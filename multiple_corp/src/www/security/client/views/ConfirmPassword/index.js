import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateConfirmForm, updateErrorText, confirmPassword } from 'actions/managePassword';
import ConfirmPassword from './ConfirmPassword';

const mapStateToProps = ({ managePassword }) => ({
    errorText: managePassword.errorText,
    confirmForm: managePassword.confirm,
});

const mapDispatchToProps = dispatch => ({
    updateConfirmForm: bindActionCreators(updateConfirmForm, dispatch),
    updateErrorText: bindActionCreators(updateErrorText, dispatch),
    confirmPassword: bindActionCreators(confirmPassword, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmPassword);
