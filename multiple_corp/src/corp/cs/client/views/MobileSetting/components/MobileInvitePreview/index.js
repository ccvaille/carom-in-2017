import { connect } from 'react-redux';
import MobileInvitePreview from './MobileInvitePreview';

const mapStateToProps = ({ inviteSetting }) => ({
    mobileInviteSetting: inviteSetting.mobile,
});

export default connect(mapStateToProps)(MobileInvitePreview);
