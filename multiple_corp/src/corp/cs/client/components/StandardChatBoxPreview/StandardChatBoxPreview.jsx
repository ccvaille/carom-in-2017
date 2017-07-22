import React, { PropTypes } from 'react';
import { Button, Icon, Input } from 'antd';
import classNames from 'classnames';
import SendButton from 'components/SendButton';
import defaultAvatar from 'img/default-avatar.png';
import noticeImage from 'img/icon-notice.png';
import 'styles/chat-preview.less';
import locale from '../../locale';
import './standard-chat-preview.less';

class StandardChatBoxPreview extends React.Component {
    static propTypes = {
        themeColor: PropTypes.string.isRequired,
        chatTitle: PropTypes.string.isRequired,
        chatNotice: PropTypes.string.isRequired,
        localeKey: PropTypes.string.isRequired
    }

    static defaultProps = {
        localeKey: 'zh-cn',
    }

    state = {
        isNoticeOpened: false,
    }

    onOpenNotice = () => {
        this.setState({
            isNoticeOpened: !this.state.isNoticeOpened,
        });
    }

    render() {
        const { themeColor, chatTitle, chatNotice, localeKey } = this.props;
        let noticeStyle = null;
        let colon = '：';

        if (localeKey === 'en-us') {
            colon = ':';
        }

        if (chatNotice) {
            noticeStyle = {
                backgroundColor: '#fffde6',
            };
        } else {
            noticeStyle = {
                backgroundColor: 'transparent',
            };
        }

        const noticeClasses = classNames({
            clearfix: true,
            'chat-notice': true,
            'notice-open': this.state.isNoticeOpened,
        });

        return (
            <div className="chat-preview standard-chat-preview">
                <div
                    className="chat-head clearfix"
                    style={{
                        backgroundColor: themeColor,
                    }}
                >
                    <div className="cs-info">
                        <div className="cs-name">客服054号</div>
                        <div className="cs-sign">{chatTitle}</div>
                    </div>

                    {/*<Icon className="close-win" type="close" />*/}
                </div>
                <div className="standard-body-wrapper clearfix">
                    <div className="chat-part">
                        <div className="chat-body">
                            {
                                chatNotice
                                ?
                                    <div className={noticeClasses} style={noticeStyle}>
                                        <div className="content">
                                            <img src={noticeImage} alt="" style={{ marginRight: 7 }} />
                                            {chatNotice}
                                        </div>
                                        <i role="button" tabIndex="-1" className="icon icon-down open-icon" onClick={this.onOpenNotice} />
                                    </div>
                                : null
                            }
                        </div>
                        <div className="chat-footer">
                            <div className="chat-area">
                                <div className="chat-tools">
                                    <Icon type="smile-o" />
                                    <Icon type="picture" />
                                </div>
                                <Input type="textarea" rows={3} />
                            </div>
                            <div className="chat-operate">
                                <Button
                                    type="ghost"
                                    style={{ marginRight: 12 }}
                                >
                                    {locale[localeKey].close}
                                </Button>
                                <SendButton
                                    localeKey={localeKey}
                                    themeColor={themeColor}
                                />
                                {/*<Button
                                    className="send-btn"
                                    style={{
                                        backgroundColor: themeColor,
                                        borderColor: themeColor,
                                    }}
                                >
                                    {locale[localeKey].send}
                                </Button>*/}
                            </div>
                        </div>
                    </div>

                    <div className="cs-part">
                        <p className="detail info-avatar">
                            <img alt="头像" src={defaultAvatar} width="120" height="120" />
                        </p>
                        <p className="detail info-name">
                            <a>客服054号</a>
                        </p>
                        <p className="detail info-pos">
                            <span className="key">{locale[localeKey].position}{colon}</span>
                            <span className="value">售后客服</span>
                        </p>
                        <p className="detail info-tel">
                            <span className="key">{locale[localeKey].tel}{colon}</span>
                            <span className="value" />
                        </p>
                        <p className="detail info-cel">
                            <span className="key">{locale[localeKey].phone}{colon}</span>
                            <span className="value" />
                        </p>
                        <p className="detail info-email">
                            <span className="key">{locale[localeKey].email}{colon}</span>
                            <span className="value" />
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default StandardChatBoxPreview;
