import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import H5Detail from "./H5Detail";
import * as h5FormDetailActions from "actions/h5FormDetailActions";
// import * as CommonModalActions from 'actions/commonModal';

const mapStateToProps = ({ h5FormDetailReducers }) => ({
    h5FormDetailReducers,
});

const mapDispatchToProps = dispatch => ({
    h5FormDetailActions: bindActionCreators(h5FormDetailActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(H5Detail);
