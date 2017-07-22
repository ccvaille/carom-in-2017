var connect = require('react-redux').connect;
var bindActionCreators = require('redux').bindActionCreators;
var appActs = require('../../../actions/app');
var inputActs = require('../../../actions/input');
var msgBoardActs = require('../../../actions/msgBoard');
var MobileSession = require('./MobileSession');

function mapStateToProps(state) {
    return {
        app: state.app,
        language: state.app.appData ? state.app.appData.language || 0 : 0,
        talkSet: state.app.appData ? state.app.appData.talkset || {} : {},
        isLeavingMsg: state.msgBoard.isLeavingMsg,
        isShowEmotion: state.input.isShowEmotion,
        tipText: state.input.tipText,
        isShowEmotion: state.input.isShowEmotion
    };
}

function mapDispatchToProps(dispatch) {
    return {
        appActs: bindActionCreators(appActs, dispatch),
        inputActs: bindActionCreators(inputActs, dispatch),
        msgBoardActs: bindActionCreators(msgBoardActs, dispatch)
    };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(MobileSession);

