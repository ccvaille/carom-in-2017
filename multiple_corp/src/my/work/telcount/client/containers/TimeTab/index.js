import React, { Component, PropTypes } from "react";
import { connect } from 'react-redux';

import { changeTimeTab,changeBeginAndEnd,fetchHistoryData,clearData,fetchRankData } from '../../actions';

import './index.less';

//时间tab索引
const mapPropToType = {
    historyData: "CHANGE_HISTORY_TIMETAB",
    employeeData: "CHANGE_RANK_TIMETAB"
}
//开始结束索引
const mapPropToType2 = {
    historyData: "CHANGE_HISTORY_BEGINANDEND",
    employeeData: "CHANGE_RANK_BEGINANDEND"
}

const mapPropToTypeOfClear = {
    historyData: "HISTORY_CLEAR_DATA",
    employeeData: "EMPLOYEE_CLEAR_DATA"
}

class TimeTab extends Component {

    componentDidMount() {
        this.props.onClick(this.props.dateType);
    }  

    render() {
        const { dateType,timearr,onClick } = this.props;
        return (
            <div className="ec_time_desc">
                <p>时间：</p>
                <div>
                    {
                        timearr.map((item, index) => {
                            return <span key={index} onClick={() => onClick(index)} className={dateType == index ? "on" : ""} type={item.type}>{item.name}</span>
                        })
                    }
                    <div className="line"></div>
                </div>
            </div>        
        )
    }
}

TimeTab.PropTypes = {
    dateType: PropTypes.number.isRequired,
    timearr: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => {
    return {
        dateType: state[ownProps.type].dateType,
        timearr: ownProps.timearr
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onClick: (index) => {
            dispatch(changeTimeTab(index, mapPropToType[ownProps.type]));
            dispatch(changeBeginAndEnd(mapPropToType2[ownProps.type], getBeginAndEnd(ownProps.timearr[index].type)));
            dispatch(clearData(mapPropToTypeOfClear[ownProps.type]));
            if(ownProps.type == "historyData"){
                dispatch(fetchHistoryData());                
            }else if(ownProps.type == "employeeData"){
                dispatch(fetchRankData());
            }              
        }        
    }
}

const getBeginAndEnd = (type) => {
    var beginTime, endTime;
    var nowTime = new Date(),
        year = nowTime.getFullYear(),
        month = nowTime.getMonth(),
        day = nowTime.getDate(),
        weekDay = nowTime.getDay();
    if (type == 0) {  //昨天
        beginTime = new Date(year, month, day - 1);
        return{
            startdate: beginTime.getFullYear() + "-" + (beginTime.getMonth() + 1) + "-" + beginTime.getDate(),
            enddate: beginTime.getFullYear() + "-" + (beginTime.getMonth() + 1) + "-" + beginTime.getDate()
        }
    }else if(type == 1) {  //今天
        return{
            startdate: year + "-" + (month + 1) + "-" + day,
            enddate: year + "-" + (month + 1) + "-" + day
        }
    } else if (type == 2) {  //本周
        if(weekDay == 0){
            weekDay = 7;
        }
        beginTime = new Date(year, month, day - (weekDay - 1));
        endTime = nowTime;
        return{
            startdate: beginTime.getFullYear() + "-" + (beginTime.getMonth() + 1) + "-" + beginTime.getDate(),
            enddate: endTime.getFullYear() + "-" + (endTime.getMonth() + 1) + "-" + endTime.getDate()
        }        
    } else if (type == 3) {  //上周
        if(weekDay == 0){
            weekDay = 7;
        }        
        beginTime = new Date(year, month, day - weekDay - 6);
        endTime = new Date(year, month, day - weekDay);
        return{
            startdate: beginTime.getFullYear() + "-" + (beginTime.getMonth() + 1) + "-" + beginTime.getDate(),
            enddate: endTime.getFullYear() + "-" + (endTime.getMonth() + 1) + "-" + endTime.getDate()
        }          
    } else if (type == 4) {  //本月
        beginTime = new Date(year, month, 1);
        endTime = nowTime;
        return{
            startdate: beginTime.getFullYear() + "-" + (beginTime.getMonth() + 1) + "-" + beginTime.getDate(),
            enddate: endTime.getFullYear() + "-" + (endTime.getMonth() + 1) + "-" + endTime.getDate()
        }  
    } else {  //上月
        beginTime = new Date(year, month - 1, 1);
        endTime = new Date(year, month, 0);
        return{
            startdate: beginTime.getFullYear() + "-" + (beginTime.getMonth() + 1) + "-" + beginTime.getDate(),
            enddate: endTime.getFullYear() + "-" + (endTime.getMonth() + 1) + "-" + endTime.getDate()
        }  
    }   
}

export default connect(mapStateToProps, mapDispatchToProps)(TimeTab);