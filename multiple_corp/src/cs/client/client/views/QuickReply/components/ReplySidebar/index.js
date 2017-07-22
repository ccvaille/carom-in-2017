import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    getReplyGroups,
    updateGroupName,
    addGroup,
    addGroupRemote,
    toggleRemoveGroupModal,
    removeGroupRemote,
    removeGroup,
    saveGroupEdit,
} from 'actions/quickreply';
import ReplySidebar from './ReplySidebar';

const mapStateToProps = ({ quickreply, app }) => ({
    ...quickreply,
    userInfo: app.userInfo,
});

const mapDispatchToProps = dispatch => ({
    getReplyGroups: bindActionCreators(getReplyGroups, dispatch),
    updateGroupName: bindActionCreators(updateGroupName, dispatch),
    addGroup: bindActionCreators(addGroup, dispatch),
    addGroupRemote: bindActionCreators(addGroupRemote, dispatch),
    toggleRemoveGroupModal: bindActionCreators(toggleRemoveGroupModal, dispatch),
    removeGroup: bindActionCreators(removeGroup, dispatch),
    removeGroupRemote: bindActionCreators(removeGroupRemote, dispatch),
    saveGroupEdit: bindActionCreators(saveGroupEdit, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReplySidebar);
