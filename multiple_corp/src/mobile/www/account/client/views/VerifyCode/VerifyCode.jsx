import React, { PropTypes } from 'react';
import { Flex } from 'antd-mobile';
import MobileInput from 'components/MobileInput';
import './verify-code.less';

class VerifyCode extends React.Component {
    render() {
        return (
            <div className="mobile-verify-code">
                <h2 className="page-title verify-title">验证手机</h2>
                <p className="sended-text">验证码已发送至 18882324215</p>

                <div className="gray-text">验证码</div>
                <Flex className="code-list">
                    <MobileInput type="number" className="first" />
                    <MobileInput type="number" className="first" />
                    <MobileInput type="number" className="first" />
                    <MobileInput type="number" className="first" />
                    <MobileInput type="number" className="first" />
                    <MobileInput type="number" className="first" />
                </Flex>

                <div className="resend-code">
                    <p className="countdown">重新获取验证码 56s</p>
                </div>
            </div>
        );
    }
}

export default VerifyCode;
