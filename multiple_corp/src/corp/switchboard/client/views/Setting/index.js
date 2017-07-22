import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Setting from './Setting';
import * as SettingActions from 'actions/switchboardSetting';
import * as CommonModalActions from 'actions/commonModal';

const mapStateToProps = ({ switchboardSetting, commonModal }) => ({
  switchboardSetting,
  commonModal,
});

const mapDispatchToProps = (dispatch) => ({
  settingActions: bindActionCreators(SettingActions, dispatch),
  commonModalActions: bindActionCreators(CommonModalActions, dispatch),
});

const setting = connect(mapStateToProps, mapDispatchToProps)(Setting);
export { setting };