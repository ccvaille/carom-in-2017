import React, {PropTypes} from 'react';
import {Router, browserHistory, Link} from 'react-router';
import './index.less';
import {connect} from 'react-redux'
import {DatePicker, Popover, Select,Spin } from 'antd';
import {Table} from 'antd';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

import {channelDateChange, fetchChannel} from '../../actions/channelActions';


let columns = [{
    key: 1,
    title: '客户来源',
    dataIndex: 'f_name'
}, {
    key: 2,
    title: '访问人数',
    dataIndex: 'f_visits',
    sorter: (a, b) => a.f_visits - b.f_visits,
}, {
    key: 3,
    title: '导入客户数',
    dataIndex: 'f_crms',
    sorter: (a, b) => a.f_crms - b.f_crms,
}, {
    key: 4,
    title: '访客转化率',
    dataIndex: 'f_rate',
    render: text => (text + '%'),
    sorter: (a, b) => a.f_rate - b.f_rate,
}];


let options = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },

    grid: {
        show: false,
        top: 0,
        left: '5%',
        right: '5%',
        bottom: '5%',
        containLabel: true
    },
    xAxis: {
        min: 'dataMin',
        max:'dataMax',
        type: 'value',
        boundaryGap: [0, '10%'],
        minInterval: 1,
        // interval:1,
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        splitLine: {
            show: true,
            lineStyle: {
                color: '#d4e3f4'
            }
        }
        // max:'dataMax'
    },
    yAxis: {
        type: 'category',
        // offset: '50',

        data: ['6巴西', '5印尼', '4美国', '3印度', '2中国', '1世界人口(万)'],
        axisTick: {
            length: 50, //y轴刻度线的长度
            lineStyle: {
                color: '#d4e3f4'
            }
        },
        axisLabel:{
            textStyle:{
                fontFamily:'微软雅黑'
            }
        },
        inverse: true,
        axisLine: {
            show: false,
            lineStyle: {
                color: '#1f497d'
            },
        }
    },

    series: [
        {
            name: '访客数',
            type: 'bar',
            // barWidth:'50%',
            barGap: '1%',
            barCategoryGap: '40%',
            label: {
                normal: {
                    show: true,
                    position: 'right'
                }
            },
            itemStyle: {
                normal: {
                    color: '#3a78c2'
                }
            },

            data: [1, 2, 0, 0, 0, 0]
        },
        {
            name: '导入客户数',
            type: 'bar',
            // barWidth:'50%',
            // barGap:'0',
            barCategoryGap: '40%',
            label: {
                normal: {
                    show: true,
                    position: 'right'
                }
            },
            itemStyle: {
                normal: {
                    color: '#88ab3e'
                }
            },

            data: [0, 0, 0, 0, 0, 0]
        }
    ]
};


