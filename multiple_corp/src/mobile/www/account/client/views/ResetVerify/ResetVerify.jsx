import React, { PropTypes } from 'react';
import PhoneVerify from 'views/PhoneVerify';

class ResetVerify extends React.Component {
    render() {
        return (
            <div className="mobile-reset-password">
                <PhoneVerify />
            </div>
        );
    }
}

export default ResetVerify;
