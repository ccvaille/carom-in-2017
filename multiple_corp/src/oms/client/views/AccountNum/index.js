import React from 'react';
import {connect} from 'react-redux';
import './index.less';
import {Menu, Icon, Row, Input, DatePicker, Button, Select} from 'antd';
import SelectYear from '../../components/SelectYear';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import {trendYearChange, lossYearChange, fetchLoss, fetchTrend} from '../../actions/accountNumAction'


let chart1Options = {
    tooltip: {
        trigger: 'axis'
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
    },
    legend: {
        bottom: 0,
        data: ['当月流失账号数', '当月流失率']
    },
    xAxis: {
        type: 'category',
        data: []
    },
    yAxis: [
        {
            type: 'value',
            name: '流失数量/个',
            // splitNumber:10,
            max:'dataMax'
            // min: 0,
            // max: 250,
            // interval: 50,
            // axisLabel: {
            //     formatter: '{value} ml'
            // }
        },
        {
            type: 'value',
            name: '流失率/%',
            min: 0,
            max: 100,
            splitNumber:10,
            // interval: 5,
            axisLabel: {
                formatter: '{value} %'
            }
        }
    ],
    series: [
        {
            itemStyle: {
                normal: {
                    color: '#5fb6c7',

                }
            },
            name: '当月流失账号数',
            splitNumber:10,
            // barWidth:'30',
            yAxisIndex: 0,
            type: 'bar',
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
        },
        {
            itemStyle: {
                normal: {
                    color: '#ffd159'
                }
            },
            name: '当月流失率',
            type: 'line',
            yAxisIndex: 1,
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
        }
    ]
};

let chart2Options = {
    title: {
        text: ''
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['当月新增付费账号数', '当月付费账号总数'],
        bottom: 0
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []
    },
    yAxis: [
        {
            splitLine: {
                show: false
            },
            type: 'value',
            // name: '当月新增付费账号数',
            name: '数量',
            axisLine: {
                lineStyle: {
                    color: '#5fb6c7'
                },
            }
        },
        // {
        //     splitLine: {
        //         show: false
        //     },
        //     type: 'value',
        //     name: '当月付费账号总数',
        //     axisLine: {
        //         lineStyle: {
        //             color: '#ffd159'
        //         },
        //     }
        // }
    ],
    series: [
        {
            itemStyle: {
                normal: {
                    color: '#5fb6c7'
                }
            },
            name: '当月新增付费账号数',
            type: 'line',

            areaStyle: {normal: {color: '#5fb6c7'}},
            data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
            itemStyle: {
                normal: {
                    color: '#ffd159'
                }
            },
            name: '当月付费账号总数',
            type: 'line',
            yAxisIndex: 0,
            // yAxisIndex: 1,
            areaStyle: {normal: {color: '#ffd159'}},
            data: [10, 20, 30, 40, 50, 60, 70]
        }
    ]
};


class AccountNum extends React.Component {
    state = {
        currentTab: 'tab1',
    };

    componentDidMount() {
        const dispatch = this.props.dispatch;
        dispatch(fetchTrend({
            time:this.props.tYear
        }));
        dispatch(fetchLoss({
            time:this.props.tYear
        }));
    }

    handleClick(e) {
        this.setState({
            currentTab: e.key,
        });
    };


    //时间改变了
    handleTYearChange(value) {
        const dispatch = this.props.dispatch;
        dispatch(trendYearChange({
            year: value
        }));
        dispatch(fetchTrend(
            {
                time: value,
            }
        ));
    }

    //时间改变了
    handleLYearChange(value) {
        const dispatch = this.props.dispatch;
        dispatch(lossYearChange({
            year: value
        }));
        dispatch(fetchLoss(
            {
                time: value,
            }
        ));
    }

    getYearSelOps(){
        let currentYear=(new Date()).getFullYear();
        let diff=currentYear-2014;
        let obj = [
            {
                label: '全部',
                value: 0
            }
        ];
        for(let i=0;i<=diff;i++){
            obj.push({
                label:(currentYear-i).toString(),
                value:currentYear-i
            });
        }
        return obj;
    }