class Channel extends React.Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        data: React.PropTypes.array,
        startDate: React.PropTypes.string,
        endDate: React.PropTypes.string,
        isFetching: React.PropTypes.bool,
    };

    componentWillMount() {
        this.setState({
            dateType: 0,//选择的时间类型 0:本月 1:上月 2:开始时间 3:结束时间
        });
        this.changeDate(0);
    }

    componentDidMount() {
        $('.ant-table-thead tr th:last span')[2].click();

    }


    //时间选项改变了
    changeDate(type, date) {
        let dispatch = this.props.dispatch;
        let startDate, endDate;
        switch (type) {
            case 0://本月
                startDate = moment().startOf('month').format('YYYY-MM-DD');
                endDate = moment().format('YYYY-MM-DD');
                break;
            case 1://上月
                startDate = moment().subtract(1,'months').startOf('month').format('YYYY-MM-DD');
                endDate = moment().subtract(1,'months').endOf('month').format('YYYY-MM-DD');
                break;
            case 2://自定义开始时间
                startDate = date;
                endDate = this.props.endDate;
                break;
            case 3://自定义结束时间
                startDate = this.props.startDate;
                endDate = date;
                break;
        }

        this.setState({
            dateType: type
        });
        dispatch(channelDateChange(startDate, endDate));
        dispatch(fetchChannel(startDate, endDate));

    }

    //起始时间的屏蔽
    disabledStartDate(current) {
        let that = this;
        let result = false;
        if (current) {
            if (current.valueOf() > Date.now()) {
                result = true;
            }
            if (current.valueOf() < (new Date('2016-11-27')).getTime()) {
                result = true;
            }
            if (current.isAfter(that.props.endDate)) {
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
            if (current.valueOf() < (new Date('2016-11-27')).getTime()) {
                result = true;
            }
            if (current.isBefore(that.props.startDate)) {
                result = true;
            }
        }
        return result;
    }

    render() {
        let {startDate, endDate, data, isFetching, ...others}=this.props;

        // data = [{
        //     "f_id": "93",
        //     "f_corpid": "21299",
        //     "f_date": "2016-11-28",
        //     "f_channelid": "102",
        //     "f_visits": "6",
        //     "f_crms": "0",
        //     "f_name": "MMMMMMMMMMMMMMMMMMMM",
        //     "f_rate": "66.67"
        // }, {
        //     "f_id": "96",
        //     "f_corpid": "21299",
        //     "f_date": "2016-11-28",
        //     "f_channelid": "104",
        //     "f_visits": "5",
        //     "f_crms": "0",
        //     "f_name": "\u5fc5\u5e94",
        //     "f_rate": "25.00"
        // }, {
        //     "f_id": "94",
        //     "f_corpid": "21299",
        //     "f_date": "2016-11-28",
        //     "f_channelid": "103",
        //     "f_visits": "4",
        //     "f_crms": "0",
        //     "f_name": "\u8c37\u6b4c",
        //     "f_rate": "100.00"
        // }, {
        //     "f_id": "91",
        //     "f_corpid": "21299",
        //     "f_date": "2016-11-28",
        //     "f_channelid": "101",
        //     "f_visits": "2",
        //     "f_crms": "1",
        //     "f_name": "\u5458\u5de5\u63a8\u5e7f",
        //     "f_rate": "66.67"
        // }];
        // isFetching = false;

        let yAxisArr = [];
        let visitCountArr = [];
        let crmCountArr = [];

        let newDate = data.slice(0);

        newDate.sort(function (a, b) {
            return (Number(b.f_visits) + Number(b.f_crms)) - (Number(a.f_visits) + Number(a.f_crms));
        });


        let chartData = newDate.slice(0, 10);

        let dataMax = 0;


        chartData.forEach(function (item, index, array) {
            visitCountArr.push(item.f_visits);
            crmCountArr.push(item.f_crms);
            yAxisArr.push(item.f_name);
            if(item.f_name.length>20){

            }
            if (item.f_visits > dataMax) {
                dataMax = item.f_visits;
            }
            if (item.f_crms > dataMax) {
                dataMax = item.f_crms;
            }
            if (item.f_crms > dataMax) {
                dataMax = item.f_crms;
            }
        });


        if(dataMax==0||dataMax==1){
            options.xAxis.splitNumber = 1;
        }
        else if (dataMax == 2) {
            options.xAxis.splitNumber = 2;
        }
        else if (dataMax == 3) {
            options.xAxis.splitNumber = 3;
        }
        else if (dataMax ==4) {
            options.xAxis.splitNumber = 4;
        }

        options.series[0].data = visitCountArr;

        options.series[1].data = crmCountArr;

        options.yAxis.data = yAxisArr;

        data.sort(function (a, b) {
            return Number(b.f_rate) - Number(a.f_rate);
        });


        return (
            <div className="channel">
                <div>
                    <div className="ec_header">
                        <div className="time">
                            <div className="ec_time_desc">
                                <p>时间：</p>
                                <div>
                                    <span onClick={() => this.changeDate(0)}
                                          className={this.state.dateType === 0 ? "on" : ""}>本月</span>
                                    <span onClick={() => this.changeDate(1)}
                                          className={this.state.dateType === 1 ? "on" : ""}>上月</span>
                                    <div className="line"></div>
                                </div>
                            </div>
                            <DatePicker allowClear={false} value={moment(startDate)} onChange={(date, dateString) => {
                                this.changeDate(2, dateString)
                            } } disabledDate={this.disabledStartDate.bind(this)}/>

                            &#12288;至&#12288;

                            <DatePicker allowClear={false} value={moment(endDate)} onChange={(date, dateString) => {
                                this.changeDate(3, dateString)
                            } } disabledDate={this.disabledEndDate.bind(this)}/>
                        </div>
                    </div>
                    <div className="split_line"></div>

                    <h1 className="title">热门渠道Top 10</h1>
                    {/*<p className="time_tip">数据统计时间段：{startDate} 00:00~{endDate} 23:59</p>*/}

                    <div style={{height: "auto"}}>
                        {
                            isFetching ? <div style={{"height": "400px", "lineHeight": "400px", "textAlign": "center"}}>
                                <Spin />
                            </div> : data.length > 0 ? <div><ReactEcharts
                                option={options}
                                notMerge={true}
                                lazyUpdate={true}
                                theme={"theme_name"}
                                style={{'minHeight': '600px'}}/>
                                <div className="chart-exp">
                                    <div className="box">
                                        <span className="color-box bg-blue"></span><span
                                        className="text-blue">访客数</span>
                                    </div>
                                    <div className="box">
                                        <span className="color-box bg-green"></span><span
                                        className="text-green">导入客户数</span>
                                    </div>
                                </div>
                            </div> : <div style={{"height": "400px", "lineHeight": "400px", "textAlign": "center"}}>
                                没有数据
                            </div>
                        }
                    </div>

                    <h1 className="title">渠道统计报表</h1>
                    <Table columns={columns} dataSource={data} pagination={false}/>
                </div>
            </div>
        );
    }
}


const mapStateToProps = state => (state.channelData);

export default connect(mapStateToProps)(Channel)
