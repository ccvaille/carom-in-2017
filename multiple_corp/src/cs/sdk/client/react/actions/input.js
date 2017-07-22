/*eslint-disable */
var msgActs = require('./msg');
var consts = require('../../modules/const');
var convert = require('~cscommon/utils/convert');
var splitText = require('~cscommon/utils/splitText');
var makeCustomMsg = require('~cscommon/utils/makeCustomMsg');
var guestTypes = require('~cscommon/consts/guestTypes');
var getLanguagePackage = require('../../utils/locale');

var brokenImg = require('~cscommon/images/broken-img.png');
var loadingImg = require('~cscommon/images/loading.gif')

var MSG_STATES = consts.MSG_STATES;
var POST_MSG_TYPES = consts.POST_MSG_TYPES;
var SESSION_CONF = consts.SESSION_CONF;
// var msgSubTypes = require('~cscommon/consts/msgSubTypes');
var isMobile = /(iPhone|iPod|Android|ios)/i.test(window.navigator.userAgent);
var isAndroid = /Android/i.test(window.navigator.userAgent);

var actTypes = {
    SET_TEXT_VALUE: 'SET_TEXT_VALUE',
    SET_TIP_TEXT: 'SET_TIP_TEXT',
    SET_IS_SHOW_EMOTION: 'SET_IS_SHOW_EMOTION'
};

var autoTrackResendCounter = {};
var tipTimer;

