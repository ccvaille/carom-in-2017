import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as InviteSettingActions from 'actions/inviteSetting';
import PcInviteSetting from './PcInviteSetting';

const mapStateToProps = ({ inviteSetting }) => ({
    pcInviteSetting: inviteSetting.pc,
});

const mapDispatchToProps = dispatch => bindActionCreators(InviteSettingActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PcInviteSetting);
