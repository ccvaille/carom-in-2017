/*eslint-disable*/
var React = require('react');
var connect = require('react-redux').connect;
var consts = require('../../modules/const'),
    WINDOW_MODES = consts.WINDOW_MODES;

var Emotion = require('~cscommon/components/GuestUsedEmotions');
var loadingImg = require('~cscommon/images/loading.gif');

var PreviewPasteImg = require('~cscommon/components/PreviewPasteImg');
var Modal = require('~cscommon/components/Modal');

var appActs = require('../actions/app');
var inputActs = require('../actions/input');
var msgBoardActs = require('../actions/msgBoard');
var customMsgActs = require('../actions/customMsg');
var eventUtils = require('../utils/events');
var openQQ = require('../../utils/openQQ');
var appConstants = require('../constants/app');

require('../../utils/trim');
var domUtils = require('../../utils/dom');
var commDomUtils = require('~cscommon/utils/dom');
var textPos = require('~cscommon/utils/textPos');
var SendKeySetting = require('~cscommon/components/SendKeySetting');
var previewTimer,
    prevStartTime,
    bodyClickEvt;

var getLanguagePackage = require('../../utils/locale');

var isMobile = /(iPhone|iPod|Android|ios)/i.test(window.navigator.userAgent);

var offset = require('../utils/offset');

