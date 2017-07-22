import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    getQuickReplies,
    toggleEditReplyModal,
    toggleRemoveReplyModal,
    addReply,
    editReply,
    removeReply,
} from 'actions/quickreply';
import QuickReplyDetail from './QuickReplyDetail';

const mapStateToProps = ({ quickreply }) => ({
    replies: quickreply.replies,
    pagination: quickreply.pagination,
    editReplyModalVisible: quickreply.editReplyModalVisible,
    removeReplyModalVisible: quickreply.removeReplyModalVisible,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    getQuickReplies,
    toggleEditReplyModal,
    toggleRemoveReplyModal,
    addReply,
    editReply,
    removeReply,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(QuickReplyDetail);
