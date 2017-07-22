/*eslint-disable */
var convertTxMsg = require('~cscommon/utils/convert').convertTxMsg;
var consts = require('../../modules/const'),
    SESSION_MSG_TYPES = consts.SESSION_MSG_TYPES,
    MSG_STATES = consts.MSG_STATES;

var getLanguagePackage = require('../../utils/locale');
var heapSort = require('../../utils/heapSort').heapSort;
var localeKey = getLanguagePackage(window.sessionData ? window.sessionData.language : 0);

var actTypes = {
    ADD_MSG: 'ADD_MSG',
    UPDATE_MSG: 'UPDATE_MSG',
    SET_HISTORY_MSGS: 'SET_HISTORY_MSGS',
    SET_HAS_HISTORY_TIP: 'SET_HAS_HISTORY_TIP',
    SET_IS_SHOW_GET_HISTORY_BTN: 'SET_IS_SHOW_GET_HISTORY_BTN',
    SET_IS_GETTING_HISTORY_MSGS: 'SET_IS_GETTING_HISTORY_MSGS',
    SET_IS_GET_HISTORY_COMPLETED: 'SET_IS_GET_HISTORY_COMPLETED',
    SET_SCROLL_PAGE: 'SET_SCROLL_PAGE',
    SET_HISTORY_SCROLL_PAGE: 'SET_HISTORY_SCROLL_PAGE',
    UPDATE_FIRST_TIME: 'UPDATE_FIRST_TIME',
    SET_HISTORY_LAST_MSG_KEY: 'SET_HISTORY_LAST_MSG_KEY',
    SET_IS_IN_BOTTOM: 'SET_IS_IN_BOTTOM',
    SET_IS_SHOW_NEW_MSG_TIP: 'SET_IS_SHOW_NEW_MSG_TIP'
};

