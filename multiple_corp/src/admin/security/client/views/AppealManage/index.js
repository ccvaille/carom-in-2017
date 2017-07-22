import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AppealActions from 'actions/appealManage';
import AppealManage from './AppealManage';

const mapStateToProps = ({ appealManage }) => ({
  appealManage,
});

const mapDispatchToProps = (dispatch) => ({
  appealActions: bindActionCreators(AppealActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppealManage);
