/*eslint-disable */
var getQueryParams = require('../../utils/search');
var csListAct = require('../actions/csList');
var actTypes = csListAct.actTypes;
var consts = require('../../modules/const');
var INIT_CONFIG = consts.INIT_CONFIG;

var isMobile = /(iPhone|iPod|Android|ios)/i.test(window.navigator.userAgent);

var queryParams = getQueryParams();
var initialState = {
    config: isMobile ? INIT_CONFIG.listsetmobile : INIT_CONFIG.listsetpc,
    isPreview: !!queryParams.isPreview,
    corpid: queryParams.corpid,
    mode: +queryParams.mode,
    selectedGroup: '',
    selectedCs: '',
    unreadNums: {},
    onlineCs: '',
    listData: '' // {}
};

module.exports = function (state, action) {
    state = state || initialState;

    var newState = Object.assign({}, state);

    switch (action.type) {
        case actTypes.INIT_CS_LIST:

            var data = action.payload.data;
            newState.config = data.listset == false ? state.config : data.listset;
            newState.onlineCs = data.onlinecslist;
            newState.listData = data.cslist;
            // console.log(newState.config,'hhhh')
            return newState;
        case actTypes.SELECT_CS:
            newState.selectedGroup = action.payload.groupid;
            newState.selectedCs = action.payload.csid;
            return newState;
        case actTypes.CSLIST_UPDATE_UNREAD_NUMS:
            newState.unreadNums[action.payload.csid] = action.payload.num;
            return newState;
        default:
            return newState;
    }
};
