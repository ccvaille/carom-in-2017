import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import H5Form from "./H5Form";
import * as h5FormActions from "actions/h5FormActions";
// import * as CommonModalActions from 'actions/commonModal';

const mapStateToProps = ({ h5FormReducers }) => ({
    h5FormReducers,
});

const mapDispatchToProps = dispatch => ({
    h5FormActions: bindActionCreators(h5FormActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(H5Form);
