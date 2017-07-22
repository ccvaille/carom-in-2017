import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateFindForm, updateErrorText, getCurrentPhone, sendSms } from 'actions/managePassword';
import FindManagePassword from './FindManagePassword';

const mapStateToProps = ({ managePassword }) => ({
    errorText: managePassword.errorText,
    findForm: managePassword.find,
    currentPhone: managePassword.currentPhone,
    isDisableGetCode: managePassword.isDisableGetCode,
    codeCountDown: managePassword.codeCountDown,
});

const mapDispatchToProps = dispatch => ({
    updateFindForm: bindActionCreators(updateFindForm, dispatch),
    updateErrorText: bindActionCreators(updateErrorText, dispatch),
    getCurrentPhone: bindActionCreators(getCurrentPhone, dispatch),
    sendSms: bindActionCreators(sendSms, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(FindManagePassword);
