/*eslint-disable */
var React = require('react');
var connect = require('react-redux').connect;

var inputActs = require('../actions/input');
var msgActs = require('../actions/msg');

var consts = require('../../modules/const'),
    SESSION_MSG_TYPES = consts.SESSION_MSG_TYPES,
    MSG_STATES = consts.MSG_STATES;

require('../../utils/dateTimeFormatter');
var isDescendantsOf = require('~cscommon/utils/isDescendantsOf');

var csDefaultAvatar = require('~cscommon/images/default-cs.png');
var visitorDefaultAvatar = require('~cscommon/images/default-visitor.png');

var getLanguagePackage = require('../../utils/locale');
var eventUtils = require('react/utils/events');
var appConstants = require('../constants/app');

var SessionMsg = require('~cscommon/components/Msg');

var scrollTops = {},
    isInBottoms = {},
    prevHeights = {};

var MsgList = React.createClass({
    componentDidMount: function () {
        var $msgList = document.querySelector('.msg-list');
        var self = this;
        // todo :: 移动端事件
        $msgList.onmousewheel = function (e) {
            if ($msgList.scrollTop === 0 && (e.wheelDelta || e.detail) > 0) {
                var txcsid = this.props.app.txcsid,
                    historyMsgs = this.props.msg.historyMsgs[txcsid] || {},
                    isCompleted = historyMsgs.isCompleted;

                var msgState = this.props.msg,
                    historyMsgs = msgState.historyMsgs[txcsid] || {};

                var hisMsgs = (historyMsgs.msgs || []).filter(function (msg) {
                    return msg.type === SESSION_MSG_TYPES.SESSION_MSG;
                }).slice(-20);

                if (hisMsgs.length < 20 && !isCompleted && !this.props.msg.isGettingHistoryMsgs) {
                    this.getHistoryMsgs();
                }
            }
        }.bind(this);
    },
    fixScroll: function (txcsid) {
        // chrome 视窗之外的图片不会将滚动条挤下去
        // 还是要确定高度才靠谱
        var $msgList = document.querySelector('.msg-list');
        var scrollTop = $msgList.scrollTop;
        // console.log($img.height, $msgList.scrollHeight - prevHeights[txcsid]);
        // // var scrollPage = (self.props.msg.historyMsgs[txcsid] || {}).scrollPage || 0;
        // var dist = $msgList.scrollHeight - prevHeights[txcsid];
        // prevHeights[txcsid] = $msgList.scrollHeight;
        // scrollTop += dist;

        // if ($img.offsetTop > scrollTop) {
        //     return;
        // }

        if (isInBottoms[txcsid]) {
            scrollTop = 99999;

            scrollTops[txcsid] = scrollTop;
            $msgList.scrollTop = scrollTop;
        }
    },
    componentWillReceiveProps: function (nextProps, nextState) {
        var $msgList = document.querySelector('.msg-list');
        var prevCsid = this.props.app.txcsid;
        var txcsid = nextProps.app.txcsid;

        if (!prevCsid) {
            $msgList.scrollTop = scrollTops[txcsid] || 99999;
            prevHeights[txcsid] = $msgList.scrollHeight;
            var isInBottom = isInBottoms[txcsid] === undefined ? this.checkIsInBottom() : isInBottoms[txcsid];
            isInBottoms[txcsid] = isInBottom;
            this.props.dispatch(msgActs.setIsScrollToBottom(txcsid, isInBottom));
        }

        var changes = this.getChanges(this.props, this.state, nextProps, nextState),
            isCsidChanged = changes.isCsidChanged,
            isFirstMsgsChanged = changes.isFirstMsgsChanged,
            isLastMsgsChanged = changes.isLastMsgsChanged,
            isScrollPageChanged = changes.isScrollPageChanged;

        if (isCsidChanged || isScrollPageChanged || isLastMsgsChanged) {
            prevHeights[txcsid] = $msgList.scrollHeight;
        }
    },
    componentDidUpdate: function (prevProps, prevState) {
        var $msgList = document.querySelector('.msg-list');
        var txcsid = this.props.app.txcsid;

        var changes = this.getChanges(prevProps, prevState, this.props, this.state),
            isCsidChanged = changes.isCsidChanged,
            isFirstMsgsChanged = changes.isFirstMsgsChanged,
            isLastMsgsChanged = changes.isLastMsgsChanged,
            isLastFromSelf = changes.isLastFromSelf,
            isLastHistoryMsgChanged = changes.isLastHistoryMsgChanged;

        var nochange = !isCsidChanged &&
                       !isFirstMsgsChanged &&
                       !isLastMsgsChanged &&
                       !isLastFromSelf &&
                       !isLastHistoryMsgChanged;

        if (nochange) {
            return;
        }

        var scrollTop = $msgList.scrollTop;

        if (isCsidChanged) {
            if (isInBottoms[txcsid] || isInBottoms[txcsid] === undefined) {
                scrollTop = 99999;
            } else {
                scrollTop = scrollTops[txcsid];
            }
        } else if (isFirstMsgsChanged) {
            if (isInBottoms[txcsid]) {
                scrollTop = 99999;
            } else {
                scrollTop = $msgList.scrollHeight - prevHeights[txcsid];
            }
            // prevHeights[txcsid] = $msgList.scrollHeight;
        } else if (isLastHistoryMsgChanged) {
            scrollTop = 99999;
        } else if (isLastMsgsChanged) {
            if (isInBottoms[txcsid] || isLastFromSelf) {
                scrollTop = 99999;
            }
        } else if (isInBottoms[txcsid]) {
            scrollTop = 99999;
        }

        scrollTops[txcsid] = scrollTop;
        $msgList.scrollTop = scrollTop;
    },
    onScroll: function (txcsid) {
        var $msgList = document.querySelector('.msg-list');
        var isInBottom = this.checkIsInBottom();
        scrollTops[txcsid] = $msgList.scrollTop;
        if (isInBottom) {
            this.props.dispatch(msgActs.setIsShowNewMsgTip(txcsid, false));
        }
        if (isInBottoms[txcsid] === isInBottom) {
            // 避免dispatch导致不停触发props更新
            return;
        }
        isInBottoms[txcsid] = isInBottom;
        this.props.dispatch(msgActs.setIsScrollToBottom(txcsid, isInBottom));
    },
    checkIsInBottom: function () {
        var $msgList = document.querySelector('.msg-list');
        return $msgList.scrollTop + $msgList.clientHeight === $msgList.scrollHeight;
    },
    getChanges: function (prevProps, prevState, nextProps, nextState) {
        var txguid = nextProps.app.txguid;

        var prevCsid = prevProps.app.txcsid,
            prevMsgs = prevProps.msg.msgs[prevCsid] || [],
            prevHistoryMsgs = (prevProps.msg.historyMsgs[prevCsid] || {}).msgs || [],
            prevScrollPage = (prevProps.msg.historyMsgs[prevCsid] || {}).scrollPage || 0;

        var txcsid = nextProps.app.txcsid,
            msgs = nextProps.msg.msgs[txcsid] || [],
            historyMsgs = (nextProps.msg.historyMsgs[txcsid] || {}).msgs || [],
            scrollPage = (nextProps.msg.historyMsgs[txcsid] || {}).scrollPage || 0;

        var firstMsg = historyMsgs[0] || {},
            prevFirstMsg = prevHistoryMsgs[0] || {},
            lastMsg = msgs.slice(-1)[0] || {},
            prevLastMsg = prevMsgs.slice(-1)[0] || {},
            lastHistoryMsg = historyMsgs.slice(-1)[0] || {},
            prevLastHistoryMsg = prevHistoryMsgs.slice(-1)[0] || {};

        return {
            isCsidChanged: txcsid !== prevCsid,
            isFirstMsgsChanged: firstMsg.msgId !== prevFirstMsg.msgId,
            isScrollPageChanged: scrollPage !== prevScrollPage,
            isLastMsgsChanged: lastMsg.msgId !== prevLastMsg.msgId,
            isLastFromSelf: lastMsg.fromId === txguid,
            isLastHistoryMsgChanged: lastHistoryMsg.msgId !== prevLastHistoryMsg.msgId
        };
    },
    fixCsAavatar: function (e, isFromSelf) {
        if (this.props.app.networkStatus === appConstants.CONNECTION_STATUS.OFFLINE) {
            return;
        }
        if (isFromSelf || e.target.src === defaultCsAvatar) {
            return;
        }
        e.target.src = defaultCsAvatar;
    },
    resend: function (msg) {
        if (msg.state === MSG_STATES.FAILED || msg.state === MSG_STATES.UPLOAD_FAILED) {
            this.props.dispatch(inputActs.resendMsg(msg));
        }
    },
    getMoreMsg: function (e) {
        e = e || window.event;
        eventUtils.preventDefault(e);

        this.getHistoryMsgs();
    },
    getHistoryMsgs: function () {
        this.props.dispatch(msgActs.getHistoryMsgs());

        var txcsid = this.props.app.txcsid,
            historyMsgs = this.props.msg.historyMsgs[txcsid] || {},
            scrollPage = historyMsgs.scrollPage || 0;

        this.props.dispatch(msgActs.setHistoryListPage(txcsid, scrollPage + 1));
    },
    renderTipMsg: function (msg) {
        return (
            <li id={'msg' + msg.msgId} className="custom-msg" key={msg.msgTime}>{msg.msgContent}</li>
        );
        return (
            <li id={ 'msg' + msg.msgId } className={ 'msg-item from-' + (isFromSelf ? 'self' : 'other') } key={ msg.msgId }>
                <img className="avatar" src={ userInfo.pic } width="30" height="30" onError={ function (e) { this.fixCsAavatar(e, isFromSelf) }.bind(this) } />
                <div className="msg-main">
                    <span className="msg-info">
                        <span className="name">{ userInfo.name }</span>
                        <span className="time">{ new Date(msg.msgTime).format('hh:mm:ss') }</span>
                    </span>

                    <div className={contentClasses}>
                        <p dangerouslySetInnerHTML={{ __html: msg.msgContent }}></p>
                        <span className={ 'msg-state ' + stateCls } onClick={ function () {
                            this.resend(msg);
                        }.bind(this) }>
                        </span>
                    </div>
                </div>
            </li>
        );
    },
    renderMsg: function (msg,index) {
        var appState = this.props.app,
            isMobile = appState.isMobile,
            txguid = appState.txguid,
            txcsid = appState.txcsid,
            csInfo = this.props.csInfo,
            guestInfo = appState.guestInfo,
            isFromSelf = msg.fromId === txguid;

        var userInfo = Object.assign({}, isFromSelf ? guestInfo : csInfo);
        if (msg.fromPic) {
            userInfo.pic = msg.fromPic;
        }
        if (msg.fromName) {
            userInfo.name = msg.fromName;
        }

        return (
            <SessionMsg
                msg={msg}
                fromattedTime={ new Date(msg.msgTime).format('hh:mm:ss') }
                userInfo={userInfo}
                isFromSelf={isFromSelf}
                defaultAvatar={ isFromSelf ? visitorDefaultAvatar : csDefaultAvatar }
                resend={this.resend}
                onImgMsgLoad={ this.fixScroll.bind(this, txcsid) }
                onImgMsgError={ this.fixScroll.bind(this, txcsid) }
                key={msg.msgId}
            />
        );

    },
    goToBottom: function () {
        var msgList = document.querySelector('.msg-list');
        msgList.scrollTop = 99999;
        this.props.dispatch(msgActs.setIsShowNewMsgTip(this.props.app.txcsid, false));
    },
    render: function () {
        var appState = this.props.app,
            txguid = appState.txguid,
            txcsid = appState.txcsid;

            // console.log(msg,'msg')

        var msgState = this.props.msg,
            historyMsgs = msgState.historyMsgs[txcsid] || {},
            msgs = msgState.msgs[txcsid] || [],
            isShowGetHistoryMsgBtn = msgState.isShowGetHistoryMsgBtn,
            isCompleted = historyMsgs.isCompleted,
            isGettingHistoryMsgs = msgState.isGettingHistoryMsgs,
            isShowNewMsgTip = msgState.isShowNewMsgTips[txcsid];

        // console.log(msgs, 'msgs')

        var sessMsgsList = msgState.sessMsgsList;
        var isFirstTime = msgState.isFirstTime;

        // var hisLength = Math.max(Math.min(20 - msgs.length, 15), 0, 5);
        var scrollPage = historyMsgs.scrollPage || 0;
        var hisMsgs = historyMsgs.msgs || [];
        var hisSessMsgs = hisMsgs.filter(function (msg) {
            return msg.type === SESSION_MSG_TYPES.SESSION_MSG;
        });
        var hisLength = Math.max(Math.min(20 - hisMsgs.length, 15 * scrollPage), 0, 5);
        //console.log(hisSessMsgs,'ssss')
        hisSessMsgs = hisSessMsgs.slice(-hisLength);
        // var renderMsgs = [].concat(hisSessMsgs).concat(msgs);
        var renderMsgs = [];
        // console.log(msgs,'msg')

        if (sessMsgsList.length === 0 && msgs[0] && !msgs[0].fromId && msgs[0].type === SESSION_MSG_TYPES.TIP_MSG) {
            // console.log(SESSION_MSG_TYPES.TIP_MSG, 'tr')
            if (isFirstTime) {
                renderMsgs = [].concat(sessMsgsList).slice(-5).concat(msgs.slice(1));
            } else {
                renderMsgs = [].concat(sessMsgsList).slice(-20).concat(msgs.slice(1));
            }
        } else {
            if (isFirstTime) {
                renderMsgs = [].concat(sessMsgsList).slice(-5).concat(msgs);
                // console.log(sessMsgsList, 'sessMsgsList')
            } else {
                renderMsgs = [].concat(sessMsgsList).slice(-20).concat(msgs);
            }
        }


        // console.log(renderMsgs, 'renderMsg')

        var languageType = this.props.app.appData ? this.props.app.appData.language : 0;
        var localeKey = getLanguagePackage(languageType);
        var viewMoreStyle = (this.props.noticeContent && this.props.isShowNotice) ? { paddingTop: 30} : {};
        // var msgListStyle = Object.assign(viewMoreStyle, this.props.style || {});

        // console.log(renderMsgs, 'renderMsgs')
                            // switch (msg.type) {
                            //     case SESSION_MSG_TYPES.TIP_MSG:
                            //         return this.renderTipMsg(msg);
                            //     case SESSION_MSG_TYPES.CS_TIP_MSG:
                            //         return this.renderMsg(msg);
                            //     case SESSION_MSG_TYPES.SESSION_MSG:
                            //         return this.renderMsg(msg, index);
                            // }
        return (
            <div className="list-wrapper" style={ this.props.style || {} }>
                <div className="msg-list" style={viewMoreStyle} id="msg-list" onScroll={ this.onScroll.bind(this, txcsid) }>
                    {
                        renderMsgs.length <= 20 && (!isCompleted || !!isCompleted && isFirstTime && sessMsgsList.length > 5) && isShowGetHistoryMsgBtn ?
                        <div
                            className={ 'history-tip' + (isGettingHistoryMsgs ? ' loading' : '') }
                        >
                        {
                            isGettingHistoryMsgs ? null : <a href="javascript:;" onClick={ this.getMoreMsg }>{localeKey.seeMoreMessage}</a>
                        }
                        </div>
                        : null
                    }
                    <ol>
                    {
                        renderMsgs.length > 0 ? renderMsgs.map(function (msg, index) {
                            return this.renderMsg(msg);
                        }.bind(this)) : null
                    }
                    </ol>
                </div>
                <div className="new-msg" onClick={this.goToBottom} style={{ display: isShowNewMsgTip ? 'block' : 'none' }}>
                    新消息
                </div>
            </div>
        );
    }
});

module.exports = connect(function (state) {
    // console.log(state, 'sate');
    return {
        app: state.app,
        msg: state.msg,
        csInfo: state.csInfo
    };
})(MsgList);
