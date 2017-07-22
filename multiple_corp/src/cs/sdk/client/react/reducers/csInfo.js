/*eslint-disable */
// var Immutable = require('immutable');
var actTypes = require('../actions/csInfo').actTypes;
var defaultCsAvatar = require('~cscommon/images/default-cs.png');
var initialState = {
    pic: defaultCsAvatar,
    name: '加载中...',
    pos: '',
    tel: '',
    cel: '',
    email: ''
};

module.exports = function (state, action) {
    state = state || initialState;

    var newState = Object.assign({}, state);

    switch (action.type) {
        case actTypes.SET_CS_INFO:
            var csInfo = action.payload.data;

            newState.pic = csInfo.face;
            newState.name = csInfo.showname;
            newState.pos = csInfo.job;
            newState.tel = csInfo.tel;
            newState.cel = csInfo.mobile;
            newState.email = csInfo.email;

            return newState;;

        default:
            return newState;;
    }
    // return Immutable.fromJS(newState).toJS();
};
