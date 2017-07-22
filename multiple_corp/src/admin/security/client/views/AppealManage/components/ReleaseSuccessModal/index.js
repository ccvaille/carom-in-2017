import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { sendReleaseSms, toggleReleaseSuccessModal } from 'actions/appealManage';
import ReleaseSuccessModal from './ReleaseSuccessModal';

const mapStateToProps = ({ appealManage }) => ({
  releaseSuccssVisible: appealManage.releaseSuccssVisible,
});

const mapDispatchToProps = (dispatch) => ({
  sendReleaseSms: bindActionCreators(sendReleaseSms, dispatch),
  toggleReleaseSuccessModal: bindActionCreators(toggleReleaseSuccessModal, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReleaseSuccessModal);
