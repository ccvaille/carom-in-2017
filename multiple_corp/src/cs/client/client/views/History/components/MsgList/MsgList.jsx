import React, { PropTypes } from 'react';
import Msg from '~cscommon/components/Msg';
import SessionTipMsg from 'components/SessionTipMsg';
import { Icon } from 'antd';
import emotionPath from '~cscommon/consts/emotionPath';
import usedEmotions from '~cscommon/consts/usedEmotions';
import csDefaultAvatar from '~cscommon/images/default-cs.png';
import visitorDefaultAvatar from '~cscommon/images/default-visitor.png';
import HistoryListTypes from 'constants/HistoryListTypes';

import '../../../../utils/dateTimeFormatter';
import '../../../../styles/chat.less';
import './msg-list.less';
import moment from 'moment';
import devicePc from '../../../../images/client-device-pc.png';
import devicePhone from '../../../../images/client-device-phone.png';
import iconQQ from '../../../../images/icons_qq.png';

const MsgTypes = {
    TEXT_MSG: 0,
    IMG_MSG: 1,
    SYS_MSG: 2,
};

class MsgList extends React.Component {
    static propTypes = {
        getChatList: PropTypes.func.isRequired,
        chat: PropTypes.object.isRequired,
        updateChatParams: PropTypes.func.isRequired,
        messageInfos: PropTypes.object.isRequired,
    };

    state = {
        chatList: [],
        hasLoade: false,
        isLoading: false,
    };

    componentDidUpdate() {
        if (!this.props.chat.chatParams.isNext && !this.state.isLoading) {
            this.refs.msgList.scrollTop = 9999;
        }
    }

    // matchEmotions (content) {
    //     return content.replace(/\[[^\[\]]*\]/g, function (key) {
    //         var keyEmotion = key.replace(/\[|\]/g, '');
    //         var hasEmotion = usedEmotions.findIndex(function (emotion) {
    //                 return keyEmotion === emotion;
    //             }) === -1;
    //         if (hasEmotion) {
    //             return key;
    //         }
    //         return '<img src="' + emotionPath + keyEmotion + '.png">';
    //     });
    // }

    getChatListHandle = (callback) => {
        const msgList = this.refs.msgList;
        const prevMsgListHeight = msgList.scrollHeight;
        const { updateChatParams, getChatList } = this.props;

        updateChatParams({
            isNext: true,
        });
        getChatList().then(() => {
            const newMsgListHeight = msgList.scrollHeight;
            msgList.scrollTop = newMsgListHeight - prevMsgListHeight;

            if (callback && typeof callback === 'function') {
                callback();
            }
        });
    };

    onScrollHandle = () => {
        const msgList = this.refs.msgList;

        const scrollTop = msgList.scrollTop;
        if (scrollTop == 0) {
            const hasLoaded = this.state.hasLoaded;
            const { isCompleted } = this.props.chat.chatParams;

            if (!hasLoaded && !isCompleted) {

                this.setState({
                    hasLoaded: true,
                    isLoading: true,
                })

                this.getChatListHandle(() => {
                    this.setState({
                        hasLoaded: false,
                        isLoading: false,
                    })
                });
            }
        }
    }

    matchEmotions = (content, type) => {
        if (content) {
            const chatTypeReg = type === HistoryListTypes.CHAT_QQ ? /\[\[[^\[\]]*\]\]/g : /\[[^\[\]]*\]/g;
            return content.replace(chatTypeReg, (key) => {
            // return content.replace(/\[[^\[\]]*\]/g, function (key) {
                const keyEmotion = key.replace(/\[|\]/g, '');
                // const keyEmotion = key.replace(/[\[\]]/g, '');
                let hasEmotion = usedEmotions.findIndex((emotion) => {
                        return keyEmotion === emotion;
                    }) === -1;

                if (hasEmotion) {
                    return key;
                }

                return `<img class="ec-qq-emoji" src=${emotionPath}${keyEmotion}.png>`;
            });
        }
        return '';
    }

    renderTipMsg(msg) {
        let newMsg = {
            ...msg,
        };

        const { messageInfos } = this.props;

        let content = '';
        newMsg.msgTime = moment(msg.msgTime).format('YYYY-MM-DD HH:mm:ss');

        if (msg.msgContent.SubType === 10) { // 转接消息
            // console.log(msg, 'msg')
            // console.log(this.props, messageInfos.csId, msg.msgContent.SwitchData.FromAccount, 'yyyy')
            if (messageInfos.csId !== msg.msgContent.SwitchData.FromAccount * 1) {
                content = msg.msgContent.SwitchData.FromName + '客服 请求转接';
            } else {
                content = '转接给 ' + msg.msgContent.SwitchData.ToName + '客服';
            }
        } else if (msg.msgContent.SubType) {
            content = msg.msgContent.Content || msg.msgContent.Conent;
        } else {
            content = msg.msgContent.Desc;
        }

        newMsg.msgContent = (
            <span>
                ---------
                <span className="tip-text">{content}</span>
                <span className="tip-time">{newMsg.msgTime}</span>
                ---------
            </span>
        );

        return (
            <div>
                <SessionTipMsg msg={newMsg} key={newMsg.msgId} />
            </div>
        );
    }

