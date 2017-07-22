import { replace } from 'react-router-redux';
import moment from 'moment';
import cookie from 'react-cookie';
import convert, { convertTxMsg } from '~cscommon/utils/convert';
import CustomMsgTypes from '~cscommon/consts/msgTypes';
import msgSubTypes from '~cscommon/consts/msgSubTypes';
import GuestTypes from '~cscommon/consts/guestTypes'; // todo :: accTypes
import txidPrefixes from '~cscommon/consts/txidPrefixes';
import { OFFLINE_TYPE } from 'constants/shared';
import { displayError } from '~comm/utils';
import restHub from '~comm/services/restHub';
import { heapSort } from '~cscommon/utils/heapSort';
import pcAvatar from 'images/client-device-pc.png';
import mobileAvatar from 'images/client-device-phone.png';
import wxAvatar from 'images/client-device-wx.png';
import { updateOfflineType } from 'actions/app';
import ApiUrls from 'constants/ApiUrls';

import SparkMD5 from '../../../common/lib/spark-md5';
import webim from '../../../common/lib/webim1.7.0';
import * as ChatActionTypes from '../constants/ChatActionTypes';
import * as GuestStatus from '../constants/ChatGuestStatus';
import * as EcAlertTypes from '../constants/EcAlertTypes';
import * as ChatGuestTerminals from '../constants/ChatGuestTerminals';
import * as MsgTypes from '../constants/MsgTypes';
import * as MsgStates from '../constants/MsgStates';
import * as chatEcimActs from './chatEcim';
import * as inputActs from './chatInput';
import * as sessionListActs from './chatSessionList';
import { getCrmInfo } from './visitorDetails';

const chattingPath = '/kf/client/chat';
const historyMaxCount = 15;

window.SparkMD5 = SparkMD5;
function initWindowFns() {
    window.ecShowImg = (image) => {
        window.ECBridge.exec({
            command: 530,
            data: {
                image,
            },
            callback: () => {},
        });
    };
}

export function ecAlert(data, callback = () => {}) {
    console.log('ecalert:', data);
    return () => {
        window.ECBridge.exec({
            command: 523,
            data: {
                ...data,
                guinfo: {
                    ...data.guinfo,
                    guid: +data.guinfo.guid
                }
            },
            callback,
        });
    };
}

export function setLogined(isTxImLogined) {
    return {
        type: ChatActionTypes.SET_TX_LOGINED,
        payload: {
            isTxImLogined,
        },
    };
}

export function setPreviewMsg(txguid, content) {
    return {
        type: ChatActionTypes.SET_PREVIEW_MSG,
        payload: {
            txguid,
            content,
        },
    };
}

export function updateMsgs(msgs) {
    return {
        type: ChatActionTypes.UPDATE_MSGS,
        payload: {
            msgs,
        },
    };
}

export function addMsg(fromId, msg, isPrepend) {
    return (dispatch, getState) => {
        const { msgs } = getState().chat;

        const currentMsgs = [...(msgs[fromId] || [])];
        currentMsgs[isPrepend ? 'unshift' : 'push'](msg);

        dispatch(updateMsgs({
            ...msgs,
            [fromId]: currentMsgs,
        }));
        /*eslint-disable*/
        dispatch(countHistoryMaxPage(fromId));
        /*eslint-enable*/
        // document.querySelector('.msg-list').scrollTop = isPrepend ? 0 : 99999;
    };
}

export function removeMsgs(txguid) {
    return (dispatch, getState) => {
        const { msgs } = getState().chat;

        dispatch(updateMsgs({
            ...msgs,
            [txguid]: [],
        }));
    };
}

export function updateMsg(fromId, msg) {
    return (dispatch, getState) => {
        const { msgs } = getState().chat;
        const currentMsgs = msgs[fromId];
        const index = currentMsgs.findIndex(tempMsg => tempMsg.msgId === msg.msgId);
        const oldMsg = currentMsgs[index];

        currentMsgs[index] = {
            ...oldMsg,
            ...msg,
        };
        dispatch(updateMsgs({
            ...msgs,
            [fromId]: currentMsgs,
        }));
    };
}

export function setHasHistoryTip(txguid, hasHistoryTip) {
    return {
        type: ChatActionTypes.SET_HAS_HISTORY_TIP,
        payload: {
            txguid,
            hasHistoryTip,
        },
    };
}

export function addHistoryTip(txguid) {
    return (dispatch) => {
        dispatch(addMsg(txguid, {
            type: MsgTypes.TIP_MSG,
            fromId: '',
            msgId: Date.now() + (Math.random() * 1000000),
            msgContent: '以上是历史消息',
            msgTime: Date.now(),
            state: MsgStates.RECEIVED,
        }, 'isPrepend'));
        dispatch(setHasHistoryTip(txguid, true));
    };
}
export function addTimeTip(txguid) {
    return (dispatch) => {
        dispatch(addMsg(txguid, {
            type: 'TIP_MSG',
            content: moment(Date.now()).format('yyyy-MM-dd hh:mm:ss'),
            msgTime: Date.now(),
        }));
    };
}

export function updateHistoryMsg(msgData) {
    return {
        type: ChatActionTypes.UPDATE_HISTORY_MSG,
        payload: {
            msgData,
        },
    };
}

export function addAddedHistoryMsg(txguid, msg) {
    return {
        type: ChatActionTypes.ADD_ADDED_HISTORY_MSG,
        payload: {
            txguid,
            msg,
        },
    };
}

export function addMsgsFromHistory(txguid, num = 15) {
    return (dispatch, getState) => {
        const { historyMsgs } = getState().chat;
        if (!historyMsgs[txguid].hasHistoryTip) {
            dispatch(addHistoryTip(txguid));
        }
        const { msgs } = historyMsgs[txguid];
        msgs.filter(msg => msg.type === MsgTypes.SESSION_MSG)
        .reverse().slice(-Math.min(num, msgs.length))
        .forEach((msg) => {
            dispatch(addMsg(txguid, msg, 'isPrepend'));
            dispatch(addAddedHistoryMsg(txguid, msg));
        });
    };
}

