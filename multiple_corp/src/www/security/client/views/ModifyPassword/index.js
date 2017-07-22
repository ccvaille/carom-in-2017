import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateModifyForm, updateErrorText, checkOldPassword } from 'actions/managePassword';
import ModifyPassword from './ModifyPassword';

const mapStateToProps = ({ managePassword }) => ({
    errorText: managePassword.errorText,
    modifyForm: managePassword.modify,
});

const mapDispatchToProps = dispatch => ({
    updateModifyForm: bindActionCreators(updateModifyForm, dispatch),
    updateErrorText: bindActionCreators(updateErrorText, dispatch),
    checkOldPassword: bindActionCreators(checkOldPassword, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModifyPassword);
