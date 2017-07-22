import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Sidebar from "./Sidebar";
import * as messageActions from "actions/messageActions";

const mapStateToProps = ({ messageReducers }) => ({
    messageReducers,
});

const mapDispatchToProps = dispatch => ({
    messageActions: bindActionCreators(messageActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
