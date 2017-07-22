import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import SessionMsg from '~cscommon/components/Msg';
import GuestTypes from '~cscommon/consts/guestTypes';

import csDefaultAvatar from '~cscommon/images/default-cs.png';
import visitorDefaultAvatar from '~cscommon/images/default-visitor.png';

import * as MsgTypes from '../../constants/MsgTypes';
import * as MsgStates from '../../constants/MsgStates';

import * as chatActs from '../../actions/chat';
import * as chatInputActs from '../../actions/chatInput';

import * as ChatGuestTerminals from '../../constants/ChatGuestTerminals';

import PC_AVATAR from '../../images/client-device-pc.png';
import CELL_PHONE_AVATAR from '../../images/client-device-phone.png';
import WX_AVATAR from '../../images/client-device-wx.png';

const deviceAvatars = {
    [ChatGuestTerminals.PC]: PC_AVATAR,
    [ChatGuestTerminals.CELL_PHONE]: CELL_PHONE_AVATAR,
    [ChatGuestTerminals.WX]: WX_AVATAR,
    [ChatGuestTerminals.DEFAULT]: WX_AVATAR,
};

const scrollTops = {};
const prevHeights = {};
const isInBottoms = {};

// const historyInitialCount = 5;

function getChanges(prevProps, prevState, nextProps) {
    const prevGuid = prevProps.chat.txguid;
    const prevMsgs = prevProps.chat.msgs[prevGuid] || [];
    const prevScrollPage = prevProps.chat.historyMsgs[prevGuid].scrollPage;
    const prevHistoryMsgs = (prevProps.chat.historyMsgs[prevGuid].msgs || [])
                            .slice(-63).slice(-((prevScrollPage * 15) + 5));

    const { txcsid, txguid, msgs, historyMsgs } = nextProps.chat;
    const currMsgs = msgs[txguid] || [];
    const { scrollPage } = historyMsgs[txguid];
    const currHistoryMsgs = (historyMsgs[txguid].msgs || [])
                            .slice(-63).slice(-((scrollPage * 15) + 5));

    const isGuidChaged = txguid !== prevGuid;

    if (!prevGuid || !txguid) return { isGuidChaged };

    const firstMsg = (currHistoryMsgs || [])[0] || {};
    const prevFirstMsg = (prevHistoryMsgs || [])[0] || {};
    const lastMsg = currMsgs[currMsgs.length - 1] || {};
    const prevLastMsg = prevMsgs[prevMsgs.length - 1] || {};

    const lastHistoryMsg = currHistoryMsgs[currHistoryMsgs.length - 1] || {};
    const prevLastHistoryMsg = prevHistoryMsgs[prevHistoryMsgs.length - 1] || {};

    const isFirstMsgsChanged = firstMsg.msgId !== prevFirstMsg.msgId;
    const isScrollPageChanged = scrollPage !== prevScrollPage;
    const isLastMsgsChanged = lastMsg.msgId !== prevLastMsg.msgId;
    const isLastFromSelf = lastMsg.fromId === txcsid;
    const isLastHistoryMsgChanged = lastHistoryMsg.msgId !== prevLastHistoryMsg.msgId;

    return {
        isGuidChaged,
        isFirstMsgsChanged,
        isScrollPageChanged,
        isLastMsgsChanged,
        isLastFromSelf,
        isLastHistoryMsgChanged,
    };
}

function checkIsInBottom() {
    const $msgList = document.querySelector('.msg-list');
    return $msgList.scrollTop + $msgList.clientHeight === $msgList.scrollHeight;
}

function getFaceImg(guestInfo) {
    const { visitortype, terminal, face } = guestInfo;

    if (face) {
        return face;
    }

    let faceKey = ChatGuestTerminals.DEFAULT;
    switch (visitortype) {
        case GuestTypes.WEB: {
            faceKey = terminal;
            break;
        }
        case GuestTypes.WX:
            faceKey = ChatGuestTerminals.WX;
            break;
        default:
            break;
    }
    return deviceAvatars[faceKey];
}
function getListType(visitortype) {
    switch (visitortype) {
        case GuestTypes.WX:
            return 'wx';
        case GuestTypes.WEB:
        default:
            return 'web';
    }
}

