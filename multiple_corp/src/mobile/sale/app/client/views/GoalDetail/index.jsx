import React, { PropTypes } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    ActivityIndicator,
    Button,
} from 'antd-mobile';
import { Link } from 'react-router';
import './index.less';
import ReactEcharts from 'echarts-for-react';
import { formatNumber, getDPR } from '../../util/utils.js'
import noGoalPng from '../../images/no-goal.png';
import * as goalDetailActions from '../../actions/goalDetailActions'

let chart1Options = {
    title: [{
        text: '80%',
        left: '47%',
        top: '45%',
        textAlign: 'center',
        textBaseline: 'middle',
        textStyle: {
            color: '#303642',
            fontWeight: 'bold',
            fontSize: (getDPR() / 2 * 40).toFixed(0)
        }
    },
    {
        text: '目标完成率',
        left: '47%',
        top: '60%',
        textAlign: 'center',
        textBaseline: 'middle',
        textStyle: {
            color: '#727C8F',
            fontWeight: 'normal',
            fontSize: (getDPR() / 2 * 22).toFixed(0)
        }
    }],
    series: [{
        hoverAnimation:false,
        name: '饼图二',
        type: 'pie',
        radius: ['80%', '100%'],
        label: {
            normal: {
                show: false
            }
        },
        data: [{
            value: 20,
            name: '缺口率',
            label: {
                normal: {
                    textStyle: {
                        fontSize: (getDPR() / 2 * 90).toFixed(0)
                    }
                }
            },
            itemStyle: {
                normal: {
                    color: '#F76F57'
                },
                emphasis: {
                    color: '#F76F57'
                }
            },
        }, {
            value: 80,
            name: '完成率',
            label: {
                normal: {
                    textStyle: {
                        color: '#555',
                        fontSize: (getDPR() / 2 * 20).toFixed(0)
                    }
                }
            },

            itemStyle: {
                normal: {
                    color: '#60ABF8'
                },
                emphasis: {
                    color: '#60ABF8'
                }
            },
        }]
    }]
};

let chart2Options = {
    animation: false,
    grid: {
        left: 'left',
        right: '3%',
        bottom: '3%',
        top: '10%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        axisTick: {
            show: false
        },
        axisLabel: {
            textStyle: {
                fontSize: (getDPR() / 2 * 20).toFixed(0)
            }
        }
    },
    yAxis: {
        type: 'value',
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        splitNumber: 5,
        axisLabel: {
            show: false,
        }
    },
    series: [
        {
            name: '完成率',
            type: 'line',
            data: [20, 30, 40, 40, 10, 49, 66, 98, 39, 18, 33, 88],
            lineStyle: {
                normal: {
                    color: '#60ABF8',
                    width: '3'
                }
            },
            label: {
                normal: {
                    textStyle: {
                        fontSize: (getDPR() / 2 * 50).toFixed(0)
                    }
                }
            },
            itemStyle: {
                normal: {
                    color: "#60ABF8",
                    "label": {
                        "show": true,
                        "position": "top",
                        textStyle: {
                            fontSize: (getDPR() / 2 * 20).toFixed(0)
                        }
                    }
                }
            },
            label: {
                normal: {
                    textStyle: {
                        color: '#303642'
                    },
                    formatter: '{c}%'
                }
            }
        }
    ]
};

const monthMap = {
    1: '1月',
    2: '2月',
    3: '3月',
    4: '4月',
    5: '5月',
    6: '6月',
    7: '7月',
    8: '8月',
    9: '9月',
    10: '10月',
    11: '11月',
    12: '12月',
    111: '第一季度',
    222: '第二季度',
    333: '第三季度',
    444: '第四季度',
    '000': '全年',
}

