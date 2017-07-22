import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import noneImg from 'images/none.png';
import Msg from '~cscommon/components/Msg';

import * as MsgTypes from '../../constants/MsgTypes';
import * as chatActs from '../../actions/chat';


class MsgHistory extends React.Component {

    static propTypes = {
        chat: React.PropTypes.object.isRequired,
        dispatch: React.PropTypes.func.isRequired,
    }

    componentDidMount() {
        const historyBox = document.querySelector('.history-box');
        if (historyBox) {
            historyBox.scrollTop = 99999;

            const hasImgMsg = !!this.hisMsgs.filter(msg => msg.subType === 2).length;
            if (hasImgMsg) {
                setTimeout(() => {
                    historyBox.scrollTop = 99999;
                }, 32);
            }
        }
    }

    componentDidUpdate(prevProps) {
        const { chat } = this.props;
        const { txguid, historyMsgs } = chat;
        const {
            listPage = 1,
            isGetting,
        } = historyMsgs[txguid] || {};

        const hisMsgs = this.hisMsgs;

        const historyBox = document.querySelector('.history-box');
        const prevListPage = prevProps.chat.historyMsgs[txguid].listPage;

        this.updateScrollTop(isGetting, hisMsgs, historyBox, prevListPage, listPage);

        const imgList = document.getElementsByClassName('msg-history')[0].getElementsByTagName('img');

        for (let i = 0, len = imgList.length; i < len; i++) {
            const self = this;
            imgList[i].addEventListener('load', () => {
                self.updateScrollTop(isGetting, hisMsgs, historyBox, prevListPage, listPage);
            });
        }
    }

    componentWillUnmount() {
        const imgList = document.getElementsByClassName('msg-history')[0].getElementsByTagName('img');

        for (let i = 0, len = imgList.length; i < len; i++) {
            // console.log('unbind')
            imgList[i].removeEventListener('load', this.updateScrollTop);
        }
    }

    hisMsgs = []

    updateScrollTop = (isGetting, hisMsgs, historyBox, prevListPage, listPage) => {
        // console.log('jjjj')
        const $historyBox = historyBox;
        if (!(isGetting && hisMsgs.length < 15) && historyBox) {
            if (prevListPage > listPage) {
                $historyBox.scrollTop = 0;
            } else {
                $historyBox.scrollTop = 99999;
            }
        }
    }

