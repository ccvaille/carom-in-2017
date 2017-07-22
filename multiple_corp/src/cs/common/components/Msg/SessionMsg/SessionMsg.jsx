/*eslint-disable*/
var React = require('react');

var subTypes = require('~cscommon/consts/msgSubTypes').SESSION;
var msgStates = require('~cscommon/consts/msgStates');

var Text = require('./Text'),
    Image = require('./Image'),
    Audio = require('./Audio');

module.exports = React.createClass({
    onAvatarError: function (e) {
        var $avatar = this.refs.avatar,
            defaultAvatar = this.props.defaultAvatar;

        if (!defaultAvatar || $avatar.src.indexOf(defaultAvatar) !== -1) {
            return;
        }

        $avatar.src = defaultAvatar;
    },
    resend: function (msg) {
        this.props.resend && this.props.resend(msg);
    },
    getMsgState: function (msg) {
        var stateCls = '';
        switch (msg.state) {
            case msgStates.SENDING:
                stateCls = 'sending';
                break;
            case msgStates.SENT:
                stateCls = 'sent';
                break;
            case msgStates.FAILED:
            case msgStates.UPLOAD_FAILED:
                stateCls = 'faild icon-exclamation-circle icon';
                break;
            case msgStates.RECEIVED:
                stateCls = 'received';
                break;
            default:
                break;
        }
        return stateCls;
    },
    renderMsgContent: function (msg) {
        var Msg;
        switch (msg.subType) {
            case subTypes.IMAGE:
                Msg = Image;
                break;
            case subTypes.AUDIO:
                Msg = Audio;
                break;
            case subTypes.TEXT:
            default:
                Msg = Text;
                break;
        }
        return <Msg msg={ msg }
                    onImgMsgLoad={ this.props.onImgMsgLoad }
                    onImgMsgError={ this.props.onImgMsgError } />
    },
    render: function () {
        var isFromSelf = this.props.isFromSelf,
            fromattedTime = this.props.fromattedTime,
            userInfo = this.props.userInfo,
            msg = this.props.msg,
            resend = this.props.resend;

        var isImageMsg = msg.subType === subTypes.IMAGE;
        var stateCls = this.getMsgState(msg);

        return (
            <li className={ 'msg-item from-' + (isFromSelf ? 'self' : 'other') }>
                <img ref="avatar"
                    className="avatar"
                    src={ userInfo.pic }
                    width="30"
                    height="30"
                    onError={ this.onAvatarError } />
                <div className="msg-main">
                    <span className="msg-info">
                        <span className="name">{ userInfo.name }</span>
                        <span className="time">{ fromattedTime }</span>
                    </span>
                    <div className={ 'msg-content' + (isImageMsg ? ' image-content' : '') }>
                        {
                            this.renderMsgContent(msg)
                        }
                        <span className={ 'msg-state ' + stateCls } onClick={ this.resend.bind(this, msg) }></span>
                    </div>
                </div>
            </li>
        );
    }
});
