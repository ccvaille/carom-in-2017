import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import CsAssign from './CsAssign';

// const mapStateToProps = ({ csAssign }) => ({
//     ...csAssign,
// });

// const mapDispatchToProps = (dispatch) => bindActionCreators(CsAssignActions, dispatch);

export default connect()(CsAssign);
