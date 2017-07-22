import React, { PropTypes } from 'react';
import { Button } from 'antd-mobile';
import PasswordSetForm from 'components/PasswordSetForm';

class PasswordSet extends React.Component {
    render() {
        return (
            <div className="set-password-page">
                <h2 className="page-title">设置密码</h2>
                <PasswordSetForm />
                <Button className="next-step-btn" disabled>下一步</Button>
            </div>
        );
    }
}

export default PasswordSet;