    renderMsg(msg, isImg) {
        const talkFlag = msg.fromId;  // 0: 访客发送，1：客服发送
        const { messageInfos, chatType } = this.props;
        let userInfo = {};
        let className = '';
        const newMsg = {
                ...msg,
                type: 'SESSION_MSG',
            };

        if (talkFlag === 0) {   // 访客发送
            let guHeaderPic = '';

            switch (messageInfos.guTerminal * 1) {
                case 0:  // 其他
                    break;
                case 1:  // pc
                    guHeaderPic = devicePc;
                    break;
                case 2:  // 移动
                    guHeaderPic = devicePhone;
                    break;
                default:
                    break;
            }

            if (messageInfos.face && chatType !== HistoryListTypes.CHAT_WEB) {
                guHeaderPic = messageInfos.face;
            }

            userInfo = {
                pic: guHeaderPic,
                name: messageInfos.visitorName,
            };

            className = 'other';
        } else if (talkFlag === 1) {
            userInfo = {
                pic: messageInfos.csPic,
                name: messageInfos.kfName,
            };

            className = 'self';
        }

        let newContent = '';
        // console.log(msg, 'msg');
        if (msg.msgContentAbstract.length > 0) {
            msg.msgContentAbstract.forEach((itemEach) => {
                switch (itemEach.SubType * 1) {
                    case 1: { // 文本消息 + 表情消息
                        // newContent += itemEach.Content;
                        newContent += this.matchEmotions(itemEach.Content, chatType);
                        newMsg.text = itemEach.Content;
                        newMsg.subType = 1;
                        break;
                    }
                    case 2: {  // 图片消息
                        newContent += `<a href=${itemEach.Srcs.OriImage} target="_blank"><img src=${itemEach.Srcs.SmallImage}></a>`;
                        newMsg.srcs = itemEach.Srcs;
                        newMsg.subType = 2;
                        break;
                    }
                    case 3: {  // 语音消息
                        newContent += `<audio src=${itemEach.Audio} controls="controls"></audio>`;
                        newMsg.audio = itemEach.Audio;
                        newMsg.subType = 3;
                        break;
                    }
                    default:  // 语音
                        break;
                }
            });

            newMsg.msgContent = newContent;

            return (
                <div>
                    <Msg
                        isFromSelf={talkFlag === 1}
                        defaultAvatar={talkFlag === 1 ? csDefaultAvatar : visitorDefaultAvatar}
                        userInfo={userInfo}
                        msg={newMsg}
                        fromattedTime={ moment(msg.msgTime).format('YYYY-MM-DD HH:mm:ss') }
                        key={msg.msgId}
                    />
                </div>
            );
        }
    }

    renderQQMsg(msg) {
        const talkFlag = msg.fromId;  // 0: 访客发送，1：客服发送
        const { messageInfos, chatType } = this.props;
        let userInfo = {};
        let className = '';
        const newMsg = {
            ...msg,
            type: 'SESSION_MSG',
            subType: 1,
            text: msg.msgContent,
        };

        if (talkFlag === 0) {   // 访客发送
            const guHeaderPic = iconQQ;

            userInfo = {
                pic: guHeaderPic,
                name: messageInfos.visitorName,
            };

            className = 'other';
        } else if (talkFlag === 1) {
            userInfo = {
                pic: messageInfos.csPic,
                name: messageInfos.kfName,
            };

            className = 'self';
        }

        let newContent = '';
        // console.log(msg, 'msg');
        newContent += this.matchEmotions(msg.msgContent, chatType);

        newMsg.msgContent = newContent;

        return (
            <div>
                <Msg
                    isFromSelf={talkFlag === 1}
                    defaultAvatar={talkFlag === 1 ? csDefaultAvatar : visitorDefaultAvatar}
                    userInfo={userInfo}
                    msg={newMsg}
                    fromattedTime={ moment(msg.msgTime).format('YYYY-MM-DD HH:mm:ss') }
                    key={msg.msgId}
                />
            </div>
        );
    }

    render() {
        const { chatList, chatParams } = this.props.chat;
        const { chatType } = this.props;
        let chatListHtml;

        if (chatType === HistoryListTypes.CHAT_QQ) {
            chatListHtml = chatList.map((item) => {
                // console.log(item, 'item');
                // return this.renderQQMsg(item);
                switch (item.type) {
                    case MsgTypes.SYS_MSG:
                        return this.renderTipMsg(item);
                    case MsgTypes.TEXT_MSG:
                        return this.renderQQMsg(item);
                    default:
                        return null;
                }
            });
        } else {
            chatListHtml = chatList.map((item) => {
                // console.log(item, 'item');
                switch (item.type) {
                    case MsgTypes.SYS_MSG:
                        return this.renderTipMsg(item);
                    case MsgTypes.TEXT_MSG:
                        return this.renderMsg(item);
                    default:
                        return null;
                }
            });
        }

        const isLoading = this.state.isLoading;

        // <a href="javascript:;" onClick={this.getChatListHandle}>
        //     <span className="clock-circle-css">
        //         <Icon type="clock-circle" />
        //     </span>
        //     查看更多
        // </a>
        return (
            <div className="msg-list" ref="msgList" onScroll={this.onScrollHandle} >
            {
                chatList.length === 0 ? (
                    <div className="none-msg">
                        <span className="img-none" />
                        <span>暂无聊天记录</span>
                    </div>
                ) : (
                    <div>
                            {
                                (!chatParams.isCompleted) &&
                                (!isLoading ?
                                    <div className="history-tip">
                                        <a href="javascript:;" onClick={this.getChatListHandle}>
                                            <span className="clock-circle-css">
                                                <Icon type="clock-circle" />
                                            </span>
                                            查看更多
                                        </a>
                                    </div> : '')
                            }
                            {
                                (!chatParams.isCompleted) &&
                                (isLoading ?
                                    <div className="history-tip">
                                        <span className="loading" />
                                    </div> : '')
                            }
                        <ol className="">
                            {chatListHtml}
                        </ol>
                    </div>
                )
            }

            </div>
        );
    }
}

export default MsgList;
