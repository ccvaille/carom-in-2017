/*eslint-disable */
var actTypes = require('../actions/notice').actTypes;
var notice = window.sessionData ? window.sessionData.talkset.notice : '';
var initialState = {
    noticeContent: notice,
    isShowingNotice: true
};

module.exports = function (state, action) {
    state = state || initialState;

    var newState = Object.assign({}, state);

    switch (action.type) {
        case actTypes.SHOW_NOTICE:
            newState.isShowingNotice = true;
            newState.noticeContent = action.payload.notice;
            return newState;
        case actTypes.HIDE_NOTICE:
            newState.isShowingNotice = false;
            return newState;

        default:
            return newState;
    }
};
