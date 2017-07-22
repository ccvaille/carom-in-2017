import React, { Component, PropTypes } from "react";
import { connect } from 'react-redux';

import { changePi } from '../../actions';

import './index.less';

const medalMap = ["first", "second", "third"];
const tabMap = ["", "callpercent", "calltime", "num", "contact", "timeaverage"];

class ShowRankList extends Component {  

    render() {
        const { data,piArr,pi,tips,onClick,tabIndex,sortType } = this.props;
        const length = data.length;
        const showPiArr = [];
        const piArrlen = piArr.length;
        let beforeLen = 6;
        if(piArrlen > 0){
            for(let i = pi; i > 0; i --){
                if(beforeLen == 0){
                    break;
                }
                showPiArr.push(i);
                beforeLen--;
            }
            showPiArr.reverse();
            const showPiArrLen = showPiArr.length;
            if(showPiArrLen < 10){
                let end = Math.min(10 - showPiArrLen, piArrlen - showPiArrLen) + pi;
                for(let i = pi + 1; i <= end; i ++){
                    if(i > piArr[piArrlen - 1]){
                        break;
                    }
                    showPiArr.push(i);
                }                
            }
            if(showPiArr.length < piArrlen){
                for(let i = showPiArr[0] - 1; i > 0 ; i --){
                    if(showPiArr.length >= 10){
                        break;
                    }
                    showPiArr.unshift(i);
                }
            }
        }
        const piCount = (pi - 1) * 6;
        return (
            <div>
                {
                    data != "" ?
                        <ul className="detail">
                            {
                                data.slice(piCount, piCount+ 6).map(function (item, index) {
                                    return <li key={index}>
                                        <div className={index % 2 == 0 ? "content on" : "content"}>
                                            <span className="ranking">
                                                {
                                                    (sortType == 0 || sortType == 2) ?
                                                    medalMap[piCount + index] ? <i className={"medal " + medalMap[piCount * 6 + index]}></i> : piCount + index + 1 :
                                                    medalMap[length - piCount - index - 1] ? <i className={"medal " + medalMap[length - piCount - index - 1]}></i> : length - piCount - index
                                                }
                                            </span>
                                            <span className="user_info">
                                                <span className="user_info_wrap">
                                                    <img src={item.face} />
                                                    <span className="name">{item.name}</span>
                                                </span>
                                            </span>
                                            <span>{item[tabMap[tabIndex]]}</span>
                                        </div>
                                    </li>
                                })
                            }
                        </ul> : (data === "" ? 
                        <div style={{ "height": "432px", "lineHeight": "432px", "textAlign": "center" }}>
                            loading
                        </div> :
                        <div style={{ "height": "432px", "lineHeight": "432px", "textAlign": "center" }}>
                            暂无数据
                        </div>)
                }
                {
                    piArr.length > 0 ?
                        <div className="page">
                            <div className="page_content">
                                {
                                    piArr.length > 1 && pi != 1 ? <div onClick={() => onClick(1)}>首页</div> : ""
                                }                            
                                {
                                    piArr.length > 1 && pi != 1 ? <div onClick={() => onClick(pi - 1)}>上一页</div> : ""
                                }
                                {
                                    showPiArr.map((item, index) => {
                                        return <div className={item == pi ? "on" : ""} key={index} onClick={() => onClick(item)}>{item}</div>
                                    })
                                }
                                {
                                    piArr.length > 1 && pi != piArr[piArr.length - 1] ? <div onClick={() => onClick(pi + 1)}>下一页</div> : ""
                                }
                                {
                                    piArr.length > 1 && pi != piArr[piArr.length - 1] ? <div onClick={() => onClick(piArr[piArr.length - 1])}>末页</div> : ""
                                }
                            </div>
                        </div> : ""
                }   
                {
                    data != "" && tips != "" ?
                        <div className="tips">
                            <i></i><p>电话小助手：<span>{tips}</span></p>
                        </div> : ""
                }                             
            </div>           
        )
    }
}

ShowRankList.PropTypes = {
    data: PropTypes.object.isRequired,
    piArr: PropTypes.object.isRequired,
    pi: PropTypes.number.isRequired,
    tabIndex: PropTypes.number.isRequired,
    tips: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    sortType: PropTypes.number.isRequired
}

const mapStateToProps = (state, ownProps) => {
    return {
        data: state.employeeData.data,
        piArr: state.employeeData.piArr,
        pi: state.employeeData.pi,
        tips: state.employeeData.tips[tabMap[state.employeeData.tabIndex]],
        tabIndex: state.employeeData.tabIndex,
        sortType: state.employeeData[tabMap[state.employeeData.tabIndex]]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onClick: (index) => {
            dispatch(changePi(index));
        }        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowRankList);