import React, { PropTypes } from 'react';
import { Router, browserEmployee, Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Cookie from 'react-cookie';
import { DatePicker, Popover, Select } from 'antd';

import TelSelectFilter from '../../../components/TelSelectFilter';
import ECPopover from '../../../components/ECPopover';
import './index.less';

const medalMap = ["first", "second", "third"];
const title = ["接通率", "通话时长", "拨打次数", "联系人数量", "平均通话时长"];
const pc = 6;

class Employee extends React.Component {

    componentWillMount() {
        this.changeBeginAndEnd(0);
        this.setState({
            tabIndex: 1,
            dateType: 0,//选择的时间类型 0:日排行 1:周排行 2:月排行
            rank_sort: 0,  //0：未排序1:正序2:倒序
            num_sort: 0,
            change_sort: 0,
            tips: '',
            pi: 1,
            piArr: [],
            selected: []//选中的部门||个人
        });
    }

    changeBeginAndEnd(type) {
        var beginTime, endTime;
        var nowTime = new Date(),
            year = nowTime.getFullYear(),
            month = nowTime.getMonth(),
            day = nowTime.getDate(),
            weekDay = nowTime.getDay();
        if (type == 0) {  //日排行
            beginTime = new Date(year, month, day - 1);
            this.setState({
                totalData: [],
                dateType: 0,
                startdate: year + "-" + (month + 1) + "-" + day,
                enddate: year + "-" + (month + 1) + "-" + day
            }, this.fetchHistoryData);
        } else if (type == 1) {  //周排行
            beginTime = new Date(year, month, day - (weekDay - 1));
            endTime = nowTime;
            this.setState({
                totalData: [],
                dateType: 1,
                startdate: beginTime.getFullYear() + "-" + (beginTime.getMonth() + 1) + "-" + beginTime.getDate(),
                enddate: endTime.getFullYear() + "-" + (endTime.getMonth() + 1) + "-" + endTime.getDate()
            }, this.fetchHistoryData);
        } else if (type == 2) {  //月排行
            beginTime = new Date(year, month, 1);
            endTime = nowTime;
            this.setState({
                totalData: [],
                dateType: 2,
                startdate: beginTime.getFullYear() + "-" + (beginTime.getMonth() + 1) + "-" + beginTime.getDate(),
                enddate: endTime.getFullYear() + "-" + (endTime.getMonth() + 1) + "-" + endTime.getDate()
            }, this.fetchHistoryData);
        } else {  //日期组件选择
            if (type.type == "begin") {
                this.setState({
                    totalData: [],
                    dateType: 3,
                    startdate: type.date || this.state.startdate,
                }, this.fetchHistoryData);
            } else {
                this.setState({
                    totalData: [],
                    dateType: 3,
                    enddate: type.date || this.state.enddate,
                }, this.fetchHistoryData);
            }
        }
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
        this.fetchNew("https://my.workec.com/work/telcount/getrank", "post", {
            startdate: this.state.startdate,
            enddate: this.state.enddate,
            type: this.state.tabIndex - 1,
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
            var _piArr = [], _pi = 1;
            for (var i = 0; i < json.data.list.length; i = i + 6) {
                _piArr.push(_pi);
                _pi++;
            }
            this.setState({
                totalData: json.data.list,
                piArr: _piArr,
                tips: json.data.tips,
                rankTips: json.data.datetips
            });
        });
    }

    setSelect = (arr) => {
        this.setState({
            selected: arr
        });
    }

    selectFilter() {
        this.setState({
            totalData: []
        }, this.fetchHistoryData);
    }

    clearFilter() {
        this.setState({
            selected: [],
            totalData: []
        }, this.fetchHistoryData);
    }

    setPi(index) {
        this.setState({
            pi: index
        });
    }

    changeTab(index) {
        this.setState({
            tabIndex: index,
            totalData: []
        }, this.fetchHistoryData);
    }

    getRankTips() {
        return <div className="rank_tips_content">{this.state.rankTips}</div>
    }

    changeSort(key, type) {
        var _totalData = this.state.totalData;
        this.setState({
            totalData: []
        });
        if (key == "rank_sort") {
            if (type == "up") {
                _totalData.sort(function (a, b) {
                    return a.number - b.number;
                });
            } else {
                _totalData.sort(function (a, b) {
                    return b.number - a.number;
                });
            }
            this.setState({
                totalData: _totalData,
                pi: 1,
                rank_sort: type == "up" ? 1 : 2
            });
        } else if (key == "num_sort") {
            if (type == "up") {
                _totalData.sort(function (a, b) {
                    return a.value - b.value;
                });
            } else {
                _totalData.sort(function (a, b) {
                    return b.value - a.value;
                });
            }
            this.setState({
                totalData: _totalData,
                pi: 1,
                num_sort: type == "up" ? 1 : 2
            });
        } else {
            if (type == "up") {
                _totalData.sort(function (a, b) {
                    return a.rank - b.rank;
                });
            } else {
                _totalData.sort(function (a, b) {
                    return b.rank - a.rank;
                });
            }
            this.setState({
                totalData: _totalData,
                pi: 1,
                change_sort: type == "up" ? 1 : 2
            });
        }
    }

    // disabledDate(current) {
    //     var result = current && current.valueOf().time > Date.now();
    //     return result;
    // }

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

    render() {
        var that = this;
        const content_wenan = [
            { title: '员工排行', desc: ['员工或部门按照联系人数量、通话时长、拨打次数、接通率、平均通话时长进行排名。', '排名变化是当前周期相对上一周期的排名比较。'] },
            { title: '接通率', desc: ['接通电话次数/拨打次数，EC云呼、EC电话会议、TCL无线话机能够准确计算接通率，TCL有线话机、TCL盒子开始拨打13秒开始算作接通。'] },
            { title: '通话时长', desc: ['通话总时长，包括给客户、EC好友、陌生人的电话时长。'] },
            { title: '拨打次数', desc: ['拨打客户、EC好友、陌生人电话总次数。'] },
            { title: '联系人数量（去重）', desc: ['通过电话联系过的客户、EC好友、陌生人，今日联系客户数会去重。'] },
            { title: '平均通话时长', desc: ['通话时长/拨打次数。'] }
        ];
        const content = <ECPopover content={content_wenan} />;
        return (
            <div className="">
                <div>
                    <div className="ec_header">
                        <div className="title">
                            <p>员工排行</p>
                            <Popover content={content} placement="bottomLeft">
                                <i></i>
                            </Popover>
                        </div>
                        <div className="time">
                            <div className="ec_time_desc">
                                <p>时间：</p><div><span className={this.state.dateType == 0 ? "on" : ""} onClick={() => this.changeBeginAndEnd(0)}>日排行</span><span className={this.state.dateType == 1 ? "on" : ""} onClick={() => this.changeBeginAndEnd(1)}>周排行</span><span className={this.state.dateType == 2 ? "on" : ""} onClick={() => this.changeBeginAndEnd(2)}>月排行</span><div className="line"></div></div>
                            </div>
                            <DatePicker value={this.state.startdate} onChange={(date, dateString) => {
                                this.changeBeginAndEnd({ type: "begin", date: dateString })
                            } } disabledDate={this.disabledDateBegin} />

                            &#12288;至&#12288;

                            <DatePicker value={this.state.enddate} onChange={(date, dateString) => {
                                this.changeBeginAndEnd({ type: "end", date: dateString })
                            } } disabledDate={this.disabledDateEnd} />
                        </div>
                        <TelSelectFilter setSelect={this.setSelect} clickFun={() => this.selectFilter()} clearFun={() => this.clearFilter()} />
                    </div>
                    <div className="statistics-table">
                        <ul className="title">
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
                        <ul className="sort">
                            {
                                this.state.rank_sort == 0 ? <li>排名<span className="content"><div className="up" onClick={() => this.changeSort("rank_sort", "up")}><i className="up_icon"></i></div><div className="down" onClick={() => this.changeSort("rank_sort", "down")}><i className="down_icon"></i></div></span></li> : (this.state.rank_sort == 1 ? <li>排名<div className="content2" onClick={() => this.changeSort("rank_sort", "down")}><i className="down_icon"></i></div></li> : <li>排名<div className="content2" onClick={() => this.changeSort("rank_sort", "up")}><i className="up_icon"></i></div></li>)
                            }
                            <li>员工</li>
                            {
                                this.state.num_sort == 0 ? <li>{title[this.state.tabIndex - 1]}<span className="content"><div className="up" onClick={() => this.changeSort("num_sort", "up")}><i className="up_icon"></i></div><div className="down" onClick={() => this.changeSort("num_sort", "down")}><i className="down_icon"></i></div></span></li> : (this.state.num_sort == 1 ? <li>{title[this.state.tabIndex - 1]}<div className="content2" onClick={() => this.changeSort("num_sort", "down")}><i className="down_icon"></i></div></li> : <li>{title[this.state.tabIndex - 1]}<div className="content2" onClick={() => this.changeSort("num_sort", "up")}><i className="up_icon"></i></div></li>)
                            }
                            {
                                this.state.change_sort == 0 ? <li>排名变化<span className="content"><div className="up" onClick={() => this.changeSort("change_sort", "up")}><i className="up_icon"></i></div><div className="down" onClick={() => this.changeSort("change_sort", "down")}><i className="down_icon"></i></div></span><Popover content={this.getRankTips()} placement="bottomLeft"><span className="rank_tips"></span></Popover></li> : (this.state.change_sort == 1 ? <li>排名变化<div className="content2" onClick={() => this.changeSort("change_sort", "down")}><i className="down_icon"></i></div><Popover content={this.getRankTips()} placement="bottomLeft"><span className="rank_tips"></span></Popover></li> : <li>排名变化<div className="content2" onClick={() => this.changeSort("change_sort", "up")}><i className="up_icon"></i></div><Popover content={this.getRankTips()} placement="bottomLeft"><span className="rank_tips"></span></Popover></li>)
                            }
                        </ul>
                        {
                            this.state.totalData.length > 0 ?
                                <ul className="detail">
                                    {
                                        this.state.totalData.slice((this.state.pi - 1) * 6, (this.state.pi - 1) * 6 + 6).map(function (item, index) {
                                            return <li key={index}>
                                                <div className={index % 2 == 0 ? "content on" : "content"}>
                                                    <span className="ranking">
                                                        <i className={medalMap[item.number - 1] ? "medal " + medalMap[item.number - 1] : "medal"}>{medalMap[item.number - 1] ? "" : item.number}</i>
                                                    </span>
                                                    <span>
                                                        <div className="info">
                                                            <img src={item.face} />
                                                            <p className="name">{item.name}</p>
                                                        </div>
                                                    </span>
                                                    <span>{item.value}</span>
                                                    <span>
                                                        <div className="change">
                                                            <p className="changeRank">{Math.abs(item.rank)}</p>
                                                            <i className={item.rank < 0 ? "rank_down" : (item.rank == 0 ? "rank_keep" : "rank_up")}></i>
                                                        </div>
                                                    </span>
                                                </div>
                                            </li>
                                        })
                                    }
                                </ul> :
                                <div style={{ "height": "432px", "lineHeight": "432px", "textAlign": "center" }}>
                                    loading
                                </div>
                        }
                        {
                            this.state.totalData.length > 0 ?
                                <div className="page">
                                    <div className="page_content">
                                        {
                                            this.state.piArr.map((item, index) => {
                                                return <div className={item == this.state.pi ? "on" : ""} key={index} onClick={() => that.setPi(item)}>{item}</div>
                                            })
                                        }
                                        {
                                            this.state.piArr.length > 1 && this.state.pi != this.state.piArr[this.state.piArr.length - 1] ? <div onClick={() => that.setPi(that.state.pi + 1)}>下一页</div> : ""
                                        }
                                        {
                                            this.state.piArr.length > 1 && this.state.pi != this.state.piArr[this.state.piArr.length - 1] ? <div onClick={() => that.setPi(this.state.piArr[this.state.piArr.length - 1])}>末页</div> : ""
                                        }
                                    </div>
                                </div> : ""
                        }
                        {
                            this.state.totalData.length > 0 && this.state.tips != "" ?
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


Employee.contextTypes = {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


export default connect(mapStateToProps, mapDispatchToProps)(Employee);