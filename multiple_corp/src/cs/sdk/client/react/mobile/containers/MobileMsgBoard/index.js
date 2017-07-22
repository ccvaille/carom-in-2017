var connect = require('react-redux').connect;
var bindActionCreators = require('redux').bindActionCreators;
var msgBoardActs = require('../../../actions/msgBoard');

var MobileMsgBoard = require('./MobileMsgBoard');


function mapStateToProps(state) {
    return {
        app: state.app,
        msgBoard: state.msgBoard
    };
}

function mapDispatchToProps(dispatch) {
    return {
        msgBoardActs: bindActionCreators(msgBoardActs, dispatch),
    };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(MobileMsgBoard);
