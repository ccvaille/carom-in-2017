import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import H5FormData from "./H5FormData";
import * as h5FormDataActions from "actions/h5FormDataActions";
// import * as CommonModalActions from 'actions/commonModal';

const mapStateToProps = ({ h5FormDataReducers }) => ({
    h5FormDataReducers,
});

const mapDispatchToProps = dispatch => ({
    h5FormDataActions: bindActionCreators(h5FormDataActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(H5FormData);
