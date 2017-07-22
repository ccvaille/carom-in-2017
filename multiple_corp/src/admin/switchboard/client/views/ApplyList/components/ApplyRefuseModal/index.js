import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleApplyRefuse, refuseApply } from 'actions/applyList';
import ApplyRefuseModal from './ApplyRefuseModal';

const mapDispatchToProps = (dispatch) => ({
  toggleApplyRefuse: bindActionCreators(toggleApplyRefuse, dispatch),
  refuseApply: bindActionCreators(refuseApply, dispatch),
});

export default connect(null, mapDispatchToProps)(ApplyRefuseModal);
