/*eslint-disable */
var msgActs = require('./msg');
var serialize = require('../../utils/serialize');
var consts = require('../../modules/const');
var getQueryParams = require('../../utils/search');
var makeCustomMsg = require('~cscommon/utils/makeCustomMsg');
var guestTypes = require('~cscommon/consts/guestTypes');
var mobileAvatar = require('../../imgs/client-device-phone.png');
var pcAvatar = require('../../imgs/client-device-pc.png');

var inputActs = require('./input');
var MSG_STATES = consts.MSG_STATES,
    SESSION_MSG_TYPES = consts.SESSION_MSG_TYPES,
    CMDS = consts.CMDS,
    FECMDS = consts.FECMDS;

var actTypes = {

};

var customMsgActs = {
    actTypes: actTypes,
    newSession: function () {
        return function (dispatch, getState) {
            var appState = getState().app,
                guid = appState.guid,
                guname = appState.guestInfo.guidName
                terminal = appState.guestInfo.terminal || 0;
                // pic = appState.isMobile ? 'client-device-phone' : 'client-device-pc',
                pic = appState.isMobile ? mobileAvatar : pcAvatar,
                data = makeCustomMsg.track.newSess({
                    accid: guid,
                    acctype: guestTypes.WEB,
                    guname: guname,
                    // pic: '//1.staticec.com/kf/sdk/image/' + pic + '.png',
                    pic: '',
                    terminal: terminal
                }),
                desc = guname + ' 进入对话',
                offlineDesc = '新的对话';

            var encodedData = window.Base64.encode(JSON.stringify(data));
            var offlinePushInfo = makeCustomMsg.offlinePushInfo({
                ext: encodedData,
                desc: offlineDesc
            });

            dispatch(inputActs.sendTrackMsg(data, desc, offlinePushInfo));
        };
    },
    closeSession: function () {
        return function (dispatch, getState) {
            var appState = getState().app,
                guid = appState.guid,
                guname = appState.guestInfo.guidName,
                data = makeCustomMsg.track.closeSess({
                    accid: guid,
                    acctype: guestTypes.WEB,
                    guname: guname
                });
            // dispatch(inputActs.sendTrackMsg(data, guname + ' 关闭会话'));
        };
    },
    sendTimeoutMsg: function (cb) {
        return function (dispatch, getState) {
            var appState = getState().app,
                guid = appState.guid,
                guname = appState.guestInfo.guidName,
                data = makeCustomMsg.track.timeout({
                    accid: guid,
                    acctype: guestTypes.WEB,
                    guname: guname
                });
            dispatch(inputActs.sendTrackMsg(data, guname + ' 超时离开', cb));
        };
    },
    sendPreviewMsg: function (content) {
        return function (dispatch, getState) {
            var appState = getState().app,
                guid = appState.guid,
                guname = appState.guestInfo.guidName,
                data = makeCustomMsg.localCustom.previewMsg({
                    accid: guid,
                    acctype: guestTypes.WEB,
                    content:content
                });

            // var encodedData = window.Base64.encode(JSON.stringify(data));
            // var offlinePushInfo = makeCustomMsg.offlinePushInfo({
            //     pushflag: 1,
            //     ext: encodedData,
            //     desc: ''
            // });

            dispatch(inputActs.sendLocslCustomMsg(data, guname + ' 预显消息'));
        };
    },
    leaveMsgSuccess: function () {
        return function (dispatch, getState) {
            var appState = getState().app,
                guid = appState.guid,
                guname = appState.guestInfo.guidName,
                data = makeCustomMsg.localCustom.leaveMsgSucc({
                    accid: guid,
                    acctype: guestTypes.WEB
                });
            dispatch(inputActs.sendLocslCustomMsg(data, guname + ' 发送留言成功'));
        };
    }
}

module.exports = customMsgActs;
