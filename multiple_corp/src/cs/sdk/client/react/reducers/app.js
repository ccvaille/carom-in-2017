/*eslint-disable */
var getQueryParams = require('../../utils/search');
var consts = require('../../modules/const');
var actTypes = require('../actions/app').actTypes;

var queryParams = getQueryParams();
window.corpid = queryParams.corpid;

var pcAvatar = require('../../imgs/client-device-pc.png'),
    mobileAvatar = require('../../imgs/client-device-phone.png');

var appConstants = require('../constants/app');

var isMobile = /(iPhone|iPod|Android|ios)/i.test(window.navigator.userAgent);

var initialState = {
    scheme: 0,
    isMobile: isMobile,
    showCsOffline: false,
    showLeaveMsg: false,
    isLeavingMsg: false,
    isSettingReply: false,
    isCsReplied: false,
    isLoading: true,
    isDisableResend: false,
    isKicked: false,
    windowMode: +queryParams.mode,
    sessionStatus: consts.SESSION_STATUS.MAXIMIZED, // 是否最小化
    session: '', // txSession
    guestInfo: {
        pic: isMobile ? mobileAvatar : pcAvatar,
        name: '我',
        device: isMobile ? 'mobile' : 'pc'
    },
    unreadNums: {},
    networkStatus: appConstants.CONNECTION_STATUS.ONLINE, // 10000: 无网络 10001: 有网络
    showKeepLoading: false,
    isFirstTime: true
};

module.exports = function (state, action) {
    state = state || initialState;

    var newState = Object.assign({}, state);

    switch (action.type) {
        case actTypes.INIT_APP:
            newState.appData = action.payload.data;
            newState.corpid = action.payload.data.corpid;
            newState.txcsid = '' + action.payload.data.csid;
            newState.csid = action.payload.data.csid;
            newState.txguid = 'guest_' + action.payload.data.guid;
            newState.guid = action.payload.data.guid;
            newState.key = action.payload.data.key;
            Object.assign(newState.guestInfo, action.payload.data.guidinfo);
            return newState;
        case actTypes.SET_TX_LOGIN_INFO:
            newState.loginInfo = action.payload.data;
            return newState;
        case actTypes.SESSION_INITED:
            newState.isLoading = !action.payload.isInited;
            return newState;
        case actTypes.INIT_SESSION:
            newState.session = action.payload.session;
            return newState;
        case actTypes.SWITCH_CS:
            newState.csid = +action.payload.csid;
            newState.txcsid = '' + action.payload.csid;
            return newState;
        case actTypes.SET_CS_REPLIED:
            newState.isCsReplied = action.payload.isCsReplied;
            return newState;
        case actTypes.SET_TALKID:
            newState.talkid = action.payload.talkid;
            return newState;
        case actTypes.SET_REPLYING:
            newState.isSettingReply = action.payload.isSetting;
            return newState;
        case actTypes.SHOW_LEAVE_MSG_TIP:
            newState.showLeaveMsg = action.payload.showLeaveMsg;
            return newState;
        case actTypes.KICKED:
            newState.isKicked = true;
            return newState;
        case actTypes.SET_UNREAD_NUM:
            newState.unreadNums[action.payload.csid] = action.payload.num;
            return newState;
        case actTypes.SET_SESSION_STATUS:
            newState.sessionStatus = action.payload.sessionStatus;
            return newState;
        case actTypes.SET_CS_OFFLINE_TIP:
            newState.showCsOffline = action.payload.showCsOffline;
            return newState;
        case actTypes.SET_DISABLE_RESEND:
            newState.isDisableResend = action.payload.isDisable;
            return newState;
        case actTypes.UPDATE_NETWORK_STATUS:
            newState.networkStatus = action.payload.status;
            return newState;
        case actTypes.SHOW_KEEP_LOADING:
            newState.showKeepLoading = action.payload.showLoading;
            return newState;
        case actTypes.SET_FIRST_IN_SESSION:
            newState.isFirstTime = action.payload;
            return newState;
        default:
            return newState;
    }
};
