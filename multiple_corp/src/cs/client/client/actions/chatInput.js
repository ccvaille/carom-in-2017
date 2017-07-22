import { displayError } from '~comm/utils';

import convert, { convertTxMsg } from '~cscommon/utils/convert';
import makeCustomMsg from '~cscommon/utils/makeCustomMsg';
import SessionMsgTypes from '~cscommon/consts/sessionMsgTypes';
import GuestTypes from '~cscommon/consts/guestTypes';
import brokenImg from '~cscommon/images/broken-img.png';
import loadingImg from '~cscommon/images/loading.gif';
import * as MsgStates from '~cscommon/consts/msgStates';

import * as ChatActionTypes from '../constants/ChatActionTypes';

import * as chatActs from './chat';
import * as sessionListActs from './chatSessionList';

const webim = window.webim;
export function setInputValue(txguid, draft) {
    return {
        type: ChatActionTypes.SET_DRAFT,
        payload: {
            txguid,
            draft,
        },
    };
}

export function setTipText(text) {
    return {
        type: ChatActionTypes.SET_TIP_TEXT,
        payload: {
            tipText: text,
        },
    };
}

let tipTimer;
export function showSessTip(tip, time = 3000) {
    return (dispatch) => {
        dispatch(setTipText(tip));
        if (time && tip) {
            if (tipTimer) {
                clearTimeout(tipTimer);
                tipTimer = null;
            }
            tipTimer = setTimeout(() => {
                dispatch(setTipText(''));
                clearTimeout(tipTimer);
                tipTimer = null;
            }, time);
        }
    };
}

export function setIsShowEmotions(isShowEmotion) {
    return {
        type: ChatActionTypes.SET_IS_SHOW_EMOTION,
        payload: {
            isShowEmotion,
        },
    };
}

export function saveTextPos(txguid, pos) {
    return {
        type: ChatActionTypes.SAVE_TEXT_POS,
        payload: {
            txguid,
            pos,
        },
    };
}

export function sendTxMsg(txMsg) {
    return (dispatch) => {
        const sessionId = txMsg.getSession().id();
        const msgEls = convert.sess(txMsg);
        webim.sendMsg(txMsg, () => {
            const newestMsg = convertTxMsg(txMsg);
            newestMsg.state = MsgStates.SENT;
            dispatch(chatActs.updateMsg(sessionId, newestMsg));
            msgEls.forEach((msg) => { // 解析后是数组
                dispatch(chatActs.updateMsg(sessionId, {
                    ...msg,
                    state: MsgStates.SENT,
                }));
            });
        }, () => {
            msgEls.forEach((msg) => { // 解析后是数组
                dispatch(chatActs.updateMsg(sessionId, {
                    ...msg,
                    state: MsgStates.FAILED,
                    txMsg,
                }));
            });
        });
    };
}

export function sendTextMsg(text) {
    return (dispatch, getState) => {
        const { chat } = getState();
        const { csid, txcsid, txguid, corpid, guests } = chat;
        const seqid = guests[txguid].talkid;
        // const { guidName } = guests[txguid];
        const txMsg = makeCustomMsg.txMsg(txcsid, txguid);
        const textData = makeCustomMsg.sess.text({
            text,
            accid: csid,
            acctype: GuestTypes.CS,
            seqid,
            corpid,
        });
        const data = window.Base64.encode(JSON.stringify(textData));
        const desc = text;
        // const offlineDesc = `${guidName}：${text}`;
        const custom = new webim.Msg.Elem.Custom(data, desc, data);
        txMsg.addCustom(custom);
        txMsg.setOfflinePushInfo(makeCustomMsg.offlinePushInfo(data, desc));

        const msgs = convert.sess(txMsg);
        msgs.forEach((msg) => {
            dispatch(chatActs.addMsg(txguid, {
                ...msg,
                state: MsgStates.SENDING,
            }));
            dispatch(sessionListActs.updateSession(txguid, {
                abstractText: text,
                sessionTime: msg.msgTime,
                lastmsgtime: msg.msgTime,
                lastFrom: csid,
            }));
        });
        dispatch(setInputValue(txguid, ''));

        dispatch(sendTxMsg(txMsg));
    };
}


export function sendPicMsg(txMsg, msgImgs) {
    return (dispatch, getState) => {
        const { csid, txguid, corpid, guests } = getState().chat;
        const seqid = guests[txguid].talkid;
        // const { guidName } = guests[txguid];
        const srcs = {};
        const imgTypes = ['SmallImage', 'BigImage', 'OriImage'];
        /*eslint-disable*/
        for (const i in msgImgs.URL_INFO) {
            const img = msgImgs.URL_INFO[i];
            srcs[imgTypes[i]] = img.DownUrl;
        }
        /*eslint-enable*/
        const picData = makeCustomMsg.sess.image({
            srcs,
            accid: csid,
            acctype: GuestTypes.CS,
            seqid,
            corpid,
        });
        const data = window.Base64.encode(JSON.stringify(picData));
        const desc = '[图片]';
        // const offlineDesc = `${guidName}： [图片]`;
        const custom = new webim.Msg.Elem.Custom(data, desc, data);
        txMsg.addCustom(custom);
        txMsg.setOfflinePushInfo(makeCustomMsg.offlinePushInfo(data, desc));

        dispatch(sendTxMsg(txMsg));
    };
}

