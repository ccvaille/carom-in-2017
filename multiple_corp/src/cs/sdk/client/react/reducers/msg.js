/*eslint-disable */
var actTypes = require('../actions/msg').actTypes;
var initialState = {
    msgs: {},
    sessMsgsList: [],
    isFirstTime: true,
    isInBottoms: {},
    isShowNewMsgTips: {},
    msgsMaps: {},
    historyMsgs: {},
    hasHistoryTip: false,
    isCheckingHasHistory: true,
    isShowGetHistoryMsgBtn: false,
    isGettingHistoryMsgs: false
};

module.exports = function (state, action) {
    state = state || initialState;

    var newState = Object.assign({}, state);

    switch (action.type) {
        case actTypes.ADD_MSG: {
            var fromId = action.payload.fromId;
            var msg = action.payload.msg;
            var msgId = msg.msgId;
            var msgs = [].concat(newState.msgs[fromId] || []);
            var msgsMap = Object.assign({}, newState.msgsMaps[fromId]);
            if (msgsMap[msgId]) {
                return newState;
            }
            msgs[action.payload.isPrepend ? 'unshift' : 'push'](msg);
            msgsMap[msgId] = 1;
            newState.msgs = Object.assign({}, newState.msgs);
            newState.msgs[fromId] = msgs;
            newState.msgsMaps[fromId] = msgsMap;
            return newState;
        }
        case actTypes.UPDATE_MSG: {
            var msgs = newState.msgs[action.payload.fromId];
            var index = msgs.findIndex(function (msg) {
                return msg.msgId === action.payload.msg.msgId;
            });
            msgs[index] = Object.assign(
                {},
                msgs[index],
                action.payload.msg
            );
            return newState;
        }
       case actTypes.SET_HISTORY_MSGS: {
            var sessMsgsList =  [].concat(action.payload.sessMsgsList).concat(newState.sessMsgsList || []);
            var temp = {};
            temp[action.payload.txcsid] = Object.assign(
                {},
                newState.historyMsgs[action.payload.txcsid],
                {
                    msgs: [].concat(action.payload.msgs).concat((newState.historyMsgs[action.payload.txcsid] || {}).msgs || []),
                    lastMsgTime: action.payload.lastMsgTime
                }
            );
            newState.historyMsgs = Object.assign({}, newState.historyMsgs, temp);
            newState.sessMsgsList = sessMsgsList;
            return newState;
        }
        case actTypes.SET_HAS_HISTORY_TIP:
            newState.hasHistoryTip = action.payload.hasHistoryTip;
            return newState;
        case actTypes.SET_IS_SHOW_GET_HISTORY_BTN:
            newState.isShowGetHistoryMsgBtn = action.payload.isShowGetHistoryMsgBtn;
            return newState;
        case actTypes.SET_IS_GETTING_HISTORY_MSGS:
            newState.isGettingHistoryMsgs = action.payload.isGettingHistoryMsgs;
            return newState;
        case actTypes.SET_IS_GET_HISTORY_COMPLETED: {
            var temp = {};
            temp[action.payload.txcsid] = Object.assign(
                {},
                newState.historyMsgs[action.payload.txcsid],
                {
                    isCompleted: action.payload.isCompleted
                }
            );
            newState.historyMsgs = Object.assign({}, newState.historyMsgs, temp);
            return newState;
        }
        case actTypes.SET_SCROLL_PAGE: {
            var temp = {};
            temp[action.payload.txcsid] = Object.assign(
                {},
                newState.historyMsgs[action.payload.txcsid],
                {
                    scrollPage: action.payload.scrollPage
                }
            );
            newState.historyMsgs = Object.assign({}, newState.historyMsgs, temp);
            return newState;
        }
        case actTypes.SET_HISTORY_LAST_MSG_KEY: {
            var temp = {};
            temp[action.payload.txcsid] = Object.assign(
                {},
                newState.historyMsgs[action.payload.txcsid],
                {
                    lastMsgKey: action.payload.msgKey
                }
            );
            newState.historyMsgs = Object.assign({}, newState.historyMsgs, temp);
            return newState;
        }
        case actTypes.UPDATE_FIRST_TIME: {
            newState.isFirstTime = action.payload;
            return newState;
        }
        case actTypes.SET_IS_IN_BOTTOM: {
            newState.isInBottoms[action.payload.txcsid] = action.payload.isInBottom;
            return newState;
        }
        case actTypes.SET_IS_SHOW_NEW_MSG_TIP: {
            newState.isShowNewMsgTips[action.payload.txcsid] = action.payload.isShowNewMsgTip;
            return newState;
        }
        default:
            return newState;
    }
};
