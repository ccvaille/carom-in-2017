import React, { PropTypes } from 'react';
import { Input, Icon, Button } from 'antd';
import locale from '../../locale';
import './mobile-chat-preview.less';

const MobileChatBoxPreview = ({
    themeColor,
    localeKey,
}) => (
    <div className="chat-preview mobile-chat-preview">
        <div
            className="chat-head clearfix"
            style={{
                backgroundColor: themeColor,
            }}
        >
            <div className="cs-info clearfix">
                <Icon className="left-sign" type="arrow-left" />
                <span className="cs-name">客服054号</span>
            </div>
        </div>
        <div className="chat-body" />
        <div className="chat-footer">
            <div className="chat-area">
                <div className="chat-tools">
                    <Icon type="smile-o" />
                    <Icon type="picture" />
                    <Input
                        style={{ width: 158, border: '1px solid #dadde1', borderRadius: '4px', verticalAlign: 'baseline' }}
                        type="text"
                    />
                </div>
            </div>
            <div className="chat-operate">
                <Button
                    className="send-btn"
                    style={{
                        backgroundColor: themeColor,
                        borderColor: themeColor,
                    }}
                >
                    {locale[localeKey].send}
                </Button>
            </div>
        </div>
    </div>
    );

MobileChatBoxPreview.propTypes = {
    themeColor: PropTypes.string.isRequired,
    localeKey: PropTypes.string.isRequired,
};

export default MobileChatBoxPreview;