export function addHistoryMsgs(txguid, msgs, lastMsgTime, isCompleted, isGetting) {
    return (dispatch, getState) => {
        const chatState = getState().chat;
        const sessMsgs = (chatState.msgs[txguid] || [])
                        .filter(msg => msg.type === MsgTypes.SESSION_MSG);
        if (!sessMsgs.length && !chatState.sessMap[txguid].abstractText) {
            const lastHistoryMsg = msgs.slice(-1)[0] || {};
            dispatch(sessionListActs.updateSession(txguid, {
                abstractText: lastHistoryMsg.abstractText,
                lastFrom: lastHistoryMsg.fromId,
            }));
        }
        /*eslint-disable*/
        dispatch(doAddHisotyMsgs(txguid, msgs, lastMsgTime, isCompleted, isGetting));
        /*eslint-enable*/
    };
}

export function doAddHisotyMsgs(txguid, msgs, lastMsgTime, isCompleted, isGetting) {
    return {
        type: ChatActionTypes.ADD_HISTORY_MSGS,
        payload: {
            txguid,
            msgs,
            lastMsgTime,
            isCompleted,
            isGetting,
        },
    };
}

export function setIsShowHistoryMsgList(txguid, isShowHistoryMsgList) {
    return {
        type: ChatActionTypes.SET_IS_SHOW_HISTORY_MSG_LIST,
        payload: {
            txguid,
            isShowHistoryMsgList,
        },
    };
}

export function setIsGettingHistoryMsgs(txguid, isGetting) {
    return {
        type: ChatActionTypes.SET_IS_GETTING_HISTORY_MSGS,
        payload: {
            txguid,
            isGetting,
        },
    };
}

export function setIsHistoryMsgGettingByScroll(txguid, isScrollGetting) {
    return {
        type: ChatActionTypes.SET_IS_GETTING_HISTORY_MSG_BY_SCROLL,
        payload: {
            txguid,
            isScrollGetting,
        },
    };
}

export function setIsGetHistoryCompleted(txguid, isCompleted) {
    return {
        type: ChatActionTypes.SET_IS_GET_HISTORY_COMPLETED,
        payload: {
            txguid,
            isCompleted,
        },
    };
}

export function setHistoryListPage(txguid, listPage) {
    return {
        type: ChatActionTypes.SET_HISTORY_LIST_PAGE,
        payload: {
            txguid,
            listPage,
        },
    };
}

export function setHistoryScrollPage(txguid, scrollPage) {
    //Math.min(scrollPage, Math.ceil(63 / 15)),
    return {
        type: ChatActionTypes.SET_HISTORY_SCROLL_PAGE,
        payload: {
            txguid,
            scrollPage,
        },
    };
}

export function setHistoryMaxPage(txguid, maxPage) {
    return {
        type: ChatActionTypes.SET_HISTORY_MAX_PAGE,
        payload: {
            txguid,
            maxPage,
        },
    };
}

export function countHistoryMaxPage(txguid) {
    return (dispatch, getState) => {
        const chatState = getState().chat;
        const { msgs } = chatState;
        const historyMsgs = chatState.historyMsgs[txguid] || {};
        const { listPage = 1 } = historyMsgs;
        const allMsgs = (historyMsgs.msgs || []).concat(msgs[txguid] || []);

        const maxPage = Math.ceil(
            allMsgs.filter(msg => msg.type === MsgTypes.SESSION_MSG).length / 15
        );

        dispatch(setHistoryMaxPage(txguid, maxPage));
        dispatch(setHistoryListPage(txguid, Math.max(1, Math.min(maxPage, listPage))));
    };
}

// @todo history_fix
export function initSessionHistory(txguid) {
    return (dispatch) => {
        dispatch(setIsGettingHistoryMsgs(txguid, false));
        dispatch(setIsHistoryMsgGettingByScroll(txguid, false));
        dispatch(addHistoryMsgs(txguid, [], 0));
        dispatch(setIsGetHistoryCompleted(txguid, false));
    };
}


// @todo history_fix
export function setHistoryLastMsgKey(payload) {
    return {
        type: ChatActionTypes.SET_HISTORY_LAST_MSG_KEY,
        payload,
    };
}

// @todo history_fix
export function setIsHistoryRespComplete(payload) {
    return {
        type: ChatActionTypes.SET_HISTORY_RESP_COMPLETE,
        payload,
    };
}

