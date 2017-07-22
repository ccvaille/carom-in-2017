import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as CsAssignActions from 'actions/csAssign';
import SelectCsModal from './SelectCsModal';

const mapStateToProps = ({ csAssign }) => ({
    ...csAssign,
});

const mapDispatchToProps = dispatch => bindActionCreators(CsAssignActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SelectCsModal);
