var React = require('react');
var connect = require('react-redux').connect;

var Header = require('../components/Header');
var Notice = require('../components/Notice');
var MsgList = require('../components/MsgList');
var Input = require('../components/Input');
var LeaveMsgBoard = require('../components/LeaveMsgBoard');
var CsInfo = require('../components/CsInfo');

var consts = require('../../modules/const'),
    WINDOW_MODES = consts.WINDOW_MODES;

var getLanguagePackage = require('../../utils/locale');
var appActs = require('../actions/app');
var inputActs = require('../actions/input');

var ButtonModeType = require('../../modules/ButtonModeType');

var domUtils = require('../../utils/dom');

// var dropPreventFn = function(e) {
//     e = e || event;
//     e.preventDefault();
// };

var Session = React.createClass({
    getInitialState: function () {
        return {
            sendSettingWrapperVisible: false,
            noticeWidth: 0
        }
    },
    componentDidMount: function () {
        domUtils.addEvent(window, 'dragover', this.dropPreventFn, false);
        domUtils.addEvent(window, 'drop', this.dropPreventFn, false);
        domUtils.addEvent(window, 'resize', this.onResize);
        this.setState({
            noticeWidth: this.refs.csSession.offsetWidth * 0.7 - 2
        })
        // window.addEventListener('dragover', this.dropPreventFn, false);
        // window.addEventListener('drop', this.dropPreventFn, false);
        this.props.dispatch(appActs.init());
    },
    componentWillUnmount: function () {
        domUtils.removeEvent(window, 'dragover', this.dropPreventFn, false);
        domUtils.removeEvent(window, 'drop', this.dropPreventFn, false);
        domUtils.removeEvent(window, 'resize', this.onResize);
        // window.removeEventListener('dragover', this.dropPreventFn);
        // window.removeEventListener('drop', this.dropPreventFn);
    },

    onResize: function () {
        this.setState({
            noticeWidth: this.refs.csSession.offsetWidth * 0.7 - 2
        });
    },

    dropPreventFn: function(e) {
        e = e || event;
        e.preventDefault();

        var files = (e.dataTransfer && e.dataTransfer.files) || e.target.files;
        var languageType = this.props.app.appData ? this.props.app.appData.language : 0;
        var localeKey = getLanguagePackage(languageType);

        if (files && (files.length || files.length)) {
            var mimeType = files[0].type;

            if (mimeType.indexOf('image') === -1) {
                this.props.dispatch(inputActs.showSessTip(localeKey.fileLimitTip));
            }
        }
    },

    hideSendSettingWrapper: function () {
        this.setState({
            sendSettingWrapperVisible: false,
        });
    },
    changeSendSettingWrapper: function (isShow) {
        this.setState({
            sendSettingWrapperVisible: isShow,
        });
    },
    onScrollToFixY: function (posY) {
        var $main = this.refs.main;
        $main.scrollTop = posY + $main.scrollTop;

    },
    onScrollToBottom: function(posY) {

        // var $main = this.refs.main;
        // $main.scrollTop = 3000 || posY;
    },
    render: function () {
        var isShowingNotice = this.props.notice.isShowingNotice;
        var notice = this.props.notice;
        var isLeavingMsg = this.props.msgBoard.isLeavingMsg;
        var isMobile = this.props.app.isMobile;
        var windowMode = this.props.app.windowMode;
        var talkSet = this.props.app.appData ? this.props.app.appData.talkset : {};


        var modeCls = 'cs-session-standard';
        var isSmallMode = false;
        switch (windowMode) {
            case WINDOW_MODES.STANDARD:
                modeCls = 'cs-session-standard';
                break;
            case WINDOW_MODES.SMALL:
                modeCls = 'cs-session-small';
                isSmallMode = true;
                break;
        }
        if (isMobile) {
            modeCls = 'cs-session-small cs-session-mobile';
        }

        // 配置信息 props.app.appData.talkset
        switch (talkSet.color) {
            case ButtonModeType.CORNFLOWER_BLUE:
                modeCls += ' cornflower-blue';
                break;
            case ButtonModeType.OCEAN_GREEN:
                modeCls += ' ocean-green';
                break;
            case ButtonModeType.FIRE_BUSH:
                modeCls += ' fire-bush';
                break;
            case ButtonModeType.OLIVE_DRAB:
                modeCls += ' olive-drab';
                break;
            case ButtonModeType.AMETHYST:
                modeCls += ' amethyst';
                break;
            case ButtonModeType.HAVELOCK_BLUE:
                modeCls += ' havelock-blue';
                break;
            case ButtonModeType.CARNATION:
                modeCls += ' carnation';
                break;
            case ButtonModeType.SHIP_COVE:
                modeCls += ' ship-cove';
                break;
            default:
                break;
        }

        return (
            <div ref="csSession" className={ 'cs-session ' + modeCls } onClick={this.hideSendSettingWrapper}>
                <Header isSmallMode={isSmallMode} />
                <div className="main" ref="main">
                    <div className="session" style={ { display: isLeavingMsg ? 'none' : 'block' } }>
                    {
                        isShowingNotice && !isSmallMode ?
                        <Notice notice={notice} style={{ width: this.state.noticeWidth }} /> : null
                    }
                        <MsgList isShowNotice={isShowingNotice && !isSmallMode} noticeContent={notice.noticeContent} />
                        <Input
                            sendSettingWrapperVisible={this.state.sendSettingWrapperVisible}
                            changeSendSettingWrapper={this.changeSendSettingWrapper}
                            onScrollToBottom = { this.onScrollToBottom }
                            isSmallMode={isSmallMode}
                        />
                        <div id="fillbox"></div>
                    </div>
                    <LeaveMsgBoard onScrollToFixY={this.onScrollToFixY} />
                </div>
                <CsInfo />
            </div>
        )
    }
});

module.exports = connect(function (state) {
    return {
        notice: state.notice,
        app: state.app,
        msgBoard: state.msgBoard
    };
})(Session);
