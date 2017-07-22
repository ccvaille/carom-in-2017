var React = require('react');
var FastClick = require('fastclick');

var loadingImg = require('~cscommon/images/loading.gif');
var domUtils = require('utils/dom');
var getLanguagePackage = require('utils/locale');
var ButtonModeType = require('modules/ButtonModeType');
var appConstants = require('react/constants/app');
// var LeaveMsgBoard = require('react/components/LeaveMsgBoard');
var MobileHeader = require('../../components/MobileHeader');
var MsgList = require('react/components/MsgList');
var MobileInput = require('../../containers/MobileInput');
var MobileMsgBoard = require('../../containers/MobileMsgBoard');
var classNames = require('classnames');
// require('./session-mobile.less');

var headerHeight = 50;
var msgListMinDelta = 51;
var msgListMaxDelata = 163;
var isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
var isUC = /UCBrowser/.test(navigator.userAgent);

var MobileSession = React.createClass({
    getInitialState: function () {
        var windowHeight = domUtils.getWindowHeight();
        return {
            inputFocused: false,
            msgListHeight: windowHeight - msgListMinDelta - headerHeight,
            needFixAndroidResize: false
        }
    },

    componentDidMount: function() {
        FastClick.attach(document.body);
        domUtils.addEvent(document.querySelector('.cs-session-mobile'), 'click', this.onBodyClick);
        domUtils.addEvent(window, 'resize', this.onWindowResize);
        if (!isUC || !isiOS) {
            domUtils.addClass(document.body, 'is-not-uc');
        }
        this.props.appActs.init();
    },

    componentWillReceiveProps: function(nextProps) {
        if (nextProps.isShowEmotion !== this.props.isShowEmotion) {
            if (nextProps.isShowEmotion) {
                this.setMsgListHeight(msgListMaxDelata);
                domUtils.addClass(document.body,'fixfixed');

            } else {
                this.setMsgListHeight(msgListMinDelta);
                domUtils.removeClass(document.body,'fixfixed');
            }

        }
    },

    componentWillUnmount: function () {
        domUtils.removeEvent(document.querySelector('.cs-session-mobile'), 'click', this.onBodyClick);
        domUtils.removeEvent(window, 'resize', this.onWindowResize);
    },

    onWindowResize: function() {
        if (this.props.isShowEmotion) {
            this.setMsgListHeight(msgListMaxDelata);
        } else {
            this.setMsgListHeight(msgListMinDelta);
        }
    },

    onInputFocus: function(e) {
        // 4.4.4 华为原生浏览器 hack
        var windowHeight = domUtils.getWindowHeight();
        var target = e.target;
        setTimeout(function() {
            if (isiOS && isUC) {
                window.scrollTo(0, document.body.scrollHeight);
            }
        }, 500);
        setTimeout(function() {
            if (isiOS || document.activeElement === target) {
                return;
            }
            var newHeight = domUtils.getWindowHeight();
            if (newHeight === windowHeight) {
                this.setState({
                    msgListHeight: windowHeight - 280 - headerHeight,
                    needFixAndroidResize: true,
                });
            }
        }.bind(this), 650);

        this.setState({
            inputFocused: true,
        });
        domUtils.addClass(document.body, 'fixfixed');
    },

    onInputBlur: function() {
        // 4.4.4 华为原生浏览器 hack
        var windowHeight = domUtils.getWindowHeight();

        setTimeout(function() {
            if (isiOS) {
                return;
            }
            var newHeight = domUtils.getWindowHeight();
            if (newHeight === windowHeight) {
                this.setState({
                    msgListHeight: windowHeight - headerHeight - 61,
                });
            }
        }.bind(this), 650);

        this.setState({
            inputFocused: false,
            needFixAndroidResize: false,
        });
        domUtils.removeClass(document.body, 'fixfixed');
    },

    onBodyClick: function(e) {
        e = e || window.event;
        var targetEle = e.target || e.srcElement;
        var isShowEmotion = false;
        var cls = targetEle.className;
        var textarea = document.getElementById('mobile-input-area');
        var activeElement = document.activeElement;

        // if (
        //     targetEle !== textarea &&
        //     (targetEle.tagName !== 'INPUT' || targetEle.tagName !== 'TEXTAREA')
        // ) {
        //     activeElement.blur();
        // }
        if (cls === 'emotion') {
            this.showEmotions();
            e.stopPropagation();
            return;
        }

        if (
            cls.indexOf('face-ele') === -1
            && cls !== 'facelist'
            && cls !== 'dFace'
            && cls !== 'faceCell'
            && cls.indexOf('btn-send') === -1
        ) {
            this.hideEmotions();
        }
    },

    onScrollToFixY: function (posY) {
        var $main = this.refs.main;
        $main.scrollTop = posY + $main.scrollTop;
    },

    showEmotions: function(e) {
        if (e) {
            e.preventDefault();
        }
        if (this.props.app.networkStatus === appConstants.CONNECTION_STATUS.ONLINE) {
            if (this.props.isShowEmotion) {
                this.props.inputActs.setIsShowEmotion(false);
                domUtils.addClass(document.body,'fixfixed');
            } else {
                this.props.inputActs.setIsShowEmotion(true);

            }
        }
    },

    hideEmotions: function() {
       this.props.inputActs.setIsShowEmotion(false);
    },

    keepSession: function (e) {
        e.preventDefault();
        var languageType = this.props.language;
        var localeKey = getLanguagePackage(languageType);
        var networkStatus = this.props.app.networkStatus;
        if (networkStatus === appConstants.CONNECTION_STATUS.OFFLINE) {
            this.props.inputActs.showSessTip(localeKey.networkUnavailable);
        } else if (networkStatus === appConstants.CONNECTION_STATUS.ONLINE) {
            this.props.appActs.checkCsStatus();
            this.props.appActs.showKeepLoading(true);
        }
    },

    leaveMsg: function (e) {
        e.preventDefault();
        this.props.msgBoardActs.leaveingMsgBoard(true);
    },

    setMsgListHeight: function(delta) {
        var windowHeight = domUtils.getWindowHeight();
        this.setState({
            msgListHeight: windowHeight - delta - headerHeight
        });
    },

    goQQ: function () {
        var csinfo = this.props.app.appData.csinfo;
        this.props.inputActs.goQQMobile(csinfo)
    },

    renderLeaveMsgTip: function () {
        var languageType = this.props.language;
        var localeKey = getLanguagePackage(languageType);

        return (
            <div className="offline-tip">
                {localeKey.leaveMsgPrev}
                <a className="keep-session" href="javascript:;" onClick={ this.keepSession }>{localeKey.continueTalk}</a>
                {/* {localeKey.or}
                <a className="leave-msg" href="javascript:;" onClick={ this.leaveMsg }>{localeKey.leaveMsg}</a>
                */}
            </div>
        );
    },

    renderCsOfflineTip: function () {
        var languageType = this.props.app.appData ? this.props.app.appData.language : 0;
        var localeKey = getLanguagePackage(languageType);

        return (
            <div className="offline-tip">
                {localeKey.csOfflineTip}
                <a className="leave-msg" href="javascript:;" onClick={ this.leaveMsg }>{localeKey.csOfflineMsg}</a>
            </div>
        );
    },

    renderKeepLoading: function () {
        return (
            <div className="offline-tip">
                <img src={loadingImg} alt="" />
            </div>
        );
    },

    render: function() {
        var tipText = this.props.tipText;
        var isLeavingMsg = this.props.isLeavingMsg;
        // 配置信息 props.app.appData.talkset
        var modeClasses = 'cs-session cs-session-small cs-session-mobile';
        var inputWrapperClasses = classNames({
            'mobile-input': true,
            'input-focused': this.state.inputFocused,
            'fix-android-focus': this.state.needFixAndroidResize
        });
        var inputNode = null;

        if (!this.props.app.showKeepLoading && this.props.app.showCsOffline) {
            inputNode = this.renderCsOfflineTip();
        } else if (!this.props.app.showKeepLoading && this.props.app.showLeaveMsg) {
            inputNode = this.renderLeaveMsgTip();
        } else if (this.props.app.showKeepLoading) {
            inputNode = this.renderKeepLoading();
        } else {
            inputNode = (
                <MobileInput
                    onInputFocus={this.onInputFocus}
                    onInputBlur={this.onInputBlur}
                    showEmotions={this.showEmotions}
                    goQQ={this.goQQ}
                />
            );
        }

        switch (this.props.talkSet.color) {
            case ButtonModeType.CORNFLOWER_BLUE:
                modeClasses += ' cornflower-blue';
                break;
            case ButtonModeType.OCEAN_GREEN:
                modeClasses += ' ocean-green';
                break;
            case ButtonModeType.FIRE_BUSH:
                modeClasses += ' fire-bush';
                break;
            case ButtonModeType.OLIVE_DRAB:
                modeClasses += ' olive-drab';
                break;
            case ButtonModeType.AMETHYST:
                modeClasses += ' amethyst';
                break;
            case ButtonModeType.HAVELOCK_BLUE:
                modeClasses += ' havelock-blue';
                break;
            case ButtonModeType.CARNATION:
                modeClasses += ' carnation';
                break;
            case ButtonModeType.SHIP_COVE:
                modeClasses += ' ship-cove';
                break;
            default:
                break;
        }

        return (
            <div className={modeClasses}>
                <MobileHeader
                    endUpSession={this.props.appActs.endUpSession}
                    isLeavingMsg={isLeavingMsg}
                />
                <div className="main" ref="main">
                    {
                        isLeavingMsg
                        ?
                        <MobileMsgBoard onScrollToFixY={this.onScrollToFixY} />
                        :
                        <div className="session">
                            <MsgList style={
                                {
                                    height: this.state.msgListHeight
                                }
                            }/>
                            <div className={inputWrapperClasses}>
                                {
                                    tipText ?
                                    <div className="session-tip">
                                        <p>{tipText}</p>
                                    </div>
                                    : null
                                }
                                {inputNode}
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
});

module.exports = MobileSession;
