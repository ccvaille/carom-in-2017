var connect = require('react-redux').connect;
var bindActionCreators = require('redux').bindActionCreators;
var InputTools = require('./InputTools');


function mapStateToProps(state) {
    return {
        app: state.app,
        input: state.input
    };
}

module.exports = connect(mapStateToProps)(InputTools);