export function uploadPic(file, reuploadOpts = {}) {
    return (dispatch, getState) => {
        const { csid, txcsid, txguid } = getState().chat;

        const txMsg = reuploadOpts.txMsg || makeCustomMsg.txMsg(txcsid, txguid);

        const msg = reuploadOpts.msg || convert.sess(txMsg)[0];
        msg.state = MsgStates.NONE; // todo :: UPLOADING
        if (!reuploadOpts.msg) {
            dispatch(chatActs.addMsg(txguid, msg));
            dispatch(sessionListActs.updateSession(txguid, {
                abstractText: '[图片]',
                sessionTime: msg.msgTime,
                lastmsgtime: msg.msgTime,
                lastFrom: csid,
            }));
        }
        // upload pic
        const opts = {
            file,
            From_Account: txcsid,
            To_Account: txguid,
            businessType: webim.UPLOAD_PIC_BUSSINESS_TYPE.C2C_MSG,
            onProgressCallBack: () => {
                // console.log(re);
            },
        };

        webim.uploadPic(opts, (re) => {
            dispatch(sendPicMsg(txMsg, re));
            document.getElementById('picform').reset();
        }, () => {
            dispatch(chatActs.updateMsg(txguid, {
                msgId: msg.msgId,
                srcs: {
                    SmallImage: brokenImg,
                    BigImage: brokenImg,
                    OriImage: brokenImg,
                },
                state: MsgStates.UPLOAD_FAILED,
                txMsg,
                file,
            }));
        });
    };
}

export function sendSwitchMsg(switchInfo) {
    return (dispatch, getState) => {
        const { chat } = getState();
        const { csid, txcsid, guid, txguid, csInfo, corpid, guests } = chat;
        const seqid = guests[txguid].talkid;
        const txMsg = makeCustomMsg.txMsg(txcsid, txguid);
        const switchData = {
            FromAccount: `${csid}`,
            FromName: csInfo.name,
            ToAccount: `${switchInfo.ToAccount}`,
            ToName: switchInfo.ShowName,
            Remark: switchInfo.Remark,
        };
        const switchCsData = makeCustomMsg.track.switchCs({
            switchData,
            accid: csid,
            acctype: GuestTypes.CS,
            seqid,
            corpid,
        });
        const data = window.Base64.encode(JSON.stringify(switchCsData));
        const desc = `转接客服${switchInfo.ToName} 备注内容：${switchInfo.Remark}`;
        const custom = new webim.Msg.Elem.Custom(data, desc, data);
        txMsg.addCustom(custom);
        txMsg.setOfflinePushInfo(makeCustomMsg.offlinePushInfo(data, desc));

        webim.sendMsg(txMsg, () => {
            const msg = convert.track(txMsg);
            dispatch(chatActs.setGuestInfo(guid, {
                csname: switchInfo.ToName,
                status: 1,
            }));
            dispatch(chatActs.addMsg(txguid, {
                ...msg,
                msgContent: `转接给客服${switchInfo.ToName}`,
            }));
        }, () => {
            displayError('转接失败，请重试');
        });
    };
}

export function sendLastMsg(switchInfo) {
    return (dispatch, getState) => {
        const { msgs, txguid, csid, txcsid, csInfo, corpid, guests } = getState().chat;
        const seqid = guests[txguid].talkid;
        const txMsg = makeCustomMsg.txMsg(txcsid, txguid);
        const lastMsgs = (msgs[txguid] || [])
                        .filter(
                            msg => msg.type === SessionMsgTypes.SESSION_MSG &&
                                   (!msg.isFromSwitch || msg.isFromSwitch !== 1)
                        ).map((msg) => {
                            if (msg.fromId === txcsid) {
                                return {
                                    ...msg,
                                    fromName: csInfo.name,
                                    fromPic: csInfo.face,
                                    isFromSwitch: 1,
                                };
                            }
                            return {
                                ...msg,
                                isFromSwitch: 1,
                            };
                        }).slice(-10);
        lastMsgs.forEach((msg) => {
            dispatch(chatActs.updateMsg(txguid, {
                msgId: msg.msgId,
                isFromSwitch: 1,
            }));
        });
        const switchMsgsData = makeCustomMsg.localCustom.switchCsMsgs({
            accid: csid,
            fromId: `${csid}`,
            toId: `${switchInfo.ToAccount}`,
            msgs: lastMsgs,
            seqid,
            corpid,
        });
        const data = window.Base64.encode(JSON.stringify(switchMsgsData));
        const custom = new webim.Msg.Elem.Custom(data, '转发最近聊天消息', '');
        txMsg.addCustom(custom);
        webim.sendMsg(txMsg, () => {}, (re) => {
            console.log(re);
            displayError('转发最近的聊天消息失败');
        });
    };
}

export function resendMsg(msg) {
    return (dispatch, getState) => {
        const { txguid, isTxImLogined } = getState().chat;
        const { txMsg } = msg;

        if (!isTxImLogined || !txMsg) {
            return;
        }
        switch (msg.state) {
            case MsgStates.FAILED:
                dispatch(chatActs.updateMsg(txguid, {
                    msgId: msg.msgId,
                    state: MsgStates.SENDING,
                }));
                dispatch(sendTxMsg(txMsg));
                break;
            case MsgStates.UPLOAD_FAILED: {
                const file = msg.file;
                if (!file) {
                    displayError('重发失败，请重新选择图片');
                    return;
                }
                dispatch(chatActs.updateMsg(txguid, {
                    msgId: msg.msgId,
                    state: MsgStates.NONE,
                    srcs: {
                        SmallImage: loadingImg,
                        BigImage: loadingImg,
                        OriImage: loadingImg,
                    }
                }));
                dispatch(uploadPic(file, {
                    txMsg,
                    msg,
                }));
                break;
            }
            default:
                break;
        }
    };
}

export function setIsShowFastReply(isShowFastReply) {
    return {
        type: ChatActionTypes.SET_IS_SHOW_FAST_REPLY,
        payload: {
            isShowFastReply,
        },
    };
}
