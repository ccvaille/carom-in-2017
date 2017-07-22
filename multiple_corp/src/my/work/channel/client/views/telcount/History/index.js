import React, { PropTypes } from 'react';
import { Router, browserHistory, Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'

import Cookie from 'react-cookie';
import { DatePicker, Popover, Select } from 'antd';

import TelSelectFilter from '../../../components/TelSelectFilter';
import ReactEcharts from 'echarts-for-react';
import ECPopover from '../../../components/ECPopover';
import './index.less';


const title = ["接通率", "通话时长", "拨打次数", "联系人数量", "平均通话时长"];
const unitArr = ["%", "分钟", "", "", "秒"];
var option = {
    title: {
        text: ''
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: []
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: {
                show: false
            }
        }
    },
    xAxis: {
        boundaryGap: false,
        data: []
    },
    yAxis: {
        type: 'value',
        axisLabel: {

        }
    },
    series: []
};

const tabMap = ["", "callpercent", "calltime", "num", "contact", "timeaverage"];  //tab对应的数据索引

class History extends React.Component {

    componentWillMount() {
        this.changeBeginAndEnd(0);
        this.setState({
            tabIndex: 1,//当前tab
            updateDate: '',
            isPerson: ISPERSON,
            option: option,  //Echart配置
            tips: '',  //电话小助手
            dateType: 0,//选择的时间类型 0:昨天 1:本周 2:上周 3:本月 4:上月
            selected: [],//选中的部门||个人
            callMode: 0,//通话方式(0 全部、1呼出、2 呼入 默认0)
            callCategory: 0//电话分类(0全部、1座机、2 EC云呼 默认0)
        });
    }

    fetchNew(url, type, body) {
        var reqHeader = {
            credentials: 'include',
            method: type,
            mode: 'no-cors',
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
        }
        if (reqHeader.method === "post") {
            reqHeader.headers['Content-Type'] = 'application/json';
            reqHeader.headers["X-XSRF-TOKEN"] = Cookie.load('XSRF-TOKEN');
            reqHeader.body = JSON.stringify(body);
        }
        return fetch(url, reqHeader).then(res => {
            return res.text();
        })
    }

    fetchHistoryData() {
        if (this.state.data != '') {  //已有数据
            this.state.data.data.ydata.map(item => {
                option.series.push({
                    name: item.name,
                    type: 'line',
                    stack: '总量',
                    data: item[tabMap[this.state.tabIndex]]
                });
            });
            option.yAxis.axisLabel.formatter = '{value} ' + unitArr[this.state.tabIndex - 1];
            this.setState({
                option: option,
                tips: this.state.data.data.tips[tabMap[this.state.tabIndex]]
            });
        } else {  //接口拉取
            this.fetchNew("https://my.workec.com/work/telcount/gethistory", "post", {
                startdate: this.state.startdate,
                enddate: this.state.enddate,
                calltype: this.state.callMode,
                phonetype: this.state.callCategory,
                users: this.state.selected
            }).then(text => {
                let json;
                try {
                    json = JSON.parse(text);
                } catch (e) {
                    console.log(text);
                    window.location = 'https://my.workec.com/work/telcount/today';
                    return;
                }
                option.xAxis.data = json.data.xdata;
                json.data.ydata.map(item => {
                    option.legend.data.push(item.name);
                    option.series.push({
                        name: item.name,
                        type: 'line',
                        stack: '总量',
                        data: item[tabMap[this.state.tabIndex]]
                    });
                });
                if (option.legend.data.length == 1) {
                    option.legend.data = [];
                }
                option.yAxis.axisLabel.formatter = '{value} ' + unitArr[this.state.tabIndex - 1];
                option.title.text = title[this.state.tabIndex - 1] + "趋势图";
                this.setState({
                    data: json,
                    option: option,
                    tips: json.data.tips[tabMap[this.state.tabIndex]],
                    selected: [],
                    updateDate: json.data.datetime
                });
            });
        }
    }

    changeDate(type) {
        this.state.option.series = [];
        if (type && type.date) {
            this.setState({
                data: '',
                option: option,
                dateType: 5
            }, () => { this.changeBeginAndEnd(type) });
        } else {
            if (type == this.state.dateType) {
                return;
            }
            this.setState({
                data: '',
                option: option,
                dateType: type
            }, () => { this.changeBeginAndEnd(type) });
        }
    }

    changeTab(index) {
        this.state.option.series = [];
        this.state.option.title.text = title[index - 1] + "趋势图";
        this.setState({
            option: option,
            tabIndex: index
        }, this.fetchHistoryData);
    }

