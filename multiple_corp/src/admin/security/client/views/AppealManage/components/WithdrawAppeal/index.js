import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withdrawAppeal } from 'actions/appealManage';
import WithdrawAppeal from './WithdrawAppeal';

const mapDispatchToProps = (dispatch) => ({
  withdrawAppeal: bindActionCreators(withdrawAppeal, dispatch),
});

export default connect(null, mapDispatchToProps)(WithdrawAppeal);
