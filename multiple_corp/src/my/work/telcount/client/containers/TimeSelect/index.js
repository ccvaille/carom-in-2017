import React, { Component, PropTypes } from "react";
import { connect } from 'react-redux';

import { DatePicker } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';

import { changeTimeTab,changeBeginAndEnd,fetchHistoryData,clearData,fetchRankData } from '../../actions';

const maxTimeGap = 31 * 24 * 60 * 60 * 1000;   //31天
const yearTime = 366 * 24 * 60 * 60 * 1000;   //一年

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

const dateFormat = 'YYYY-MM-DD';

class TimeSelect extends Component {

    disabledDateBegin = (current) => {
        return current && (current.valueOf() > Date.now() || current.valueOf() > new Date(this.props.enddate).getTime() || current.valueOf() < Date.now() - yearTime);
    }

    disabledDateEnd = (current) => {
        return current && (current.valueOf() > Date.now() || current.valueOf() < moment(this.props.startdate).valueOf() || (current.valueOf() > maxTimeGap + moment(this.props.startdate).valueOf()));
    }   

    render() {
        const { startdate,enddate,onClick } = this.props;
        return (
            (startdate == "" || enddate == "") ? <div></div> :
                <div>
                    <DatePicker format={dateFormat} value={moment(startdate, dateFormat)} onChange={(date, dateString) => onClick({
                        startdate: dateString,
                        enddate: enddate
                    })} disabledDate={this.disabledDateBegin} allowClear={false} />
                    <span>&#12288;至&#12288;</span>
                    <DatePicker format={dateFormat} value={moment(enddate, dateFormat)} onChange={(date, dateString) => onClick({
                        startdate: startdate,
                        enddate: dateString
                    })} disabledDate={this.disabledDateEnd} allowClear={false} />  
                </div>               
        )
    }
}

TimeSelect.PropTypes = {
    startdate: PropTypes.string.isRequired,
    enddate: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => {
    return {
        startdate: state[ownProps.type].startdate,
        enddate: state[ownProps.type].enddate
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onClick: (obj) => {
            if(new Date(obj.startdate).getTime() < new Date(obj.enddate).getTime() - maxTimeGap){

            }
            var _begin = moment(obj.startdate);
            var _end = moment(obj.enddate);
            var _subDay = _end.diff(_begin, 'd');
            if(_subDay > 31){
                _end.subtract(_subDay - 31, 'd');
                obj.enddate = _end.format(dateFormat);
            }
            dispatch(changeTimeTab(-1, mapPropToType[ownProps.type]));
            dispatch(changeBeginAndEnd(mapPropToType2[ownProps.type], obj));
            dispatch(clearData(mapPropToTypeOfClear[ownProps.type]));
            if(ownProps.type == "historyData"){
                dispatch(fetchHistoryData());                
            }else if(ownProps.type == "employeeData"){
                dispatch(fetchRankData());
            }            
        }        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TimeSelect);