import React, { Component, PropTypes } from "react";
import { connect } from 'react-redux';

import { Select } from 'antd';

import { changeType,fetchHistoryData,clearData } from '../../actions';

import './index.less';

const Option = Select.Option;

const mapPropToType = {
    historyData: "CHANGE_HISTORY_TYPE"
}

const mapPropToTypeOfClear = {
    historyData: "HISTORY_CLEAR_DATA"
}

class TypeSelect extends Component {   

    render() {
        const { callMode,callCategory,callTimeType,onClick } = this.props;
        return (
            <div className="ec_date_content">
                <div className="ec_date">
                    呼入/呼出：&nbsp;&nbsp;
                    <Select defaultValue={callMode + ""} style={{ width: 120 }}
                        onChange={(value) => onClick(parseInt(value, 10), "mode")}>
                        <Option value="0">全部</Option>
                        <Option value="1">呼出</Option>
                        <Option value="2">呼入</Option>
                    </Select>
                </div>
                <div className="ec_line"></div>
                <div className="ec_date">
                    通话方式：&nbsp;&nbsp;
                    <Select defaultValue={callCategory + ""} style={{ width: 120 }}
                        onChange={(value) => onClick(parseInt(value, 10), "cate")}>
                        <Option value="0">全部</Option>
                        <Option value="1">座机</Option>
                        <Option value="2">EC云呼</Option>
                    </Select>
                </div>
                <div className="ec_line"></div>
                <div className="ec_date">
                    通话时长：&nbsp;&nbsp;
                    <Select defaultValue={callTimeType + ""} style={{ width: 120 }}
                        onChange={(value) => onClick(parseInt(value, 10), "timetype")}>
                        <Option value="0">全部</Option>
                        <Option value="1">0秒</Option>
                        <Option value="2">1-30秒</Option>
                        <Option value="3">31-60秒</Option>
                        <Option value="4">61-180秒</Option>
                        <Option value="5">180秒以上</Option>
                    </Select>
                </div>
            </div>             
        )
    }
}

TypeSelect.PropTypes = {
    callMode: PropTypes.number.isRequired,
    callCategory: PropTypes.number.isRequired,
    callTimeType: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => {
    return {
        callMode: state[ownProps.type].callMode,
        callCategory: state[ownProps.type].callCategory,
        callTimeType: state[ownProps.type].callTimeType,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onClick: (value, type) => {
            dispatch(changeType(mapPropToType[ownProps.type], value, type));
            dispatch(clearData(mapPropToTypeOfClear[ownProps.type]));
            if(ownProps.type == "historyData"){
                dispatch(fetchHistoryData());
            }
        }        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TypeSelect);