import { connect } from 'react-redux';
import PermissionSetting from './PermissionSetting';

const mapStateToProps = ({ csGroups }) => ({
    csGroups: csGroups.csGroups,
});

export default connect(mapStateToProps)(PermissionSetting);
