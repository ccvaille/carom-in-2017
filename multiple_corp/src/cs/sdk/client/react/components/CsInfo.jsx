var React = require('react');
var connect = require('react-redux').connect;
var getLanguagePackage = require('../../utils/locale');
var defaultCsAvatar = require('~cscommon/images/default-cs.png');
var appConstants = require('../constants/app');

var CsInfo = React.createClass({
    fixCsAvatar: function (e) {
        if (this.props.networkStatus === appConstants.CONNECTION_STATUS.OFFLINE) {
            return;
        }
        if (e.target.src === defaultCsAvatar) {
            return;
        }

        e.target.src = defaultCsAvatar;
    },
    render: function () {
        var csInfo = this.props.csInfo;
        var languageType = this.props.language;
        var localeKey = getLanguagePackage(languageType);
        return (
            <div className="cs-info">
                <p className="detail info-avatar">
                    <img src={ csInfo.pic.indexOf('http') === 0 ? csInfo.pic : 'http:' + csInfo.pic } onError={ this.fixCsAvatar } />
                </p>
                <p className="detail info-name">
                    <a>{ csInfo.name }</a>
                </p>
                <p className="detail info-pos">
                    <span className="key">{localeKey.position}：</span>
                    <span className="value">{ csInfo.pos }</span>
                </p>
                <p className="detail info-tel">
                    <span className="key">{localeKey.tel}：</span>
                    <span className="value">{ csInfo.tel }</span>
                </p>
                <p className="detail info-cel">
                    <span className="key">{localeKey.mobile}：</span>
                    <span className="value">{ csInfo.cel }</span>
                </p>
                <p className="detail info-email">
                    <span className="key">{localeKey.email}：</span>
                    <span className="value">{ csInfo.email }</span>
                </p>
            </div>
        );
    }
});

module.exports = connect(function (state) {
    var language = state.app.appData ? state.app.appData.language : 0;
    return {
        networkStatus: state.app.networkStatus,
        language: language,
        csInfo: state.csInfo,
    };
})(CsInfo);
