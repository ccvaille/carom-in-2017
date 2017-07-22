import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { selectSession } from '../../actions/chatSessionList';
import * as ChatGuestTerminals from '../../constants/ChatGuestTerminals';
import GuestTypes from '~cscommon/consts/guestTypes';

const deviceAvatars = {
    [ChatGuestTerminals.PC]: require('../../images/client-device-pc.png'),
    [ChatGuestTerminals.CELL_PHONE]: require('../../images/client-device-phone.png'),
    [ChatGuestTerminals.WX]: require('../../images/client-device-wx.png'),
    [ChatGuestTerminals.DEFAULT]: require('../../images/client-device-wx.png'),
};

import noneImg from 'images/none.png';

class SessionList extends React.Component {
    selectSession(guid, txguid) {
        const { dispatch } = this.props;
        dispatch(selectSession(guid, txguid));
    }
    getFaceImg(guestInfo) {
        let { visitortype, terminal, face } = guestInfo;

        if (face) {
            return face;
        }

        let faceKey = ChatGuestTerminals.DEFAULT;
        switch (visitortype) {
            case GuestTypes.WEB: {
                faceKey = terminal;
                break;
            }
            case GuestTypes.WX:
                faceKey = ChatGuestTerminals.WX;
                break;
            default:
                return ;
        }
        return deviceAvatars[faceKey];
    }
    getTerminalText(guestInfo) {
        let { visitortype, terminal } = guestInfo;
        switch (visitortype) {
            case GuestTypes.WEB: {
                if (terminal === ChatGuestTerminals.PC) {
                    return '电脑';
                } else {
                    return '手机';
                }
            }
            case GuestTypes.WX:
                return '微信';
            case GuestTypes.QQ:
                return 'QQ';
            default:
                return '未知终端';
        }
    }
    render() {
        const { sessions, guests, guid, txguid } = this.props.chat;
        const selectedGuest = txguid;
        return (
            <div className="session-list">
                <h3>与我的对话（{sessions.length}）</h3>
                <ul className="list-box">
                    {
                        sessions.length ? sessions.map((item) => {
                            const {
                                guid,
                                txguid,
                                sessionTime,
                                abstractText = '进入对话',
                                unreadNums,
                                visitortype,
                                lastFrom,
                            } = item;

                            const guestInfo = guests[txguid] || {};
                            const { guidName } = guestInfo;
                            const activeCls = (selectedGuest === txguid ? ' active' : '');

                            return (
                                <li className={`session-item from-${guid}${activeCls}`}
                                    key={guid}
                                    onClick={() => this.selectSession(guid, txguid)}>
                                    <img className="avatar" src={ this.getFaceImg(guestInfo) } width="30" height="30" />
                                    <a className="name" href="javascript:;">{`${guidName || 'loading...'}`}</a>
                                    <span className="time">{sessionTime ? moment(sessionTime).format('HH:mm:ss') : ''}</span>
                                    <p className="abstract">
                                        【{this.getTerminalText(guestInfo)}】{abstractText}
                                    </p>
                                    {
                                        !!unreadNums ? <span className="unread-num">{unreadNums > 99 ? '99+' : unreadNums}</span> : null
                                    }
                                </li>
                            );
                        }) : (<div className="none-session">
                            <img src={noneImg} alt="暂无我的对话" />
                            <span>暂无我的对话</span>
                        </div>)
                    }
                </ul>
            </div>
        );
    }
}

export default connect(state => {
    const { chat } = state;
    return {
        chat,
    };
})(SessionList);
