import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as VisitorsActions from 'actions/visitors';
import { sendInvite } from 'actions/chatEcim';
import { getInviteSetting } from 'actions/inviteSetting';
import Visitors from './Visitors';

const mapStateToProps = ({ app, visitors, inviteSetting }) => ({
    userInfo: app.userInfo,
    offlineModalVisible: app.offlineModalVisible,
    visitors,
    inviteSetting,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    ...VisitorsActions,
    getInviteSetting,
    sendInvite,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Visitors);
