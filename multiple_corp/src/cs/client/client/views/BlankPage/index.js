import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    updateAppMenus,
    updateUserInfo,
} from 'actions/app';
import { excludeWechatSessions } from 'actions/chatSessionList';
import { txImLogin } from 'actions/chat';
import BlankPage from './BlankPage';

const mapStateToProps = ({ app }) => ({
    offlineType: app.offlineType,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    txImLogin,
    updateAppMenus,
    updateUserInfo,
    excludeWechatSessions,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(BlankPage);
