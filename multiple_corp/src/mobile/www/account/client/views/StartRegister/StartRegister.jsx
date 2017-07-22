import React, { PropTypes } from 'react';
import { Button } from 'antd-mobile';
import './start-register.less';

class StartRegister extends React.Component {
    componentDidMount() {
        // @todo 获取验证码服务 js
    }

    render() {
        return (
            <div className="register-page mobile-start-register">
                <h2 className="page-title">注册</h2>
                <p className="content">
                    注册即表明你同意我们的
                    <a href="">《EC用户协议》</a>，你可能会收到来自 EC 的短信通知
                </p>

                <div className="start">
                    <Button type="primary" className="start-btn">马上开始</Button>
                </div>

                <div className="to-login">
                    <span>已有账号？</span>
                    <a href="">登录</a>
                </div>
            </div>
        );
    }
}

export default StartRegister;
