import React, { PropTypes } from 'react';
import { Button } from 'antd-mobile';
import MobileInput from 'components/MobileInput';

class CompleteProfile extends React.Component {
    render() {
        return (
            <div className="set-password-page">
                <h2 className="page-title">完善资料</h2>

                <div className="form-wrapper set-wrapper">
                    <div className="form-field">
                        <span className="input-label">公司全称</span>
                        <MobileInput type="password" />
                    </div>
                    <div className="form-field">
                        <span className="input-label">姓名</span>
                        <MobileInput type="password" />
                    </div>
                </div>

                <Button className="next-step-btn" disabled>下一步</Button>
            </div>
        );
    }
}

export default CompleteProfile;
