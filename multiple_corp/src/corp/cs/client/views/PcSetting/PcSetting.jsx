import React, { PropTypes } from 'react';
import VisitorEntrySet from 'views/VisitorEntrySet';
import ChatBoxSet from 'views/ChatBoxSet';
import InviteBoxSet from 'views/InviteBoxSet';
import EntryPreview from './components/EntryPreview';
import PcEntrySetting from './components/PcEntrySetting';
import PcChatPreview from './components/PcChatPreview';
import PcChatSetting from './components/PcChatSetting';
import InvitePreview from './components/InvitePreview';
import PcInviteSetting from './components/PcInviteSetting';
import PcAccessCode from './components/PcAccessCode';

// import CorpStructure from 'components/CorpStructure';

const PcSetting = ({ activeTab }) => (
    <div className="pc-setting">
        <PcAccessCode />
        <VisitorEntrySet
            title="网站访客入口样式"
            previewSide={<EntryPreview />}
            settingFormSide={<PcEntrySetting />}
            activeTab={activeTab}
        />
        <ChatBoxSet
            title="网站访客会话框样式"
            previewSide={<PcChatPreview />}
            settingFormSide={<PcChatSetting />}
            activeTab={activeTab}
        />
        <InviteBoxSet
            title="网站访客邀请框样式"
            previewSide={<InvitePreview />}
            settingFormSide={<PcInviteSetting />}
            activeTab={activeTab}
        />
    </div>
);

PcSetting.propTypes = {
    activeTab: PropTypes.string.isRequired,
};

export default PcSetting;
