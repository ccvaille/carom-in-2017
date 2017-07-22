import React, { PropTypes } from 'react';
import MobileInput from 'components/MobileInput';

class PasswordSetForm extends React.Component {
    render() {
        return (
            <div className="form-wrapper set-wrapper">
                <div className="form-field">
                    <span className="input-label">密码</span>
                    <MobileInput type="password" />
                </div>
                <div className="form-field">
                    <span className="input-label">重复密码</span>
                    <MobileInput type="password" />
                </div>
            </div>
        );
    }
}

export default PasswordSetForm;
