/*eslint-disable*/
var React = require('react');
var sessionMsgTypes = require('~cscommon/consts/sessionMsgTypes');

var SessionMsg = require('./SessionMsg'),
    TipMsg = require('./TipMsg');

module.exports = React.createClass({
    render: function () {
        var isFromSelf = this.props.isFromSelf,
            defaultAvatar = this.props.defaultAvatar,
            stateCls = this.props.stateCls,
            userInfo = this.props.userInfo,
            msg = this.props.msg,
            fromattedTime = this.props.fromattedTime,
            resend = this.props.resend,
            onImgMsgLoad = this.props.onImgMsgLoad,
            onImgMsgError = this.props.onImgMsgError,
            isInHistoryList = this.props.isInHistoryList;

        var Msg;
        switch (msg.type) {
            case sessionMsgTypes.TIP_MSG:
                Msg = TipMsg;
                break;
            case sessionMsgTypes.SESSION_MSG: {
                if (isInHistoryList) {
                    Msg = SessionMsg.HistorySessionMsg;
                } else {
                    Msg = SessionMsg.SessionMsg;
                }
                break;
            }
            default:
                break;
        }

        return <Msg
                isFromSelf={ isFromSelf }
                defaultAvatar={ defaultAvatar }
                stateCls={ stateCls }
                userInfo={ userInfo }
                msg={ msg }
                fromattedTime={ fromattedTime }
                resend={ resend }
                onImgMsgLoad={ onImgMsgLoad }
                onImgMsgError={ onImgMsgError } />
    }
});
