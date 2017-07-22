import React, { PropTypes } from 'react';
import { Button } from 'antd-mobile';
import WarningImg from 'components/WarningImg';

class ExcessQuotaWarning extends React.Component {
    render() {
        return (
            <div className="register-page warning-page mobile-excess-warning">
                <WarningImg />

                <p className="warning-content">
                    当前手机号码：13776888999 已注册过5个企业，达到注册数量限制。如需要继续注册企业请更换手机号码。
                </p>

                <p className="prompt">注：每个号码最大可注册5个企业</p>

                <Button type="primary" className="continue-reg">返回</Button>
                <Button>关闭</Button>
            </div>
        );
    }
}

export default ExcessQuotaWarning;
