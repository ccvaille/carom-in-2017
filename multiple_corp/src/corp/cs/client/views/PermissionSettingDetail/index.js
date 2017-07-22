import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as PermissionSetActions from 'actions/permissionSet';
import PermissionSettingDetail from './PermissionSettingDetail';

const mapStateToProps = ({ permissionSet }) => ({
    ...permissionSet,
});
const mapDispatchToProps = dispatch => bindActionCreators(PermissionSetActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PermissionSettingDetail);
