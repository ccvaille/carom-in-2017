import React, { Component, PropTypes } from "react";
import { connect } from 'react-redux';

import { Popover } from 'antd';

import { changeRankSort,changePi } from '../../actions';

import './index.less';

const title = ["接通率", "通话时长", "拨打次数", "联系人数量", "平均通话时长"];
const sortMap = ["callpercent", "calltime", "num", "contact", "timeaverage"];

//ec_sort_tab

class RankSort extends Component {  

    getRankTips() {
        const content = <div className="rank_tips_content">{this.props.rankTips}</div>;
        return this.props.rankTips != "" ? <Popover content={content} placement="bottomLeft"><span className="rank_tips"></span></Popover> : "";
    }     

    render() {
        const { rank_sort,num_sort,change_sort,index,onClick,num,callpercent,calltime,contact,timeaverage } = this.props;
        const typeMap = [callpercent, calltime, num, contact, timeaverage];
        return (
            <ul className="ec_sort_tab">
                {
                    typeMap[index - 1] == 0 ? 
                    <li>排名<span className="content"><div className="up" onClick={() => onClick(sortMap[index - 1], "up")}><i className="up_icon"></i></div><div className="down" onClick={() => onClick(sortMap[index - 1], "down")}><i className="down_icon"></i></div></span></li> : 
                    (typeMap[index - 1] == 1 ? 
                    <li>排名<div className="content2" onClick={() => onClick(sortMap[index - 1], "down")}><i className="down_icon"></i></div></li> : 
                    <li>排名<div className="content2" onClick={() => onClick(sortMap[index - 1], "up")}><i className="up_icon"></i></div></li>)
                }
                <li>员工</li>
                {
                    typeMap[index - 1] == 0 ? 
                    <li>{title[index - 1]}<span className="content"><div className="up" onClick={() => onClick(sortMap[index - 1], "up")}><i className="up_icon"></i></div><div className="down" onClick={() => onClick(sortMap[index - 1], "down")}><i className="down_icon"></i></div></span></li> : 
                    (typeMap[index - 1] == 1 ? 
                    <li>{title[index - 1]}<div className="content2" onClick={() => onClick(sortMap[index - 1], "down")}><i className="down_icon"></i></div></li> : 
                    <li>{title[index - 1]}<div className="content2" onClick={() => onClick(sortMap[index - 1], "up")}><i className="up_icon"></i></div></li>)
                }
            </ul>           
        )
    }
}

RankSort.PropTypes = {
    rank_sort: PropTypes.number.isRequired,
    num_sort: PropTypes.number.isRequired,
    change_sort: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    rankTips: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    num: PropTypes.number.isRequired,
    callpercent: PropTypes.number.isRequired,
    calltime: PropTypes.number.isRequired,
    contact: PropTypes.number.isRequired,
    timeaverage: PropTypes.number.isRequired,
}

const mapStateToProps = (state, ownProps) => {
    return {
        rank_sort: state.employeeData.rank_sort,
        num_sort: state.employeeData.num_sort,
        change_sort: state.employeeData.change_sort,
        rankTips: state.employeeData.rankTips,
        index: state.employeeData.tabIndex,
        num: state.employeeData.num,
        callpercent: state.employeeData.callpercent,
        calltime: state.employeeData.calltime,
        contact: state.employeeData.contact,
        timeaverage: state.employeeData.timeaverage,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onClick: (key, type) => {
            dispatch(changeRankSort(key, type));
        }        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RankSort);