    hide = () => {
        const { dispatch, chat } = this.props;
        const { txguid } = chat;
        dispatch(chatActs.setIsShowHistoryMsgList(txguid, false));
        dispatch(chatActs.setHistoryListPage(txguid, 1));
    }
    toPage = (page, isLast = false) => {
        const { dispatch, chat } = this.props;
        const { txguid } = chat;
        if (!isLast) {
            dispatch(chatActs.setHistoryListPage(txguid, page));
        }
        dispatch(chatActs.checkNeedGetHistory(txguid, isLast));
    }
    toNextPage = () => {
        const { chat } = this.props;
        const { txguid, historyMsgs } = chat;
        const {
            listPage = 1,
            isRespCompleted = true,
            isGetting,
            maxPage = 1
        } = historyMsgs[txguid];
        const isNextDisable = listPage >= maxPage && isRespCompleted;
        if (isNextDisable || isGetting) {
            return;
        }
        this.toPage(listPage + 1);
    }
    toPrevPage = () => {
        const { chat } = this.props;
        const { txguid, historyMsgs } = chat;
        const {
            listPage = 1,
            isGetting,
        } = historyMsgs[txguid];
        const isPrevDisable = listPage === 1;
        if (isPrevDisable || isGetting) {
            return;
        }
        this.toPage(Math.max(listPage - 1, 1));
    }
    toLast = () => {
        const { chat } = this.props;
        const { txguid, historyMsgs } = chat;
        const {
            listPage = 1,
            isRespCompleted = true,
            isGetting,
            maxPage = 1
        } = historyMsgs[txguid];
        const isLastDisable = listPage >= maxPage && isRespCompleted;
        if (isLastDisable || isGetting) {
            return;
        }
        this.toPage(maxPage, true);
    }
    toFirst = () => {
        const { chat } = this.props;
        const { txguid, historyMsgs } = chat;
        const {
            listPage = 1,
            isGetting,
        } = historyMsgs[txguid];
        const isFirstDisable = listPage === 1;
        if (isFirstDisable || isGetting) {
            return;
        }
        this.toPage(1);
    }
    renderMsg(msg) {
        const { txguid, txcsid, csInfo, guests } = this.props.chat;
        const { msgTime, fromId, msgId } = msg;
        const isFromSelf = fromId === txcsid;
        const userName = isFromSelf ? csInfo.name : guests[txguid].guidName;
        return (
            <Msg
                isFromSelf={isFromSelf}
                msg={msg}
                key={msgId}
                fromattedTime={moment(msgTime).format('HH:mm:ss')}
                isInHistoryList
                userInfo={{
                    name: userName
                }}
            />
        );
    }
    render() {
        const { chat } = this.props;
        const { txguid, historyMsgs } = chat;
        const sessionMsgs = chat.msgs[txguid] || [];
        const {
            msgs = [],
            listPage = 1,
            isGetting,
            isRespCompleted = true,
            maxPage = 1
        } = historyMsgs[txguid] || {};
        const isPrevDisable = listPage === 1;
        const isNextDisable = listPage >= maxPage && isRespCompleted;
        const hisMsgs = msgs
                        .concat(sessionMsgs)
                        .filter(msg => msg.type === MsgTypes.SESSION_MSG)
                        .reverse().slice(15 * (listPage - 1), 15 * listPage)
                        .reverse();

        const groupHisMsgs = [];
        let timeStr;
        let msgGroupObj;

        hisMsgs.forEach((msg) => {
            const tempTimeStr = moment(msg.msgTime).format('YYYY-MM-DD');
            if (tempTimeStr !== timeStr) {
                timeStr = tempTimeStr;
                msgGroupObj = {
                    time: tempTimeStr,
                    msgs: [],
                };
                groupHisMsgs.push(msgGroupObj);
            }
            msgGroupObj.msgs.push(msg);
        });

        let historyBox = null;
        if (!hisMsgs.length) {
            historyBox = (
                <div className="empty-history">
                    <img src={noneImg} alt="暂无消息记录" />
                    <span>暂无消息记录</span>
                </div>
            );
        } else {
            const hisMsgsNodes = groupHisMsgs.map(group => [
                <li className="history-date">
                    <span>{group.time}</span>
                </li>
            ].concat(group.msgs.map(msg => this.renderMsg(msg))));

            historyBox = (
                <ul className="history-box">
                    {hisMsgsNodes}
                </ul>
            );
        }

        this.hisMsgs = hisMsgs;

        return (
            <div className="msg-history">
                <div className="top-bar">消息记录
                    <i
                        className="history-close anticon anticon-close"
                        onClick={this.hide}
                        role="button"
                        tabIndex="0"
                    />
                </div>
                {
                    isGetting && hisMsgs.length < 15 ?
                        <div className="cs-loading">
                            <i
                                className="anticon anticon-spin anticon-loading"
                            />
                            数据加载中....
                        </div>
                        :
                        historyBox
                }
                <div className="history-page">
                    <i
                        className={`page-first anticon anticon-verticle-right${isNextDisable ? ' disabled' : ''}`}
                        title="第一页"
                        onClick={this.toLast}
                        role="button"
                        tabIndex="0"
                    />
                    <i
                        className={`page-prev anticon anticon-left${isNextDisable ? ' disabled' : ''}`}
                        title="上一页"
                        onClick={this.toNextPage}
                        role="button"
                        tabIndex="-1"
                    />
                    <i
                        className={`page-next anticon anticon-right${isPrevDisable ? ' disabled' : ''}`}
                        title="下一页"
                        onClick={this.toPrevPage}
                        role="button"
                        tabIndex="-2"
                    />
                    <i
                        className={`page-last anticon anticon-verticle-left${isPrevDisable ? ' disabled' : ''}`}
                        title="最后一页"
                        onClick={this.toFirst}
                        role="button"
                        tabIndex="-3"
                    />
                </div>
            </div>
        );
    }
}

export default connect((state) => {
    const { chat } = state;
    return {
        chat,
    };
})(MsgHistory);
