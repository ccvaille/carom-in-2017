import React, { PropTypes } from 'react';
import { Button } from 'antd-mobile';
import MobileInput from 'components/MobileInput';
import './other-profile.less';

class OtherProfile extends React.Component {
    render() {
        return (
            <div className="register-page mobile-other-profile">
                <h2
                    className="page-title"
                    style={{
                        display: 'inline-block',
                    }}
                >
                    其他资料
                </h2>
                <span className="gray-text">（非必填）</span>

                <div className="form-wrapper">
                    <div className="form-field">
                        <span className="input-label">职位</span>
                        <MobileInput />
                    </div>
                    <div className="form-field">
                        <span className="input-label">公司行业</span>
                    </div>
                    <div className="form-field">
                        <span className="input-label">地区</span>
                    </div>
                </div>

                <Button type="primary" className="next-step-btn">完成注册</Button>
            </div>
        );
    }
}

export default OtherProfile;
