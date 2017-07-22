import React, { PropTypes } from 'react';
import VisitorEntrySet from 'views/VisitorEntrySet';
import ChatBoxSet from 'views/ChatBoxSet';
import InviteBoxSet from 'views/InviteBoxSet';
import MobileEntryPreview from './components/MobileEntryPreview';
import MobileEntrySetting from './components/MobileEntrySetting';
import MobileChatPreview from './components/MobileChatPreview';
import MobileChatSetting from './components/MobileChatSetting';
import MobileInvitePreview from './components/MobileInvitePreview';
import MobileInviteSetting from './components/MobileInviteSetting';
import MobileAccessCode from './components/MobileAccessCode';

const MobileSetting = ({ activeTab }) => (
    <div className="mobile-setting">
        <MobileAccessCode />
        <VisitorEntrySet
            title="手机访客入口样式"
            previewSide={<MobileEntryPreview />}
            settingFormSide={<MobileEntrySetting />}
            activeTab={activeTab}
        />
        <ChatBoxSet
            title="手机访客会话框样式"
            previewSide={<MobileChatPreview />}
            settingFormSide={<MobileChatSetting />}
            activeTab={activeTab}
        />
        <InviteBoxSet
            title="手机访客邀请框样式"
            previewSide={<MobileInvitePreview />}
            settingFormSide={<MobileInviteSetting />}
            activeTab={activeTab}
        />
    </div>
);

MobileSetting.propTypes = {
    activeTab: PropTypes.string.isRequired,
};

export default MobileSetting;
