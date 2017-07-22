/*eslint-disable */
var actTypes = {
    SHOW_NOTICE: 'SHOW_NOTICE',
    HIDE_NOTICE: 'HIDE_NOTICE'
};

var noticeTimer;
var noticeActs = {
    actTypes: actTypes,
    showNotice: function (msg) {
        return function (dispatch, getState) {
            dispatch(noticeActs.doShowNotice(msg));
            if (noticeTimer) {
                clearTimeout(noticeTimer);
                noticerTimer = null;
            }
            noticeTimer = setTimeout(function () {
                noticeActs.hideNotice();
            }, 5000);
        };
    },
    doShowNotice: function (msg) {
        return {
            type: actTypes.SHOW_NOTICE,
            payload: {
                notice: msg
            }
        };
    },
    hideNotice: function () {
        return {
            type: actTypes.HIDE_NOTICE
        };
    }
};

module.exports = noticeActs;
/*eslint-enable */