var Input = React.createClass({
    textPos: 0,
    getInitialState: function () {
        return {
            isShowPreviewImgModal: false,
            previewPasteImgSrc: '',
            previewPasteImgFile: '',
            sendSettingWrapperVisible: this.props.sendSettingWrapperVisible,
        }
    },
    componentDidMount: function () {
        bodyClickEvt = bodyClickEvt || function (e) {
            e = e || window.event;
            var targetEle = e.target || e.srcElement;
            var isShowEmotion = false;
            var cls = targetEle.className;
            if (cls === 'emotion') {
                this.showEmotions();
                eventUtils.stopPropagation(e);
                return;
            }
            if (
                ( cls.indexOf('face-ele') === -1 && cls !== 'facelist' && cls !== 'dFace' && cls !== 'faceCell' )
                ||
                !isMobile
            ) {
                this.hideEmotions();
            }

        }.bind(this);

        domUtils.addEvent(document.body, 'click', bodyClickEvt);

        if (window.FileReader) {
            document.addEventListener('paste', this.onPaste, false);
        }
    },
    componentWillUnmount: function () {
        bodyClickEvt && domUtils.removeEvent(document.body, 'click', bodyClickEvt);
    },
    onSendTextChange: function () {
        var textarea = this.refs.textarea;
        var value = textarea.value.trim();
        this.props.dispatch(inputActs.setTextValue(textarea.value));
        // 输入过程中每2.5s发送预显消息
        if (previewTimer) {
            return;
        }
        previewTimer = setTimeout(function () {
            var value = textarea.value.trim();
            this.props.dispatch(customMsgActs.sendPreviewMsg(value.slice(0, 120)));
            this.clearPreviewTimer();
        }.bind(this), 2500);
    },
    onKeyDown: function (e) {
        var $textarea = this.refs.textarea;
        var keyIndex = commDomUtils.localStorageFix.getItem('sendSettingKey') * 1 || 1;

        if (!e.ctrlKey && e.keyCode === 13 && keyIndex === 1) {
            this.sendTextMsg();
            e.preventDefault();
        } else if(e.ctrlKey && e.keyCode === 13 && keyIndex === 2) {
            this.sendTextMsg();
            e.preventDefault();
        } else if(e.ctrlKey && e.keyCode === 13 && keyIndex === 2) {
            this.sendTextMsg();
            e.preventDefault();
        } else if (keyIndex === 1 && e.ctrlKey && e.keyCode === 13) {
            $textarea.value += '\n';
            $textarea.scrollTop = 99999;
            this.props.dispatch(inputActs.setTextValue($textarea.value));
        }
    },
    onImageSelect: function (e) {
        var self = this;
        var target = document.getElementById('picfile');
        var file;
        var value;
        var $form = document.getElementById('picform');
        if (e.target.files && e.target.files.length) {
            file = e.target.files[0];
            value = e.target.value;
        } else {
            file = target.value;
            value = target.value;
        }
        if (!this.validateFile(value, file)) {
            return;
        }
        this.props.dispatch(inputActs.uploadPic(file));
        this.props.dispatch(appActs.updateTimeout());
    },
    validateFile: function (value, file) {
        if (!file || !file.size) {
            return false;
        }
        if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(value)) {
            alert('请您发送 gif、jpg、jpeg、png格式的图片，给您带来不便请谅解');
            $form.reset();
            return false;
        }
        if (window.File && file.size > 2 * 1024 * 1024) {
            alert('仅支持发送大小2M以下的图片');
            $form.reset();
            return false;
        }
        return true;
    },
    onInputFocus: function(e) {
        if (/Android/gi.test(navigator.userAgent)) {
            var fillbox = document.getElementById('fillbox');
            var msgList = document.getElementById('msg-list');
            // fillbox.className = "fillbox open";
            // msgList.style.height =  msgList.clientHeight - 100 + 'px';
            // document.getElementById('main').scrollTop = '99999px';
            // alert(document.getElementById('main').scrollTop)
            // console.log(document.getElementById('main'))
            // this.props.onScrollToBottom(9999);
            // console.log(msgList.style.height)
            // this.propps.fillBox();
        }
    },
    onInputBlur: function() {

    },
    onPaste: function (e) {
        if (!window.FileReader) {
            return false;
        }

        var evt = e || window.event;
        var imgItem;
        Array.from(evt.clipboardData.items).forEach(function (item) {
            // if (item.kind === 'string' && item.type === 'text/html') {
            //     htmlItem = item;
            // }
            if (item.kind === 'file' && item.type.indexOf('image/') === 0) {
                imgItem = item;
            }
        });

        if (imgItem) {
            var reader = new FileReader();
            var file = imgItem.getAsFile();

            if (!file || !file.size) {
                alert('图片粘贴失败，请使用图片上传功能发送图片');
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                alert('仅支持发送大小2M以下的图片');
                return false;
            }

            if (!this.validateFile('from-clipboard.png', file)) {
                return false;
            }
            reader.onload = function () {
                // this.result 可以得到图片的base64
                // document.querySelector('img').src = this.result;
                this.setState({
                    previewPasteImgSrc: reader.result,
                });
            }.bind(this);
            reader.readAsDataURL(file);
            this.setState({
                previewPasteImgFile: file,
            });
            this.showPreviewModal();
            // this.props.dispatch(chatInputActs.uploadPic(file));
        }
        return false;
    },
    clearPreviewTimer: function() {
        clearTimeout(previewTimer);
        previewTimer = undefined;
    },
    saveTextPos: function (e) {

        this.textPos = textPos.getTextPos(e.target);
        this.props.dispatch(inputActs.setIsShowEmotion(false));
    },
    selectEmotion: function (emotion) {
        var textarea = this.refs.textarea,
            value = textarea.value,
            pos = this.textPos || value.length,
            emotionText = '[' + emotion + ']',
            newVal = value.slice(0, pos) + emotionText + value.slice(pos);

        this.props.dispatch(inputActs.setTextValue(newVal));
        textarea.value = newVal;
        // if (!isMobile) {
            textarea.focus();
        // }
        textPos.setTextPos(textarea, pos + emotionText.length);
        this.textPos = pos + emotionText.length;
        // setTimeout(function () {
        //     textarea.focus();
        //     textPos.setTextPos(textarea, pos + emotionText.length);
        // }, 16);
    },
    showEmotions: function (e) {
        e = e || window.event;
        eventUtils.preventDefault(e);
        // e.preventDefault();
        if (this.props.app.networkStatus === appConstants.CONNECTION_STATUS.ONLINE) {
            if (this.props.input.isShowEmotion) {
                this.props.dispatch(inputActs.setIsShowEmotion(false));
            } else {
                this.props.dispatch(inputActs.setIsShowEmotion(true));
            }
        }
    },
    hideEmotions: function () {
        this.props.dispatch(inputActs.setIsShowEmotion(false));
    },
    sendTextMsg: function () {
        var languageType = this.props.app.appData ? this.props.app.appData.language : 0;
        var localeKey = getLanguagePackage(languageType);
        if (this.props.app.isLoading) {
            return;
        }
        if (this.refs.textarea.value.length > 200) {
            this.props.dispatch(inputActs.showSessTip(localeKey.msgLengthLimitTip));
            return;
        }
        var textarea = this.refs.textarea;
        var value = textarea.value.trim();
        if (value) {
            this.clearPreviewTimer();
            this.props.dispatch(inputActs.sendTextMsg(value));
            this.props.dispatch(appActs.updateTimeout());
        } else {
            this.props.dispatch(inputActs.showSessTip(localeKey.emptyContentTip));
        }

        textarea.focus();
    },
    keepSession: function (e) {
        e = e || window.event;
        eventUtils.preventDefault(e);
        var languageType = this.props.app.appData ? this.props.app.appData.language : 0;
        var localeKey = getLanguagePackage(languageType);
        var networkStatus = this.props.app.networkStatus;
        if (networkStatus === appConstants.CONNECTION_STATUS.OFFLINE) {
            this.props.dispatch(inputActs.showSessTip(localeKey.networkUnavailable));
        } else if (networkStatus === appConstants.CONNECTION_STATUS.ONLINE) {
            this.props.dispatch(appActs.checkCsStatus());
            this.props.dispatch(appActs.showKeepLoading(true));
        }
        // this.props.dispatch(appActs.keepSession());
    },
    leaveMsg: function (e) {
        e = e || window.event;
        eventUtils.preventDefault(e);
        this.props.dispatch(msgBoardActs.leaveingMsgBoard(true));
    },
    changeSendSettingWrapper: function (isShow) {
        this.props.changeSendSettingWrapper(isShow);
    },
    showSendSettingWrapper: function (e) {
        e.preventDefault();
        e.stopPropagation();
        // this.refs.sendSettingWrapper.style.display = 'block';
        this.props.changeSendSettingWrapper(true);
    },
    closeMsgBorad: function () {
        var isLeavingMsg = this.props.msgBoard.isLeavingMsg;
        if (!isLeavingMsg) {
            this.props.dispatch(appActs.endUpSession());
        }
        window.close();
    },
    connectQQ: function (csinfo) {
        // window.location = consts.SESSION_CONF.QQURL + csinfo.qq;
        this.props.dispatch(inputActs.hideSmallSession(csinfo, this.props.isSmallMode))
        // this.closeMsgBorad();
    },
    renderLeaveMsgTip: function () {
        var languageType = this.props.app.appData ? this.props.app.appData.language : 0;
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
    showPreviewModal: function () {
        this.setState({
            isShowPreviewImgModal: true
        });
    },
    hidePreviewModal: function () {
        this.setState({
            isShowPreviewImgModal: false
        });
    },
    renderPreviewPastImg: function () {
        return (
            <Modal
                wrapClassName="guest-preview-paste"
                visible={ this.state.isShowPreviewImgModal }
                width={ Math.min((window.innerWidth || (document.body || document.documentElement).clientWidth) * 0.8, 520) }
                onCancel={ this.hidePreviewModal }
                title="是否发送图片"
            >
                <PreviewPasteImg
                    src={ this.state.previewPasteImgSrc }
                    onSend={ this.sendPasteImg }
                    onCancel={ this.hidePreviewModal }
                />
            </Modal>
        );
    },
    sendPasteImg: function () {
        this.hidePreviewModal();
        if (this.props.app.isLoading) {
            return;
        }
        this.props.dispatch(inputActs.uploadPic(this.state.previewPasteImgFile));
    },
    render: function () {
        var tipText = this.props.input.tipText;
        var isStandardWindow = this.props.app.windowMode === WINDOW_MODES.STANDARD;
        var close = { closeMsgBorad: this.closeMsgBorad, showClose: isStandardWindow };

        var languageType = 0;
        var csinfo;

        if (this.props.app.appData) {
            languageType = this.props.app.appData.language;
            csinfo = this.props.app.appData.csinfo;
        }

        var localeKey = getLanguagePackage(languageType);

        isMobile && (close.showClose = false);

        return (
            <div className="input">
            {
                tipText ?
                <div className="session-tip">
                    <p>{ tipText }</p>
                </div>
                : null
            }
                <div className="input-box">
                    <textarea
                        ref="textarea"
                        onChange={ this.onSendTextChange }
                        onKeyDown={ this.onKeyDown }
                        onKeyUp={ this.saveTextPos }
                        onClick={ this.saveTextPos }
                        onFocus= { this.onInputFocus }
                        onBlur = { this.onInputBlur }
                        value={ this.props.input.text }
                        readOnly={ this.props.app.isLoading }
                        ></textarea>

                    {
                        this.props.app.showCsOffline || this.props.app.showLeaveMsg ? null : (
                            <div className="tools">
                                <a className="emotion" href="javascript:;" title="表情" onClick={ this.showEmotions }></a>
                                <span className="pic" title="图片">
                                    <form id="picform" encType="multipart/form-data">
                                        <input
                                            id="picfile"
                                            type="file"
                                            accept="image/png,image/jpg,image/jpeg,image/gif"
                                            onChange={ this.onImageSelect }
                                        />
                                    </form>
                                </span>
                                {
                                    csinfo && csinfo.showqq === 1 ? (
                                        <div className="icon icon-qq" title="QQ会话" onClick={this.connectQQ.bind(this, csinfo)}>
                                        </div>
                                    ) : null
                                }
                            </div>
                        )
                    }

                    <div className="faceCell" style={ { display: !this.props.input.isShowEmotion || this.props.app.showCsOffline || this.props.app.showLeaveMsg ? 'none' : 'block' } }>
                        <Emotion onSelect={ this.selectEmotion } />
                    </div>
                </div>

                {
                    this.props.app.showKeepLoading || this.props.app.showCsOffline || this.props.app.showLeaveMsg ? null : (
                        <SendKeySetting
                            changeSendSettingWrapper={this.changeSendSettingWrapper}
                            sendTextMsg={this.sendTextMsg}
                            sendSettingWrapperVisible={this.props.sendSettingWrapperVisible}
                            localeKey={localeKey}
                            close={close}
                        />
                    )
                }

                {
                    (this.props.app.showCsOffline && !this.props.app.showKeepLoading) ? this.renderCsOfflineTip() : null
                }

                {
                    (this.props.app.showLeaveMsg && !this.props.app.showKeepLoading) ? this.renderLeaveMsgTip() : null
                }

                {
                    this.props.app.showKeepLoading ? this.renderKeepLoading() : null
                }
                {
                    this.renderPreviewPastImg()
                }
            </div>
        );
    }
});

module.exports = connect(function (state) {
    return {
        app: state.app,
        input: state.input,
        msgBoard: state.msgBoard
    };
})(Input);
