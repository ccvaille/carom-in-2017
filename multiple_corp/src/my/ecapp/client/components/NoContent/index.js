import React from 'react';
const NoContent = () => {
    return (
        <div className="no-content">
            <img className="error-img" src="//www.staticec.com/api/images/error_403.png" alt=""/>
            <p className="error-tips-box">暂无消息</p>
        </div>
    )
}

export default NoContent