// @todo history_fix
export function getHistoryMessages(payload) {
    return (dispatch, getState) => {
        const { txguid, showLimit = 15, prevLength = 0, isLast = false } = payload;
        const chatState = getState().chat;
        const sessionHistory = chatState.historyMsgs[txguid];
        const scrollPage = sessionHistory.scrollPage || 0;

        // 如果这个会话的 historyMsg 没有初始化成功，则初始化，然后再拉取。正常情况下不应该出现这种问题
        // 现在是 MsgList 内给了 currentHistoryMessages 默认值，先让那边不报错，但是可能确实没有初始化
        // 这会导致拉取时报错，所以写了这个
        if (
            !sessionHistory ||
            (sessionHistory &&
                (!('lastMsgTime' in sessionHistory) || !('msgs' in sessionHistory)
            ))
        ) {
            dispatch(initSessionHistory(txguid));
            dispatch(getHistoryMessages(payload));
            return false;
        }

        if (sessionHistory.isCompleted) {
            return false;
        }

        const { msgs } = chatState;

        const currentSessionMsgs = (msgs[txguid] || [])
                                    .filter(msg => msg.type === MsgTypes.SESSION_MSG);
        const lastSessionMsg = currentSessionMsgs[Math.max(currentSessionMsgs.length - 1, 0)] || {};
        const historyMessages = sessionHistory.msgs || [];

        let lastMsgTime = 0;
        if (lastSessionMsg) {
            lastMsgTime = Math.floor(lastSessionMsg.msgTime / 1000) || 0;
        }

        if (sessionHistory && sessionHistory.lastMsgTime !== 0) {
            lastMsgTime = sessionHistory.lastMsgTime;
        }

        const getMessageOpts = {
            Peer_Account: txguid,
            MaxCnt: historyMaxCount,
            LastMsgTime: lastMsgTime,
            MsgKey: sessionHistory.lastMsgKey || '',
        };

        // const { msgs = [] } = sessionHistory;
        const msgSliceLimit = showLimit - prevLength;

        webim.getC2CHistoryMsgs(getMessageOpts, (resp) => {
            dispatch(setIsGettingHistoryMsgs(txguid, false));
            const { txcsid, historyMsgs } = getState().chat;
            const newSessHis = historyMsgs[txguid];
            const convertedMsgs = [];

            heapSort(resp.MsgList);
            resp.MsgList.forEach((txMsg) => {
                const converted = convertTxMsg(txMsg);
                if (converted instanceof Array) {
                    converted.forEach((msgEle) => {
                        const existInSession = currentSessionMsgs
                                                .findIndex(m => m.msgId === msgEle.msgId);
                        const existInHistory = historyMessages
                                                .findIndex(m => m.msgId === msgEle.msgId);
                        if (existInSession === -1 && existInHistory === -1) {
                            convertedMsgs.push({
                                ...msgEle,
                                state: msgEle.fromId === txcsid ? MsgTypes.SENT : MsgTypes.RECEIVED,
                            });
                        }
                    });
                } else {
                    const existInSession = currentSessionMsgs
                                            .findIndex(m => m.msgId === converted.msgId);
                    const existInHistory = historyMessages
                                            .findIndex(m => m.msgId === converted.msgId);
                    if (existInSession === -1 && existInHistory === -1) {
                        convertedMsgs.push({
                            ...converted,
                            state: converted.fromId === txcsid ? MsgTypes.SENT : MsgTypes.RECEIVED,
                        });
                    }
                }
            });

            // 预显消息可能非常多
            let respLastTime = resp.LastMsgTime;
            if (respLastTime === lastMsgTime) {
                respLastTime -= 1;
            }
            const sessionMessages = convertedMsgs.filter(msg => msg.type === MsgTypes.SESSION_MSG);
            const sessionMessagesLength = sessionMessages.length;
            // const savedSessionMessages = sessionMessages.slice(-msgSliceLimit);
            // 以前会把所有消息都存下来，现在只存会话 2017-05-18
            // 由于下次拉取过来的会话消息会多于需要的，为了方便，直接丢弃这次拉取多余的消息
            // @todo history_fix 会有重复消息。加上 msgkey 应该是没有重复了 2017.05.23
            if (((scrollPage * 15) + 5) < historyMessages.length + sessionMessagesLength) {
                dispatch(setIsGetHistoryCompleted(txguid, false));
            } else {
                dispatch(setIsGetHistoryCompleted(txguid, !!resp.Complete));
            }

            // @todo history_fix 给消息记录内使用
            dispatch(setIsHistoryRespComplete({
                txguid,
                isRespCompleted: !!resp.Complete,
            }));
            // if (sessionMessagesLength && sessionMessagesLength > msgSliceLimit) {
            //     dispatch(setIsGetHistoryCompleted(txguid, false));
            // } else {
            //     dispatch(setIsGetHistoryCompleted(txguid, !!resp.Complete));
            // }
            dispatch(addHistoryMsgs(txguid, sessionMessages, respLastTime));
            dispatch(setHistoryLastMsgKey({
                txguid,
                msgKey: resp.MsgKey,
            }));
            // if (sessionMessagesLength && sessionMessagesLength > msgSliceLimit) {
            //     const lastTime = Math.floor(savedSessionMessages[0].msgTime / 1000);
            //     dispatch(setIsGetHistoryCompleted(txguid, false));
            //     dispatch(addHistoryMsgs(txguid, savedSessionMessages, lastTime));
            //     dispatch(setHistoryLastMsgKey({
            //         txguid,
            //         msgKey: resp.MsgKey,
            //     }));
            // } else {
            //     dispatch(setIsGetHistoryCompleted(txguid, !!resp.Complete));
            //     dispatch(addHistoryMsgs(txguid, savedSessionMessages, respLastTime));
            //     dispatch(setHistoryLastMsgKey({
            //         txguid,
            //         msgKey: resp.MsgKey,
            //     }));
            // }
            const finalPrevLength = (sessionMessagesLength || 0) + prevLength;

            // 如果会话消息不足, 要继续拉取
            if (isLast && resp.Complete !== 1) {
                dispatch(getHistoryMessages({
                    txguid,
                    showLimit,
                    prevLength: finalPrevLength,
                    isLast,
                }));
            } else if (sessionMessagesLength < msgSliceLimit && resp.Complete !== 1) {
                dispatch(getHistoryMessages({
                    txguid,
                    showLimit,
                    prevLength: finalPrevLength,
                }));
            }
            if (isLast && resp.Complete === 1) {
                // 这里 maxPage 记录的是最后一次请求发出去之前的，所以 +1
                dispatch(setHistoryListPage(txguid, newSessHis.maxPage + 1));
            }
            dispatch(countHistoryMaxPage(txguid));

            // if (!isFromScroll) {
            //     dispatch(checkNeedGetHistory(targetTxguid));
            // } else {
            //     dispatch(setIsHistoryMsgGettingByScroll(targetTxguid, false));
            // }
        }, () => {
            dispatch(setIsGettingHistoryMsgs(txguid, false));
        });
        return false;
    };
}

// @todo history_fix
export function beforeGetHistoryMessages(payload) {
    const { txguid, showLimit = 15 } = payload;
    return (dispatch, getState) => {
        const { historyMsgs } = getState().chat;

        if (!historyMsgs[txguid] || !historyMsgs[txguid].lastMsgTime) {
            dispatch(initSessionHistory(txguid));
        }

        // const { msgs } = getState().chat;
        // const sessionMsgs = (msgs[txguid] || [])
        //                       .filter(msg => msg.type === MsgTypes.SESSION_MSG);
        // const lastSessionMsg = sessionMsgs[Math.max(sessionMsgs.length - 1, 0)] || {};

        dispatch(setIsGettingHistoryMsgs(txguid, true));
        dispatch(getHistoryMessages({
            txguid,
            showLimit,
        }));
    };
}

export function checkHasHistory(txguid) {
    return (dispatch, getState) => {
        const { msgs } = getState().chat;
        // todo :: 第一条会话消息的时间
        const sessMsgs = (msgs[txguid] || []).filter(msg => msg.type === MsgTypes.SESSION_MSG);
        const lastSessMsg = sessMsgs[Math.max(sessMsgs.length - 1, 0)] || {};
        const lastTime = lastSessMsg.msgTime || 0;
        const opts = {
            Peer_Account: txguid,
            MaxCnt: 15,
            LastMsgTime: lastTime / 1000,
            MsgKey: '',
        };
        dispatch(setIsGettingHistoryMsgs(txguid, true));
        dispatch(setIsHistoryMsgGettingByScroll(txguid, true));
        webim.getC2CHistoryMsgs(opts, (re) => {
            const lastMsg = re.MsgList[re.MsgList.length - 1];
            const isCompleted = re.MsgCount <= 1;

            dispatch(setIsGettingHistoryMsgs(txguid, false));
            dispatch(setIsHistoryMsgGettingByScroll(txguid, false));
            dispatch(addHistoryMsgs(txguid, [], lastMsg ? lastMsg.time : 0));
            dispatch(setIsGetHistoryCompleted(txguid, isCompleted));
            /*eslint-disable*/
            dispatch(checkNeedGetHistory(txguid));
            /*eslint-enable*/
        }, () => {
            dispatch(setIsGettingHistoryMsgs(txguid, false));
            dispatch(setIsHistoryMsgGettingByScroll(txguid, false));
        });
    };
}

