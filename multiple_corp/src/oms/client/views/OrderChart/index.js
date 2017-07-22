import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Button, Input, DatePicker, Cascader, Menu, Dropdown, Icon, message, Table, Select} from 'antd';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import classNames from 'classnames';
const Option = Select.Option;
import addressJson from '../../common/address'
import SelectYear from '../../components/SelectYear'

import {
    fetchSearch,
    addressChange,
    searchTextChange,
    yearChange
} from '../../actions/orderChartAction'


import './index.less';

let chart1Options = {
    title: {
        text: '',
        textStyle:{
            fontSize:16,
            color:'#888',
            fontStyle:'normal',
            fontWeight:'normal'
        },
        left:40
    },
    tooltip: {
        trigger: 'axis',
        // position: function (pt) {
        //     return [pt[0], '10%'];
        // }
    },
    legend: {
        data: ['新增EC套餐订单数', '新增增值服务订单数', '新增硬件设备订单数'],
        bottom: 0
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
    },
    xAxis: {
        name: '时间',
        type: 'category',
        boundaryGap: false,
        // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        data:[]
    },
    yAxis: {
        name: '新增订单数',
        type: 'value',
        minInterval: 1
    },
    series: [
        {
            itemStyle: {
                normal: {
                    color: '#5fb6c7'
                }
            },
            name: '新增EC套餐订单数',
            type: 'line',
            data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
            itemStyle: {
                normal: {
                    color: '#e96b77'
                }
            },
            name: '新增增值服务订单数',
            type: 'line',
            data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
            itemStyle: {
                normal: {
                    color: '#ffd159'
                }
            },
            name: '新增硬件设备订单数',
            type: 'line',
            data: [150, 232, 201, 154, 190, 330, 410]
        }
    ]
};

let chart2Options = {
    title: {
        text: '',
        textStyle:{
            fontSize:16,
            color:'#888',
            fontStyle:'normal',
            fontWeight:'normal'
        },
        left:40
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },

        // formatter:'{a0}:{b0}: {c0}<br />{a1}:{b1}: {c1}'
    },
    legend: {
        itemWidth: 10,
        itemHeight: 10,
        bottom: '0',
        data: ['新增EC套餐订单数', '新增增值服务订单数', '新增硬件设备订单数']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
    },
    xAxis: {
            name: '时间',
            type: 'category',
            // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            data:[],
            // boundaryGap: [0, '10%'],
            // boundaryGap: false,
    },
    yAxis: {
            name: '新增订单数',
            type: 'value',
            minInterval: 1
        },
    series: [
        {
            itemStyle: {
                normal: {
                    color: '#5fb6c7'
                }
            },

            name: '新增EC套餐订单数',
            barCategoryGap: '40%',
            type: 'bar',
            data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
            itemStyle: {
                normal: {
                    color: '#e96b77'
                }
            },
            name: '新增增值服务订单数',
            barCategoryGap: '40%',
            type: 'bar',

            data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
            itemStyle: {
                normal: {
                    color: '#ffd159'
                }
            },
            name: '新增硬件设备订单数',
            barCategoryGap: '40%',
            type: 'bar',

            data: [220, 182, 191, 234, 290, 330, 310]
        }
    ]
};


class OrderChart extends React.Component {
    state = {
        searchText: '',
        addressData: addressJson,

    };

    componentWillMount() {
        const dispatch = this.props.dispatch;
        dispatch(fetchSearch({
            time: this.props.year,
        }));
    }


    //点击了搜索按钮
    onSearch() {
        const dispatch = this.props.dispatch;
        dispatch(searchTextChange(this.state.searchText));
        dispatch(fetchSearch({
            source: this.state.searchText,
            time: moment().format('YYYY')
        }));
    }

    //搜索框改变
    searchTextChange(e) {
        this.setState({
            searchText: e.target.value
        });
    }

