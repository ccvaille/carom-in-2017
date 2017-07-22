/*eslint-disable */
var initialState = {
    text: '加载中...',
    textCopy: '',
    isShowEmotion: false,
    tipText: ''
};

var actTypes = require('../actions/input').actTypes;

module.exports = function (state, action) {
    state = state || initialState;

    var newState = Object.assign({}, state);

    switch (action.type) {
        case actTypes.SET_TEXT_VALUE:
            newState.text = action.payload.value;
            newState.textCopy = action.payload.value;
            return newState;
        case actTypes.SET_TIP_TEXT:
            newState.tipText = action.payload.tipText;
            return newState;
        case actTypes.SET_IS_SHOW_EMOTION:
            newState.isShowEmotion = action.payload.isShowEmotion;
        default:
            return newState;
    }

};
