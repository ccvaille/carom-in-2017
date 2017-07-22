import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleModifyPhone, modifyPhone } from 'actions/applyList';
import ModifyPhoneModal from './ModifyPhoneModal';

const mapDispatchToProps = (dispatch) => ({
  toggleModifyPhone: bindActionCreators(toggleModifyPhone, dispatch),
  modifyPhone: bindActionCreators(modifyPhone, dispatch),
});

export default connect(null, mapDispatchToProps)(ModifyPhoneModal);
