var React = require('react');
var connect = require('react-redux').connect;

var msgBoardActs = require('../actions/msgBoard');
var FormInput = require('~cscommon/components/FormInput/');
var getLanguagePackage = require('../../utils/locale');
var successCheck = require('../../imgs/submit-success-pc.png');
var consts = require('../../modules/const'),
    WINDOW_MODES = consts.WINDOW_MODES;

var offset = require('../utils/offset');

var LeaveMsgBoard = React.createClass({
    getInitialState: function () {
        return {
            ecTipVisible: 'none'
        }
    },
    setInputValue: function (e) {
        var name = e.target.name;
        var value = e.target.value;

        this.props.dispatch(msgBoardActs.setInputValue(name, value));
    },
    submitMsgBoard: function () {
        this.props.dispatch(msgBoardActs.validateForm());
    },
    closeMsgBorad: function () {
        // window.close();
        if (this.props.app.windowMode === WINDOW_MODES.STANDARD) {
            window.close();
        } else {
            msgBoardActs.removeSessionToTop();
        }
    },
    validateInput: function (e, name) {
        var index = this.props.msgBoard.msgBoardForm.eles.findIndex(function (ele) {
            return ele.name === name;
        });
        this.props.dispatch(msgBoardActs.validateInput(name, index));
    },
    changeCodeImage: function () {
        this.props.dispatch(msgBoardActs.changeCode());
    },
    hideTip: function (name) {
        var index = this.props.msgBoard.msgBoardForm.eles.findIndex(function (ele) {
            return ele.name === name;
        });
        this.props.dispatch(msgBoardActs.setInputTip(index, ''));
    },
    focusInput: function (index) {
        var input = 'input' + index;
        this.refs[input].focus();
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

        this.props.dispatch(msgBoardActs.resetSetInputValue(values));
        this.props.dispatch(msgBoardActs.setFormSubmited(false));
    },
    showEcTipPopover: function () {
        this.setState({
            ecTipVisible: 'block',
        });
    },
    hideEcTipPopover: function () {
        this.setState({
            ecTipVisible: 'none'
        });
    },
    renderForm: function () {
        var isLeavingMsg = this.props.msgBoard.isLeavingMsg;
        var isSubmitting = this.props.msgBoard.isSubmitting;
        var msgBoardForm = this.props.msgBoard.msgBoardForm;
        var msgBoardValues = this.props.msgBoard.values;
        var isStandardWindow = this.props.app.windowMode === WINDOW_MODES.STANDARD;

        var languageType = 0;
        var leaveMsgNotice = '';
        if (this.props.app.appData) {
            languageType = this.props.app.appData.language;
            leaveMsgNotice = this.props.app.appData.talkset.noticemsg === '' ?
            '您好，我暂时不在线，您可以给我发送短信或者留言。' : this.props.app.appData.talkset.noticemsg;
        }
        var localeKey = getLanguagePackage(languageType);
        var ecTipVisible = this.state.ecTipVisible;

        return (
            <div className="msg-board" style={{ display: isLeavingMsg ? 'block' : 'none' }}>
                <div
                    className="tip"
                    onMouseEnter={this.showEcTipPopover}
                    onMouseLeave={this.hideEcTipPopover}
                >
                    {leaveMsgNotice}
                    <div
                        className="ec--tip"
                        style={{ display: ecTipVisible }}
                    >
                        {leaveMsgNotice}
                    </div>
                </div>
                <form>
                {
                    msgBoardForm.eles.map(function (item, index) {
                        return (
                            item.name === 'code' ?
                            <FormInput
                                config={ item }
                                prefixEle={ item.validateConfig.isRequired ? (<em>*</em>) : null }
                                onChange={ this.setInputValue }
                                onBlur={ this.validateInput }
                                onTipClick={ this.hideTip }
                                codeRandomParam={ this.props.msgBoard.codeRandomParam }
                                changeCodeImage={ this.changeCodeImage }
                                key={ item.name }
                                value={msgBoardValues[item.name]}
                                placeholder = {this.placeholder}
                            />
                            : <FormInput
                                config={ item }
                                prefixEle={ item.validateConfig.isRequired ? (<em>*</em>) : null }
                                onChange={ this.setInputValue }
                                onBlur={ this.validateInput }
                                onTipClick={ this.hideTip }
                                key={ item.name }
                                value={msgBoardValues[item.name]}

                            />
                        );
                    }.bind(this))
                }
                    <p className="btns">
                        {
                            isStandardWindow ? <a className="btn btn-cancel" href="javascript:;" onClick={this.closeMsgBorad}>{localeKey.close}</a> : null
                        }
                        <span className="btn btn-blue" onClick={ this.submitMsgBoard }>
                        {
                            isSubmitting ? localeKey.isSubmit + '...' : localeKey.submit
                        }
                        </span>
                    </p>
                </form>
            </div>
        );
    },
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
                <a className="btn btn-cancel" href="javascript:;" onClick={this.closeMsgBorad}>{localeKey.close}</a>
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

module.exports = connect(function (state) {
    return {
        app: state.app,
        msgBoard: state.msgBoard
    }
})(LeaveMsgBoard);