let resizeCb;

class MsgList extends React.Component {
    static propTypes = {
        chat: React.PropTypes.object.isRequired,
        dispatch: React.PropTypes.func.isRequired,
    }
    componentDidMount() {
        const $msgList = document.querySelector('.msg-list');
        let { txguid } = this.props.chat;

        const isInBottom = isInBottoms[txguid] === undefined ?
                           checkIsInBottom() :
                           isInBottoms[txguid];

        isInBottoms[txguid] = isInBottom;
        this.props.dispatch(chatActs.setIsScrollToBottom(txguid, isInBottom));
        $msgList.scrollTop = isInBottom ? 99999 : (scrollTops[txguid] || 99999);
        prevHeights[txguid] = $msgList.scrollHeight;

        if (!resizeCb) {
            resizeCb = () => {
                txguid = this.props.chat.txguid;
                if (isInBottoms[txguid]) {
                    document.querySelector('.msg-list').scrollTop = 99999;
                }
            };
        }
        window.addEventListener('resize', resizeCb, false);
    }
    componentWillReceiveProps(nextProps, nextState) {
        const $msgList = document.querySelector('.msg-list');
        const { txguid } = this.props.chat;

        const changes = getChanges(this.props, this.state, nextProps, nextState);

        const {
            isGuidChaged,
            isLastMsgsChanged,
            isScrollPageChanged,
        } = changes;

        if (isGuidChaged || isScrollPageChanged || isLastMsgsChanged) {
            prevHeights[txguid] = $msgList.scrollHeight;
        }
    }
    componentDidUpdate(prevProps, prevState) {
        const $msgList = document.querySelector('.msg-list');

        const { txguid } = this.props.chat;

        const changes = getChanges(prevProps, prevState, this.props, this.state);

        const {
            isGuidChaged,
            isFirstMsgsChanged,
            isLastMsgsChanged,
            isLastFromSelf,
            isLastHistoryMsgChanged,
            isScrollPageChanged,
        } = changes;

        const nochange = !isGuidChaged &&
                         !isFirstMsgsChanged &&
                         !isLastMsgsChanged &&
                         !isLastFromSelf &&
                         !isLastHistoryMsgChanged &&
                         !isScrollPageChanged;

        if (nochange) {
            return;
        }

        let scrollTop = $msgList.scrollTop;

        if (isGuidChaged) {
            if (isInBottoms[txguid] || isInBottoms[txguid] === undefined) {
                scrollTop = 99999;
                isInBottoms[txguid] = true;
                this.props.dispatch(chatActs.setIsScrollToBottom(txguid, true));
            } else {
                scrollTop = scrollTops[txguid];
            }
        } else if (isScrollPageChanged || isFirstMsgsChanged) {
            if (isInBottoms[txguid]) {
                scrollTop = 99999;
            } else {
                scrollTop = $msgList.scrollHeight - prevHeights[txguid];
            }
            // prevHeights[txguid] = $msgList.scrollHeight;
        } else if (isLastHistoryMsgChanged) {
            scrollTop = 99999;
        } else if (isLastMsgsChanged) {
            if (isInBottoms[txguid] || isLastFromSelf) {
                scrollTop = 99999;
            }
        } else if (isInBottoms[txguid]) {
            scrollTop = 999999;
        }

        $msgList.scrollTop = scrollTop;
        scrollTops[txguid] = scrollTop;
    }
    componentWillUnmount() {
        // window.msgListWrapperWidth = document.querySelector('.msg-list').clientWidth;
        window.removeEventListener('resize', resizeCb);
    }
    onScroll(txguid) {
        const $msgList = document.querySelector('.msg-list');
        const isInBottom = checkIsInBottom();
        scrollTops[txguid] = $msgList.scrollTop;
        if (isInBottom) {
            this.props.dispatch(chatActs.setIsShowNewMsgTip(txguid, false));
        }
        if (isInBottoms[txguid] === isInBottom) {
            return;
        }
        isInBottoms[txguid] = isInBottom;
        this.props.dispatch(chatActs.setIsScrollToBottom(txguid, isInBottom));
    }
    getHistoryMsgs(txguid) {
        // const { historyMsgs } = this.props.chat;
        // const { isGetting, isScrollGetting, scrollPage = 0 } = historyMsgs[txguid];

        // if (isScrollGetting || isGetting) {
        //     return;
        // }

        // const { dispatch } = this.props;
        // dispatch(chatActs.setHistoryScrollPage(txguid, scrollPage + 1));
        // dispatch(chatActs.getHistoryMsgs(txguid, 'isFromScroll'));

        // @todo history_fix
        const { historyMsgs } = this.props.chat;
        const { isGetting, isScrollGetting, scrollPage = 0 } = historyMsgs[txguid];

        if (isScrollGetting || isGetting) {
            return;
        }

        const { dispatch } = this.props;

        // 应该不需要 scrollpage 了
        dispatch(chatActs.setHistoryScrollPage(txguid, scrollPage + 1));
        dispatch(chatActs.getHistoryMessages({
            txguid,
            showLimit: 15,
        }));
    }
    showHistoryList(txguid) {
        this.props.dispatch(chatActs.setIsShowHistoryMsgList(txguid, true));
    }
    resend = (msg) => {
        const { guid, sessions } = this.props.chat;
        const isGuestLeaved = sessions.findIndex(sess => sess.guid === guid) === -1;
        if (!isGuestLeaved &&
            (msg.state === MsgStates.FAILED || msg.state === MsgStates.UPLOAD_FAILED)
        ) {
            this.props.dispatch(chatInputActs.resendMsg(msg));
        } else if (isGuestLeaved) {
            this.props.dispatch(chatInputActs.showSessTip('会话已结束，不能发送消息。'));
        }
    }
    fixScroll(txguid) {
        const $msgList = document.querySelector('.msg-list');
        const currentTxguid = this.props.chat.txguid;

        if (txguid !== currentTxguid) {
            return;
        }

        // let scrollTop = scrollTops[txguid];
        // console.log($img.height, $msgList.scrollHeight - prevHeights[txguid]);
        // var scrollPage = (self.props.msg.historyMsgs[txguid] || {}).scrollPage || 0;
        // const dist = $msgList.scrollHeight - prevHeights[txguid];
        // prevHeights[txguid] = $msgList.scrollHeight;
        // scrollTop += dist;

        if (isInBottoms[txguid]) {
            const scrollTop = 99999;

            scrollTops[txguid] = scrollTop;
            $msgList.scrollTop = scrollTop;
        }
    }
    goToBottom = () => {
        const { dispatch, chat } = this.props;
        document.querySelector('.msg-list').scrollTop = 999999;
        dispatch(chatActs.setIsShowNewMsgTip(chat.txguid, false));
    }
    renderMsg(msg, isHistory) {
        const { txcsid, txguid, guests, csInfo } = this.props.chat;
        const { msgId } = msg;
        const guestInfo = guests[txguid] || {};
        const isFromSelf = msg.fromId === txcsid || !!msg.fromName;
        const userInfo = {
            pic: msg.fromPic || (isFromSelf ? csInfo.face : getFaceImg(guestInfo)),
            name: msg.fromName || (isFromSelf ? csInfo.name : guestInfo.guidName),
        };

        let time = '';
        if (isHistory) {
            time = moment(msg.msgTime).format('YYYY-MM-DD HH:mm:ss');
        } else {
            time = moment(msg.msgTime).format('MM-DD HH:mm:ss');
        }

        return (
            <SessionMsg
                isFromSelf={isFromSelf}
                defaultAvatar={isFromSelf ? csDefaultAvatar : visitorDefaultAvatar}
                userInfo={userInfo}
                msg={msg}
                fromattedTime={time}
                resend={this.resend}
                onImgMsgLoad={() => this.fixScroll(txguid)}
                onImgMsgError={() => this.fixScroll(txguid)}
                key={msgId}
            />
        );
    }
    renderHistoryTipBtn(isMsgListFull) {
        const { txguid, historyMsgs } = this.props.chat;
        const currHisMsgs = historyMsgs[txguid] || {};
        const { isScrollGetting, isShowHistoryMsgList } = currHisMsgs;

        let btnCont = null;

        if (isMsgListFull) {
            let btnCtrlCont = [];
            if (!isShowHistoryMsgList) {
                btnCtrlCont = [
                    '，',
                    <a
                        onClick={() => this.showHistoryList(txguid)}
                        role="button"
                        tabIndex="0"
                    >
                        打开消息记录
                    </a>
                ];
            }
            btnCont = <span>更多消息请在消息记录里查看{btnCtrlCont}</span>;
        } else if (!isScrollGetting) {
            btnCont = (
                <a
                    onClick={() => this.getHistoryMsgs(txguid)}
                    role="button"
                    tabIndex="0"
                >
                    查看更多消息
                </a>
            );
        }

        return (
            <div className={`history-tip${isScrollGetting ? ' loading' : ''}`}>
                {
                    btnCont
                }
            </div>
        );
    }
    render() {
        const { guid, txguid, msgs, historyMsgs, newMsgTipStates, guests } = this.props.chat;
        const guestInfo = guests[txguid] || {};
        const { visitortype } = guestInfo;
        const listType = getListType(visitortype);
        // const currMsgs = (switchMsgs[txguid] || []).concat(msgs[txguid] || []);
        const currMsgs = msgs[txguid] || [];
        // currMsgs.forEach((msg, index) => {
        //     const { msgTime, msgContent, msgId } = msg;
        //     if (msgContent.indexOf('进入对话') > -1) {
        //         currMsgs.splice(index, 1);
        //         currMsgs.unshift(msg);
        //     }
        // });
        const currMsgsLength = currMsgs.filter(msg => msg.type === MsgTypes.SESSION_MSG).length;

        const currentHistory = historyMsgs[txguid] || {};
        const { msgs: currentHistoryMessages = [], isCompleted, scrollPage = 0 } = currentHistory;
        // const { isCompleted, scrollPage = 0 } = currHisMsgs;

        // const historySessMsgs = (currHisMsgs.msgs || [])
        //                            .filter(msg => msg.type === MsgTypes.SESSION_MSG);
        // const historyMsgsLength = Math.max(
        //                               Math.min(63 - currMsgsLength, 15 * scrollPage),
        //                               0,
        //                               historyInitialCount
        //                           );

        // let shouldAddedHistoryMsgs = [];
        // if (historyMsgsLength) {
        //     shouldAddedHistoryMsgs = historySessMsgs.slice(-historyMsgsLength);
        // }

        const shouldAddedHistoryMsgs = currentHistoryMessages.slice(-63);
        let shouldShowHistory = [];
        if (scrollPage === 0) {
            shouldShowHistory = shouldAddedHistoryMsgs.slice(-5);
        } else {
            shouldShowHistory = shouldAddedHistoryMsgs.slice(-((scrollPage * 15) + 5));
        }
        const isMsgListFull = shouldShowHistory.length + currMsgsLength >= 63;
        const isShowGetHistoryBtn = isMsgListFull ||
                                    (shouldShowHistory.length < shouldAddedHistoryMsgs.length) ||
                                    (isCompleted !== undefined && !isCompleted);

        return (
            <div className={`msg-list ${listType}`} onScroll={() => this.onScroll(txguid)}>
                {
                    isShowGetHistoryBtn ? this.renderHistoryTipBtn(isMsgListFull) : null
                }
                {
                    guid ? <ol >
                        {
                            shouldShowHistory.map(msg => this.renderMsg(msg, true))
                        }
                        {
                            currMsgs.map(msg => this.renderMsg(msg, false))
                        }
                    </ol> : null
                }
                <div
                    className="new-msg"
                    onClick={this.goToBottom}
                    style={{ display: newMsgTipStates[txguid] ? 'block' : 'none' }}
                    role="button"
                    tabIndex="0"
                >
                    新消息
                </div>
            </div>
        );
    }
}

export default connect((state) => {
    const { chat } = state;
    return {
        chat,
    };
})(MsgList);
