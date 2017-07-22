import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleApplyPass, passApplyOne, clearPhoneList } from 'actions/applyList';
import ApplyPassModal from './ApplyPassModal';

const mapDispatchToProps = (dispatch) => ({
  toggleApplyPass: bindActionCreators(toggleApplyPass, dispatch),
  passApplyOne: bindActionCreators(passApplyOne, dispatch),
  clearPhoneList: bindActionCreators(clearPhoneList, dispatch),
});

export default connect(null, mapDispatchToProps)(ApplyPassModal);
