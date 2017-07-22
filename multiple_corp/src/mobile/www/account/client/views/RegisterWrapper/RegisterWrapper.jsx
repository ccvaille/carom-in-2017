import React, { PropTypes } from 'react';

class RegisterWrapper extends React.Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
    }

    render() {
        return (
            <div className="register-page">
                {this.props.children}
            </div>
        );
    }
}

export default RegisterWrapper;
