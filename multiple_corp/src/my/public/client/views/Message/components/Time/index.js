import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Time from "./Time";
import * as messageActions from "actions/messageActions";

const mapStateToProps = ({ timeReducers }) => ({
    timeReducers,
});

const mapDispatchToProps = dispatch => ({
    messageActions: bindActionCreators(messageActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Time);
