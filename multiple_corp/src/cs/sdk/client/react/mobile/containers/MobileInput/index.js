var connect = require('react-redux').connect;
var bindActionCreators = require('redux').bindActionCreators;
var appActs = require('../../../actions/app');
var inputActs = require('../../../actions/input');
var msgBoardActs = require('../../../actions/msgBoard');
var customMsgActs = require('../../../actions/customMsg');
var MobileInput = require('./MobileInput');

function mapStateToProps(state) {
    return {
        app: state.app,
        input: state.input
    };
}

function mapDispatchToProps(dispatch) {
    return {
        appActs: bindActionCreators(appActs, dispatch),
        inputActs: bindActionCreators(inputActs, dispatch),
        msgBoardActs: bindActionCreators(msgBoardActs, dispatch),
        customMsgActs: bindActionCreators(customMsgActs, dispatch),
    };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(MobileInput);
