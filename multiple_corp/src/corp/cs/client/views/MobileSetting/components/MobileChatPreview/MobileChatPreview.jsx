import React, { PropTypes } from 'react';
// import FloatChatBoxPreview from 'components/FloatChatBoxPreview';
import MobileChatBoxPreview from 'components/MobileChatBoxPreview';
import 'styles/mobile-common.less';
import './mobile-chat-preview.less';

const MobileChatPreview = ({
    mobileChatSetting,
    localeKey,
}) => (
    <div className="mobile-chat-preview">
        <div className="preview entry-preview mobile-preview">
            <div className="head">
                <h4>效果预览</h4>
            </div>

            <div className="preview-result">
                <MobileChatBoxPreview
                    themeColor={mobileChatSetting.themeColor}
                    localeKey={localeKey}
                />
            </div>
        </div>
    </div>
);

MobileChatPreview.propTypes = {
    mobileChatSetting: PropTypes.object.isRequired,
    localeKey: PropTypes.string.isRequired,
};

export default MobileChatPreview;
