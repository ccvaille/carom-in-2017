import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getInviteSetting } from 'actions/inviteSetting';
import InviteBoxSet from './InviteBoxSet';

const mapDispatchToProps = (dispatch) => ({
    getInviteSetting: bindActionCreators(getInviteSetting, dispatch),
});

export default connect(null, mapDispatchToProps)(InviteBoxSet);
