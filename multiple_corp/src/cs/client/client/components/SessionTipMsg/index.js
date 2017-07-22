import React from 'react';

class SessionTipMsg extends React.Component {
    render() {
        const { msgContent, msgId } = this.props.msg;
        return (
            <li className="custom-msg">{ (msgContent) }</li>
        );
    }
}

export default SessionTipMsg;
