import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setAlreadyRead, excludeWechatSessions } from 'actions/chatSessionList';
import { showSessTip } from 'actions/chatInput';
import { handleCrmSaveSuccess, handleOfflineMessageRedirect } from 'actions/history';
import {
    toggleOfflineModal,
    updateActiveMenu,
    updateAppMenus,
    updateUserInfo,
} from 'actions/app';
import { txImLogin, txImLogout, csLogout, goChatting, getGuestDetail } from 'actions/chat';
import { getCrmInfo } from 'actions/visitorDetails';
import MainLayout from './MainLayout';

const mapStateToProps = ({ app, chat }) => ({
    app,
    haveUnread: chat.haveUnread,
    guests: chat.guests,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setAlreadyRead,
    showSessTip,
    handleCrmSaveSuccess,
    handleOfflineMessageRedirect,
    toggleOfflineModal,
    txImLogin,
    txImLogout,
    goChatting,
    getGuestDetail,
    updateActiveMenu,
    updateUserInfo,
    updateAppMenus,
    excludeWechatSessions,
    getCrmInfo,
    csLogout,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);
