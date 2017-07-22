/*eslint-disable */
var consts = require('../../modules/const'),
    HEARTBEAT_TYPES = consts.HEARTBEAT_TYPES,
    MSG_STATES = consts.MSG_STATES,
    SESSION_MSG_TYPES = consts.SESSION_MSG_TYPES,
    ECIM_STATUS = consts.ECIM_STATUS,
    ECIM_EVENTS = consts.ECIM_EVENTS,
    CMDS = consts.CMDS,
    FECMDS = consts.FECMDS,
    CUSTOM_SYS_CMDS = consts.CUSTOM_SYS_CMDS,
    SAFE_ORIGIN = consts.SAFE_ORIGIN,
    POST_MSG_TYPES = consts.POST_MSG_TYPES,
    SESSION_STATUS = consts.SESSION_STATUS,
    WINDOW_MODES = consts.WINDOW_MODES;

var msgTypes = require('~cscommon/consts/msgTypes'),
    msgSubTypes = require('~cscommon/consts/msgSubTypes');

var ECIM = require('../../core/ec_im');

var msgActs = require('./msg');
var msgBoardActs = require('./msgBoard');
var customMsgActs = require('./customMsg');

var ajax = require('../../utils/ajax');
var getQueryParams = require('../../utils/search');
var convert = require('~cscommon/utils/convert');
var getLanguagePackage = require('../../utils/locale');
var addEvent = require('../../utils/dom').addEvent;

var appConstants = require('../constants/app');

var actTypes = {
    INIT_APP: 'INIT_APP',
    SET_TX_LOGIN_INFO: 'SET_TX_LOGIN_INFO',
    SESSION_INITED: 'SESSION_INITED',
    INIT_SESSION: 'INIT_SESSION',
    KICKED: 'KICKED',
    SWITCH_CS: 'SWITCH_CS',
    SET_CS_REPLIED: 'SET_CS_REPLIED',
    SET_TALKID: 'SET_TALKID',
    SET_REPLYING: 'SET_REPLYING',
    SHOW_LEAVE_MSG_TIP: 'SHOW_LEAVE_MSG_TIP',
    SET_UNREAD_NUM: 'SET_UNREAD_NUM',
    UPDATE_UNREAD_NUMS: 'UPDATE_UNREAD_NUMS',
    SET_SESSION_STATUS: 'SET_SESSION_STATUS',
    SET_CS_OFFLINE_TIP: 'SET_CS_OFFLINE_TIP',
    SET_DISABLE_RESEND: 'SET_DISABLE_RESEND',
    UPDATE_NETWORK_STATUS: 'UPDATE_NETWORK_STATUS',
    SHOW_KEEP_LOADING: 'SHOW_KEEP_LOADING',
    SET_FIRST_IN_SESSION: 'SET_FIRST_IN_SESSION'
};

var csInfoActs = require('./csInfo');
var inputActs = require('./input');

var topWindow = window.opener ? window.opener.top : window.top;

var endUpTimer;