export function checkNeedGetHistory(txguid, isLast = false) {
    return (dispatch, getState) => {
        const chatState = getState().chat;
        const { historyMsgs } = chatState;
        const sessionMsgs = chatState.msgs[txguid] || [];
        const { isCompleted, msgs = [], listPage = 1, scrollPage = 0 } = historyMsgs[txguid];
        if (isCompleted) {
            return;
        }
        const allMsgs = msgs.concat(sessionMsgs)
                            .filter(msg => msg.type === MsgTypes.SESSION_MSG)
                            .reverse();

        const listLength = allMsgs.slice(15 * (listPage - 1), 15 * listPage).length;
        const expectScrollNum = Math.min(15 * scrollPage, Math.max(63 - sessionMsgs.length));
        if (isLast) {
            dispatch(getHistoryMessages({
                txguid,
                showLimit: 15,
                prevLength: 0,
                isLast: true,
            }));
        } else if (listLength < 15 || allMsgs.length < expectScrollNum) {
            // dispatch(getHistoryMsgs(txguid));
            // @todo history_fix
            dispatch(getHistoryMessages({
                txguid,
                showLimit: 15,
                prevLength: 0,
            }));
        }
    };
}

export function getHistoryMsgs(targetTxguid, isFromScroll, callback) {
    return (dispatch, getState) => {
        const historyMsg = getState().chat.historyMsgs[targetTxguid];
        if (historyMsg.isCompleted) {
            return;
        }
        let lastMsgTime = 0;
        if (historyMsg) {
            lastMsgTime = historyMsg.lastMsgTime;
        }
        const opts = {
            Peer_Account: targetTxguid,
            MaxCnt: 15,
            LastMsgTime: lastMsgTime,
            MsgKey: '',
        };

        dispatch(setIsGettingHistoryMsgs(targetTxguid, true));
        if (isFromScroll) {
            dispatch(setIsHistoryMsgGettingByScroll(targetTxguid, true));
        }
        webim.getC2CHistoryMsgs(opts, (re) => {
            dispatch(setIsGettingHistoryMsgs(targetTxguid, false));
            const { txcsid } = getState().chat;
            const convertedMsgs = [];
            heapSort(re.MsgList);
            re.MsgList.forEach((txMsg) => {
                const msg = convertTxMsg(txMsg);

                if (msg instanceof Array) {
                    msg.forEach((msgEle) => {
                        convertedMsgs.push({
                            ...msgEle,
                            state: msgEle.fromId === txcsid ? MsgTypes.SENT : MsgTypes.RECEIVED,
                        });
                    });
                } else {
                    convertedMsgs.push({
                        ...msg,
                        state: msg.fromId === txcsid ? MsgTypes.SENT : MsgTypes.RECEIVED,
                    });
                }
            });
            // 预显消息可能非常多
            let newLastTime = re.LastMsgTime;
            if (newLastTime === lastMsgTime) {
                newLastTime -= 1;
            }
            dispatch(addHistoryMsgs(targetTxguid, convertedMsgs, newLastTime));
            dispatch(setIsGetHistoryCompleted(targetTxguid, !!re.Complete));
            dispatch(countHistoryMaxPage(targetTxguid));

            if (!isFromScroll) {
                dispatch(checkNeedGetHistory(targetTxguid));
            } else {
                dispatch(setIsHistoryMsgGettingByScroll(targetTxguid, false));
                if (callback) callback();
            }
        }, () => {
            dispatch(setIsGettingHistoryMsgs(targetTxguid, false));
            if (isFromScroll) {
                dispatch(setIsHistoryMsgGettingByScroll(targetTxguid, false));
            }
        });
    };
}

export function setTxLoginInfo(loginInfo) {
    return {
        type: ChatActionTypes.SET_TX_LOGIN_INFO,
        payload: {
            loginInfo,
        },
    };
}

export function setAuth(iscs, ismanager) {
    return {
        type: ChatActionTypes.SET_AUTH,
        payload: {
            iscs,
            ismanager,
        },
    };
}

export function setCsInfo(data) {
    return {
        type: ChatActionTypes.SET_CS_INFO,
        payload: {
            info: data,
        },
    };
}

export function setHaveUnread(payload) {
    return {
        type: ChatActionTypes.SET_HAVE_UNREAD,
        payload,
    };
}

export function goChatting(numberGuid, txguid, type) {
    const guid = `${numberGuid}`;
    return (dispatch, getState) => {
        const { chat, routing } = getState();
        const { sessions } = chat;
        const { pathname } = routing.locationBeforeTransitions;
        const isChatting = pathname === chattingPath;
        if (!isChatting) {
            dispatch(replace('/kf/client/chat'));
        }
        if (sessions.findIndex(sess => sess.guid === guid) >= 0) {
            dispatch(sessionListActs.selectSession(guid, txguid));
            dispatch(sessionListActs.setAlreadyRead());
        }
        if (type === EcAlertTypes.NEW_MSG) {
            setTimeout(() => {
                document.querySelector('.msg-list').scrollTop = 99999;
            }, 16);
        }
    };
}

