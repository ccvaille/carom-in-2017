import React from 'react';
import './index.less';
import { withRouter } from 'react-router';

import ECharts from '../ECharts'
import Funnel from '../Funnel'
import SwitchBtn from '../SwitchBtn'

import moment from 'moment'
import { Popover, Select, DatePicker, Button } from 'antd'
const Option = Select.Option;
const { RangePicker } = DatePicker;

const initDateRange = getBeginAndEnd(2);

class TransformContent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            range1: {
                startDate: initDateRange.startDate,
                endDate: initDateRange.endDate
            },
            range2: {
                startDate: initDateRange.startDate,
                endDate: initDateRange.endDate
            }
        }
    }
    getTips = () => {
        return (
            <div className="tips-box">
                <ul>
                    <li>
                        <span className="name">送达用户数</span>
                        ：第一/二/三条推送内容送达的去重用户数
                    </li>
                    <li>
                        <span className="name">阅读用户数</span>
                        ：点击查看第一/二/三条推送内容的去重用户数
                    </li>
                    <li>
                        <span className="name">登记用户数</span>
                        ：在第一/二/三条推送的微表单作品中提交数据的去重用户数
                    </li>
                    <li>
                        <span className="name">入库用户数</span>
                        ：第一/二/三条推送内容送达的去重用户数
                    </li>
                    <li>
                        <span className="name">阅读转化率</span>
                        ：阅读用户数除以送达用户数
                    </li>
                    <li>
                        <span className="name">登记转化率</span>
                        ：登记用户数除以阅读用户数
                    </li>
                    <li>
                        <span className="name">入库转化率</span>
                        ：入库用户数除以登记用户数
                    </li>
                    <li>
                        <span className="name">客户转化率</span>
                        ：入库用户数除以送达用户数
                    </li>
                </ul>
            </div>
        )
    }

    switchBtn = (index) => {
        const { switchIndex } = this.props.transformActions;
        const { activeIndex } = this.props.transformReducers;
        if(activeIndex == index) {
            return;
        }
        switchIndex(index);
    }

    changeSelect = (dateObj, index) => {
        const { getAnalysis, getKeyData } = this.props.transformActions;
        this.setState({
            ['range' +index]: {
                ...dateObj
            }
        })
        if(index == 1) {
            getKeyData(dateObj)
        } else {
            getAnalysis(dateObj)
        }
    }
    
    disabledDate = (current) => {
        return current && current.valueOf() > Date.now();
    }

    changeDate = (_, range, index) => {
        const { getAnalysis, getKeyData } = this.props.transformActions;
        const dateObj = {
            startDate: range[0],
            endDate: range[1]
        }
        this.setState({
            ['range' + index]: dateObj
        })
        if(index == 1) {
            getKeyData(dateObj)
        } else {
            getAnalysis(dateObj)
        }
    }

    componentDidMount = () => {
        const { getAnalysis, getKeyData } = this.props.transformActions;
        const dateRange = getBeginAndEnd(2);
        getKeyData(dateRange);
        getAnalysis(dateRange);
    }

    render = () => {
        const data = this.props.transformReducers;
        return (
            <div className="transform-content">
                <div className="content-box">
                    <div className="title">
                        关键指标
                        <Popover content={this.getTips()} placement="bottomLeft">
                            <i className="tips"></i>
                        </Popover>
                        <div className="prompt">
                            <i className="iconfont icon-tuandui-copy"></i>
                            <a href="http://form.workec.com/html/form/UXdZSU9ITGdhUmclM0Q=.html?chan=100" target="_blank">投放微信广告，获取更多用户</a>
                        </div>
                    </div>
                    <div className="echarts-box">
                        <div className="header">
                            <Select defaultValue="2" 
                                style={{ width: '110px', marginLeft: '10px' }}
                                onChange={(value) => this.changeSelect(getBeginAndEnd(value), 1)}>
                                <Option value="1">今天</Option>
                                <Option value="2">最近7天</Option>
                                <Option value="3">最近30天</Option>
                            </Select>
                            <RangePicker 
                                style={{ width: '207px', marginLeft: '10px' }}
                                disabledDate={this.disabledDate}
                                value={[moment(this.state.range1.startDate, 'YYYY-MM-DD'), moment(this.state.range1.endDate, 'YYYY-MM-DD')]}
                                onChange={(memont, date) => this.changeDate(moment, date, 1)}
                                allowClear={false}/>
                        </div>
                        <Funnel keyData={data.keyData}/>
                    </div>
                </div>
                <div className="content-box">
                    <div className="title">
                        趋势图
                    </div>
                    <div className="echarts-box">
                        <div className="header">
                            <Select defaultValue="2"
                                style={{ width: '110px', marginLeft: '10px' }}
                                onChange={(value) => this.changeSelect(getBeginAndEnd(value), 2)}>
                                <Option value="1">今天</Option>
                                <Option value="2">最近7天</Option>
                                <Option value="3">最近30天</Option>
                            </Select>
                            <RangePicker 
                                style={{ width: '207px', marginLeft: '10px' }} 
                                disabledDate={this.disabledDate}
                                value={[moment(this.state.range2.startDate, 'YYYY-MM-DD'), moment(this.state.range2.endDate, 'YYYY-MM-DD')]}
                                onChange={(memont, date) => this.changeDate(moment, date, 2)}
                                allowClear={false}/>
                            <SwitchBtn changeEvent={ this.switchBtn } activeIndex={ data.activeIndex }/>
                        </div>
                        <ECharts option={ data.option} style={{height: '200px'}}/>
                    </div>
                </div>
            </div>
        )
    }
}

function getBeginAndEnd(type) {
    var beginTime, endTime;
    var nowTime = new Date(),
        oneDay = 24 * 60 * 60 * 1000;
    if (type == 1) {  //今天
        beginTime = nowTime;
        return{
            startDate: beginTime.getFullYear() + "-" + (beginTime.getMonth() + 1) + "-" + beginTime.getDate(),
            endDate: beginTime.getFullYear() + "-" + (beginTime.getMonth() + 1) + "-" + beginTime.getDate()
        }
    } else if (type == 2) {  //最近7天
        beginTime = new Date(nowTime - 7 * oneDay);
        endTime = nowTime;
        return{
            startDate: beginTime.getFullYear() + "-" + (beginTime.getMonth() + 1) + "-" + beginTime.getDate(),
            endDate: endTime.getFullYear() + "-" + (endTime.getMonth() + 1) + "-" + endTime.getDate()
        }        
    } else if (type == 3) {  //最近30天
        beginTime = new Date(nowTime - 30 * oneDay);
        endTime = nowTime;
        return{
            startDate: beginTime.getFullYear() + "-" + (beginTime.getMonth() + 1) + "-" + beginTime.getDate(),
            endDate: endTime.getFullYear() + "-" + (endTime.getMonth() + 1) + "-" + endTime.getDate()
        }          
    }  
}


export default withRouter(TransformContent);
