import React, { PropTypes } from 'react';
import { Button } from 'antd-mobile';
import WarningImg from 'components/WarningImg';
import './registered-warning.less';

class RegisteredWarning extends React.Component {
    render() {
        return (
            <div className="register-page warning-page mobile-registered-warning">
                <WarningImg />

                <p className="warning-content">
                    当前手机号码：139828422342 已注册超过2个企业，请问需要继续注册吗？
                </p>

                <p className="prompt">注：每个号码最大可注册5个企业</p>

                <Button type="primary" className="continue-reg">继续注册</Button>
                <Button>返回</Button>
            </div>
        );
    }
}

export default RegisteredWarning;
