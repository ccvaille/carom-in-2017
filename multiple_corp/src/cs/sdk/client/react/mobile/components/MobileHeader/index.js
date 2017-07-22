var MobileHeader = require('./MobileHeader');
var connect = require('react-redux').connect;

function mapStateToProps(state) {
    return {
        csInfo: state.csInfo,
        talkTitle: state.app.appData ? (state.app.appData.talkset.title || '') : '',
    }
}

module.exports = connect(mapStateToProps)(MobileHeader);
