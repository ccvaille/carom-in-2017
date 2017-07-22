import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ApplyActions from 'actions/applySwitchboard';
import * as CommonModalActions from 'actions/commonModal';
import Apply from './Apply';

const mapStateToProps = ({ applySwitchboard, commonModal }) => ({
  applySwitchboard,
  commonModal,
});

const mapDispatchToProps = (dispatch) => ({
  applyActions: bindActionCreators(ApplyActions, dispatch),
  commonModalActions: bindActionCreators(CommonModalActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Apply);
