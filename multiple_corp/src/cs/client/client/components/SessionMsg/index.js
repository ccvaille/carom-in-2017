import React from 'react';
import moment from 'moment';
import csDefaultAvatar from 'images/cs-default.png';
import visitorDefaultAvatar from 'images/visitor-default.png';
import defaultAvator from '../../images/cs-default.png'

class SessionMsg extends React.Component {
    // onAvatarError = (type) => {
    //     switch (type) {
    //         case 'cs':

    //             break;
    //         case 'visitor':
    //         default:
    //             break;
    //     }
    // }
    static defaultProps = {
        isHistory: 0,
    }

    resend = () => {
        this.props.resend && this.props.resend(this.props.msg);
    }

    fixCsAvatar = (e) => {
        e.target.src = defaultAvator;
    }

    render() {
        const { className, stateCls = 'received', userInfo, msg, isHistory } = this.props;
        const { msgTime, msgContent, msgId } = msg;
        let avatarNode = null;

        if (className === 'self') {
            let csAvatarUrl = userInfo.pic;
            if (!csAvatarUrl) {
                csAvatarUrl = csDefaultAvatar;
            }

            avatarNode = (
                <img
                    className="avatar"
                    src={csAvatarUrl}
                    width="30"
                    height="30"
                    onError={this.fixCsAvatar}
                />
            );
        } else if (className === 'other') {
            let visitorAvatarUrl = userInfo.pic;
            if (!visitorAvatarUrl) {
                visitorAvatarUrl = visitorDefaultAvatar;
            }

            avatarNode = (
                <img
                    className="avatar"
                    src={visitorAvatarUrl}
                    width="30"
                    height="30"
                />
            );
        }

        // let avatar = userInfo.pic;

        // if (!userInfo.pic) {
        //     if (className === 'self') {
        //         avatar = csDefaultAvatar;
        //     } else if (className === 'other') {
        //         avatar = visitorDefaultAvatar;
        //     }
        // }
        let time = null;

        if (isHistory) {
            time = moment(msgTime).format('YYYY-MM-DD HH:mm:ss');
        } else {
            time = moment(msgTime).format('MM-DD HH:mm:ss');
        }

        return (
            <li className={ `msg-item from-${className}` }>
                {avatarNode}
                <div className="msg-main">
                    <span className="msg-info">
                        <span className="name">{ userInfo.name }</span>
                        <span className="time">{time}</span>
                    </span>
                    <div className="msg-content">
                        <p dangerouslySetInnerHTML={{ __html: msgContent }}></p>
                        <span className={ `msg-state ${stateCls}` } onClick={ this.resend }></span>
                    </div>
                </div>
            </li>
        );
    }
}

export default SessionMsg;
