import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ManagePasswordActions from 'actions/managePassword';
import ManagePassword from './ManagePassword';

const mapStateToProps = ({ managePassword }) => ({
    errorText: managePassword.errorText,
    settingForm: managePassword.setting,
    confirmForm: managePassword.confirm,
    modifyForm: managePassword.modify,
    findForm: managePassword.find,
});

const mapDispatchToProps = dispatch => ({
    managePasswordActions: bindActionCreators(ManagePasswordActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManagePassword);
