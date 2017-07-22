import React from 'react';
import { connect } from 'react-redux';
import '../ECTeam/index.less'

class ErrorMessage extends React.Component {
    getData() {
        window.location.reload();
    }
    render() {
        var data = this.props.data;

        return (
            <div className="ecTeam-box ecTeam-box-sno">
                <img className="error-img" src="//www.staticec.com/api/images/error_403.png" alt=""/>
                <div className="error-tips-box">
                    对不起，这里的内容跑的慢了点~
                </div>
                <div className="refresh-btn"><a onClick={() => this.getData()}>刷新</a></div>
            </div>
        )

    }
}

export default ErrorMessage;



