var React = require('react');
var connect = require('react-redux').connect;
var defaultCsAvatar = require('~cscommon/images/default-cs.png');
var appConstants = require('../constants/app');

var Header = React.createClass({
    minify: function () {

    },
    fixCsAvatar: function (e) {
        if (this.props.networkStatus === appConstants.CONNECTION_STATUS.OFFLINE) {
            return;
        }
        if (e.target.src === defaultCsAvatar) {
            return;
        }
        e.target.src = defaultCsAvatar;
    },
    closeWindow: function () {
        window.close();
    },
    returnPage: function () {
        //if (window.history) {
            window.history.go(-1);
        //}
        //else {
        //    location.href = document.referrer;
        //}
    },
    render: function () {
        var csInfo = this.props.csInfo;
        var talkTitle = this.props.talkset.title;
        var isSmallMode = this.props.isSmallMode;
        // csInfo.pic

        //     <span className="min" onClick={ this.minify }>_</span>
        return (
            <div className="header">
                {
                    document.referrer ? (
                        <div className="return" onClick={ this.returnPage }>
                            <a className="arrow-left icon" href="javascript:;"></a>
                        </div>
                    ) : null
                }
                {
                    isSmallMode
                    ?
                    <img className="avatar" src={ csInfo.pic.indexOf('http') === 0 ? csInfo.pic : 'http:' + csInfo.pic } onError={ this.fixCsAvatar } />
                    : null
                }
                <div className="name" href="javascipt:;">
                    <p>{ csInfo.name }</p>
                    <p className="talk-title">{talkTitle}</p>
                </div>
                <p className="ctrls">

                    <a className="close" href="javascript:;" onClick={ this.closeWindow }>×</a>
                </p>
            </div>
        );
    }
});

module.exports = connect(function (state) {
    return {
        app: state.app.networkStatus,
        csInfo: state.csInfo,
        msgs: state.msgs,
        talkset: state.app.appData ? state.app.appData.talkset : { title: '' },
    };
})(Header);