function newSessionByTrack(trackMsg) {
    console.log('new visitor:', trackMsg);
    return (dispatch, getState) => {
        const { fromId, seqId, msgTime, guestInfo } = trackMsg;
        const { sessions, csInfo, historyMsgs } = getState().chat;
        const { guid, name = '', pic = '', visitortype, terminal = 0 } = guestInfo;
        let face = pic;
        let terminalToPc = terminal;

        if (visitortype === 2) {
            terminalToPc = 3;
        }

        if (!face) {
            switch (visitortype) {
                case GuestTypes.WEB: {
                    if (terminal === ChatGuestTerminals.CELL_PHONE) {
                        face = mobileAvatar;
                    } else {
                        face = pcAvatar;
                    }
                    break;
                }
                case GuestTypes.WX:
                default:
                    face = wxAvatar;
                    break;
            }
        }

        dispatch(getCrmInfo(guid, visitortype));
        /*eslint-disable*/
        dispatch(setGuestInfo(fromId, {
            guid,
            visitortype,
            guidName: name,
            face,
            csname: csInfo.name,
            status: 1,
            talkid: seqId, // 需要每次新会话轨迹消息过来都更新seqid
            terminal,
        }));
        /*eslint-enable*/
        if (sessions.findIndex(sess => sess.txguid === fromId) !== -1) {
            return;
        }
        dispatch(sessionListActs.addSession({
            guid,
            txguid: fromId,
            lastmsgtime: msgTime,
        }));
        /*eslint-disable*/
        dispatch(getGuestDetail(guid, visitortype));
        /*eslint-enable*/
        dispatch(addMsg(fromId, trackMsg));

        dispatch(sessionListActs.updateSession(fromId, {
            abstractText: '进入对话',
            sessionTime: trackMsg.msgTime,
            lastmsgtime: trackMsg.msgTime,
            lastFrom: fromId,
        }));

        // @todo history_fix
        if (!historyMsgs[fromId]) {
            dispatch(initSessionHistory(fromId));
        }

        dispatch(ecAlert({
            type: EcAlertTypes.NEW_SESSION,
            msg: `${name}进入对话`,
            title: '新消息',
            msgnum: 0,
            guinfo: {
                guid,
                guname: name,
                avatar: face,
                terminal: terminalToPc,
            },
            fromId,
        }));
    };
}

function addWebCloseSessTip(txguid) {
    return (dispatch) => {
        dispatch(addMsg(txguid, {
            type: MsgTypes.TIP_MSG,
            fromId: '',
            msgId: Date.now() + (Math.random() * 1000000),
            msgContent: '对方已经关闭会话窗口，退出会话，请去备注该访客',
            msgTime: Date.now(),
            state: MsgStates.RECEIVED,
        }));
    };
}

function addWxTimeoutTip(txguid) {
    return (dispatch) => {
        dispatch(addMsg(txguid, {
            type: MsgTypes.TIP_MSG,
            fromId: '',
            msgId: Date.now() + (Math.random() * 1000000),
            msgContent: '已超过48小时，无法回复消息',
            msgTime: Date.now(),
            state: MsgStates.RECEIVED,
        }));
    };
}

function addWxCancelFollowTip(txguid) {
    return (dispatch) => {
        dispatch(addMsg(txguid, {
            type: MsgTypes.TIP_MSG,
            fromId: '',
            msgId: Date.now() + (Math.random() * 1000000),
            msgContent: '已经取消关注，无法回复消息',
            msgTime: Date.now(),
            state: MsgStates.RECEIVED,
        }));
    };
}

export function closeSession(txguid) {
    return (dispatch, getState) => {
        dispatch(sessionListActs.removeSession(txguid));
        /*eslint-disable*/
        dispatch(setGuestInfo(txguid, {
            csname: '',
            status: 2,
        }));
        /*eslint-enable*/
        const { guests } = getState().chat;
        const { wx48Timer, visitortype } = guests[txguid];
        if (visitortype === GuestTypes.WX) {
            clearInterval(wx48Timer);
        }
    };
}
function onSysMsg(txMsg) {
    const msgBody = convert.msgData(txMsg).MsgBody;
    console.log('sys msg:', msgBody);
    return (dispatch, getState) => {
        const { sessions, guests } = getState().chat;
        const txguid = `${txidPrefixes[msgBody.AccountType]}${msgBody.ID}`;

        if (sessions.findIndex(sess => sess.txguid === txguid) === -1) {
            return;
        }
        const { talkid } = guests[txguid];
        switch (msgBody.SubType) {
            case msgSubTypes.SYSTEM.VISITOR_STATUS_CHANGE: {
                if (+msgBody.Status !== GuestStatus.CHATTING) {
                    if (msgBody.AccountType === GuestTypes.WEB) {
                        if (msgBody.SeqID !== talkid) {
                            break;
                        }
                        dispatch(addWebCloseSessTip(txguid));
                    }
                    if (msgBody.AccountType === GuestTypes.WX) {
                        dispatch(addWxCancelFollowTip(txguid));
                    }
                    dispatch(closeSession(txguid));
                }
                break;
            }
            default:
                break;
        }
    };
}

