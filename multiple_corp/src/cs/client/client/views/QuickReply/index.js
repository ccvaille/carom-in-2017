import { connect } from 'react-redux';
import QuickReply from './QuickReply';

const mapStateToProps = ({ quickreply }) => ({
    commonReplyGroups: quickreply.commonReplyGroups,
});

export default connect(mapStateToProps)(QuickReply);
