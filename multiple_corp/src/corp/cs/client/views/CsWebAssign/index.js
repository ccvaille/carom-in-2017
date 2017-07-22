import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
// import * as CsAssignActions from 'actions/csAssign';
import CsWebAssign from './CsWebAssign';

// const mapStateToProps = ({ csAssign }) => ({
//     ...csAssign,
// });

// const mapDispatchToProps = (dispatch) => bindActionCreators(CsAssignActions, dispatch);

export default connect()(CsWebAssign);