    render() {
        let {tData, tYear, lYear, lData, isFetching, ...others}=this.props;

        // let showLoss=this.props.location.query.showLoss;




        let tSeries1Arr = [];
        let tSeries2Arr = [];
        let tXAxisArr = [];
        let tChartData = tData.slice(0);

        tChartData.forEach(function (item, index, array) {
            tXAxisArr.push(moment(item.f_date).format('YYYY-MM'));
            tSeries1Arr.push(item.f_new_account);
            tSeries2Arr.push(item.f_sum_account);
        });

        chart2Options.xAxis.data = tXAxisArr;
        chart2Options.series[0].data = tSeries1Arr;
        chart2Options.series[1].data = tSeries2Arr;

        chart2Options.tooltip.formatter=function(params){
            var str='<div style="text-align: left;">'+params[0].name+'<br/>'
                +'<span style="margin-right:3px;display:inline-block;width:10px;height:10px;border-radius:50%;background-color:'+params[0].color+'"></span>'+params[0].seriesName+':'+params[0].value+'个<br/>'
                +'<span style="margin-right:3px;display:inline-block;width:10px;height:10px;border-radius:50%;background-color:'+params[1].color+'"></span>'+params[1].seriesName+':'+params[1].value+'个<br/></div>';

            return str;
        };


        let lSeries1Arr = [];
        let lSeries2Arr = [];
        let lXAxisArr = [];
        let lChartData = lData.slice(0);

        let max_l_f_uloss=0;
        lChartData.forEach(function (item, index, array) {
            lXAxisArr.push(moment(item.f_date).format('YYYY-MM'));
            lSeries1Arr.push(item.f_uloss);
            lSeries2Arr.push(item.f_uloss_rate);

            if(item.f_uloss>max_l_f_uloss){
                max_l_f_uloss=item.f_uloss;
            }
        });
        let lYInterVal=Math.floor(max_l_f_uloss/10);
        chart1Options.yAxis[0].interval=lYInterVal;

        chart1Options.xAxis.data = lXAxisArr;
        chart1Options.series[0].data = lSeries1Arr;
        chart1Options.series[1].data = lSeries2Arr;


        chart1Options.tooltip.formatter=function(params){
            var str='<div style="text-align: left;">'+params[0].name+'<br/>'
                +'<span style="margin-right:3px;display:inline-block;width:10px;height:10px;border-radius:50%;background-color:'+params[0].color+'"></span>'+params[0].seriesName+':'+params[0].value+'个<br/>'
                +'<span style="margin-right:3px;display:inline-block;width:10px;height:10px;border-radius:50%;background-color:'+params[1].color+'"></span>'+params[1].seriesName+':'+params[1].value+'%<br/></div>';

            return str;
        };

        let ops = this.getYearSelOps();

        return (
            <div className="account-num">
                <Menu onClick={this.handleClick.bind(this)}
                      selectedKeys={[this.state.currentTab]}
                      mode="horizontal"
                >
                    <Menu.Item key="tab1">
                        付费账号增长趋势
                    </Menu.Item>
                    <Menu.Item key="tab2">
                            流失率
                    </Menu.Item>
                </Menu>
                {
                    this.state.currentTab == 'tab1' ? <div className="tab1">
                        <div className="filter-panel">
                            <span className="title">时间：</span>
                            {/*<Select defaultValue="'0'" value={tYear} style={{width: 120}}*/}
                                    {/*onChange={this.handleTYearChange.bind(this)}>*/}
                                {/*<Option value="0">全部</Option>*/}
                                {/*<Option value="2016">2016</Option>*/}
                                {/*<Option value="2015">2015</Option>*/}
                                {/*<Option value="2014">2014</Option>*/}
                                {/*<Option value="2013">2013</Option>*/}
                            {/*</Select>*/}

                            <SelectYear value={tYear} options={ops} onChange={this.handleTYearChange.bind(this)}/>

                        </div>
                        <div className="chart-wrapper">


                            <ReactEcharts
                                option={chart2Options}
                                notMerge={true}
                                lazyUpdate={true}
                                style={{'height': '600px'}} showLoading={isFetching}/>
                        </div>
                    </div> : <div className="tab2">
                        <div className="filter-panel">
                            <span className="title">时间：</span>
                            {/*<Select defaultValue="'0'" value={lYear} style={{width: 120}}*/}
                                    {/*onChange={this.handleLYearChange.bind(this)}>*/}
                                {/*<Option value="0">全部</Option>*/}
                                {/*<Option value="2016">2016</Option>*/}
                                {/*<Option value="2015">2015</Option>*/}
                                {/*<Option value="2014">2014</Option>*/}
                                {/*<Option value="2013">2013</Option>*/}
                            {/*</Select>*/}

                            <SelectYear value={lYear} options={ops} onChange={this.handleLYearChange.bind(this)}/>

                        </div>
                        <div className="chart-wrapper">
                            {
                                <ReactEcharts
                                    option={chart1Options}
                                    notMerge={true}
                                    lazyUpdate={true}
                                    style={{'height': '600px'}} showLoading={isFetching}/>

                            }
                        </div>
                    </div>
                }
            </div>
        )
    }
}

const mapStateToProps = state => (
    state.accountNum
);

export default connect(mapStateToProps)(AccountNum)
