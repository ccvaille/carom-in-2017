import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleReleaseFailModal } from 'actions/appealManage';
import ReleaseFailModal from './ReleaseFailModal';

const mapStateToProps = ({ appealManage }) => ({
  releaseFailVisible: appealManage.releaseFailVisible,
});

const mapDispatchToProps = (dispatch) => ({
  toggleReleaseFailModal: bindActionCreators(toggleReleaseFailModal, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReleaseFailModal);
