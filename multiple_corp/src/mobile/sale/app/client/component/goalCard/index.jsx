import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import './index.less';
import classNames from 'classnames';
import ReactEcharts from 'echarts-for-react';
import { formatNumber, getDPR } from '../../util/utils.js'
import noGoalPng from '../../images/no-goal.png';
import noRankPng from '../../images/no-rank.png';
import noFunnelPng from '../../images/no-funnel.png';

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
            fontSize: (getDPR() / 2 * 50).toFixed(0)
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
            fontSize: (getDPR() / 2 * 28).toFixed(0)
        }
    }],
    series: [{
        hoverAnimation:false,
        name: '饼图二',
        type: 'pie',
        radius: ['68%', '85%'],
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

class GoalCard extends React.Component {
    constructor(props) {
        super(props);

    }
    static propTypes = {
        data: PropTypes.object.isRequired,
    };

    static defaultProps = {
        data: {}
    };

    render = () => {
        let { className, style, data, ...others } = this.props;
        let cls = classNames({
            'goal-card': true,
            ...className
        });


        if (data.sumGoal) {
            let goalRate = (data.sumFinished / data.sumGoal * 100).toFixed(2);
            chart1Options.title[0].text = goalRate + '%';
            chart1Options.title[1].text = '目标完成率';

            if (goalRate > 1000) {
                chart1Options.title[0].textStyle.fontSize = (getDPR() / 2 * 35).toFixed(0);
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
            <div className={cls} style={style}>
                <div className="header">
                    <span className="title">销售目标(本月)</span>
                    <i className="iconfont">&#xe67e;</i>
                </div>

                {
                    (typeof data.sumGoal === 'undefined') || (data && data.sumFinished === 0 && data.sumGoal === 0 && data.sumUnFinished === 0) ?
                        (
                            <div className="no-data-content">
                                <img className="no-data-img" src={noGoalPng} />
                                <p>还没有目标，快去设置目标吧</p>
                            </div>
                        ) :
                        (
                            <div className="content">
                                <div className="chart-area">
                                    <ReactEcharts
                                        option={chart1Options}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        showLoading={false}
                                        loadingOption={'default',{
                                        text:''
                            }}
                            style={{ 'width': (getDPR() / 2 * 340).toFixed(0) + 'px', 'height': (getDPR() / 2 * 340).toFixed(0) + 'px', 'margin': '0 auto' }} />
                            </div>
                                <div className="stat">
                                    <div className="goal">
                                        <i className="icon iconfont">&#xe66c;</i>
                                        <span className="t1">目标</span>
                                        <span className="t2">{data.sumGoal ? formatNumber(data.sumGoal) : '--'}</span>
                                    </div>
                                    <div className="finished">
                                        <i className="icon"></i>
                                        <span className="t1">已完成</span>
                                        <span className="t2">{data.sumFinished ? formatNumber(data.sumFinished) : '--'}</span>
                                    </div>
                                    <div className="unfinished">
                                        <i className="icon"></i>
                                        <span className="t1">缺口</span>
                                        <span className="t2">{data.sumUnFinished ? formatNumber(data.sumUnFinished) : '--'}</span>
                                    </div>
                                </div>
                            </div>
                        )
                }
            </div>
        )
    }
}

export default GoalCard;