    changeBeginAndEnd(type) {
        var beginTime, endTime;
        var nowTime = new Date(),
            year = nowTime.getFullYear(),
            month = nowTime.getMonth(),
            day = nowTime.getDate(),
            weekDay = nowTime.getDay();
        if (type == 0) {  //昨天
            beginTime = new Date(year, month, day - 1);
            this.setState({
                data: '',
                startdate: beginTime.getFullYear() + "-" + (beginTime.getMonth() + 1) + "-" + beginTime.getDate(),
                enddate: beginTime.getFullYear() + "-" + (beginTime.getMonth() + 1) + "-" + beginTime.getDate()
            }, this.fetchHistoryData);
        } else if (type == 1) {  //本周
            beginTime = new Date(year, month, day - (weekDay - 1));
            endTime = nowTime;
            this.setState({
                data: '',
                startdate: beginTime.getFullYear() + "-" + (beginTime.getMonth() + 1) + "-" + beginTime.getDate(),
                enddate: endTime.getFullYear() + "-" + (endTime.getMonth() + 1) + "-" + endTime.getDate()
            }, this.fetchHistoryData);
        } else if (type == 2) {  //上周
            beginTime = new Date(year, month, day - weekDay - 6);
            endTime = new Date(year, month, day - weekDay);
            this.setState({
                data: '',
                startdate: beginTime.getFullYear() + "-" + (beginTime.getMonth() + 1) + "-" + beginTime.getDate(),
                enddate: endTime.getFullYear() + "-" + (endTime.getMonth() + 1) + "-" + endTime.getDate()
            }, this.fetchHistoryData);
        } else if (type == 3) {  //本月
            beginTime = new Date(year, month, 1);
            endTime = nowTime;
            this.setState({
                data: '',
                startdate: beginTime.getFullYear() + "-" + (beginTime.getMonth() + 1) + "-" + beginTime.getDate(),
                enddate: endTime.getFullYear() + "-" + (endTime.getMonth() + 1) + "-" + endTime.getDate()
            }, this.fetchHistoryData);
        } else if (type == 4) {  //上月
            beginTime = new Date(year, month - 1, 1);
            endTime = new Date(year, month, 0);
            this.setState({
                data: '',
                startdate: beginTime.getFullYear() + "-" + (beginTime.getMonth() + 1) + "-" + beginTime.getDate(),
                enddate: endTime.getFullYear() + "-" + (endTime.getMonth() + 1) + "-" + endTime.getDate()
            }, this.fetchHistoryData);
        } else {
            if (type.type == "begin") {
                this.setState({
                    data: '',
                    startdate: type.date
                }, this.fetchHistoryData);
            } else {
                this.setState({
                    data: '',
                    enddate: type.date
                }, this.fetchHistoryData);
            }
        }
    }

    changeCallMode(value) {
        if (value == this.state.callMode) {
            return;
        }
        this.state.option.series = [];
        this.setState({
            option: this.state.option,
            data: '',
            callMode: value
        }, this.fetchHistoryData);
    }

    changeCallCategory(value) {
        if (this.state.callCategory == value) {
            return;
        }
        this.state.option.series = [];
        this.setState({
            data: '',
            option: this.state.option,
            callCategory: value
        }, this.fetchHistoryData);
    }

    setSelect = (arr) => {
        this.setState({
            selected: arr
        });
    }

    selectFilter() {
        this.state.option.series = [];
        this.setState({
            data: '',
            option: this.state.option
        }, this.fetchHistoryData);
    }

    clearFilter() {
        this.state.option.series = [];
        this.setState({
            selected: [],
            data: '',
            option: this.state.option
        }, this.fetchHistoryData);
    }

    disabledDateBegin = (current) => {
        var result1 = current && current.valueOf().time > Date.now(),
            result2 = current && current.valueOf().time > new Date(this.state.enddate).getTime();
        return result1 || result2;
    }

    disabledDateEnd = (current) => {
        var result1 = current && current.valueOf().time > Date.now(),
            result2 = current && (current.valueOf().time + 86400000) < new Date(this.state.startdate).getTime();
        return result1 || result2;
    }

    onChartReadyCallback() {

    }

    EventsDict() {
        return {}
    }

