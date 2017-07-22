import * as ChatActionTypes from '../constants/ChatActionTypes';

import * as chatActs from './chat';
import * as chatInputActs from './chatInput';
import { getCrmInfo, updateInfoActiveTab, resetCrmInfo } from './visitorDetails';
import { convertTxMsg } from '~cscommon/utils/convert';
import * as MsgTypes from '../constants/MsgTypes';

const webim = window.webim;

export function doSelectSession(guid, txguid) {
    return {
        type: ChatActionTypes.SELECT_SESSION,
        payload: {
            guid,
            txguid,
        },
    };
}

export function updateSessions(sessions) {
    window.localStorage.setItem('cs-sessions', JSON.stringify(sessions));
    return (dispatch, getState) => {
        // const oldState = getState();
        // const { pathname } = oldState.routing.locationBeforeTransitions;
        const hasUnread = !!sessions.reduce((unreadNums, sess) => unreadNums + sess.unreadNums, 0);
        dispatch(chatActs.setHaveUnread(hasUnread));
        dispatch({
            type: ChatActionTypes.UPDATE_SESSIONS,
            payload: {
                sessions,
            },
        });
    };
}

export function updateSessInMap(txguid, session) {
    return {
        type: ChatActionTypes.UPDATE_SESSION_IN_MAP,
        payload: {
            txguid,
            session,
        },
    };
}

export function updateSession(txguid, payload) {
    return (dispatch, getState) => {
        const { sessions } = getState().chat;
        const index = sessions.findIndex(sess => sess.txguid === txguid);
        if (index === -1) {
            return;
        }
        const session = sessions[index];
        const newSession = {
            ...session,
            ...payload,
        };
        sessions[index] = newSession;
        dispatch(updateSessInMap(txguid, newSession));
        dispatch(updateSessions([
            ...sessions,
        ]));
    };
}

export function updateSessionToTop(txguid, payload) {
    return (dispatch, getState) => {
        const { sessions } = getState().chat;
        const index = sessions.findIndex(sess => sess.txguid === txguid);
        const session = sessions[index];
        const newSession = {
            ...session,
            ...payload,
        };
        sessions.splice(index, 1);
        dispatch(updateSessions([
            newSession,
            ...sessions,
        ]));
    };
}

export function excludeWechatSessions() {
    return (dispatch, getState) => {
        const { sessions } = getState().chat;
        const sessionsExcludeWechat = sessions.filter(session => session.guestInfo && session.guestInfo.visitortype !== 2);
        dispatch(updateSessions(sessionsExcludeWechat));
    };
}

// 初始化列表
// 轨迹消息
// 突然来到的新消息（客服初始化太慢 错过了轨迹消息）
export function addSession(sessionInfo, localSessCache = {}) {
    return (dispatch, getState) => {
        const { sessions, sessMap } = getState().chat;
        const { guid, txguid, lastmsgtime } = sessionInfo;
        const isExisted = sessions.findIndex(item => item.txguid === txguid) > -1;
        if (isExisted) {
            return;
        }
        const sessCache = sessMap[txguid] || {};
        const session = {
            guid,
            txguid,
            lastmsgtime: lastmsgtime || Date.now(),
            unreadNums: 0,
            sessionTime: Date.now(),
            lastFrom: txguid,
        };
        const newSession = {
            ...session,
            ...localSessCache,
            ...sessCache,
        };
        dispatch(updateSessInMap(txguid, newSession));
        dispatch(updateSessions([
            newSession,
            ...sessions,
        ]));
    };
}

export function removeSession(txguid) {
    return (dispatch, getState) => {
        const { sessions } = getState().chat;
        const newSession = sessions.filter(session => session.txguid !== txguid);
        dispatch(updateSessions(newSession));
        dispatch(chatActs.setPreviewMsg(txguid, ''));
        dispatch(chatInputActs.setIsShowFastReply(false));
        dispatch(chatInputActs.setIsShowEmotions(false));
    };
}

export function setCurrentSession(session) {
    return {
        type: ChatActionTypes.SET_CURRENT_SESSION,
        payload: {
            session,
        },
    };
}

export function setAlreadyRead() {
    return (dispatch, getState) => {
        const { txguid } = getState().chat;
        webim.setAutoRead(webim.MsgStore.sessMap()[`C2C${txguid}`], true, true);
        dispatch(updateSession(txguid, {
            unreadNums: 0,
        }));
    };
}

export function selectSession(guid, txguid) {
    return (dispatch, getState) => {
        console.log('select session');
        const chatState = getState().chat;
        if (guid === chatState.guid) {
            return;
        }

        const guestInfo = chatState.guests[txguid];
        // 获取客户资料
        dispatch(resetCrmInfo());
        dispatch(doSelectSession(guid, txguid));
        dispatch(chatActs.getGuestDetail(guid, guestInfo.visitortype));
        dispatch(getCrmInfo(guid, guestInfo.visitortype));
        dispatch(updateInfoActiveTab('0'));

        const { sessions, historyMsgs, visitorPaths } = chatState;
        const currentSession = sessions.filter(session => session.guid === guid)[0];

        dispatch(setCurrentSession(currentSession));
        dispatch(setAlreadyRead());
        dispatch(chatInputActs.setIsShowFastReply(false));
        if (!visitorPaths[txguid]) {
            dispatch(chatActs.getVisitorCurrpPath(guid, txguid));
        }
        // 查看是否有历史消息
        // if (!historyMsgs[txguid] || !historyMsgs[txguid].lastMsgTime) {
        //     dispatch(chatActs.checkHasHistory(txguid));
        // }

        // @todo history_fix
        if (!historyMsgs[txguid] || !historyMsgs[txguid].lastMsgTime) {
            // dispatch(chatActs.checkHasHistory(txguid));
            dispatch(chatActs.beforeGetHistoryMessages({
                txguid,
                showLimit: 15,
            }));
        }
        setTimeout(() => {
            document.querySelector('.session-input textarea').focus();
        }, 100);
    };
}

function notifyUnreadToPc(nums) {
    window.ECBridge.exec({
        command: 535,
        data: {
            unread: `${nums}`,
            type: '0',
        },
        callback: () => {},
    });
}

// 腾讯历史未读消息
export function getTxUnreadNums() {
    return (dispatch, getState) => {
        const { sessions } = getState().chat;
        webim.syncMsgs((re) => {
            const unreadMsgs = {};
            re.forEach(txMsg => {
                const msg = convertTxMsg(txMsg);
                if (msg instanceof Array) {
                    msg.forEach((msgEle) => {
                        if (msgEle.type !== MsgTypes.SESSION_MSG) {
                            return;
                        }
                        const txguid = msgEle.fromId;
                        if (!unreadMsgs[txguid]) unreadMsgs[txguid] = [];
                        unreadMsgs[txguid].push(msgEle);
                    });
                }
            });
            let totalUnreadNums = 0;
            for (const txguid in unreadMsgs) {
                const lastMsg = unreadMsgs[txguid][unreadMsgs[txguid].length - 1];
                const index = sessions.findIndex(sess => sess.txguid === txguid);
                if (index !== -1) {
                    totalUnreadNums += unreadMsgs[txguid].length || 0;
                }
                dispatch(updateSession(txguid, {
                    unreadNums: unreadMsgs[txguid].length,
                    abstractText: lastMsg.abstractText,
                    sessionTime: lastMsg.msgTime,
                    lastmsgtime: lastMsg.msgTime,
                }));
            }
            if (totalUnreadNums > 0) {
                notifyUnreadToPc(totalUnreadNums);
            }
        });
    };
}