class GoalPerson extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };

    }
    componentWillMount() {

    }
    componentDidMount() {
        let { goalDetailActions, goalDetailReducers } = this.props;
        let { dept, year, month } = this.props.location.state;
        goalDetailActions.fetchGoalStat({
            users: [{
                name: dept.name,
                parent_id: dept.parentId,
                type: dept.type,
                id: dept.id,
            }],
            m: month,
            year: year,
            show: 1
        });
        goalDetailActions.fetchYearRate({
            users: [{
                name: dept.name,
                parent_id: dept.parentId,
                type: dept.type,
                id: dept.id,
            }],
            year: year
        });
    }
    componentWillUnmount() {
        let {goalDetailActions, goalDetailReducers}  = this.props;
        goalDetailActions.initState();
    }
    componentWillReceiveProps(nextProps) {

    }

    render = () => {
        let { goalData, yearRateData, fetching,...others } = this.props.goalDetailReducers;
        let { dept, year, month } = this.props.location.state;

        chart2Options.series[0].data = yearRateData;

        if (goalData.sumGoal) {
            let goalRate = (goalData.sumFinished / goalData.sumGoal * 100).toFixed(2);
            chart1Options.title[0].text = goalRate + '%';
            chart1Options.title[1].text = '目标完成率';

            if (goalRate > 1000) {
                chart1Options.title[0].textStyle.fontSize = (getDPR() / 2 * 30).toFixed(0);
            }
            else if (goalRate > 100) {
                chart1Options.title[0].textStyle.fontSize = (getDPR() / 2 * 40).toFixed(0);
            }

            chart1Options.series[0].data[0].value = goalRate > 100 ? 0 : 100 - goalRate;
            chart1Options.series[0].data[1].value = goalRate > 100 ? 100 : goalRate;

            chart1Options.series[0].data[1].itemStyle = {
                normal: {
                    color: '#60ABF8'
                },
                emphasis: {
                    color: '#60ABF8'
                }
            }
        }
        else {
            chart1Options.title[0].text = '--';
            chart1Options.series[0].data[0].value = 0;
            chart1Options.series[0].data[1].value = 100;

            chart1Options.series[0].data[1].itemStyle = {
                normal: {
                    color: '#DADDE3'
                },
                emphasis: {
                    color: '#DADDE3'
                }
            }
        }
        return (
            <div className="goal-detail">
                <div className="header">
                    {
                        dept.type === 1 ? (<i className="iconfont left">&#xe664;</i>) : (<img className="avatar" src={goalData && goalData.tree && goalData.tree[0] && goalData.tree[0].face} />)
                    }
                    <span className="title">{dept.name&&dept.name.length>8?dept.name.slice(0,8)+'...':dept.name}</span>
                    <span className="right">{year}年{monthMap[month]}</span>
                </div>
                {
                    (typeof goalData.sumGoal === 'undefined') || (goalData && goalData.sumFinished === 0 && goalData.sumGoal === 0 && goalData.sumUnFinished === 0) ?
                        (<div className="no-data-content">
                            <img className="no-data-img" src={noGoalPng} />
                            <p>还没有目标，快去设置目标吧</p>
                        </div>) : (<div className="chart-panel">
                            <div className="chart">
                                <ReactEcharts
                                    option={chart1Options}
                                    notMerge={true}
                                    lazyUpdate={true}
                                    showLoading={false}
                                    loadingOption={'default',{
                                    text:''
                                }}
                                style={{ 'width': (getDPR() / 2 * 220).toFixed(0) + 'px', 'height': (getDPR() / 2 * 220).toFixed(0) + 'px', 'margin': '0 auto' }} />
                        </div>
                            <div className="stat">
                                <div className="goal">
                                    <i className="icon iconfont">&#xe66c;</i>
                                    <span className="t1">目标</span>
                                    <span className="t2">{goalData.sumGoal ? formatNumber(goalData.sumGoal) : '--'}</span>
                                </div>
                                <div className="finished">
                                    <i className="icon"></i>
                                    <span className="t1">已完成</span>
                                    <span className="t2">{goalData.sumFinished ? formatNumber(goalData.sumFinished) : '--'}</span>
                                </div>
                                <div className="unfinished">
                                    <i className="icon"></i>
                                    <span className="t1">缺口</span>
                                    <span className="t2">{goalData.sumUnFinished ? formatNumber(goalData.sumUnFinished) : '--'}</span>
                                </div>
                            </div>
                        </div>)
                }

                <div className="line-panel">
                    <h2 className="title">{year}年全年目标完成率</h2>
                    <ReactEcharts
                        option={chart2Options}
                        notMerge={true}
                        lazyUpdate={true}
                        style={{ 'height': (getDPR() / 2 * 400).toFixed(0) + 'px' }} showLoading={false} />
                </div>
                <ActivityIndicator
                    toast
                    text="正在加载"
                    animating={fetching}
                />
            </div>

        )
    }
}


const mapStateToProps = ({ goalDetailReducers }) => ({
    goalDetailReducers,
});

const mapDispatchToProps = dispatch => ({
    goalDetailActions: bindActionCreators(goalDetailActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(GoalPerson);
