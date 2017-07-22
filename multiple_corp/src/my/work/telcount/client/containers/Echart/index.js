import React, { Component, PropTypes } from "react";
import { connect } from 'react-redux';

import ReactEcharts from 'echarts-for-react';

import './index.less';

const tabMap = ["", "callpercent", "calltime", "num", "contact", "timeaverage"];  //tab对应的数据索引
const title = ["接通率", "通话时长", "拨打次数", "联系人数量", "平均通话时长"];
const unitArr = ["%", "分钟", "", "", "秒"];

class Echart extends Component {
    render() {
        const { option } = this.props;
        return (
            <div>
                <div style={{height: "auto", minHeight: "350px"}}>
                    {
                        option.series.length > 0 ?
                            <ReactEcharts
                                option={option}
                                notMerge={true}
                                lazyUpdate={true}
                                theme={"theme_name"}/> :
                            <div style={{"height": "350px", "lineHeight": "350px", "textAlign": "center"}}>
                                loading
                            </div>
                    }
                </div>    
                {
                    this.props.tips ?
                        <div className="tips">
                            <p>电话小助手：<span>{this.props.tips}</span></p>
                        </div> : ""                    
                }           
            </div>     
        )
    }
}

Echart.PropTypes = {
    option: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => {
    if(ownProps.type == "historyData" && state[ownProps.type].data != ""){
        return {
            option: getOption(state, ownProps),
            tips: state[ownProps.type].data.data.tips[tabMap[state[ownProps.type].tabIndex]]
        }
    }
    return {
        option: getOption(state, ownProps)
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        
    }
}

const getOption = (state, ownProps) => {
    const option = {
        title: {
            text: ''
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            // show: false,  //false不展示
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
            data: [],
            axisTick: {
                // length: 10
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                
            }
        },
        series: [],
        color: ['#5d9cec', '#62c87f', '#f15755', '#fc8d4b', '#7053b6']
    };
    if(state[ownProps.type].data != ""){
        const index = state[ownProps.type].tabIndex;
        option.title.text = title[index - 1] + "趋势图";
        option.legend.data = [];
        option.series = [];
        state[ownProps.type].data.data.ydata.map(item => {
            option.legend.data.push(item.name);
            option.series.push({
                name: item.name,
                type: 'line',
                data: item[tabMap[index]]
            });
        });   
        if(option.legend.data.length == 1){
            option.legend.data = [];
        }     
        option.yAxis.axisLabel.formatter = '{value} ' + unitArr[index - 1];
        option.xAxis.data = state[ownProps.type].data.data.xdata;
    }
    return  option;
}

export default connect(mapStateToProps, mapDispatchToProps)(Echart);