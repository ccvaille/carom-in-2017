import React from 'react';
import {connect} from 'react-redux';
import './index.less';
import moment from 'moment';
import SelectYear from '../../components/SelectYear'
import {Menu, Icon, Row, Input, DatePicker, Button, Select} from 'antd';
const Option = Select.Option;
import ReactEcharts from 'echarts-for-react';
import {
    trendYearChange,
    lossYearChange,
    fetchTrend,
    fetchLoss,
    fetchRetain,
    dateChange
} from '../../actions/companyNumAction'

let chart1Options = {
    title: {
        text: ''
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['当月新增付费企业数', '当月付费企业总数'],
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
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: [
        {
            splitLine: {
                show: false
            },
            type: 'value',
            // name: '当月新增付费企业数',
            name: '数量',
            min:1,
            // splitNumber:10,
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
        //     splitNumber:10,
        //     name: '当月付费企业总数',
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
            name: '当月新增付费企业数',
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
            name: '当月付费企业总数',
            type: 'line',
            yAxisIndex: 0,
            // yAxisIndex: 1,
            areaStyle: {normal: {color: '#ffd159'}},
            data: [10, 20, 30, 40, 50, 60, 70]
        }
    ]
};

let chart2Options = {
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
        data: ['当月流失企业数', '当月流失率']
    },
    xAxis:{
        type: 'category',
        data: []
    },
    yAxis: [
        {
            type: 'value',
            name: '流失数量/个',
            max:''
            // splitNumber:10,
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
            axisLabel: {
                formatter: '{value}%'
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
            name: '当月流失企业数',
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

let chart3Options = {
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
        data: ['留存企业数', '留存率']
    },
    xAxis:{
        type: 'category',
        data: []
    },
    yAxis: [
        {
            type: 'value',
            name: '留存数量/个',
            // splitNumber:10,
            max:''
            // min: 0,
            // max: 250,
            // interval: 50,
            // axisLabel: {
            //     formatter: '{value} ml'
            // }
        },
        {
            type: 'value',
            name: '留存率/%',
            min: 0,
            max: 100,
            splitNumber:10,
            // interval: 5,
            axisLabel: {
                formatter: '{value}%'
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
            name: '留存企业数',
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
            name: '留存率',
            type: 'line',
            yAxisIndex: 1,
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
        }
    ]
};

class CompanyNum extends React.Component {
    state = {
        currentTab: 'tab1',
    };

    componentDidMount(){
        const dispatch = this.props.dispatch;
        dispatch(fetchTrend({
            time:this.props.tYear
        }));
        dispatch(fetchLoss({
            time:this.props.lYear
        }));
        dispatch(fetchRetain({
            start: this.props.startDate,
            end: this.props.endDate
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


    //起始时间的屏蔽
    disabledStartDate(current) {
        let that = this;
        let result = false;
        if (current) {
            if (current.valueOf() > Date.now()) {
                result = true;
            }
            if(current.isAfter(that.props.endDate)){
                result = true;
            }
        }
        return result;
    }

    //结束时间的屏蔽
    disabledEndDate(current) {
        let that = this;
        let result = false;
        if (current) {
            if (current.valueOf() > Date.now()) {
                result = true;
            }
            if(current.isBefore(that.props.startDate)){
                result = true;
            }
        }
        return result;
    }

    //时间选项改变了
    changeDate(type, dateString) {
        let dispatch = this.props.dispatch;
        let startDate, endDate;
        switch (type) {
            case 0://最近七天
                startDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
                endDate = moment().format('YYYY-MM-DD');
                break;
            case 1://本月
                startDate = moment().startOf('month').format('YYYY-MM-DD');
                endDate = moment().format('YYYY-MM-DD');
                break;
            case 4://今年
                startDate = moment().startOf('year').format('YYYY-MM-DD');
                endDate = moment().format('YYYY-MM-DD');
                break;
            case 5://去年
                startDate = moment().subtract(1, 'years').startOf('year').format('YYYY-MM-DD');
                endDate = moment().subtract(1, 'years').endOf('year').format('YYYY-MM-DD');
                break;
            case 2://自定义开始时间
                startDate = dateString;
                endDate = this.props.endDate;
                break;
            case 3://自定义结束时间
                startDate = this.props.startDate;
                endDate = dateString;
                break;
        }

        dispatch(dateChange({
            startDate: startDate,
            endDate: endDate,
            dateType: type
        }));

        dispatch(fetchRetain({
            start: startDate,
            end: endDate
        }));
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
        let {tYear, tData, lYear, lData, rData,startDate, endDate, dateType, isFetching, ...others}=this.props;
        // let showLoss=this.props.location.query.showLoss;


        let tSeries1Arr = [];
        let tSeries2Arr = [];
        let tXAxisArr=[];
        let tChartData = tData.slice(0);

        tChartData.forEach(function (item, index, array) {
            tXAxisArr.push(moment(item.f_date).format('YYYY-MM'));
            tSeries1Arr.push(item.f_new_purchased);
            tSeries2Arr.push(item.f_sum_purchased);
        });

        chart1Options.xAxis.data=tXAxisArr;
        chart1Options.series[0].data=tSeries1Arr;
        chart1Options.series[1].data=tSeries2Arr;

        chart1Options.tooltip.formatter=function(params){
            var str='<div style="text-align: left;">'+params[0].name+'<br/>'
                +'<span style="margin-right:3px;display:inline-block;width:10px;height:10px;border-radius:50%;background-color:'+params[0].color+'"></span>'+params[0].seriesName+':'+params[0].value+'个<br/>'
                +'<span style="margin-right:3px;display:inline-block;width:10px;height:10px;border-radius:50%;background-color:'+params[1].color+'"></span>'+params[1].seriesName+':'+params[1].value+'个<br/></div>';

            return str;
        };


        let lSeries1Arr = [];
        let lSeries2Arr = [];
        let lXAxisArr=[];
        let lChartData = lData.slice(0);

        let max_l_f_data=0;
        lChartData.forEach(function (item, index, array) {
            lXAxisArr.push(moment(item.f_date).format('YYYY-MM'));
            lSeries1Arr.push(item.f_closs);
            lSeries2Arr.push(item.f_closs_rate);
            if(item.f_closs>max_l_f_data){
                max_l_f_data=item.f_closs;
            }
        });




        let lYInterVal=Math.ceil(max_l_f_data/10);
        chart2Options.yAxis[0].max=lYInterVal*10;
        chart2Options.yAxis[0].interval=lYInterVal;

        chart2Options.xAxis.data=lXAxisArr;
        chart2Options.series[0].data=lSeries1Arr;
        chart2Options.series[1].data=lSeries2Arr;

        chart2Options.tooltip.formatter=function(params){
            var str='<div style="text-align: left;">'+params[0].name+'<br/>'
                +'<span style="margin-right:3px;display:inline-block;width:10px;height:10px;border-radius:50%;background-color:'+params[0].color+'"></span>'+params[0].seriesName+':'+params[0].value+'个<br/>'
                +'<span style="margin-right:3px;display:inline-block;width:10px;height:10px;border-radius:50%;background-color:'+params[1].color+'"></span>'+params[1].seriesName+':'+params[1].value+'%<br/></div>';

            return str;
        };



        let rSeries1Arr = [];
        let rSeries2Arr = [];
        let rXAxisArr=[];
        let rChartData = rData.slice(0);

        let max_r_f_data=0;
        rChartData.forEach(function (item, index, array) {
            rXAxisArr.push(item.f_date);
            rSeries1Arr.push(item.f_retained);
            rSeries2Arr.push(item.f_retained_rate);
            if(item.f_retained>max_r_f_data){
                max_r_f_data=item.f_retained;
            }
        });

        let rYInterVal=Math.ceil(max_r_f_data/10);
        chart3Options.yAxis[0].max=rYInterVal*10;

        chart3Options.yAxis[0].interval=rYInterVal;

        chart3Options.xAxis.data=rXAxisArr;
        chart3Options.series[0].data=rSeries1Arr;
        chart3Options.series[1].data=rSeries2Arr;

        chart3Options.tooltip.formatter=function(params){
            var str='<div style="text-align: left;">'+params[0].name+'<br/>'
                +'<span style="margin-right:3px;display:inline-block;width:10px;height:10px;border-radius:50%;background-color:'+params[0].color+'"></span>'+params[0].seriesName+':'+params[0].value+'个<br/>'
                +'<span style="margin-right:3px;display:inline-block;width:10px;height:10px;border-radius:50%;background-color:'+params[1].color+'"></span>'+params[1].seriesName+':'+params[1].value+'%<br/></div>';

            return str;
        };


        let ops = this.getYearSelOps();


        return (
            <div className="company-num">
                <Menu onClick={this.handleClick.bind(this)}
                      selectedKeys={[this.state.currentTab]}
                      mode="horizontal"
                >
                    <Menu.Item key="tab1">
                        付费企业增长趋势
                    </Menu.Item>
                    <Menu.Item key="tab2">
                            流失率
                    </Menu.Item>
                    <Menu.Item key="tab3">
                        留存率
                    </Menu.Item>
                </Menu>
                {
                    {
                        'tab1': <div className="tab1">
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
                                    option={chart1Options}
                                    notMerge={true}
                                    lazyUpdate={true}
                                    style={{'height': '600px'}} showLoading={isFetching}/>
                            </div>
                        </div>, 'tab2': <div className="tab2">
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
                                    option={chart2Options}
                                    notMerge={true}
                                    lazyUpdate={true}
                                    style={{'height': '600px'}} showLoading={isFetching}/>

                            }
                        </div>
                    </div>, 'tab3': <div className="tab2">
                        <div className="filter-panel">

                            <span className="title">时间：</span>
                            <DatePicker allowClear={false} value={moment(startDate)} onChange={(date, dateString) => {
                                this.changeDate(2, dateString)
                            } } disabledDate={this.disabledStartDate.bind(this)} className="datePicker"/>

                            &#12288;—&#12288;

                            <DatePicker allowClear={false} value={moment(endDate)} onChange={(date, dateString) => {
                                this.changeDate(3, dateString)
                            } } disabledDate={this.disabledEndDate.bind(this)} className="datePicker"/>

                            <span>&#12288;|&#12288;</span>

                            <span onClick={() => this.changeDate(0)}
                                  className={dateType === 0 ? "date-text on" : "date-text"}>最近7天</span>
                            <span onClick={() => this.changeDate(1)}
                                  className={dateType === 1 ? "date-text on" : "date-text"}>本月</span>
                            <span onClick={() => this.changeDate(4)}
                                  className={dateType === 4 ? "date-text on" : "date-text"}>今年</span>
                            <span onClick={() => this.changeDate(5)}
                                  className={dateType === 5 ? "date-text on" : "date-text"}>去年</span>

                        </div>
                        <div className="chart-wrapper">
                            {
                                <ReactEcharts
                                    option={chart3Options}
                                    notMerge={true}
                                    lazyUpdate={true}
                                    style={{'height': '600px'}} showLoading={isFetching}/>

                            }
                        </div>
                    </div>
                    }[this.state.currentTab]
                }
            </div>
        )
    }
}

const mapStateToProps = state => (
    state.companyNum
);

export default connect(mapStateToProps)(CompanyNum)