var inputActs = {
    actTypes: actTypes,
    setTextValue: function (value) {
        return {
            type: actTypes.SET_TEXT_VALUE,
            payload: {
                value: value
            }
        };
    },
    setTipText: function (text) {
        return {
            type: actTypes.SET_TIP_TEXT,
            payload: {
                tipText: text
            }
        };
    },
    showSessTip: function (tip, time) {
        time = time === undefined ? 3000 : time;
        return function (dispatch, getState) {
            dispatch(inputActs.setTipText(tip));
            if (time && tip) {
                if (tipTimer) {
                    clearTimeout(tipTimer);
                    tipTimer = null;
                }
                tipTimer = setTimeout(function () {
                    dispatch(inputActs.setTipText(''));
                    clearTimeout(tipTimer);
                    tipTimer = null;
                }, time);
            }
        };
    },
    setIsShowEmotion: function (isShowEmotion) {
        return {
            type: actTypes.SET_IS_SHOW_EMOTION,
            payload: {
                isShowEmotion: isShowEmotion
            }
        };
    },
    resendMsg: function (msg) {
        return function (dispatch, getState) {
            var appState = getState().app,
                txcsid = appState.txcsid,
                isLoading = appState.isLoading,
                isDisableResend = appState.isDisableResend,
                showCsOffline = appState.showCsOffline,
                showLeaveMsg = appState.showLeaveMsg;
            var txMsg = msg.txMsg;
            var languageType = appState.appData ? appState.appData.language : 0;
            var localeKey = getLanguagePackage(languageType);

            if (isDisableResend) {
                if (showCsOffline) {
                    dispatch(inputActs.showSessTip(localeKey.csOfflineInTip));
                } else if (showLeaveMsg) {
                    dispatch(inputActs.showSessTip(localeKey.endSessionTip));
                }
                return false;
            }

            if (isLoading || !txMsg) {
                return;
            }
            switch (msg.state) {
                case MSG_STATES.FAILED: {
                    // 重新载入表情图片
                    var regex = /<img[^>]+src="?([^"\s]+)"?\s*\/?>/;
                    var result = regex.exec(msg.msgContent);
                    if (result && result.length > 1) {
                        var src = result[1];
                        if (src.indexOf('www.staticec.com/my/images/qqimg/') > -1) {
                            dispatch(msgActs.updateMsg(txcsid, {
                                msgId: msg.msgId,
                                msgContent: '<img class="ec-qq-emoji" src="' + src + '?' + new Date().getTime() + '">'
                            }));
                        }
                    }
                    dispatch(msgActs.updateMsg(txcsid, {
                        msgId: msg.msgId,
                        state: MSG_STATES.SENDING
                    }));
                    dispatch(inputActs.sendTxSessMsg(txMsg));
                    break;
                }
                case MSG_STATES.UPLOAD_FAILED: {
                    var file = msg.file;
                    if (!file) {
                        alert('重发失败，请重新选择图片');
                        return;
                    }
                    dispatch(msgActs.updateMsg(txcsid, {
                        msgId: msg.msgId,
                        srcs: {
                            SmallImage: loadingImg,
                            BigImage: loadingImg,
                            OriImage: loadingImg
                        },
                        state: MSG_STATES.NONE
                    }));
                    dispatch(inputActs.uploadPic(file, {
                        txMsg: txMsg,
                        msg: msg
                    }));
                    break;
                }
                default:
                    break;
            }
        };
    },
    sendTxSessMsg: function (txMsg) {
        return function (dispatch, getState) {
            var isLoading = getState().app.isLoading;
            var sessionId = txMsg.getSession().id();
            var msgEls = convert.sess(txMsg);

            // console.log('im state:', isLoading);
            // debugger;
            !isLoading && webim.sendMsg(txMsg, function (re) {
                msgEls.forEach(function (msg) { // 解析后是数组
                    msg.state = MSG_STATES.SENT;
                    dispatch(msgActs.updateMsg(sessionId, msg));
                });
            }, function (re) {
                msgEls.forEach(function (msg) {
                    // if (msg.subType === msgSubTypes.SESSION.IMAGE) {
                    //     msg.msgContent = '<img src="' + require('~cscommon/images/broken-img.png') + '" />'
                    // }
                    msg.state = MSG_STATES.FAILED;
                    msg.txMsg = txMsg; // 如果失败则必然是组合内的消息都失败了 重发则重发这条组合
                    dispatch(msgActs.updateMsg(sessionId, msg));
                });
            });
        };
    },
    beforeSendTextMsg: function (text) {
        return function (dispatch, getState) {
            splitText(text, 500).forEach(function (text) {
                dispatch(inputActs.doSendTextMsg(text));
            });
        };
    },
    sendTextMsg: function (text) {
        return function (dispatch, getState) {
            var appState = getState().app,
                guid = appState.guid,
                txguid = appState.txguid,
                txcsid = appState.txcsid,
                guidName = appState.guestInfo.guidName;
            // make txMsg
            var txMsg = makeCustomMsg.txMsg(txguid, txcsid);

            // make msgData
            var textData = makeCustomMsg.sess.text({
                text: text,
                accid: guid,
                acctype: guestTypes.WEB
            });
            var data = window.Base64.encode(JSON.stringify(textData));
            var desc = text;
            var offlineDesc = guidName + '：' + text;
            var custom = new webim.Msg.Elem.Custom(data, desc, data);
            txMsg.addCustom(custom);
            txMsg.setOfflinePushInfo(makeCustomMsg.offlinePushInfo({
                ext: data,
                desc: desc
            }));

            var msgs = convert.sess(txMsg);
            msgs.forEach(function (msg) {
                msg.state = MSG_STATES.SENDING;
                dispatch(msgActs.addMsg(txcsid, msg));
            });
            dispatch(inputActs.setTextValue(''));
            dispatch(inputActs.sendTxSessMsg(txMsg, msgs));
        };
    },
    sendPicMsg: function (txMsg, msgImgs) {
        return function (dispatch, getState) {
            var appState = getState().app;
            var guid = appState.guid;
            var guidName = appState.guestInfo.guidName;
            var srcs = {};
            var imgTypes = ['SmallImage', 'BigImage', 'OriImage'];
            for (var i in msgImgs.URL_INFO) {
                var img = msgImgs.URL_INFO[i];
                srcs[imgTypes[i]] = img.DownUrl;
            }
            var picData = makeCustomMsg.sess.image({
                srcs: srcs,
                accid: guid,
                acctype: guestTypes.WEB
            });
            var data = window.Base64.encode(JSON.stringify(picData));
            var desc = '[图片]';
            var offlineDesc = guidName + '：' + '[图片]';
            var custom = new webim.Msg.Elem.Custom(data, desc, data);
            txMsg.addCustom(custom);
            txMsg.setOfflinePushInfo(makeCustomMsg.offlinePushInfo({
                ext: data,
                desc: desc
            }));

            dispatch(inputActs.sendTxSessMsg(txMsg));
        };
    },
    uploadPic: function (file, reuploadOpts) {
        return function (dispatch, getState) {
            var appState = getState().app,
                txguid = appState.txguid,
                txcsid = appState.txcsid;
            // 重发传入的对象
            reuploadOpts = reuploadOpts || {};
            // make txmsg
            var txMsg = reuploadOpts.txMsg || makeCustomMsg.txMsg(txguid, txcsid);

            var msg = reuploadOpts.msg || convert.sess(txMsg)[0];
            msg.state = MSG_STATES.NONE;
            if (!reuploadOpts.msg) {
                dispatch(msgActs.addMsg(txcsid, msg));
            }

            // upload pic
            var opts;
            if (window.isLowerIE) {
                opts = {
                    formId: 'picform', // 上传图片表单id
                    fileId: 'picfile', // file控件id
                    To_Account: txcsid,
                    businessType: webim.UPLOAD_PIC_BUSSINESS_TYPE.C2C_MSG
                };
            } else {
                opts = {
                    file: file,
                    From_Account: txguid,
                    To_Account: txcsid,
                    businessType: webim.UPLOAD_PIC_BUSSINESS_TYPE.C2C_MSG,
                    onProgressCallBack: function (re) {
                        // console.log(re);
                    }
                };
            }
            // webim.submitUploadFileForm // ie8
            var uploadFn = webim[window.isLowerIE ? 'submitUploadFileForm' : 'uploadPic'];
            uploadFn(opts, function (re) {
                dispatch(inputActs.sendPicMsg(txMsg, re));
                document.getElementById('picform').reset();
            }, function (re) {
                dispatch(msgActs.updateMsg(txcsid, {
                    msgId: msg.msgId,
                    srcs: {
                        SmallImage: brokenImg,
                        BigImage: brokenImg,
                        OriImage: brokenImg
                    },
                    state: MSG_STATES.UPLOAD_FAILED,
                    txMsg: txMsg,
                    file: file
                }));
            });
        };
    },
    sendTrackMsg: function (data, desc) {
        var offlinePushInfo = makeCustomMsg.offlinePushInfo({
                pushflag: 1, // 1表示不推送
                ext: '',
                desc: ''
            });
        var cb = function () {};

        if (arguments[2]) {
            if (typeof arguments[2] === 'function') {
                cb = arguments[2];
            } else {
                offlinePushInfo = arguments[2];
                if (typeof cb === 'function') cb = arguments[3];
            }
        }

        return function (dispatch, getState) {
            var appState = getState().app,
                txguid = appState.txguid,
                txcsid = appState.txcsid;
            // make txMsg
            var txMsg = makeCustomMsg.txMsg(txguid, txcsid);
            // make msgData
            var encodedData = window.Base64.encode(JSON.stringify(data));
            var custom = new webim.Msg.Elem.Custom(encodedData, desc, encodedData);
            txMsg.addCustom(custom);

            txMsg.setOfflinePushInfo(offlinePushInfo);

            webim.sendMsg(txMsg, function (re) {
                cb && cb();
            }, function (re) {
                // 失败则重发
                var counter = autoTrackResendCounter[txMsg.seq];
                if (!counter) {
                    autoTrackResendCounter[txMsg.seq] = 0;
                }
                if (++autoTrackResendCounter[txMsg.seq] < 5) {
                    setTimeout(arguments.callee, 200);
                    return;
                }
                // debugger;
                if (window.console) {
                    console.log(re, data);
                }
                // alert(desc + ' 消息发送失败');
            });
        };
    },
    sendLocslCustomMsg: function (data, desc) {
        var offlinePushInfo = makeCustomMsg.offlinePushInfo({
                pushflag: 1, // 1表示不推送
                ext: '',
                desc: ''
            });
        var cb = function () {};

        if (arguments[2]) {
            if (typeof arguments[2] === 'function') {
                cb = arguments[2];
            } else {
                offlinePushInfo = arguments[2];
                if (typeof cb === 'function') cb = arguments[3];
            }
        }

        return function (dispatch, getState) {
            var appState = getState().app,
                txguid = appState.txguid,
                txcsid = appState.txcsid;
            // make txMsg
            var txMsg = makeCustomMsg.txMsg(txguid, txcsid);

            // make msgData
            var encodedData = window.Base64.encode(JSON.stringify(data));

            var custom = new webim.Msg.Elem.Custom(encodedData, desc, encodedData);
            txMsg.addCustom(custom);

            if (offlinePushInfo) {
                txMsg.setOfflinePushInfo(offlinePushInfo);
            }

            webim.sendMsg(txMsg, function (re) {
                cb && cb();
            }, function (re) {
                // 失败则重发
                var counter = autoTrackResendCounter[txMsg.seq];
                if (!counter) {
                    autoTrackResendCounter[txMsg.seq] = 0;
                }
                if (++autoTrackResendCounter[txMsg.seq] < 5) {
                    setTimeout(arguments.callee, 200);
                    return;
                }
                // debugger;
                if (window.console) {
                    console.log(data);
                }
                // alert(desc + ' 消息发送失败');
            });
        };
    },
    // 转发消息用
    sendTxMsg: function (txMsg, succCb, errCb) {
        return function (dispatch, getState) {
            var appState = getState().app,
                txguid = appState.txguid;

            var msgBody = convert.msgData(txMsg).MsgBody;
            var txcsid = msgBody.SwitchData.ToAccount;
            // make txMsg
            var newTxMsg = makeCustomMsg.txMsg(txguid, txcsid);
            var msgEle = txMsg.getElems()[0],
                msgContent = msgEle.getContent(),
                data = msgContent.getData(),
                desc = msgContent.getDesc(),
                ext = msgContent.getExt();

            var newCustom = new webim.Msg.Elem.Custom(data, desc, ext);
            newTxMsg.addCustom(newCustom);

            var offlinePushInfo = makeCustomMsg.offlinePushInfo({
                pushflag: 1, // 1表示不推送
                ext: '',
                desc: ''
            });
            txMsg.setOfflinePushInfo(offlinePushInfo);

            webim.sendMsg(newTxMsg, function (re) {
                (succCb || function () {})(re);
            }, function (re) {
                (errCb || function () {})(re);
            });
        }
    },
    hideSmallSession: function (csinfo, isSmallMode) {
        return function (dispatch, getState) {
            window.open(consts.SESSION_CONF.QQURL + csinfo.qq);

            if (isSmallMode) {
                // window.top.postMessage(JSON.stringify({
                //     event: POST_MSG_TYPES.HIDE_SAMLL_SESSION,
                //     data: ''
                // }), '*')
            }
        }
    },
    goQQMobile: function (csinfo) {
        return function (dispatch, getState) {
            if (isMobile) {
                window.isGoToQQ = true;
                if (isAndroid) {
                    window.location.href = SESSION_CONF.QQURLAndroid + csinfo.qq;
                } else {
                    window.location.href = SESSION_CONF.QQURLIOS + csinfo.qq;
                }
            }
        }
    }
};

module.exports = inputActs;
