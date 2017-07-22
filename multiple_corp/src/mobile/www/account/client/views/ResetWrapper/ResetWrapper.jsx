import React from 'react';

class ResetWrapper extends React.Component {
    render() {
        return (
            <div className="reset-page">
                {this.props.children}
            </div>
        );
    }
}

export default ResetWrapper;