var msgActs = {
    actTypes: actTypes,
    addMsg: function (fromId, msg, isPrepend) {
        return {
            type: actTypes.ADD_MSG,
            payload: {
                fromId: fromId,
                msg: msg,
                isPrepend: isPrepend
            }
        };
    },
    addTipMsg: function (txcsid, content, isPrepend) {
        return function (dispatch, getState) {
            dispatch(msgActs.addMsg(txcsid, {
                type: SESSION_MSG_TYPES.TIP_MSG,
                fromId: '',
                msgId: new Date().getTime() + Math.random() * 1000000,
                msgContent: content,
                msgTime: new Date().getTime(),
                state: SESSION_MSG_TYPES.SENT,
            }, isPrepend));
        };
    },
    addHistoryTip: function (txcsid) {
        return function (dispatch) {
            dispatch(msgActs.addTipMsg(txcsid, localeKey.allHisttoryMessage, 'isPrepend'));
            dispatch(msgActs.setHasHistoryTip(true));
        };
    },
    setHasHistoryTip: function (hasHistoryTip) {
        return {
            type: actTypes.SET_HAS_HISTORY_TIP,
            payload: {
                hasHistoryTip: hasHistoryTip
            }
        };
    },
    setHistoryListPage: function(txcsid, scrollPage) {
        return {
            type: actTypes.SET_SCROLL_PAGE,
            payload: {
                txcsid: txcsid,
                scrollPage: Math.min(scrollPage, Math.ceil(20 / 15)),
            }
        };
    },
    addGreetingMsg: function () {
        return function (dispatch, getState) {
            var appState = getState().app,
                content = appState.appData.talkset.onlinemsg || '您好，请问有什么可以帮到您',
                txcsid = appState.txcsid;

            if (content) {
                dispatch(msgActs.addMsg(txcsid, {
                    type: SESSION_MSG_TYPES.SESSION_MSG,
                    fromId: txcsid,
                    msgId: new Date().getTime() + Math.random() * 1000000,
                    msgContent: content,
                    text: content,
                    msgTime: new Date().getTime(),
                    state: SESSION_MSG_TYPES.SENT,
                }));
            }
        };
    },
    updateMsg: function (fromId, msg) {
        return {
            type: actTypes.UPDATE_MSG,
            payload: {
                fromId: fromId,
                msg: msg
            }
        };
    },
    removeMsg: function () {
        return function (dispatch, getState) {

        };
    },
    checkHasHistory: function () {
        return function (dispatch, getState) {
            var txcsid = getState().app.txcsid;
            var opts = {
                Peer_Account: txcsid,
                MaxCnt: 15,
                LastMsgTime: 0,
                MsgKey: '',
            };
            dispatch(msgActs.setIsGettingHistoryMsgs(true));
            webim.getC2CHistoryMsgs(opts, function (re) {
                var lastMsg = re.MsgList[re.MsgList.length - 1],
                    isCompleted = re.MsgCount <= 1;

                dispatch(msgActs.setIsGettingHistoryMsgs(false));
                // dispatch(msgActs.setHistoryMsgs(txcsid, [], lastMsg ? lastMsg.time : 0));
                dispatch(msgActs.setHistoryMsgs(txcsid, [], 0));
                dispatch(msgActs.setIsGetHistoryCompleted(txcsid, isCompleted));
                dispatch(msgActs.setIsShowGetHistoryMsgBtn(!isCompleted));
                dispatch(msgActs.getHistoryMsgs());
                // @todo 使用下面的方法可以拉取到消息，现在的问题是查看更多没有显示更多的消息，可能是 slice 的问题
                // dispatch(msgActs.checkNeedGetHistory(txcsid));
            }, function (re) {
                dispatch(msgActs.setIsGettingHistoryMsgs(false));
            });
        };
    },
    checkNeedGetHistory: function(txcsid) {
        return function (dispatch, getState) {
            // const chatState = getState().chat;
            // const { historyMsgs } = chatState;
            // const sessionMsgs = chatState.msgs[txguid] || [];
            var state = getState();
            var appState = state.app;
            var txcsid = appState.txcsid;
            var sessionMsgs = state.msg.msgs[txcsid] || [];
            var historyMsgs = state.msg.historyMsgs[txcsid];
            var hisMsgs = historyMsgs.msgs || [];
            var scrollPage = historyMsgs.scrollPage || 0;
            if (historyMsgs.isCompleted) {
                return;
            }
            var allMsgs = hisMsgs.concat(sessionMsgs)
                                .filter(function(msg) {
                                    return msg.type === SESSION_MSG_TYPES.SESSION_MSG
                                }).reverse();

            var listLength = allMsgs.slice(0, 15).length;
            var expectScrollNum = Math.min(15 * scrollPage, Math.max(20 - sessionMsgs.length));
            if (listLength < 15 || allMsgs.length < expectScrollNum) {
                dispatch(msgActs.getHistoryMsgs(txcsid));
            }
        };
    },
    getHistoryMsgs: function (isFromScroll) {
        return function (dispatch, getState) {
            isFromScroll = isFromScroll || false;
            var state = getState();
            var appState = state.app;
            var txcsid = appState.txcsid;
            var msgs = state.msg.msgs[txcsid];
            var historyMsg = state.msg.historyMsgs[txcsid];
            if (historyMsg.isCompleted) {
                return;
            }
            var hasHistoryTip = state.msg.hasHistoryTip;
            !hasHistoryTip && dispatch(msgActs.addHistoryTip(txcsid));

            var lastMsgTime = 0;
            var firstMsgId = '';
            if (historyMsg) {
                lastMsgTime = historyMsg.lastMsgTime;
            } else if (msgs && msgs.length) {
                lastMsgTime = Math.floor(msgs[0].msgTime / 1000);
                firstMsgId = msgs[0].msgId;
            }

            var opts = {
                Peer_Account: txcsid,
                MaxCnt: 15,
                LastMsgTime: lastMsgTime,
                MsgKey: historyMsg.lastMsgKey || '',
            };
            dispatch(msgActs.setIsGettingHistoryMsgs(true));

            var sessionMsgsList = [];   // 用来存放会话消息
            var isCovertCompleting = false;
            var convertedMsgs = [];
            var isFirstTime = state.msg.isFirstTime;
            var sessMsgsList = state.msg.sessMsgsList;

            var isFirstTimeUpdate = true;
            if (isFirstTime && sessMsgsList.length > 0) {
                isFirstTimeUpdate = false;
            }

            var today = new Date();
            today.setHours(0);
            today.setMinutes(0);
            today.setSeconds(0);
            today.setMilliseconds(0);
            var timestamp = today.getTime() / 1000;

            function getHistoryMsgsCycle(opts) {
                webim.getC2CHistoryMsgs(opts, function (re) {
                    var appState = getState().app;
                    var txcsid = appState.txcsid;

                    var tempIndex = 0;
                    var lastTempStamp = 0;

                    heapSort(re.MsgList);

                    re.MsgList.forEach(function (txMsg, index) {
                        // console.log(txMsg, 'txtMsg')
                        var msg = convertTxMsg(txMsg);
                        // console.log(msg, 'convertTxMssssssg')
                        // console.log(msg.msgTime,'msg', timestamp,'t')
                        if (msg instanceof Array) {
                            // console.log(msg, 'msgghgfhgfhgfhgfhgfhgfhfgyrtyrtyrtyrt')
                            msg.forEach(function (msgEle) {
                                msgEle.state = msgEle.fromId === txcsid ? MSG_STATES.RECEIVED : MSG_STATES.SENT;

                                if (msgEle.fromId && msgEle.msgTime / 1000 >= timestamp) {
                                    convertedMsgs.splice(index, 0, msgEle);
                                    sessionMsgsList.splice(tempIndex, 0, msgEle);
                                    tempIndex ++;
                                }

                                if (index === re.MsgList.length - 1) {
                                    lastTempStamp = msgEle.msgTime;
                                }
                            });
                        } else {
                            msg.state = msg.fromId === txcsid ? MSG_STATES.RECEIVED : MSG_STATES.SENT;
                            if (msg.fromId && msg.msgTime / 1000 >= timestamp) {
                                convertedMsgs.splice(index, 0, msg);
                            }
                            if (index === re.MsgList.length - 1) {
                                lastTempStamp = msg.msgTime / 1000;
                            }
                        }
                    });

                    // console.log(convertedMsgs, 'con')
                    // var currentLastMsg = convertTxMsg(re.MsgList[re.MsgList.length - 1]);
                    // 如果没有会话消息，继续拉取
                    if (sessionMsgsList.length <= 5 && !re.Complete && lastTempStamp >= timestamp) {
                        opts.LastMsgTime = re.LastMsgTime;
                        opts.MsgKey = re.MsgKey;
                        dispatch(msgActs.setHistoryLastMsgKey({
                            txcsid: txcsid,
                            msgKey: re.MsgKey
                        }));
                        getHistoryMsgsCycle(opts);
                    } else {
                        // console.log(sessionMsgsList, 'convertedMsgs')
                        dispatch(msgActs.setIsGettingHistoryMsgs(false));

                        // 如果是第一次
                        if (!isFirstTimeUpdate) {
                            dispatch(msgActs.updateFirstTime(false));
                        }

                        dispatch(msgActs.setHistoryMsgs(txcsid, convertedMsgs, re.LastMsgTime, sessionMsgsList));
                        dispatch(msgActs.setHistoryLastMsgKey({
                            txcsid: txcsid,
                            msgKey: re.MsgKey
                        }));
                        // console.log(!!re.Complete,'Complete')

                        if (lastTempStamp < timestamp) {
                            dispatch(msgActs.setIsGetHistoryCompleted(txcsid, true));
                        } else {
                            dispatch(msgActs.setIsGetHistoryCompleted(txcsid, !!re.Complete));
                        }

                        // 看不懂  在首次进来的时候会加载两次
                        // if (!isFromScroll) {
                        //     dispatch(msgActs.checkNeedGetHistory(txcsid));
                        // }

                        // firstMsgId && setTimeout(function () {
                        //     document.querySelector('.msg-list').scrollTop = document.getElementById('msg' + firstMsgId).offsetTop;
                        // }, 100);
                    }

                }, function (re) {});

            }

            getHistoryMsgsCycle(opts);

        };
    },
    setHistoryLastMsgKey: function(payload) {
        return {
            type: actTypes.SET_HISTORY_LAST_MSG_KEY,
            payload: payload
        };
    },
    setHistoryMsgs: function (txcsid, msgs, lastMsgTime, sessMsgsList) {
        // console.log(sessMsgsList, 'action')
        return {
            type: actTypes.SET_HISTORY_MSGS,
            payload: {
                txcsid: txcsid,
                msgs: msgs,
                lastMsgTime: lastMsgTime,
                sessMsgsList: sessMsgsList || [],
            }
        };
    },
    getUnreadNum: function () {
        return function (dispatch, getState) {

        };
    },
    setAlreadyRead: function () {
        return function (dispatch, getState) {
            var txcsid = getState().app;
            webim.setAutoRead(webim.MsgStore.sessMap()['C2C' + txcsid], true, true);
        };
    },
    setIsShowGetHistoryMsgBtn: function (isShowGetHistoryMsgBtn) {
        return {
            type: actTypes.SET_IS_SHOW_GET_HISTORY_BTN,
            payload: {
                isShowGetHistoryMsgBtn: isShowGetHistoryMsgBtn
            }
        };
    },
    setIsGettingHistoryMsgs: function (isGettingHistoryMsgs) {
        return {
            type: actTypes.SET_IS_GETTING_HISTORY_MSGS,
            payload: {
                isGettingHistoryMsgs: isGettingHistoryMsgs
            }
        };
    },
    setIsGetHistoryCompleted: function (txcsid, isCompleted) {
        return {
            type: actTypes.SET_IS_GET_HISTORY_COMPLETED,
            payload: {
                txcsid: txcsid,
                isCompleted: isCompleted
            }
        }
    },
    setHistoryScrollPage: function(txcsid, scrollPage) {
        return {
            type: actTypes.SET_HISTORY_SCROLL_PAGE,
            payload: {
                txguid: txguid,
                scrollPage: Math.min(scrollPage, Math.ceil(63 / 15))
            }
        };
    },
    updateFirstTime: function(type) {
        return {
            type: actTypes.UPDATE_FIRST_TIME,
            payload: type
        }
    },
    setIsScrollToBottom: function (txcsid, isInBottom) {
        return {
            type: actTypes.SET_IS_IN_BOTTOM,
            payload: {
                txcsid: txcsid,
                isInBottom: isInBottom
            }
        };
    },
    setIsShowNewMsgTip: function (txcsid, isShowNewMsgTip) {
        return {
            type: actTypes.SET_IS_SHOW_NEW_MSG_TIP,
            payload: {
                txcsid: txcsid,
                isShowNewMsgTip: isShowNewMsgTip
            }
        };
    }
};


module.exports = msgActs;