function onTrackMsg(txMsg) {
    return (dispatch) => {
        const msgBody = convert.msgData(txMsg).MsgBody;
        // const accInfo = {
        //     accid: msgBody.ID,
        //     acctype: msgBody.AccountType,
        // };

        const convertedMsg = convert.track(txMsg);
        const { fromId } = convertedMsg;

        switch (msgBody.SubType) {
            case msgSubTypes.TRACK.NEW_SESSION: {
                dispatch(newSessionByTrack(convertedMsg));
                break;
            }
            case msgSubTypes.TRACK.CLOSE_SESSION:
            case msgSubTypes.TRACK.TIMEOUT: {
                console.log('visitor leave:', convertedMsg);
                break;
            }
            case msgSubTypes.TRACK.SWITCH_CS: {
                console.log('switch cs:', convertedMsg);
                const { FromName, Remark } = msgBody.SwitchData;
                dispatch(addMsg(fromId, {
                    ...convertedMsg,
                    msgContent: `${FromName}客服请求转接，备注内容：${Remark}`,
                }));
                // ...
                break;
            }
            default:
                break;
        }
    };
}
/*eslint-disable*/
function setSwitchLastMsgs(txguid, msgs) {
    return {
        type: ChatActionTypes.SET_SWITCH_MSGS,
        payload: {
            txguid,
            msgs,
        },
    };
}
/*eslint-enable*/
function onSwitchCsLastMsgs(txMsg) {
    return (dispatch) => {
        const txguid = txMsg.getSession().id();
        const msgBody = convert.msgData(txMsg).MsgBody;
        const msgsLength = msgBody.Msgs.length;
        const lastMsg = msgBody.Msgs[msgsLength - 1];
        msgBody.Msgs.forEach((msg) => {
            dispatch(addMsg(txguid, msg));
        });

        if (lastMsg) {
            dispatch(sessionListActs.addSession({
                guid: txguid.split('_')[1],
                txguid,
                lastmsgtime: lastMsg.msgTime,
            }));
            dispatch(sessionListActs.updateSession(txguid, {
                abstractText: lastMsg.abstractText,
                sessionTime: lastMsg.msgTime,
                // lastFrom: lastMsg.fromId,
            }));
        }
    };
}
function newMsgAlert(fromId, msg) {
    return (dispatch, getState) => {
        const { guests } = getState().chat;
        const guestInfo = guests[fromId] || {};
        const guname = guestInfo.guidName || fromId;
        let { terminal } = guestInfo;
        const { face, visitortype, guid } = guestInfo;

        if (!terminal) {
            if (visitortype === GuestTypes.WX) {
                terminal = 3;
            } else if (visitortype === GuestTypes.QQ) {
                terminal = 4;
            }
        }

        dispatch(ecAlert({
            type: EcAlertTypes.NEW_MSG,
            msg: msg.abstractText,
            title: '新消息',
            guinfo: {
                guid,
                guname,
                avatar: face, // 消息用户头像
                terminal,
            },
            fromId,
        }));
    };
}
function onSessMsgEle(msg, accInfo) {
    return (dispatch, getState) => {
        const { chat, routing } = getState();
        const { pathname } = routing.locationBeforeTransitions;
        const { txguid, txcsid, sessions, guests, isInBottoms } = chat;
        const { seqId } = msg;
        let { fromId } = msg;
        const abstractText = msg.abstractText;
        let unreadNums = 0;

        if (fromId === txcsid) { // 同步过来的消息
            Object.keys(guests).forEach((syncTxguid) => {
                if (guests[syncTxguid].talkid === seqId) {
                    fromId = syncTxguid;
                }
            });
        }
        let session = sessions.filter(sess => sess.txguid === fromId)[0];

        if (!session && +accInfo.acctype !== 0) {
            /*eslint-disable*/
            const guid = accInfo.accid;
            const visitortype = accInfo.acctype;
            dispatch(setGuestInfo(fromId, {
                guid,
                visitortype,
                talkid: seqId,
            }));
            dispatch(getGuestDetail(guid, visitortype));
            /*eslint-enable*/
            dispatch(sessionListActs.addSession({
                guid,
                txguid: fromId,
                lastmsgtime: msg.msgTime,
            }));
            const newSessions = getState().chat.sessions;
            session = newSessions.filter(sess => sess.txguid === fromId)[0];
        }

        // 显示新消息小红点
        dispatch(setHaveUnread(true));
        dispatch(addMsg(fromId, msg));
        dispatch(setPreviewMsg(fromId, ''));

        if (fromId === txguid) {
            if (pathname.indexOf('chat') > -1) {
                unreadNums = 0;
                dispatch(sessionListActs.setAlreadyRead());
            } else {
                unreadNums = session.unreadNums + 1;
            }
        } else if (session) {
            unreadNums = session.unreadNums + 1;
        }

        if (isInBottoms[fromId] !== undefined && !isInBottoms[fromId]) {
            /*eslint-disable*/
            dispatch(setIsShowNewMsgTip(fromId, true));
            /*eslint-enable*/
        }


        dispatch(sessionListActs.updateSession(fromId, {
            unreadNums,
            abstractText,
            sessionTime: msg.msgTime,
            lastmsgtime: msg.msgTime,
            lastFrom: txguid,
        }));

        // 让ec客户端弹窗通知
        if (fromId !== txcsid) {
            dispatch(newMsgAlert(fromId, msg));
        }
    };
}
function onSessionMsg(txMsg, accInfo) {
    return (dispatch) => {
        const msgEles = convert.sess(txMsg);
        msgEles.forEach((msg) => {
            dispatch(onSessMsgEle(msg, accInfo));
        });
    };
}
function onLocalCustomMsg(txMsg) {
    return (dispatch) => {
        const msgBody = convert.msgData(txMsg).MsgBody;
        const txguid = txMsg.getSession().id();
        switch (msgBody.SubType) {
            case msgSubTypes.PREIVEW_MSG:
                dispatch(setPreviewMsg(txguid, msgBody.Content));
                break;
            case msgSubTypes.LEAVE_MSG_SUCCESS:
                break;
            default:
                break;
        }
    };
}
export function onMsgNotify(msgs) {
    console.log('new msg:', msgs);
    return (dispatch, getState) => {
        const { isTxImLogined } = getState().chat;
        if (!isTxImLogined) {
            return false;
        }

        msgs.forEach((txMsg) => {
            const msgData = convert.msgData(txMsg);
            if (!msgData) {
                console.error(txMsg, 'error txMsg');
                return;
            }
            const accInfo = {
                accid: msgData.MsgBody.ID,
                acctype: msgData.MsgBody.AccountType,
            };
            switch (msgData.Type) {
                case CustomMsgTypes.SYSTEM:
                    dispatch(onSysMsg(txMsg));
                    break;
                case CustomMsgTypes.TRACK:
                    dispatch(onTrackMsg(txMsg));
                    break;
                case CustomMsgTypes.SESSION:
                    dispatch(onSessionMsg(txMsg, accInfo));
                    break;
                case CustomMsgTypes.LOCAL_CUSTOM:
                    dispatch(onLocalCustomMsg(txMsg));
                    break;
                case CustomMsgTypes.SWITCH_LAST_MSG:
                    dispatch(onSwitchCsLastMsgs(txMsg));
                    break;
                default:
                    break;
            }
        });
        return false;
    };
}