var appActs = {
    actTypes: actTypes,
    init: function () {
        return function (dispatch, getState) {
            var data = window.sessionData;
            var windowMode = getState().app.windowMode;

            dispatch(appActs.doInit(data));
            dispatch(csInfoActs.setCsInfo(data.csinfo));
            dispatch(appActs.initECIM());
            dispatch(appActs.initWindowEvent());
            dispatch(appActs.updateUnreadNums(data.csid, 0));
            if (!data.csinfo.status) {
                dispatch(msgBoardActs.leaveingMsgBoard(true));
                dispatch(appActs.endUpSession());
                return;
            }
            window.ecim.updateStatus(ECIM_STATUS.CHATTING, data.csid);
        }
    },
    doInit: function (data) {
        return {
            type: actTypes.INIT_APP,
            payload: {
                data: data
            }
        };
    },
    initWindowEvent: function () {
        return function (dispatch, getState) {

            addEvent(window, 'message', function (e) {
                // if (!SAFE_ORIGIN[e.origin]) {
                //     return;
                // }
                var data = e.data;
                if (data && typeof data === 'string') {
                    try {
                        data = JSON.parse(data);
                    } catch (err) {}
                }
                switch (data.event) {
                    // 小窗口模式会收到
                    case POST_MSG_TYPES.SET_SESSION_STATUS: { // 最小化、关闭
                        dispatch(appActs.setSessionStatus(data.data.status));
                        // 最大化时更新未读数为0
                        if (data.data.status === SESSION_STATUS.MAXIMIZED) {
                            var csid = getState().app.csid;
                            dispatch(appActs.updateUnreadNums(csid, 0));
                        }
                        break;
                    }
                    default:
                        break;
                }
            });
            addEvent(window, 'beforeunload', function () {
                var appState = getState().app,
                    isKicked = appState.isKicked,
                    isLoading = appState.isLoading,
                    windowMode = appState.windowMode;

                    // topWindow.alert('kkkkkk')
                    // console.log(appState,'appState')

                if (window.sessionImgClicked || window.isGoToQQ) {
                    window.sessionImgClicked = false;
                    window.isGoToQQ = false;
                    return false;
                }

                if (!isLoading) {
                    if (!isKicked) {
                        dispatch(appActs.endUpSession());
                    }
                    dispatch(customMsgActs.closeSession());
                }
                // todo :: if small
                if (windowMode === WINDOW_MODES.SMALL) {
                    topWindow.postMessage(JSON.stringify({
                        event: POST_MSG_TYPES.SESSION_INITED,
                        data: {
                            inited: false
                        }
                    }), '*');
                }
            });

            // 腾讯IM需要注册的全局方法
            window.onKickedEventCall = function (re) {
                dispatch(appActs.kicked());
                window.ecim.emit(ECIM_EVENTS.KICKED);
            };
        }
    },
    getTxLoginInfo: function () {
        return function (dispatch, getState) {
            var appState = getState().app;
            ajax.getJSON('//kf.ecqun.com/index/talk/getsig', {
                corpid: appState.corpid,
                guid: appState.guid,
                cskey: window.ec_cskey
            }, function (re) {
                var loginInfo = {
                    identifier: appState.txguid,
                    sdkAppID: re.data.appid,
                    accountType: re.data.accountType,
                    userSig: re.data.sig
                };
                dispatch(appActs.setTxLoginInfo(loginInfo));
                dispatch(appActs.txImLogin());
            });
        };
    },
    setTxLoginInfo: function (loginInfo) {
        return {
            type: actTypes.SET_TX_LOGIN_INFO,
            payload: {
                data: loginInfo
            }
        };
    },
    setSessionStatus: function (sessionStatus) {
        return {
            type: actTypes.SET_SESSION_STATUS,
            payload: {
                sessionStatus: sessionStatus
            }
        };
    },
    updateUnreadNums: function (csid, num) {
        return function (dispatch, getState) {
            var windowMode = getState().app.windowMode;
            if (windowMode === WINDOW_MODES.SMALL) {
                topWindow.postMessage(JSON.stringify({
                    event: POST_MSG_TYPES.UPDATE_UNREAD_NUMS,
                    data: {
                        csid: csid,
                        num: num
                    }
                }), '*');
            }
            dispatch({
                type: actTypes.SET_UNREAD_NUM,
                payload: {
                    csid: csid,
                    num: num
                }
            });
        };
    },
    onSysMsg: function (txMsg) {
        return function (dispatch, getState) {
            var msgBody = convert.msgData(txMsg).MsgBody;
            var appState = getState().app;
            var csid = appState.csid;
            switch (msgBody.SubType) {
                case msgSubTypes.SYSTEM.CS_STATUS_CHANGE:
                    if (+msgBody.ID === csid && !msgBody.Status) {
                        // 客服离线显示与超时结束界面类似，访客自己点击去离线留言
                        dispatch(inputActs.setIsShowEmotion(false));
                        dispatch(appActs.updateDisableResend(true));
                        dispatch(appActs.showCsOfflineTip(true));
                        if (endUpTimer) {
                            clearTimeout(endUpTimer);
                            endUpTimer = undefined;
                        }
                        // dispatch(msgBoardActs.leaveingMsgBoard(true));
                        dispatch(appActs.endUpSession());
                    }
                    break;
                default:
                    break;
            }
        };
    },
    onTrackMsg: function (txMsg) {
        return function (dispatch, getState) {
            var msgBody = convert.msgData(txMsg).MsgBody;
            var convertedMsg = convert.track(txMsg);
            switch (msgBody.SubType) {
                case msgSubTypes.TRACK.NEW_SESSION:
                    break;
                case msgSubTypes.TRACK.CLOSE_SESSION:
                    break;
                case msgSubTypes.TRACK.TIMEOUT:
                    break;
                case msgSubTypes.TRACK.SWITCH_CS: {
                    // 访客转发转接客服消息
                    dispatch(inputActs.sendTxMsg(txMsg));
                    var switchData = msgBody.SwitchData;
                    window.ecim.switchCs(switchData.ToAccount, switchData.ToName, getState().app.csid);
                    break;
                }
            }
        };
    },
    onSwitchCsLastMsgs: function (txMsg) {
        return function (dispatch, getState) {
            // 访客转发转接客服消息
            dispatch(inputActs.sendTxMsg(txMsg));
        };
    },
    onSessionMsg: function (msg) {
        return function (dispatch, getState) {
            var allState = getState(),
                appState = allState.app,
                msgState = allState.msg,
                csInfo = allState.csInfo;
            // 防止多次发消息产生多次请求
            var csid = appState.csid,
                txcsid = appState.txcsid,
                isSettingReply = appState.isSettingReply,
                isCsReplied = appState.isCsReplied,
                sessionStatus = appState.sessionStatus,
                windowMode = appState.windowMode;

            // 改成后端写消息时处理
            // if (!isSettingReply && !isCsReplied) {
            //     dispatch(appActs.setCsReplied());
            // }

            msg.state = MSG_STATES.RECEIVED;
            msg.fromName = csInfo.name;
            msg.fromPic = csInfo.pic;
            dispatch(msgActs.addMsg(msg.fromId, msg));
            if (msg.fromId === txcsid) {
                dispatch(appActs.updateTimeout());
            }

            // 判断是否是小窗口
            if (windowMode === WINDOW_MODES.SMALL) {
                // 更新未读数
                var targetCsId = +msg.fromId;
                // 最小化的时候才有未读数提醒
                if (targetCsId !== csid || sessionStatus === SESSION_STATUS.MINIMIZED) {
                    var unreadNum = appState.unreadNums[targetCsId] || 0;
                    dispatch(appActs.updateUnreadNums(targetCsId, unreadNum + 1));
                } else {
                    dispatch(appActs.updateUnreadNums(targetCsId, 0));
                }
            }

            if (!msgState.isInBottoms[txcsid]) {
                dispatch(msgActs.setIsShowNewMsgTip(txcsid, true));
            }
        };
    },
    onLocalCustomMsg: function (msg) {
        // 访客侧不关注
    },
    onMsgNotify: function (msgs) {
        return function (dispatch, getState) {
            var isLoading = getState().app.isLoading;
            if (isLoading) {
                return;
            }
            msgs = msgs.filter(function(msg) {
                return msg.fromAccount !== 'ecadmin';
            });
            webim.Log.warn('new msg:', msgs);
            msgs.forEach(function (txMsg, index) {
                var msgBody = convert.msgData(txMsg);
                webim.Log.warn('new msg body' + index + ':', msgBody);
                switch (msgBody.Type) {
                    case msgTypes.SYSTEM: {
                        dispatch(appActs.onSysMsg(txMsg));
                        break;
                    }
                    case msgTypes.TRACK: {
                        dispatch(appActs.onTrackMsg(txMsg));
                        break;
                    }
                    case msgTypes.SESSION: {
                        convert.sess(txMsg).forEach(function (msg) {
                            dispatch(appActs.onSessionMsg(msg));
                        });
                        break;
                    }
                    case msgTypes.LOCAL_CUSTOM: {
                        dispatch(appActs.onLocalCustomMsg(txMsg));
                        break;
                    }
                    case msgTypes.SWITCH_LAST_MSG: {
                        dispatch(appActs.onSwitchCsLastMsgs(txMsg));
                        break;
                    }
                    default:
                        break;
                }
            });
        };
    },
    setFirstInSession: function (payload) {
        return {
            type: actTypes.SET_FIRST_IN_SESSION,
            payload: payload
        };
    },
    txImLogin: function () {
        return function (dispatch, getState) {
            var appState = getState().app;
            var inputState = getState().input;
            var listeners = {
                onConnNotify: function (re) {
                    switch (re.ErrorCode) {
                        case webim.CONNECTION_STATUS.ON:
                            webim.Log.warn('建立连接成功: ' + re.ErrorInfo);
                            break;
                        case webim.CONNECTION_STATUS.OFF:
                            dispatch(appActs.updateNetworkStatus(appConstants.CONNECTION_STATUS.OFFLINE));
                            // 断网后 45s 结束会话
                            // endUpTimer = setTimeout(function () {
                            //     dispatch(appActs.timeout());
                            // }, 45000 - (window.ecim.heartbeatInterval - window.ecim.heartBeatTimeGap));
                            webim.Log.warn('连接已断开，无法收到新消息，请检查下你的网络是否正常: ' + re.ErrorInfo);
                            break;
                        case webim.CONNECTION_STATUS.RECONNECT:
                            dispatch(appActs.updateNetworkStatus(appConstants.CONNECTION_STATUS.ONLINE));
                            // if (endUpTimer) {
                            //     clearTimeout(endUpTimer);
                            //     endUpTimer = undefined;
                            // }
                            if (window.ecim.heartbeatType === HEARTBEAT_TYPES.VIEWING) {
                                if (getState().app.isLoading) {
                                    dispatch(appActs.endUpSession());
                                }
                            }
                            webim.Log.warn('连接状态恢复正常: ' + re.ErrorInfo);
                            break;
                        default:
                            break;
                    }
                },
                jsonpCallback: function (re) {
                    webim.setJsonpLastRspData(re);
                },
                onMsgNotify: function (msgs) {
                    dispatch(appActs.onMsgNotify(msgs));
                }
            };

            webim.login(getState().app.loginInfo, listeners, {
                isLogOn: false
            }, function () {
                dispatch(appActs.setSessionInited(true));
                dispatch(appActs.initSession());
                if (appState.isFirstTime) {
                    dispatch(msgActs.checkHasHistory());
                }
                dispatch(appActs.setFirstInSession(false));
                dispatch(inputActs.setTextValue(inputState.textCopy || ''));
            }, function (re) {
                webim.Log.warn('login faild', re);
                // alert('登录失败，请重试');
            });
        }
    },
    setSessionInited: function (isInited) {
        return function (dispatch, getState) {
            var appState = getState().app;
            var windowMode = appState.windowMode;
            if (windowMode === WINDOW_MODES.SMALL) {
                topWindow.postMessage(JSON.stringify({
                    event: POST_MSG_TYPES.SESSION_INITED,
                    data: {
                        inited: isInited,
                        csid: appState.csid
                    }
                }), '*');
            }
            dispatch({
                type: actTypes.SESSION_INITED,
                payload: {
                    isInited: isInited
                }
            });
        };
    },
    saveMsgFromPrevCs: function (prevCsid) {
        return function (dispatch, getState) {
            var msgs = getState().msg.msgs[prevCsid] || [];
            var txcsid = getState().app.txcsid;

            msgs.forEach(function (msg) {
                dispatch(msgActs.addMsg(txcsid, msg));
            });
        };
    },
    initECIM: function () {
        return function (dispatch, getState) {
            var appState = getState().app;
            var windowMode = appState.windowMode;
            var ecim  = new ECIM({
                heartbeatType: HEARTBEAT_TYPES.CHATTING,
                guid: appState.guid,
                corpid: appState.corpid,
                key: appState.key,
                pageType: ECIM_STATUS.CHATTING
            });
            ecim.on(ECIM_EVENTS.LOGIN, function () {
                var csid = appState.csid;
                // login后发现如果当前心跳状态是会话中
                if (this.heartbeatType === HEARTBEAT_TYPES.CHATTING) {
                    this.updateStatus(ECIM_STATUS.CHATTING, csid);
                }
            });
            ecim.on(ECIM_EVENTS.ERROR, function (errorInfo) {
                if (this.heartbeatType === HEARTBEAT_TYPES.VIEWING) {
                    if (!getState().app.isLoading) {
                        dispatch(appActs.endUpSession());
                    }
                }
                if (errorInfo.ErrorCode === 5) {
                    this.login();
                }
                if (errorInfo.ErrorCode === 7) {
                    if (this.heartbeatType === HEARTBEAT_TYPES.CHATTING) {
                        var csid = appState.csid;
                        this.updateStatus(ECIM_STATUS.CHATTING, csid);
                    }
                }
            });
            ecim.on(ECIM_EVENTS.KICKED, function () {
                dispatch(appActs.kicked());
                dispatch(appActs.endUpSession());

                topWindow.postMessage(JSON.stringify({
                    event: POST_MSG_TYPES.SESSION_KICKED
                }), '*');

                if (windowMode === WINDOW_MODES.STANDARD) {
                    window.close();
                }
            });
            ecim.on(ECIM_EVENTS.UPDATED, function (seqid, status) {
                switch (status) {
                    case ECIM_STATUS.CHATTING:
                        var appState = getState().app;
                        if (appState.loginInfo) {
                            if (appState.isLoading) {
                                dispatch(appActs.txImLogin());
                            }
                        } else {
                            dispatch(appActs.getTxLoginInfo());
                        }
                        dispatch(appActs.setTalkId(seqid));
                         // 放入全局中 给makeCustomMsg使用
                        window.seqid = seqid;
                        this.startHeartbeat();
                        break;
                    // case ECIM_STATUS.VIEWING:
                    //     this.stopHeartbeat();
                    //     break;
                    default:
                        break;
                }
                // appActs.updateStatusToTop(status);
            });
            ecim.on(ECIM_EVENTS.SWITCH_CS, function (csid, csname, fromcsid, seqid) {
                window.seqid = seqid;
                var states = getState(),
                    prevCsid = states.app.csid;

                dispatch(appActs.setSessionInited(true));
                dispatch(appActs.switchCs(csid));
                dispatch(appActs.getCsInfo(csid)); // 在这里改变csid
                dispatch(appActs.setTalkId(seqid));
                dispatch(appActs.initSession(fromcsid));
                dispatch(msgActs.checkHasHistory());
                dispatch(appActs.doSetCsReplied(false));
                dispatch(appActs.saveMsgFromPrevCs(prevCsid));
                dispatch(msgActs.addTipMsg(csid, '接下来' + csname + '为您服务'));
            });

            window.ecim = ecim;
        };
    },
    initSession: function (fromcsid) {
        return function (dispatch, getState) {
            // dispatch(appActs.doInitSession(session));
            var appState = getState().app;
            var logData = {
                corpid: appState.corpid,
                guid: appState.guid,
                type: 1,
                csid: appState.csid,
                cskey: window.ec_cskey
            };
            if (fromcsid) {
                logData.type = 2;
                logData.fromcsid = fromcsid;
            }
            ajax.getJSON('//kf.ecqun.com/index/index/vlogtalk', logData);
            dispatch(appActs.updateDisableResend(false));
            dispatch(appActs.updateTimeout());
            dispatch(appActs.uploadSessionData());
            dispatch(customMsgActs.newSession());
            dispatch(msgActs.addGreetingMsg());
        };
    },
    uploadSessionData: function () {
        return function (dispatch, getState) {
            var appState = getState().app;
            ajax.getJSON('//kf.ecqun.com/index/analy/index', {
                corpid: appState.corpid,
                scheme: appState.scheme,
                guid: appState.guid,
                talkid: appState.talkid,
                csid: appState.csid,
                cskey: window.ec_cskey
            });
        };
    },
    doInitSession: function (session) {
        return {
            type: actTypes.INIT_SESSION,
            payload: {
                session: session
            }
        };
    },
    setTalkId: function (talkid) {
        return {
            type: actTypes.SET_TALKID,
            payload: {
                talkid: talkid
            }
        };
    },
    switchCs: function (csid) {
        return {
            type: actTypes.SWITCH_CS,
            payload: {
                csid: csid
            }
        };
    },
    showKeepLoading: function(showLoading) {
        return {
            type: actTypes.SHOW_KEEP_LOADING,
            payload: {
                showLoading: showLoading
            }
        };
    },
    keepSession: function () {
        return function (dispatch, getState) {
            var appState = getState().app;
            var languageType = appState.appData ? appState.appData.language : 0;
            var localeKey = getLanguagePackage(languageType);
            var networkStatus = appState.networkStatus;
            if (networkStatus === appConstants.CONNECTION_STATUS.OFFLINE) {
                dispatch(inputActs.showSessTip(localeKey.networkUnavailable));
                return false;
            }

            var csid = getState().app.csid;

            dispatch(msgBoardActs.leaveingMsgBoard(false));
            dispatch(appActs.showKeepLoading(false));
            dispatch(appActs.showLeaveMsgTip(false));
            dispatch(appActs.doSetCsReplied(false));
            window.ecim.updateStatus(ECIM_STATUS.CHATTING, csid);
        };
    },
    checkCsStatus: function () {
        return function (dispatch, getState) {
            var appState = getState().app;
            var corpid = appState.corpid;
            var csid = appState.csid;
            var languageType = appState.appData ? appState.appData.language : 0;
            var localeKey = getLanguagePackage(languageType);

            ajax.getJSON('//kf.ecqun.com/index/talk/getcsstatus', {
                corpid: corpid,
                csid: csid,
                cskey: window.ec_cskey
            }, function (re) {
                if (re.code !== 200) {
                    // alert(re.msg);
                }

                if (re.data.status == 1) {
                    dispatch(appActs.keepSession());
                } else if (re.data.status == 0) {
                    dispatch(appActs.showKeepLoading(false));
                    dispatch(appActs.showLeaveMsgTip(false));
                    dispatch(appActs.showCsOfflineTip(true));
                }
            }, function() {
                dispatch(inputActs.showSessTip(localeKey.networkUnavailable));
                dispatch(appActs.showKeepLoading(false));
                dispatch(appActs.showLeaveMsgTip(true));
            });
        }
    },
    getCsInfo: function (csid) {
        return function (dispatch, getState) {
            var corpid = getState().app.corpid;
            ajax.getJSON('//kf.ecqun.com/index/talk/getcsinfo', {
                corpid: corpid,
                csid: csid,
                cskey: window.ec_cskey
            }, function (re) {
                if (re.code !== 200) {
                    return;
                }
                dispatch(csInfoActs.setCsInfo(re.data));
            });
        }
    },
    setCsReplied: function () {
        return function (dispatch, getState) {
            var appState = getState().app;
            var corpid = appState.corpid,
                scheme = appState.scheme,
                csid = appState.csid,
                guid = appState.guid,
                talkid = appState.talkid;
            dispatch(appActs.setReplying(true));
            ajax.getJSON('//kf.ecqun.com/index/talk/firsreply', {
                corpid: corpid,
                scheme: scheme,
                csid: csid,
                guid: guid,
                talkid: talkid,
                cskey: window.ec_cskey
            }, function (re) {
                if (re.code !== 200) {
                    return;
                }
                dispatch(appActs.doSetCsReplied(true));
                dispatch(appActs.setReplying(false));
            });
        };
    },
    doSetCsReplied: function (replied) {
        return {
            type: actTypes.SET_CS_REPLIED,
            payload: {
                isCsReplied: replied || false
            }
        };
    },
    setReplying: function (isSetting) {
        return {
            type: actTypes.SET_REPLYING,
            payload: {
                isSetting: isSetting
            }
        };
    },
    showLeaveMsgTip: function (showLeaveMsg) {
        return {
            type: actTypes.SHOW_LEAVE_MSG_TIP,
            payload: {
                showLeaveMsg: showLeaveMsg
            }
        }
    },
    showCsOfflineTip: function (showOffline) {
        return {
            type: actTypes.SET_CS_OFFLINE_TIP,
            payload: {
                showCsOffline: showOffline
            }
        }
    },
    kicked: function () {
        return {
            type: actTypes.KICKED
        };
    },
    updateTimeout: function () {
        return function (dispatch, getState) {
            var timeout =  (getState().app.appData.talkset.timeout || 0) * 1000;
            // var timeout = 6000;
            var timeoutTime = new Date().getTime() + timeout;
            if (!timeout) {
                return;
            }
            if (endUpTimer) {
                clearTimeout(endUpTimer);
                endUpTimer = undefined;
            }
            (function timeoutCountter() {
                endUpTimer = setTimeout(function () {
                    if (new Date().getTime() >= timeoutTime) {
                        dispatch(appActs.timeout());
                    } else {
                        timeoutCountter();
                    }
                }, 1000);
            })();
        };
    },
    timeout: function () {
        return function (dispatch, getState) {
            var appState = getState().app,
                csid = appState.csid,
                txcsid = appState.txcsid;

            var networkStatus = appState.networkStatus;
            var languageType = appState.appData ? appState.appData.language : 0;
            var localeKey = getLanguagePackage(languageType);

            dispatch(inputActs.setIsShowEmotion(false));

            // 禁止重发消息
            dispatch(appActs.updateDisableResend(true));
            // 显示留言提示
            dispatch(appActs.showLeaveMsgTip(true));

            // 断网后超时离开重置 pageid
            if (networkStatus === appConstants.CONNECTION_STATUS.OFFLINE) {
                window.ecim.resetPageId();
                window.ecim.heartbeatType = HEARTBEAT_TYPES.VIEWING;
                // dispatch(appActs.setSessionInited(false));
            }

            // 一条假消息
            dispatch(msgActs.addMsg(txcsid, {
                type: SESSION_MSG_TYPES.SESSION_MSG,
                msgId: new Date().getTime() + Math.random() * 1000000,
                fromId: txcsid,
                msgTime: new Date().getTime(),
                // msgContent: '您好，由于很久没有收到您的消息，系统自动结束了对话。如有需要欢迎咨询！',
                msgContent: localeKey.autoEndSys,
                text: localeKey.autoEndSys,
                state: MSG_STATES.SENT
            }));

            if (networkStatus === appConstants.CONNECTION_STATUS.ONLINE) {
                dispatch(customMsgActs.sendTimeoutMsg(function () {
                    dispatch(appActs.endUpSession());
                }));
            }
        };
    },
    endUpSession: function () {
        return function (dispatch, getState) {
            var appState = getState().app,
                csid = appState.csid,
                isLoading = appState.isLoading;

            if (isLoading) {
                return;
            }

            window.ecim.updateStatus(ECIM_STATUS.VIEWING, csid);
            // window.ecim.heartbeatType = HEARTBEAT_TYPES.VIEWING;
            // 同步处理
            // 已改成非postmsg方案
            // appActs.updateStatusToTop(ECIM_STATUS.VIEWING);
            // 退出腾讯im登录
            webim.logout(function () {});

            dispatch(appActs.setSessionInited(false));
        };
    },
    updateStatusToTop: function (status) {
        topWindow.postMessage(JSON.stringify({
            event: ECIM_EVENTS.UPDATED,
            data: {
                status: status
            }
        }), '*');
    },
    updateDisableResend: function (payload) {
        return {
            type: actTypes.SET_DISABLE_RESEND,
            payload: {
                isDisable: payload,
            }
        };
    },
    updateNetworkStatus: function (payload) {
        return {
            type: actTypes.UPDATE_NETWORK_STATUS,
            payload: {
                status: payload,
            }
        };
    }
};

module.exports = appActs;
