import React, { Component, PropTypes } from "react";
import { connect } from 'react-redux';

import './index.less';

class RefreshTime extends Component {
    render() {
        const { updateTime } = this.props;
        return (
            <div>
                {
                    updateTime != '' ? <div className="refresh_time">最后更新时间：<i>{updateTime}</i></div> : ""
                }            
            </div>   
        )
    }
}

RefreshTime.PropTypes = {
    updateTime: PropTypes.string.isRequired
}

const mapStateToProps = (state, ownProps) => {
    if(state.dailyData.data == ""){
        return {
            updateTime: ""
        }
    }
    return {
        updateTime: state.dailyData.data.data.datetime
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RefreshTime);