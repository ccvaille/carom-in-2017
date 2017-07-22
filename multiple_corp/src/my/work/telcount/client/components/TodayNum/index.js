import React, { Component, PropTypes } from "react";
import { connect } from 'react-redux';

import './index.less';

class TodayNum extends Component {
    render() {
        const { num } = this.props;
        return (
            <div>
                {
                    !num.hasData ? "" :
                    <ul className="statistics-items">
                        <li>
                            <p className="statistics-items-name">接通率</p>
                            <p className="statistics-items-num">{num.callCompletingRate}%</p>
                        </li>
                        <li>
                            <p className="statistics-items-name">通话时长</p>
                            <p className="statistics-items-num">{num.callDuration}分钟</p>
                        </li>
                        <li>
                            <p className="statistics-items-name">拨打次数</p>
                            <p className="statistics-items-num">{num.dialCount}</p>
                        </li>
                        <li>
                            <p className="statistics-items-name">联系人数量</p>
                            <p className="statistics-items-num">{num.person}</p>
                        </li>
                    </ul> 
                }   
            </div>
        )
    }
}

TodayNum.PropTypes = {
    num: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => {
    if(state.dailyData.data == ""){
        return {
            num: {
                hasData: false
            }
        }
    }
    return {
        num: {
            hasData: true,
            dialCount: state.dailyData.data.data.num,
            person: state.dailyData.data.data.contact,
            callCompletingRate: state.dailyData.data.data.callpercent,
            callDuration: state.dailyData.data.data.calltime,           
        }
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TodayNum);