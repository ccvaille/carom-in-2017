import { connect } from 'react-redux';
import InvitePreview from './InvitePreview';

const mapStateToProps = ({ inviteSetting }) => ({
    pcInviteSetting: inviteSetting.pc,
});

export default connect(mapStateToProps)(InvitePreview);
