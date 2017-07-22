var React = require('react');
var connect = require('react-redux').connect;


var Emotion = require('~cscommon/components/GuestUsedEmotions');

require('utils/trim');
var domUtils = require('utils/dom');
var commDomUtils = require('~cscommon/utils/dom');
var textPos = require('~cscommon/utils/textPos');

var getLanguagePackage = require('utils/locale');

var isMobile = /(iPhone|iPod|Android|ios)/i.test(window.navigator.userAgent);

var offset = require('react/utils/offset');
var InputTools = require('../InputTools');
var bodyClickEvt;

var previewTimer,
    prevStartTime;

var MobileInput = React.createClass({
    textPos: 0,

    getInitialState: function () {
        var windowWidth = domUtils.getWindowWidth();
        return {
            textareaWidth: windowWidth - 136 - 30
        }
    },

    onInputFocus: function(e) {
        // this.hideEmotions();
        this.saveTextPos(e);
        this.props.onInputFocus(e);
        // setTimeout( function(){ window.scrollTo(0, 1) }, 100);
    },

    onInputBlur: function(e) {
        this.saveTextPos(e);
        this.props.onInputBlur(e);
    },

    onSendTextChange: function () {
        var textarea = this.refs.textarea;
        var value = textarea.value.trim();
        this.props.inputActs.setTextValue(textarea.value);
        // 输入过程中每2.5s发送预显消息
        if (previewTimer) {
            return false;
        }
        previewTimer = setTimeout(function () {
            var value = textarea.value.trim();
            this.props.customMsgActs.sendPreviewMsg(value.slice(0, 120));
            this.clearPreviewTimer();
        }.bind(this), 2500);
    },

    onEmojiSelected: function(emotion) {
       var textarea = this.refs.textarea;
       var value = textarea.value;
       var pos = this.textPos || value.length;
       var emotionText = '[' + emotion + ']';
       var newVal = value.slice(0, pos) + emotionText + value.slice(pos);

        this.props.inputActs.setTextValue(newVal);
        textarea.value = newVal;
        // textPos.setTextPos(textarea, pos + emotionText.length);
        this.textPos = pos + emotionText.length;
        // textarea.blur();
        // this.textPos = textPos.getTextPos(textarea);
        // textarea.focus();
        // textPos.setTextPos(textarea, pos + emotionText.length);
        if (textarea.scrollHeight > 30) {
            textarea.scrollTop = textarea.scrollHeight;
        }
    },

    // bodyClickEvt: function(e) {
    //     e = e || window.event;
    //     var targetEle = e.target || e.srcElement;
    //     var isShowEmotion = false;
    //     var cls = targetEle.className;
    //     if (targetEle !== this.refs.textarea) {
    //         this.refs.textarea.blur();
    //     }
    //     if (cls === 'emotion') {
    //         this.showEmotions();
    //         e.stopPropagation();
    //         return;
    //     }
    //     if (
    //         cls !== 'face-ele'
    //         && cls !== 'facelist'
    //         && cls !== 'dFace'
    //         && cls !== 'faceCell'
    //         && cls.indexOf('btn-send') === -1
    //     ) {
    //         this.hideEmotions();
    //     }
    // },

    clearPreviewTimer: function() {
        clearTimeout(previewTimer);
        previewTimer = undefined;
    },

    saveTextPos: function(e) {
        // 现在选择表情后不操作输入框，this.textPos 会比从输入框获取的位置要大，判断一下
        // 不过这个问题一般是不需要处理的，因为手机在 focus 的时候都会自动到最后去
        var tempPos = textPos.getTextPos(e.target);
        this.textPos = this.textPos > tempPos ? this.textPos : textPos.getTextPos(e.target);
        // this.props.dispatch(inputActs.setIsShowEmotion(false));
    },

    sendTextMsg: function () {
        var languageType = this.props.app.appData ? this.props.app.appData.language : 0;
        var localeKey = getLanguagePackage(languageType);
        if (this.props.app.isLoading) {
            return false;
        }
        if (this.refs.textarea.value.length > 200) {
            this.props.inputActs.showSessTip(localeKey.msgLengthLimitTip);
            return false;
        }
        var textarea = this.refs.textarea;
        var value = textarea.value.trim();
        if (!value) {
            this.props.inputActs.showSessTip(localeKey.emptyContentTip);
            textarea.focus();
            return false;
        }
        this.props.inputActs.sendTextMsg(value);
        this.props.appActs.updateTimeout();

        // 仿 QQ 微信行为，在选择表情后发送不 focus 输入框
        if (!this.props.input.isShowEmotion) {
            textarea.focus();
        }
    },

    render: function() {
        var languageType = this.props.app.appData ? this.props.app.appData.language : 0;
        var localeKey = getLanguagePackage(languageType);
        return (
            <div className="input-wrapper">
                <div className="input-box">
                    <InputTools
                        showEmotions={this.props.showEmotions}
                        sendTextMsg={this.sendTextMsg}
                        uploadPic={this.props.inputActs.uploadPic}
                        updateTimeout={this.props.appActs.updateTimeout}
                        goQQ={this.props.goQQ}
                    />
                    <textarea
                        id="mobile-input-area"
                        ref="textarea"
                        onChange={this.onSendTextChange}
                        onKeyUp={this.saveTextPos}
                        onClick={this.saveTextPos}
                        onFocus= {this.onInputFocus}
                        onBlur={this.onInputBlur}
                        value={this.props.input.text}
                        readOnly={this.props.app.isLoading}
                        style={{
                            width: this.state.textareaWidth
                        }}
                    >
                    </textarea>
                    <a className="btn btn-send" onClick={this.sendTextMsg}>
                    {localeKey.send}
                </a>
                </div>

                <div className="faceCell" style={{ display: !this.props.input.isShowEmotion || this.props.app.showCsOffline || this.props.app.showLeaveMsg ? 'none' : 'block' }}>
                    <Emotion onSelect={this.onEmojiSelected} />
                </div>
            </div>
        );
    }
});

module.exports = MobileInput;