    render() {
        const content_wenan = [
            { title: '接通率', desc: ['接通电话次数/拨打次数，EC云呼、EC电话会议、TCL无线话机能够准确计算接通率，TCL有线话机、TCL盒子开始拨打13秒开始算作接通。'] },
            { title: '通话时长', desc: ['通话总时长，包括给客户、EC好友、陌生人的电话时长。'] },
            { title: '拨打次数', desc: ['拨打客户、EC好友、陌生人电话总次数。'] },
            { title: '联系人数量（去重）', desc: ['通过电话联系过的客户、EC好友、陌生人，今日联系客户数会去重。'] },
            { title: '平均通话时长', desc: ['通话时长/拨打次数。'] },
            { title: '趋势图', desc: ['展示不同时间段内的趋势，其中当前时间点代表之前两小时内时间段，例如：10点代表8-10点区间段的数据。'] }
        ];
        const content = <ECPopover content={content_wenan} />;
        var that = this;
        return (
            <div>
                <div>
                    <div className="ec_header">
                        <div className="title">
                            <p>历史趋势</p>
                            <Popover content={content} placement="bottomLeft">
                                <i></i>
                            </Popover>
                        </div>
                        <div className="time">
                            <div className="ec_time_desc">
                                <p>时间：</p>
                                <div>
                                    <span onClick={() => this.changeDate(0)}
                                        className={this.state.dateType === 0 ? "on" : ""}>昨天</span>
                                    <span onClick={() => this.changeDate(1)}
                                        className={this.state.dateType === 1 ? "on" : ""}>本周</span>
                                    <span onClick={() => this.changeDate(2)}
                                        className={this.state.dateType === 2 ? "on" : ""}>上周</span>
                                    <span onClick={() => this.changeDate(3)}
                                        className={this.state.dateType === 3 ? "on" : ""}>本月</span>
                                    <span onClick={() => this.changeDate(4)}
                                        className={this.state.dateType === 4 ? "on" : ""}>上月</span>
                                    <div className="line"></div>
                                </div>
                            </div>
                            <DatePicker value={this.state.startdate} onChange={(date, dateString) => {
                                this.changeDate({ type: "begin", date: dateString })
                            } } disabledDate={this.disabledDateBegin} />

                            &#12288;至&#12288;

                            <DatePicker value={this.state.enddate} onChange={(date, dateString) => {
                                this.changeDate({ type: "end", date: dateString })
                            } } disabledDate={this.disabledDateEnd} />
                        </div>
                        {
                            !this.state.isPerson ? <TelSelectFilter setSelect={this.setSelect} clearFun={() => this.clearFilter()} clickFun={() => this.selectFilter()} /> : ""
                        }
                    </div>
                    <div className="ec_date_content">
                        <div className="ec_date">
                            通话方式：&nbsp;&nbsp;
                            <Select defaultValue="0" style={{ width: 120 }}
                                onChange={(value) => this.changeCallMode(value)}>
                                <Option value="0">全部</Option>
                                <Option value="1">呼出</Option>
                                <Option value="2">呼入</Option>
                            </Select>
                        </div>
                        <div className="ec_line"></div>
                        <div className="ec_date">
                            电话分类：&nbsp;&nbsp;
                            <Select defaultValue="0" style={{ width: 120 }}
                                onChange={(value) => this.changeCallCategory(value)}>
                                <Option value="0">全部</Option>
                                <Option value="1">座机</Option>
                                <Option value="2">EC云呼</Option>
                            </Select>
                        </div>
                    </div>
                    <div className="statistics-table">
                        <ul>
                            <li className={this.state.tabIndex == 1 ? "active" : "x"} onClick={() => {
                                this.changeTab(1);
                            } }>接通率
                            </li>
                            <li className={this.state.tabIndex == 2 ? "active" : "x"} onClick={() => {
                                this.changeTab(2);
                            } }>通话时长
                            </li>
                            <li className={this.state.tabIndex == 3 ? "active" : "x"} onClick={() => {
                                this.changeTab(3);
                            } }>拨打次数
                            </li>
                            <li className={this.state.tabIndex == 4 ? "active" : "x"} onClick={() => {
                                this.changeTab(4);
                            } }>联系人数量
                            </li>
                            <li className={this.state.tabIndex == 5 ? "active" : "x"} onClick={() => {
                                this.changeTab(5);
                            } }>平均通话时长
                            </li>
                        </ul>
                        <div style={{ minHeight: "300px" }}>
                            {
                                this.state.option.series.length > 0 ?
                                    <ReactEcharts
                                        option={this.state.option}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        theme={"theme_name"}
                                        onChartReady={this.onChartReadyCallback}
                                        onEvents={this.EventsDict()} /> :
                                    <div style={{ "height": "300px", "lineHeight": "300px", "textAlign": "center" }}>
                                        loading
                                    </div>
                            }
                        </div>
                        {
                            this.state.tips != "" ?
                                <div className="tips">
                                    <i></i><p>电话小助手：<span>{this.state.tips}</span></p>
                                </div> : ""
                        }
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    const obj = Object.assign({}, state.historyData);
    return obj;
};

const change = (index) => {
    return {
        type: 'CHANGE_HISTORY_TAB_INDEX',
        index: index
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        change
    }, dispatch);
};


History.contextTypes = {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


export default connect(mapStateToProps, mapDispatchToProps)(History);
