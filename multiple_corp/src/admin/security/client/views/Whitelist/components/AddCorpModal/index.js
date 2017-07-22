import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleAddModal, addWhitelistCorps, addCorpsChange } from 'actions/whitelist';
import AddCorpModal from './AddCorpModal';

const mapStateToProps = ({ whitelist }) => ({
  addModalVisible: whitelist.addModalVisible,
  addCorps: whitelist.addCorps,
});

const mapDispatchToProps = (dispatch) => ({
  toggleAddModal: bindActionCreators(toggleAddModal, dispatch),
  addWhitelistCorps: bindActionCreators(addWhitelistCorps, dispatch),
  addCorpsChange: bindActionCreators(addCorpsChange, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddCorpModal);
