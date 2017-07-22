var React = require('react');
var FormInput = require('react/mobile/components/FormInput/');
var getLanguagePackage = require('utils/locale');
// var successCheck = require('imgs/success-check.png');
var successCheck = require('imgs/submit-success-pc.png');
var offset = require('react/utils/offset');
var domUtils = require('utils/dom');
var windowHeight = domUtils.getWindowHeight();


var MobileMsgBoard = React.createClass({
    getInitialState: function () {
        return {
            getMsgBoardHeight: windowHeight - 50,
            focusElemOffsetHeight: 0
        }
    },
    componentDidMount: function() {
        domUtils.addEvent(window, 'resize', this.onWindowResize);
    },
    componentWillUnmount: function () {
        domUtils.removeEvent(window, 'resize', this.onWindowResize);
    },
    setInputValue: function (e) {
        var name = e.target.name;
        var value = e.target.value;

        this.props.msgBoardActs.setInputValue(name, value);
    },

    submitMsgBoard: function () {
        this.props.msgBoardActs.validateForm();
    },

    validateInput: function (e, name) {
        var index = this.props.msgBoard.msgBoardForm.eles.findIndex(function (ele) {
            return ele.name === name;
        });
        this.props.msgBoardActs.validateInput(name, index);
    },

    changeCodeImage: function () {
        this.props.msgBoardActs.changeCode();
    },

    hideTip: function (name) {
        var index = this.props.msgBoard.msgBoardForm.eles.findIndex(function (ele) {
            return ele.name === name;
        });
        this.props.msgBoardActs.setInputTip(index, '');
    },

    focusInput: function (index) {
        var input = 'input' + index;
        this.refs[input].focus();
    },

    onInputFocus: function (e) {
        if (/Android/gi.test(navigator.userAgent)) {
            // var $input = e.target;
            var box = offset(e.target);
            var value = box.top;
            // this.props.onScrollToFixY(value - 50)
            this.setState({
                focusElemOffsetHeight: value - 50
            });
        }
    },
    onWindowResize: function() {
        var nowWindowHeight = domUtils.getWindowHeight();
        if (windowHeight - nowWindowHeight > 0){
            this.setState({
                getMsgBoardHeight: windowHeight - 280,
            });
        } else {
            this.setState({
                getMsgBoardHeight: windowHeight - 50,
            });
        }
        this.refs.msgBoard.scrollTop = this.state.focusElemOffsetHeight;
    },
    leaveMsgAgain: function () {
        var values = {
            title: '',
            name: '',
            tel: '',
            qq: '',
            email: '',
            note: '',
            code: ''
        };

        this.props.msgBoardActs.resetSetInputValue(values);
        this.props.msgBoardActs.setFormSubmited(false);
    },
    renderForm: function () {
        var isLeavingMsg = this.props.msgBoard.isLeavingMsg;
        var isSubmitting = this.props.msgBoard.isSubmitting;
        var msgBoardForm = this.props.msgBoard.msgBoardForm;
        var msgBoardValues = this.props.msgBoard.values;

        // var languageType = this.props.app.appData ? this.props.app.appData.language : 0;
        var languageType = 0;
        var leaveMsgNotice = '';
        if (this.props.app.appData) {
            languageType = this.props.app.appData.language;
            leaveMsgNotice = this.props.app.appData.talkset.noticemsg === '' ?
            '您好，我暂时不在线，您可以给我发送短信或者留言。' : this.props.app.appData.talkset.noticemsg;

        }

        var localeKey = getLanguagePackage(languageType);
        labelClassName = 'ch-input';

        return (
            <div className="msg-board" ref="msgBoard" style={{ height: this.state.getMsgBoardHeight }}>
                <p className="tip">{leaveMsgNotice}</p>
                <form>
                {
                    msgBoardForm.eles.map(function (item, index) {
                        var renderIdentifying = null;
                        if (languageType == 1) {
                            renderIdentifying = (
                                <div className={ 'field field-' + item.name + (item.pass ? '' : ' error') } key={ item.name }>
                                    <em>*</em>
                                    <input
                                        type='text'
                                        name={ item.name }
                                        ref={ item.name }
                                        value={msgBoardValues[item.name]}
                                        onChange={ function (e) { this.setInputValue(e, item.name) }.bind(this) }
                                        onFocus={ function (e) { this.onInputFocus(e, item.name) }.bind(this) }
                                        onBlur={ function (e) { this.validateInput(e, item.name) }.bind(this) }
                                        placeholder="Identifying Code"
                                    />
                                    <img className="code"
                                        src={ '//kf.ecqun.com/index/message/captcha?t=' + this.props.codeRandomParam }
                                        width="115"
                                        height="30"
                                        onClick={ this.changeCodeImage }
                                    />
                                    {
                                        item.tip ?
                                        <div className="ec--tip" onClick={ function() { this.hideTip(item.name); }.bind(this) }>
                                            { item.tip }
                                        </div>
                                        : null
                                    }
                                </div>
                            )
                        } else {
                            renderIdentifying = (
                                 <FormInput
                                config={ item }
                                prefixEle={ item.validateConfig.isRequired ? (<em>*</em>) : null }
                                onChange={ this.setInputValue }
                                onBlur={ this.validateInput }
                                onFocus={ this.onInputFocus }
                                onTipClick={ this.hideTip }
                                codeRandomParam={ this.props.msgBoard.codeRandomParam }
                                changeCodeImage={ this.changeCodeImage }
                                key={ item.name }
                                value={msgBoardValues[item.name]}
                                placeholder = {this.placeholder}
                                inputClassname = 'ch-input'
                            />
                            )
                        }
                        return (
                            item.name === 'code' ?
                            renderIdentifying
                            : <FormInput
                                config={ item }
                                prefixEle={ item.validateConfig.isRequired ? (<em>*</em>) : null }
                                onChange={ this.setInputValue }
                                onBlur={ this.validateInput }
                                onFocus={ this.onInputFocus}
                                onTipClick={ this.hideTip }
                                key={ item.name }
                                value={msgBoardValues[item.name]}
                            />
                        );
                    }.bind(this))
                }
                    <p className="btns">
                        <a className="btn btn-blue" href="javascript:;" onClick={this.submitMsgBoard}>
                        {
                            isSubmitting ? localeKey.isSubmit + '...' : localeKey.submit
                        }
                        </a>
                    </p>
                </form>
            </div>
        );
    },

    // renderSubmitSuccess: function () {
    //     return (
    //         <div className="msg-submit-success-prompt">
    //             <div className="prompt">
    //                 <img src={successCheck} alt="提交成功" />
    //                 <p>提交成功</p>
    //             </div>
    //         </div>
    //     );
    // },

    renderSubmitSuccess: function () {
        var languageType = this.props.app.appData ? this.props.app.appData.language : 0;
        var localeKey = getLanguagePackage(languageType);

        return (
            <div className="msg-submit-success-prompt pc">
                <div className="prompt" style={{ width: 'auto' }}>
                    <img src={successCheck} alt="提交成功" />
                    <p style={{ marginTop: 20 }}>{localeKey.leaveMsgSuccessText}
                        <a className="link" href="javascript:;" style={{ marginLeft: 5 }} onClick={this.leaveMsgAgain}>{localeKey.leaveMsgAgain}</a>
                    </p>
                </div>
            </div>
        );
    },

    render: function () {
        var isSubmited = this.props.msgBoard.isSubmited;
        var isMobile = this.props.app.isMobile;
        var msgBoardNode = null;
        if (!isSubmited) {
            msgBoardNode = this.renderForm();
        } else {
            msgBoardNode = this.renderSubmitSuccess();
        }

        return msgBoardNode;
    }
});

module.exports = MobileMsgBoard;
