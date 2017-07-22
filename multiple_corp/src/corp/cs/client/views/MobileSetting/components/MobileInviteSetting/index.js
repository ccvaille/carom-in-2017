import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as InviteSettingActions from 'actions/inviteSetting';
import MobileInviteSetting from './MobileInviteSetting';

const mapStateToProps = ({ inviteSetting }) => ({
    mobileInviteSetting: inviteSetting.mobile,
});

const mapDispatchToProps = dispatch => bindActionCreators(InviteSettingActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MobileInviteSetting);
