import React, {PropTypes} from 'react';
import {Router, browserHistory, Link} from 'react-router';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {DatePicker, Popover} from 'antd';
import ReactEcharts from 'echarts-for-react';
import fetch from 'isomorphic-fetch';
import Cookie from 'react-cookie';

import {fetchDailyData} from '../../../actions/index';
import TelSelectFilter from '../../../components/TelSelectFilter';
import ECPopover from '../../../components/ECPopover';

import './index.less';

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
        type: 'category',
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
const title = ["接通率", "通话时长", "拨打次数", "联系人数量", "平均通话时长"];
const unitArr = ["%", "分钟", "", "", "秒"];


class Today extends React.Component {
    
    componentWillMount() {
        this.setState({
            tabIndex: 1,//当前tab
            updateDate: '',
            dialCount: 0,  //通话数
            person: 0,  //联系人数量
            callCompletingRate: '0%',  //接通率
            callDuration: 0,  //通话时长
            isPerson: ISPERSON,
            data: '',//后台返回的数据
            option: option,  //Echart配置
            selected: []//选中的部门||个人
        });
    }

    componentDidMount() {
        this.fetchHistoryData();
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
        });
    }    

    fetchHistoryData(useCache) {
        if(useCache){  //已有数据
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
                option: option
            });                     
        }else{  //接口拉取
            this.fetchNew("https://my.workec.com/work/telcount/gettoday", "post", {users: this.state.selected}).then(text => {
                let json;
                try{
                    json = JSON.parse(text);
                }catch(e){
                    console.log(text);
                    window.location = 'https://my.workec.com/work/telcount/today';
                    return;
                }
                option.xAxis.data = json.data.xdata;
                option.title.text = title[this.state.tabIndex - 1] + "趋势图";
                json.data.ydata.map(item => {
                    option.legend.data.push(item.name);
                    option.series.push({
                        name: item.name,
                        type: 'line',
                        stack: '总量',
                        data: item[tabMap[this.state.tabIndex]]
                    });
                });
                if(option.legend.data.length == 1){
                    option.legend.data = [];
                }
                option.yAxis.axisLabel.formatter = '{value} ' + unitArr[this.state.tabIndex - 1];
                this.setState({
                    data: json,
                    option: option,
                    updateDate: json.data.datetime,
                    person: json.data.contact,
                    dialCount: json.data.num,
                    callDuration: json.data.calltime,
                    callCompletingRate: json.data.callpercent
                });
            });
        }
    }

    setSelect = (arr) =>{
        this.setState({
            selected: arr
        });
    }

    selectFilter(){
        this.state.option.series = [];
        this.setState({
            option: this.state.option
        }, this.fetchHistoryData);
    }

    clearFilter(){
        this.state.option.series = [];
        this.setState({
            selected: [],
            option: this.state.option
        }, this.fetchHistoryData);        
    }    

    changeTab(index) {
        this.state.option.series = [];
        this.state.option.title.text = title[index - 1] + "趋势图";
        this.setState({
            tabIndex: index,
            option: this.state.option
        }, () => this.fetchHistoryData(true));
    }

    onChartReadyCallback() {

    }

    EventsDict() {
        return {}
    }

    render() {
        const content_wenan = [
            {title: '接通率', desc: ['接通电话次数/拨打次数，EC云呼、EC电话会议、TCL无线话机能够准确计算接通率，TCL有线话机、TCL盒子开始拨打13秒开始算作接通。']},
            {title: '通话时长', desc: ['通话总时长包括客户与陌生人的电话时长。']},
            {title: '拨打次数', desc: ['拨打客户和陌生人电话总次数。']},
            {title: '联系人数量', desc: ['通过电话联系过的客户和陌生人，不会重复计数，如果客户被删除、转让等操作，不用影响联系客户数的减少，陌生人备注为客户后，不影响联系客户数变更。', '拨打EC好友的号码，默认为陌生人，也会记录联系客户数。', '联系客户数量，只做当天内的去重，跨天或跨员工的而联系客户数量累加。']},
            {title: '联系人数量', desc: ['通话时长/拨打次数。']}
            ];
        const content = <ECPopover content={content_wenan} />;
        var that = this;
        return (
            <div>
                <div>
                    <div className="ec_header">
                        <div className="title">
                            <p>今日统计</p>
                            <Popover content={content} placement="bottomLeft">
                                <i></i>
                            </Popover>                            
                        </div>
                        {
                            this.state.updateDate != "" ? <div className="refresh_time">最后更新时间：<i>{this.state.updateDate}</i></div> : ""
                        }
                        {
                            !this.state.isPerson ? <TelSelectFilter setSelect={this.setSelect} clickFun={() => this.selectFilter()} clearFun={() => this.clearFilter()}/> : ""
                        }                        
                    </div>  
                    <ul className="statistics-items">
                        <li>
                            <p>接通率</p>
                            <span>{this.state.data == '' ? '' : this.state.callCompletingRate}</span>
                        </li>
                        <li>
                            <p>通话时长</p>
                            <span>{this.state.data == '' ? '' : this.state.callDuration}</span>
                        </li>
                        <li>
                            <p>拨打次数</p>
                            <span>{this.state.data == '' ? '' : this.state.dialCount}</span>
                        </li>
                        <li>
                            <p>联系人数量</p>
                            <span>{this.state.data == '' ? '' : this.state.person}</span>
                        </li>
                    </ul>
                    <div className="statistics-table">
                        <ul>
                            <li className={this.state.tabIndex == 1 ? "active" : ""} onClick={() => {
                                this.changeTab(1);
                            }}>接通率
                            </li>
                            <li className={this.state.tabIndex == 2 ? "active" : ""} onClick={() => {
                                this.changeTab(2);
                            }}>通话时长
                            </li>
                            <li className={this.state.tabIndex == 3 ? "active" : ""} onClick={() => {
                                this.changeTab(3);
                            }}>拨打次数
                            </li>
                            <li className={this.state.tabIndex == 4 ? "active" : ""} onClick={() => {
                                this.changeTab(4);
                            }}>联系人数量
                            </li>
                            <li className={this.state.tabIndex == 5 ? "active" : ""} onClick={() => {
                                this.changeTab(5);
                            }}>平均通话时长
                            </li>
                        </ul>
                        <div style={{height: "auto", minHeight: "350px"}}>
                            {
                                this.state.option.series.length > 0 ?
                                    <ReactEcharts
                                        option={this.state.option}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        theme={"theme_name"}
                                        onChartReady={this.onChartReadyCallback}
                                        onEvents={this.EventsDict()}/> :
                                    <div style={{"height": "350px", "lineHeight": "350px", "textAlign": "center"}}>
                                        loading
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


const change = (index) => {
    return {
        type: 'CHANGE_TAB_INDEX',
        index: index
    };
};

const clear = (index) => {
    return {
        type: 'DAILY_CLEAR_DATA',
        index: index
    };
};

function onDateChange(date, dateString) {
    console.log(date, dateString);

    return {
        type: 'DAILY_DATE_CHANGE',
        date: dateString
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        change,
        fetchDailyData,
        clear,
        onDateChange
    }, dispatch);
};


Today.contextTypes = {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    const obj = Object.assign({}, state.dailyData);
    return obj;
};

export default connect(mapStateToProps, mapDispatchToProps)(Today);