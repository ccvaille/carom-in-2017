import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import { toggleSwitchCsShow, getFastReply, setIsShowHistoryMsgList } from 'actions/chat';
import { setInputValue, saveTextPos } from 'actions/chatInput';

import textPos from '~cscommon/utils/textPos';

import Emotions from '~cscommon/components/Emotions';
import GuestTypes from '~cscommon/consts/guestTypes';

import switchIcon from 'images/switch-icon.png';
import nothingImg from 'images/deault.png';
import '../../styles/chat.less';

import SessionList from './SessionList';
import MsgList from './MsgList';
import VisitorPath from './VisitorPath';
import SessionInput from './SessionInput';
import VisitorDetails from './VisitorDetails';
import MsgHistory from './MsgHistory';
import SwitchCs from './SwitchCs';
import FastReply from './FastReply';


class Chat extends React.Component {
    static propTypes = {
        chat: PropTypes.object.isRequired,
        chatInput: PropTypes.object.isRequired,
        toggleSwitchCsShow: PropTypes.func.isRequired,
        setIsShowHistoryMsgList: PropTypes.func.isRequired,
        getFastReply: PropTypes.func.isRequired,
        isShowDetail: PropTypes.bool.isRequired,
        setInputValue: PropTypes.func.isRequired,
        saveTextPos: PropTypes.func.isRequired,
    }

    componentDidMount() {
        this.props.getFastReply();
    }

    toggleSwitchCs() {
        const { txguid } = this.props.chat;
        this.props.toggleSwitchCsShow(true);
        this.props.setIsShowHistoryMsgList(txguid, false);
    }
    selectEmotion = (emotion) => {
        const textarea = document.getElementById('ec-session-textarea');
        // const textarea = this.refs.textarea;
        const value = textarea.value;
        const { txguid } = this.props.chat;
        const pos = this.props.chatInput.textPos[txguid] || value.length;
        const emotionText = `[${emotion}]`;
        const newVal = value.slice(0, pos) + emotionText + value.slice(pos);

        this.props.setInputValue(txguid, newVal);

        setTimeout(() => {
            textarea.focus();
            textPos.setTextPos(textarea, pos + emotionText.length);
            this.props.saveTextPos(txguid, pos + emotionText.length);
        }, 16);
    }
    render() {
        const {
            csid,
            guid,
            txguid,
            guests,
            historyMsgs,
            sessions,
            shortCutKey,
            sendSettingWrapperVisible,
        } = this.props.chat;

        const { isShowEmotion } = this.props.chatInput;

        const currentHistoryMsgs = historyMsgs[txguid] || {};
        const { isShowHistoryMsgList } = currentHistoryMsgs;
        const guestInfo = guests[txguid] || {
            guidName: 'loading...',
            visitortype: '',
        };
        const isSessionOvered = sessions.findIndex(sess => sess.guid === guid) === -1;
        const sessionClasses = classNames({
            'session-main': true,
            show: !!guid,
            'show-detail': this.props.isShowDetail,
        });
        return (
            <div className="cs-chat">
                <SessionList />
                {
                    isShowHistoryMsgList ? <MsgHistory /> : null
                }
                {
                    guid ?
                        <div className={sessionClasses}>
                            <div className="session-header">
                                <h2>
                                    { guestInfo.guidName }
                                    { guestInfo.visitortype === GuestTypes.WX ? ' EC-微客通' : '' }
                                </h2>
                                {
                                    isSessionOvered ? null :
                                    <a
                                        className="change-cs"
                                        onClick={() => this.toggleSwitchCs()}
                                        role="button"
                                        tabIndex="0"
                                    >
                                        <img
                                            style={{
                                                verticalAlign: 'middle',
                                                marginRight: 3,
                                            }}
                                            src={switchIcon}
                                            alt=""
                                        />
                                        转接
                                    </a>
                                }
                            </div>
                            <VisitorPath />
                            <MsgList />
                            <SessionInput
                                sendSettingKey={shortCutKey}
                                sendSettingWrapperVisible={sendSettingWrapperVisible}
                            />
                        </div> :
                        <div className="session-main nothing">
                            <img src={nothingImg} alt="" />
                        </div>
                }
                <FastReply />
                {
                    guid ? <VisitorDetails currentTxGuid={txguid} currentGuid={guid} /> : null
                }

                <div className="faceCell" style={{ display: isShowEmotion ? 'block' : 'none' }}>
                    <Emotions onSelect={this.selectEmotion} />
                </div>

                <SwitchCs csid={csid} />
            </div>
        );
    }
}

const mapStateToProps = ({ chat, visitorDetails, chatInput }) => ({
    chatInput,
    chat,
    isShowDetail: visitorDetails.isShowDetail,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    toggleSwitchCsShow,
    getFastReply,
    setIsShowHistoryMsgList,
    setInputValue,
    saveTextPos,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
