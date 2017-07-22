import React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'antd';

// import Emotions from '~cscommon/components/Emotions';
// import { displayError } from '~comm/utils';
import textPos from '~cscommon/utils/textPos';

import PreviewPasteImg from '~cscommon/components/PreviewPasteImg';
import SendKeyWrapper from '~cscommon/components/SendKeyWrapper';
import arrowDownImg from '~cscommon/images/arrow-down.png';

import * as chatInputActs from '../../actions/chatInput';
import * as chatActs from '../../actions/chat';


const localeKey = {
    enter: '按Enter键发送消息',
    ctrlEnter: '按Ctrl+Enter键发送消息',
};

const h5Url = 'https://my.workec.com/remind/form/?type=1&ordertype=1&from=cs';

class SessionInput extends React.Component {
    static propTypes = {
        chat: React.PropTypes.object.isRequired,
        chatInput: React.PropTypes.object.isRequired,
        sendSettingWrapperVisible: React.PropTypes.bool.isRequired,
        sendSettingKey: React.PropTypes.number.isRequired,
        dispatch: React.PropTypes.func.isRequired,
    }
    state = {
        isCtrlEntry: false,
        isShowH5Form: false,
        isShowPreviewModal: false,
        previewPasteImgSrc: '',
        previewPasteImgFile: '',
        h5Url,
    }
    componentDidMount() {
        document.body.addEventListener('click', this.bodyClickEvt);

        window.addEventListener('message', this.messgaeEvt, false);

        document.addEventListener('paste', this.onPaste, false);
    }
    componentWillUnmount() {
        document.body.removeEventListener('click', this.bodyClickEvt);
        window.removeEventListener('message', this.messgaeEvt);
        document.removeEventListener('paste', this.onPaste);
    }
    onInputChange = (e) => {
        const value = e.target.value;
        const { dispatch, chat } = this.props;
        const { txguid } = chat;

        dispatch(chatInputActs.setInputValue(txguid, value));
    }
    onInputKeyDown = (e) => {
        const $textarea = document.querySelector('#ec-session-textarea');
        const { dispatch } = this.props;
        const keyIndex = this.props.sendSettingKey * 1;
        if (!e.ctrlKey && e.keyCode === 13 && keyIndex === 1) {
            const value = e.target.value.trim();
            if (!value) {
                dispatch(chatInputActs.showSessTip('发送内容不能为空，请重新输入。'));
            }
            if (value) this.sendTextMsg();

            e.preventDefault();
        } else if (e.ctrlKey && e.keyCode === 13 && keyIndex === 2) {
            const value = e.target.value.trim();
            if (!value) {
                dispatch(chatInputActs.showSessTip('发送内容不能为空，请重新输入。'));
            }
            if (value) this.sendTextMsg();
            e.preventDefault();
        } else if (keyIndex === 1 && e.ctrlKey && e.keyCode === 13) {
            const newline = String.fromCharCode(13, 10);
            const { chat } = this.props;
            const { txguid } = chat;
            $textarea.value += newline;
            $textarea.scrollTop = 99999;
            dispatch(chatInputActs.setInputValue(txguid, $textarea.value));
        }
    }
    onPaste = (e) => {
        const { txguid, sessions, sessMap } = this.props.chat;
        if (sessions.indexOf(sessMap[txguid]) === -1) {
            return false;
        }

        const evt = e || window.event;
        let imgItem;
            // htmlItem;
        Array.from(evt.clipboardData.items).forEach((item) => {
            // if (item.kind === 'string' && item.type === 'text/html') {
            //     htmlItem = item;
            // }
            if (item.kind === 'file' && item.type.indexOf('image/') === 0) {
                imgItem = item;
            }
        });

        // if (htmlItem) {
        //     htmlItem.getAsString((str) => {
        //         // str 是获取到的字符串
        //         const src = /src="(.*?)"/.exec(str)[1];
        //         this.setState({
        //             previewPasteImgSrc: src,
        //         });
        //         this.showPreviewModal();
        //     });
        // }
        if (imgItem) {
            const reader = new FileReader();
            const file = imgItem.getAsFile();

            if (!file || !file.size) {
                this.props.dispatch(chatInputActs.showSessTip('图片粘贴失败，请使用图片上传功能发送图片'));
                return false;
            }

            if (file.size > 2 * 1024 * 1024) {
                this.props.dispatch(chatInputActs.showSessTip('仅支持发送大小2M以下的图片'));
                return false;
            }

            if (!this.validateFile('from-clipboard.png', file)) {
                return false;
            }
            reader.onload = () => {
                // this.result 可以得到图片的base64
                // document.querySelector('img').src = this.result;
                this.setState({
                    previewPasteImgSrc: reader.result,
                });
            };
            reader.readAsDataURL(file);

            this.setState({
                previewPasteImgFile: file,
            });
            this.showPreviewModal();
            // this.props.dispatch(chatInputActs.uploadPic(file));
        }
        return false;
    }
    onImageSelect = (e) => {
        const file = e.target.files[0];
        if (!this.validateFile(e.target.value, file)) {
            return;
        }
        const { dispatch } = this.props;
        dispatch(chatInputActs.uploadPic(file));
    }
    validateFile(value, file) {
        if (!file || !file.size) {
            return false;
        }
        if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(value)) {
            // displayError('请您发送 gif、jpg、jpeg、png格式的图片，给您带来不便请谅解');
            this.props.dispatch(chatInputActs.showSessTip('请您发送 gif、jpg、jpeg、png格式的图片，给您带来不便请谅解'));
            document.getElementById('picform').reset();
            return false;
        }
        if (file.size > 2 * 1024 * 1024) {
            this.props.dispatch(chatInputActs.showSessTip('仅支持发送大小2M以下的图片'));
            document.getElementById('picform').reset();
            return false;
        }
        return true;
    }
    toggleHistoryList = () => {
        const { dispatch, chat } = this.props;
        const { txguid, historyMsgs } = chat;
        const { isShowHistoryMsgList } = historyMsgs[txguid];
        dispatch(chatActs.setIsShowHistoryMsgList(txguid, !isShowHistoryMsgList));
        if (!isShowHistoryMsgList) {
            dispatch(chatActs.checkNeedGetHistory(txguid));
        } else {
            dispatch(chatActs.setHistoryListPage(txguid, 1));
        }
    }
    toggleFastReply = () => {
        const { isShowFastReply } = this.props.chat;
        this.props.dispatch(chatInputActs.setIsShowFastReply(!isShowFastReply));
    }
    toggleEmotions = () => {
        const { dispatch, chatInput } = this.props;
        const { isShowEmotion } = chatInput;
        dispatch(chatInputActs.setIsShowEmotions(!isShowEmotion));
    }
    hideEmotions = () => {
        const { dispatch } = this.props;
        dispatch(chatInputActs.setIsShowEmotions(false));
    }
    toggleH5Form = () => {
        const { isShowH5Form } = this.state;
        this.setState({
            isShowH5Form: !isShowH5Form,
        });
    }
    hideH5Form = () => {
        this.setState({
            isShowH5Form: false,
            h5Url: `${h5Url}&random=${Math.random()}`,
        });
    }
    showPreviewModal = () => {
        this.setState({
            isShowPreviewModal: true,
        });
    }
    hidePreviewModal = () => {
        this.setState({
            isShowPreviewModal: false,
        });
    }
    saveTextPos = (e) => {
        const { txguid } = this.props.chat;
        // const { isCtrlEntry } = this.state;

        const pos = textPos.getTextPos(e.target);
        this.props.dispatch(chatInputActs.saveTextPos(txguid, pos));
    }
    selectEmotion = (emotion) => {
        const { dispatch } = this.props;
        const $textarea = document.querySelector('#ec-session-textarea');
        const value = $textarea.value;
        const { txguid } = this.props.chat;
        const currPos = this.props.chatInput.textPos[txguid];
        const pos = currPos === undefined ? value.length : currPos;
        const emotionText = `[${emotion}]`;
        const newVal = value.slice(0, pos) + emotionText + value.slice(pos);

        dispatch(chatInputActs.setInputValue(txguid, newVal));

        setTimeout(() => {
            $textarea.focus();
            const newPos = pos + emotionText.length;
            textPos.setTextPos($textarea, newPos);
            dispatch(chatInputActs.saveTextPos(txguid, newPos));
        }, 16);
    }
    sendTextMsg = () => {
        const { isTxImLogined, guid, txguid } = this.props.chat;
        if (!isTxImLogined || !guid) {
            return;
        }
        const { dispatch, chatInput } = this.props;
        const { drafts } = chatInput;
        const value = (drafts[txguid] || '').trim();
        const $textarea = document.querySelector('#ec-session-textarea');
        $textarea.focus();
        if (value.length > 200) {
            dispatch(chatInputActs.showSessTip('您的消息超过系统限制，无法发送'));
            return;
        }
        if (value) {
            dispatch(chatInputActs.setIsShowFastReply(false));
            dispatch(chatInputActs.sendTextMsg(value));
        } else {
            dispatch(chatInputActs.showSessTip('发送内容不能为空，请重新输入。'));
        }
    }
    sendPasteImg = () => {
        const { txguid, sessions, sessMap } = this.props.chat;
        this.hidePreviewModal();
        if (sessions.indexOf(sessMap[txguid]) === -1) {
            return;
        }
        this.props.dispatch(chatInputActs.uploadPic(this.state.previewPasteImgFile));
    }
    messgaeEvt = (e) => {
        const { event, data } = e.data;
        switch (event) {
            case 'close':
                this.hideH5Form();
                break;
            case 'insert': {
                const { title, url } = data;
                const $textarea = document.querySelector('#ec-session-textarea');
                const { chat, chatInput } = this.props;

                const { txguid } = chat;

                const pos = chatInput.textPos[txguid];
                const { value } = $textarea;
                const headText = value.slice(0, pos);
                const tailText = value.slice(pos);
                const newVal = `${headText ? `${headText} ` : ''}${title}，${url}${tailText ? ` ${tailText}` : ''}`;

                this.props.dispatch(chatInputActs.setInputValue(txguid, newVal));

                this.hideH5Form();
                break;
            }
            default:
                break;
        }
    }
    bodyClickEvt = (e) => {
        const cls = e.target.className;
        if (cls === 'emotion') {
            return;
        }
        const { isShowEmotion } = this.props.chatInput;
        if (isShowEmotion) {
            this.hideEmotions();
        }

        if (cls.indexOf('icon-down') !== -1) {
            return;
        }

        const { sendSettingWrapperVisible } = this.props;
        if (sendSettingWrapperVisible) {
            this.props.dispatch(chatActs.setShortCutKeyWrapper(false));
        }
    }
    showSendSettingWrapper = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const { sendSettingWrapperVisible } = this.props;

        // console.log(this.props, 'props')

        if (sendSettingWrapperVisible) {
            this.props.dispatch(chatActs.setShortCutKeyWrapper(false));
        } else {
            this.props.dispatch(chatActs.setShortCutKeyWrapper(true));
        }
    }

    selectSettingType = (keyIndex) => {
        this.props.dispatch(chatActs.updateShortCutKey({
            shortCutKey: keyIndex,
            sendSettingWrapperVisible: false,
        }));
        this.props.dispatch(chatActs.updateShortCutKeySuccess());
    }

    renderH5Form() {
        return (
            <Modal
                wrapClassName="h5-from-modal"
                visible={this.state.isShowH5Form}
                onCancel={this.hideH5Form}
                width={822}
                footer={null}
                closable={false}
                maskClosable={false}
            >
                <iframe
                    title="h5-modal"
                    src={this.state.h5Url}
                    width="822"
                    height="545"
                    style={{ border: 'none' }}
                />
            </Modal>
        );
    }

    renderPreviewPasteImg() {
        return (
            <Modal
                title="是否发送图片"
                wrapClassName="preview-pasteimg-modal"
                visible={this.state.isShowPreviewModal}
                onCancel={this.hidePreviewModal}
                footer={null}
                maskClosable={false}
                width={600}
            >
                <PreviewPasteImg
                    src={this.state.previewPasteImgSrc}
                    onSend={this.sendPasteImg}
                    onCancel={this.hidePreviewModal}
                />
            </Modal>
        );
    }

    render() {
        const { chat, chatInput } = this.props;
        const { isTxImLogined, txguid, guid, previewMsgs, sessions, hasH5Form } = chat;
        const { drafts, tipText } = chatInput;
        const value = drafts[txguid] || '';
        const session = sessions.filter(sess => sess.txguid === txguid)[0];
        const isSessionOvered = session === undefined;
        const previewText = previewMsgs[txguid];

        // 快捷发送方式
        const { sendSettingKey } = this.props;

        // onKeyUp={ this.saveTextPos }
        return (
            <div className="session-input">
                {
                    previewText ?
                        <p
                            className="session-tip"
                            title={previewText}
                        >
                            对方正在输入：{ previewText }
                        </p>
                        : null
                }
                {
                    tipText ?
                        <p className="session-tip">{ tipText }</p>
                        : null
                }
                <div className="tools">
                    <a
                        title="表情"
                        className="emotion"
                        onClick={this.toggleEmotions}
                        role="button"
                        tabIndex="0"
                    >表情</a>
                    <a
                        className="pic"
                        title="图片"
                        role="button"
                        tabIndex="-1"
                    >
                        <form id="picform">
                            <input
                                id="picfile"
                                type="file"
                                accept="image/png,image/jpg,image/jpeg,image/gif"
                                onChange={this.onImageSelect}
                            />
                        </form>
                    </a>
                    <a
                        className="reply"
                        title="快捷回复"
                        onClick={this.toggleFastReply}
                        role="button"
                        tabIndex="-2"
                    >快捷回复</a>
                    {
                        hasH5Form ? [
                            <a
                                className="h5-form"
                                title="插入表单"
                                onClick={this.toggleH5Form}
                                role="button"
                                tabIndex="-3"
                            >h5</a>,
                            this.renderH5Form()
                        ] : null
                    }

                </div>
                <a
                    className="history"
                    title="消息记录"
                    onClick={this.toggleHistoryList}
                    role="button"
                    tabIndex="-4"
                >
                    <i className="anticon anticon-clock-circle-o" /> 消息记录
                </a>
                <textarea
                    id="ec-session-textarea"
                    onChange={this.onInputChange}
                    onKeyDown={this.onInputKeyDown}
                    onKeyUp={this.saveTextPos}
                    onClick={this.saveTextPos}
                    value={value}
                    readOnly={!isTxImLogined || !guid || isSessionOvered}
                />
                <p className="btns">
                    <a className="btn btn-blue send-btn btn-add-icon">
                        <span className="btn-text" onClick={this.sendTextMsg} role="button" tabIndex="0">发送</span>
                        <span className="border-icon" onClick={this.showSendSettingWrapper} role="button" tabIndex="0">
                            <img src={arrowDownImg} alt="" />
                        </span>
                    </a>
                    <SendKeyWrapper
                        changeSendSettingWrapper={chatActs.setShortCutKeyWrapper}
                        sendSettingWrapperVisible={this.props.sendSettingWrapperVisible}
                        localeKey={localeKey}
                        sendSettingKey={sendSettingKey}
                        selectSettingType={this.selectSettingType}
                    />
                </p>
                {
                    isSessionOvered ? <div className="session-input-tip">对话已结束</div> : null
                }
                {
                    this.renderPreviewPasteImg()
                }
            </div>
        );
    }
}

export default connect((state) => {
    const { chat, chatInput } = state;
    return {
        chat,
        chatInput,
    };
})(SessionInput);
