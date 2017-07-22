import React, { PropTypes } from 'react';
import { Button } from 'antd-mobile';
import PasswordSetForm from 'components/PasswordSetForm';

class PasswordReset extends React.Component {
    render() {
        return (
            <div className="find-page new-password-set">
                <h2 className="page-title">输入新密码</h2>
                <PasswordSetForm />
                <Button className="next-step-btn" disabled>下一步</Button>
            </div>
        );
    }
}

export default PasswordReset;