    onCasChange(value) {
        const dispatch = this.props.dispatch;
        //如果清除了
        if(value.length==0){
            dispatch(addressChange({
                province: '',
                city: ''
            }));
            dispatch(fetchSearch(
                {
                    source: this.props.searchText,
                    province: '',
                    city: '',
                    time: this.props.year,
                }
            ));
        }
        //选择的是省份
        else if (value.length == 1) {
            dispatch(addressChange({
                province: value[0],
                city: ''
            }));
            dispatch(fetchSearch(
                {
                    source: this.props.searchText,
                    province: value[0],
                    city: '',
                    time: this.props.year,
                }
            ));
        }
        //选择的是市
        else if (value.length > 1) {
            dispatch(addressChange({
                province: value[0],
                city: value[1]
            }));
            dispatch(fetchSearch(
                {
                    source: this.props.searchText,
                    time: this.props.year,
                    province: value[0],
                    city: value[1],
                }
            ));
        }

    }

    //时间改变了
    handleYearChange(value) {
        const dispatch = this.props.dispatch;
        dispatch(yearChange({
            year: value
        }));
        dispatch(fetchSearch(
            {
                source: this.props.searchText,
                time: value,
                province: this.props.province,
                city: this.props.city,
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
        let {province, city, data, year, searchText, isFetching, ...others}=this.props;

        // isFetching = false;
        // data = [{
        //     "f_date": "2015",//统计日期
        //     "f_new_ec": "222",//新增EC套餐订单数
        //     "f_new_increment": "111", //新增增值服务订单数
        //     "f_new_hd": 444,//新增硬件设备订单数
        //     "f_increment_price": "2343",//新增增值服务总的市场价
        //     "f_hd_price": "333",//新增硬件总的市场价
        //     "f_ec_price": "333",//新增EC套餐总的市场价
        // },
        //     {
        //         "f_date": "2016",//统计日期
        //         "f_new_ec": "333",//新增EC套餐订单数
        //         "f_new_increment": "222", //新增增值服务订单数
        //         "f_new_hd": 555,//新增硬件设备订单数
        //         "f_increment_price": "3432",//新增增值服务总的市场价
        //         "f_hd_price": "333",//新增硬件总的市场价
        //         "f_ec_price": "333",//新增EC套餐总的市场价
        //     },
        //     {
        //         "f_date": "2017",//统计日期
        //         "f_new_ec": "444",//新增EC套餐订单数
        //         "f_new_increment": "333", //新增增值服务订单数
        //         "f_new_hd": 666,//新增硬件设备订单数
        //         "f_increment_price": "2342",//新增增值服务总的市场价
        //         "f_hd_price": "333",//新增硬件总的市场价
        //         "f_ec_price": "333",//新增EC套餐总的市场价
        //     }
        // ];


        let series1Arr = [];
        let series2Arr = [];
        let series3Arr = [];

        let xAxisArr = [];


        let chartData = data.slice(0);

        let new_ec_total=0;
        let new_increment_total=0;
        let new_hd_total=0;

        chartData.forEach(function (item, index, array) {
            xAxisArr.push(moment(item.f_date).format('YYYY-MM'));

            series1Arr.push(item.f_new_ec);
            series2Arr.push(item.f_new_increment);
            series3Arr.push(item.f_new_hd);

            new_ec_total+=Number(item.f_new_ec);
            new_increment_total+=Number(item.f_new_increment);
            new_hd_total+=Number(item.f_new_hd);

        });

        // chart1Options.title.text='总数：EC套餐,'+new_ec_total+'个;增值服务,'+new_increment_total+'个;硬件设备:'+new_hd_total+'个';

        chart1Options.xAxis.data = xAxisArr;
        chart1Options.series[0].data = series1Arr;
        chart1Options.series[1].data = series2Arr;
        chart1Options.series[2].data = series3Arr;


        chart1Options.tooltip.formatter=function(params){
            var str='<div style="text-align: left;">'+params[0].name+'<br/>'
                +'<span style="margin-right:3px;display:inline-block;width:10px;height:10px;border-radius:50%;background-color:'+params[0].color+'"></span>'+params[0].seriesName+':'+params[0].value+'个('+chartData[params[0].dataIndex].f_ec_price+'元)<br/>'
                +'<span style="margin-right:3px;display:inline-block;width:10px;height:10px;border-radius:50%;background-color:'+params[1].color+'"></span>'+params[1].seriesName+':'+params[1].value+'个('+chartData[params[1].dataIndex].f_increment_price+'元)<br/>'
                +'<span style="margin-right:3px;display:inline-block;width:10px;height:10px;border-radius:50%;background-color:'+params[2].color+'"></span>'+params[2].seriesName+':'+params[2].value+'个('+chartData[params[2].dataIndex].f_hd_price+'元)<br/></div>';

            return str;
        };

        // chart2Options.title.text='总数：EC套餐,'+new_ec_total+'个;增值服务,'+new_increment_total+'个;硬件设备:'+new_hd_total+'个';

        chart2Options.xAxis.data = xAxisArr;
        chart2Options.series[0].data = series1Arr;
        chart2Options.series[1].data = series2Arr;
        chart2Options.series[2].data = series3Arr;

        chart2Options.tooltip.formatter=function(params){
            var str='<div style="text-align: left;">'+params[0].name+'<br/>'
                +'<span style="margin-right:3px;display:inline-block;width:10px;height:10px;border-radius:50%;background-color:'+params[0].color+'"></span>'+params[0].seriesName+':'+params[0].value+'个('+chartData[params[0].dataIndex].f_ec_price+'元)<br/>'
                +'<span style="margin-right:3px;display:inline-block;width:10px;height:10px;border-radius:50%;background-color:'+params[1].color+'"></span>'+params[1].seriesName+':'+params[1].value+'个('+chartData[params[1].dataIndex].f_increment_price+'元)<br/>'
                +'<span style="margin-right:3px;display:inline-block;width:10px;height:10px;border-radius:50%;background-color:'+params[2].color+'"></span>'+params[2].seriesName+':'+params[2].value+'个('+chartData[params[2].dataIndex].f_hd_price+'元)<br/></div>';

            return str;
        };



        let ops = this.getYearSelOps();



        // chart1Options.tooltip.formatter='{b0}: {c0}<br />{b1}: {c1}';

        return (



            <div className="order-chart">
                <div className="search-panel">
                    <Row>
                        <span className="title">搜索：</span>
                        <Input placeholder="输入代理商名称或ID" onChange={this.searchTextChange.bind(this)}
                               onPressEnter={this.onSearch.bind(this)} style={{width: "200px"}}/>
                        <Button type="primary" onClick={this.onSearch.bind(this)}
                                style={{marginLeft: '20px'}}>搜索</Button>
                    </Row>
                </div>
                <div className="filter-panel">

                    <span className="title">时间：</span>


                    <SelectYear value={year} options={ops} onChange={this.handleYearChange.bind(this)}/>

                    {/*<Button type="primary" onClick={this.onSearch.bind(this)}*/}
                    {/*style={{marginLeft: '10px'}}>全部</Button>*/}

                    <span className="title" style={{'marginLeft': '20px'}}>地区：</span>
                    <Cascader placeholder="请选择地区" options={this.state.addressData} allowClear={true} value={[province, city]}
                              onChange={this.onCasChange.bind(this)}
                              changeOnSelect style={{width: '250px'}}/>

                </div>
                <p className="summary">总数：EC套餐{new_ec_total}个；增值服务,{new_increment_total}个；硬件设备:{new_hd_total}个；</p>
                <div className="chart-wrapper">
                    {
                        year == 0 ? <ReactEcharts
                            option={chart1Options}
                            notMerge={true}
                            lazyUpdate={true}
                            style={{'height': '600px'}} showLoading={isFetching}/> :
                            <ReactEcharts
                                option={chart2Options}
                                notMerge={true}
                                lazyUpdate={true}
                                style={{'height': '600px'}} showLoading={isFetching}/>
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => (
    state.orderChart
);

export default connect(mapStateToProps)(OrderChart)
