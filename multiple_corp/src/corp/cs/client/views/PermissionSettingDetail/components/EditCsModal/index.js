import { connect } from 'react-redux';
import EditCsModal from './EditCsModal';

const mapStateToProps = ({ csGroups }) => ({
    csGroups: csGroups.csGroups,
});

export default connect(mapStateToProps)(EditCsModal);
