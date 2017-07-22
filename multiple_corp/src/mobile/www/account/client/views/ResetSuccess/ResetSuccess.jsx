import React from 'react';
import { Button } from 'antd-mobile';
import WarningImg from 'components/WarningImg';
import './reset-success.less';

class ResetSuccess extends React.Component {
    render() {
        return (
            <div className="find-page reset-success">
                <WarningImg type={1} />
                <p className="success-text">密码设置成功</p>
                <Button type="primary" className="next-step-btn">返回登录</Button>
            </div>
        );
    }
}

export default ResetSuccess;
