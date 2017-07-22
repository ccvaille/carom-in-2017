import React, { PropTypes } from 'react';
import { Input, Icon } from 'antd';
import defaultAvatar from 'img/default-avatar.png';
import SendButton from 'components/SendButton';
import 'styles/chat-preview.less';
import './float-chat-preview.less';

class FloatChatBoxPreview extends React.Component {
    static propTypes = {
        themeColor: PropTypes.string.isRequired,
        chatTitle: PropTypes.string.isRequired,
        localeKey: PropTypes.string.isRequired,
    }

    static defaultProps = {
        localeKey: 'zh-cn',
    }

    render() {
        const { themeColor, chatTitle, localeKey } = this.props;
        return (
            <div className="chat-preview float-chat-preview">
                <div
                    className="chat-head clearfix"
                    style={{
                        backgroundColor: themeColor,
                    }}
                >
                    <div className="cs-info clearfix">
                        <img src={defaultAvatar} alt="头像" className="cs-avatar" />
                        <div className="cs-misc">
                            <div className="cs-name">客服054号</div>
                            <div className="cs-sign">{chatTitle}</div>
                        </div>
                    </div>
                    <span className="minimize-win" />
                </div>
                <div className="chat-body" />
                <div className="chat-footer">
                    <div className="chat-area">
                        <div className="chat-tools">
                            <Icon type="smile-o" />
                            <Icon type="picture" />
                        </div>
                        <Input type="textarea" rows={3} />
                    </div>
                    <div className="chat-operate">
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
        );
    }
}

export default FloatChatBoxPreview;
