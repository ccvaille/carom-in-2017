import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ManagePasswordActions from 'actions/managePassword';
import SetPassword from './SetPassword';

const mapStateToProps = ({ managePassword }) => ({
    errorText: managePassword.errorText,
    settingForm: managePassword.setting,
});

const mapDispatchToProps = dispatch => ({
    managePasswordActions: bindActionCreators(ManagePasswordActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SetPassword);
