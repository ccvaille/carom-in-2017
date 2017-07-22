import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Transform from "./Transform";
import * as transformActions from "actions/transformActions";

const mapStateToProps = ({ transformReducers }) => ({
    transformReducers,
});

const mapDispatchToProps = dispatch => ({
    transformActions: bindActionCreators(transformActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Transform);