export function txImLogin() {
    return (dispatch, getState) => {
        const listeners = {
            onConnNotify(re) {
                switch (re.ErrorCode) {
                    case webim.CONNECTION_STATUS.ON:
                        webim.Log.warn(`建立连接成功: ${re.ErrorInfo}`);
                        break;
                    case webim.CONNECTION_STATUS.OFF:
                        webim.Log.warn(`连接已断开，无法收到新消息，请检查下你的网络是否正常: ${re.ErrorInfo}`);
                        break;
                    case webim.CONNECTION_STATUS.RECONNECT:
                        webim.Log.warn(`连接状态恢复正常: ${re.ErrorInfo}`);
                        break;
                    default:
                        break;
                }
            },
            jsonpCallback() {},
            onMsgNotify(msgs) {
                dispatch(onMsgNotify(msgs));
            },
            onKickedEventCall() {
                /*eslint-disable*/
                dispatch(txImLogout(OFFLINE_TYPE.TIM_KICKED));
                localStorage.setItem('offlineType', OFFLINE_TYPE.TIM_KICKED);
                dispatch(replace('/kf/client/blank'));
                /*eslint-enable*/
                // setTimeout(() => {
                //     dispatch(txImLogin());
                // }, 15000);
            },
        };
        const { loginInfo } = getState().chat;
        webim.login(loginInfo, listeners, {
            isLogOn: false,
        }, () => {
            webim.Log.warn('login success');
            dispatch(setLogined(true));
            dispatch(sessionListActs.getTxUnreadNums());

            dispatch(chatEcimActs.initECIM());
            window.ecim.socket.onopen = () => {
                dispatch(chatEcimActs.login());
            };

            // if (window.ecim.socket.readyState === 1) {
            //     dispatch(chatEcimActs.login());
            // }
            window.ECBridge.exec({
                command: 531,
                data: {
                    status: 1,
                },
            });

            // 仅用来判断客服侧偶尔出现的轮询不请求的问题
            cookie.save('isTIMLogout', '0', {
                path: '/',
            });
        }, (re) => {
            webim.Log.warn('login faild');
            webim.Log.warn(re);
        });
    };
}

export function txImLogout(offlineType = OFFLINE_TYPE.TIM_KICKED) {
    return (dispatch) => {
        dispatch(setLogined(false));
        dispatch(chatEcimActs.closeSocket());
        dispatch(updateOfflineType(offlineType));
        // dispatch(toggleOfflineModal(true));
        window.ECBridge.exec({
            command: 531,
            data: {
                status: 0,
            },
        });
        webim.logout(() => {
            // 仅用来判断客服侧偶尔出现的轮询不请求的问题
            cookie.save('isTIMLogout', '1', {
                path: '/',
            });
        });
    };
}

export function csLogout() {
    return (dispatch) => {
        dispatch(setLogined(false));
        dispatch(chatEcimActs.closeSocket());
        window.ECBridge.exec({
            command: 531,
            data: {
                status: 0,
            },
        });
        webim.logout(() => {
            // 仅用来判断客服侧偶尔出现的轮询不请求的问题
            cookie.save('isTIMLogout', '1', {
                path: '/',
            });
        });
    };
}

export function getTxLoginInfo() {
    return (dispatch, getState) => {
        const { corpid, csid } = getState().chat;
        const getSigUrl = `https://kf.workec.com/cs/talk/getsig?CorpID=${corpid}`;
        restHub.post(getSigUrl).then((re) => {
            const reData = re.jsonResult.data;
            const loginInfo = {
                identifier: csid,
                sdkAppID: reData.appid,
                // appIDAt3rd: reData.appid,
                accountType: reData.accountType,
                userSig: reData.sig,
            };
            dispatch(setTxLoginInfo(loginInfo));
            dispatch(txImLogin(re));
        });
    };
}

export function setGuestInfo(txguid, info) {
    return {
        type: ChatActionTypes.SET_GUEST_INFO,
        payload: {
            txguid,
            info,
        },
    };
}

// 获取web访客信息
// todo :: 微信访客信息
export function getGuestDetail(guid, acctype = 1) {
    return (dispatch, getState) => {
        const { corpid, csInfo } = getState().chat;

        restHub.post(`https://kf.workec.com/visitor/index/getinfo?CorpID=${corpid}`, {
            body: {
                guid,
                scheme: 0,
                type: acctype,
            },
        }).then((re) => {
            if (!re.errorMsg) {
                if (re.jsonResult) {
                    const guestInfo = re.jsonResult.data;
                    const { visitortype } = guestInfo;
                    const txguid = `${txidPrefixes[guestInfo.visitortype]}${guid}`;

                    dispatch(setGuestInfo(txguid, {
                        ...guestInfo,
                        csname: csInfo.name,
                        status: 1,
                        // visitortype,
                    }));
                    dispatch(sessionListActs.updateSession(txguid, {
                        guestInfo,
                    }));

                    if (visitortype === GuestTypes.WX) {
                        /*eslint-disable*/
                        dispatch(calcWxLeftTime(txguid));
                        /*eslint-enable*/
                    }
                }
            } else {
                displayError(re.errorMsg);
            }
        });
    };
}

function calcWxLeftTime(txguid) {
    const timeCounters = {};
    return (dispatch, getState) => {
        const { guests } = getState().chat;
        let timeCounter = timeCounters[txguid];

        if (!timeCounter) {
            const { remaintime } = guests[txguid];
            timeCounter = {
                remaintime,
            };
            timeCounters[txguid] = {
                remaintime,
            };
        }

        let { wx48Timer, remaintime } = timeCounter;

        if (wx48Timer) {
            clearInterval(wx48Timer);
            wx48Timer = undefined;
        }

        wx48Timer = setInterval(() => {
            remaintime -= 1;
            // console.log(txguid, remaintime);
            if (!remaintime) {
                dispatch(addWxTimeoutTip(txguid));
                dispatch(closeSession(txguid));
                dispatch(setGuestInfo(txguid, {
                    remaintime,
                }));
                return;
            }
            timeCounter.remaintime = remaintime;
        }, 1000);

        timeCounter.wx48Timer = wx48Timer;

        dispatch(setGuestInfo(txguid, {
            wx48Timer,
        }));
    };
}

// 获取在线访客列表
export function getSessionList() {
    return (dispatch, getState) => {
        const { corpid, csInfo } = getState().chat;
        // todo :: 判断权限 是否请求微信
        restHub.post(`https://kf.workec.com/visitor/index/intalk?CorpID=${corpid}`, {
            body: {
                type: 4,
            },
        }).then((re) => {
            const cachedSessions = JSON.parse(window.localStorage.getItem('cs-sessions')) || [];
            let { data } = re.jsonResult;
            const { isTxImLogined } = getState().chat;
            data = data.sort(() => (prev, next) => next.lastmsgtime - prev.lastmsgtime);
            data.forEach((guest) => {
                const { guid, wxid, visitortype, lastmsgtime } = guest;
                const fixGuid = `${guid || wxid}`; // guid转成字符串
                const txguid = `${txidPrefixes[visitortype]}${fixGuid}`;
                const localCache = cachedSessions.filter(sess => sess.guid === fixGuid)[0] || {};
                dispatch(setGuestInfo(txguid, {
                    ...guest,
                    csname: csInfo.name,
                    status: 1,
                    guid: fixGuid,
                }));
                dispatch(sessionListActs.addSession({
                    guid: fixGuid,
                    txguid,
                    lastmsgtime,
                }, localCache));
                if (visitortype === GuestTypes.WX) {
                    dispatch(calcWxLeftTime(txguid));
                }
            });
            if (isTxImLogined) {
                dispatch(sessionListActs.getTxUnreadNums());
            }
        });
    };
}

