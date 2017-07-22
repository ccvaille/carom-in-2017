import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as CsAssignActions from 'actions/csAssign';
import CsWechatAssign from './CsWechatAssign';

const mapStateToProps = ({ csAssign }) => ({
    csWechatAssign: csAssign,
});

const mapDispatchToProps = dispatch => bindActionCreators(CsAssignActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CsWechatAssign);
