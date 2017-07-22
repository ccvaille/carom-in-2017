/*eslint-disable*/
var React = require('react');

var subTypes = require('~cscommon/consts/msgSubTypes').SESSION;

var Text = require('./Text'),
    Image = require('./Image'),
    Audio = require('./Audio');

module.exports = React.createClass({
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
            msg = this.props.msg;

        return (
            <li className={ 'from-' + (isFromSelf ? 'self' : 'other') }>
                <p className="history-name">
                    <span>{ userInfo.name }</span>
                    <span style={{ marginLeft: '10px' }}>
                    { fromattedTime }
                    </span>
                </p>
                <div className="history-msg-show">
                {
                    this.renderMsgContent(msg)
                }
                </div>
            </li>
        );
    }
});