export function toggleSwitchCsShow(payload) {
    return {
        type: ChatActionTypes.TOGGLE_SWITCH_CS_SHOW,
        payload,
    };
}

export function updateSwitchCsError(payload) {
    return {
        type: ChatActionTypes.UPDATE_SWITCH_CS_ERROR,
        payload,
    };
}

export function setVisitorCurrPath(txguid, path) {
    return {
        type: ChatActionTypes.SET_VISITOR_CURR_PATH,
        payload: {
            txguid,
            path,
        },
    };
}

export function getVisitorCurrpPath(guid, txguid) {
    return (dispatch) => {
        restHub.get(`https://kf.workec.com/cs/vlog/getorbit/${guid}/0`).then(({ errorMsg, jsonResult }) => {
            if (!errorMsg) {
                const { data } = jsonResult;
                dispatch(setVisitorCurrPath(txguid, data.data || []));
            }
        });
    };
}

export function setIsShowVisitorPathDetail(isShowVisitorPathDetial) {
    return {
        type: ChatActionTypes.SET_IS_SHOW_VISITOR_PATH_DETAIL,
        payload: {
            isShowVisitorPathDetial,
        },
    };
}

export function setFastReply(replies) {
    return {
        type: ChatActionTypes.SET_FASET_REPLY,
        payload: {
            replies,
        },
    };
}

export function getFastReply() {
    return (dispatch, getState) => {
        const { corpid } = getState().chat;
        restHub.get(`https://kf.workec.com/cs/quickreply/allreplylist?CorpID=${corpid}`).then((re) => {
            const replies = re.jsonResult.data || {};
            dispatch(setFastReply(replies));
        });
    };
}

export function selectFastReplyStr(id, str) {
    return (dispatch, getState) => {
        const { txguid } = getState().chat;
        dispatch(inputActs.setInputValue(txguid, str));
        restHub.post(`https://kf.workec.com/cs/quickreply/updateclick/${id}`).then((re) => {
            const hotGroup = re.jsonResult.data;
            dispatch(setFastReply({
                hotGroup,
            }));
        });
    };
}

export function setHasH5Form(hasH5Form) {
    return {
        type: ChatActionTypes.SET_HAS_H5_FORM,
        payload: {
            hasH5Form,
        },
    };
}

export function init(data) {
    return (dispatch, getState) => {
        const { formfunction, iscs, ismanager, messages, messageDateType } = data;
        const dateType = messageDateType || 0;
        if (!iscs) {
            // displayError('非客服权限');
            return;
        }

        initWindowFns(dispatch, getState);

        dispatch(setCsInfo(data));
        dispatch(setAuth(iscs, ismanager));
        dispatch(setHasH5Form(formfunction));
        dispatch(getTxLoginInfo());
        dispatch(getSessionList());
        // dispatch(getFastReply());
        /*eslint-disable*/
        keepPvAlive();
        /*eslint-enable*/
        // ec提示未读留言
        if (messages) {
            dispatch(ecAlert({
                type: EcAlertTypes.LEAVE_MSG,
                msg: `您有${messages}条未读的留言消息`,
                title: '离线留言',
                msgnum: messages,
                guinfo: {
                    guid: 0,
                    guname: '',
                    avatar: '',
                    terminal: 0,
                },
                dateType,
            }));
        }

        // dispatch(chatEcimActs.initECIM());
        // window.ecim.socket.onopen = () => {
        //     if (getState().chat.isTxImLogined) {
        //         dispatch(chatEcimActs.login());
        //     }
        // };
        // window.onKickedEventCall = () => {
        //     // dispatch(ecLogout());
        //     dispatch(txImLogout(OFFLINE_TYPE.TIM_KICKED));
        //     // webim.logout(() => {
        //     //     dispatch(setLogined(false));
        //     //     dispatch(chatEcimActs.closeSocket());
        //     //     dispatch(updateOfflineType(OFFLINE_TYPE.TIM_KICKED));
        //     //     dispatch(toggleOfflineModal(true));
        //     //     window.ECBridge.exec({
        //     //         command: 531,
        //     //         data: {
        //     //             status: 0,
        //     //         },
        //     //     });
        //     //     console.log('已在别处登录');
        //     // });
        // };
    };
}

export function keepPvAlive() {
    setInterval(() => {
        restHub.get(ApiUrls.keepPvAlive);
    }, 850000);
}

export function updateFastReplyGroup(payload) {
    return {
        type: ChatActionTypes.UPDATE_FASET_REPLY_GROUP,
        payload,
    };
}

export function updateFastReply(payload) {
    return {
        type: ChatActionTypes.UPDATE_FASET_REPLY,
        payload,
    };
}

export function updateShortCutKey(payload) {
    return {
        type: ChatActionTypes.UPDATE_SHORT_CUT_KEY,
        payload,
    };
}

export function updateShortCutKeySuccess() {
    return (dispatch, getState) => {
        const { shortCutKey } = getState().chat;
        // const url =
        restHub.post(ApiUrls.shortCutKey, {
            body: {
                shortcut: shortCutKey,
            },
        }).then(() => {
            // const hotGroup = re.jsonResult.data;
        });
    };
}

export function setShortCutKeyWrapper(payload) {
    return {
        type: ChatActionTypes.SET_SHORT_CUT_KEY_WRAPPER,
        payload,
    };
}

export function setIsScrollToBottom(txguid, isInBottom) {
    return {
        type: ChatActionTypes.SET_IS_SCROLL_TO_BOTTOM,
        payload: {
            txguid,
            isInBottom,
        },
    };
}

export function setIsShowNewMsgTip(txguid, isShowNewMsgTip) {
    return {
        type: ChatActionTypes.SET_IS_SHOW_NEW_MSG_TIP,
        payload: {
            txguid,
            isShowNewMsgTip,
        },
    };
}
