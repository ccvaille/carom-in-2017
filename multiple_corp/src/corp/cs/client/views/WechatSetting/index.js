import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import '~comm/public/styles/iconfont.less';
import * as WechatSettingActions from 'actions/wechatSetting';
import WechatSetting from './WechatSetting';
import './wechat-setting.less';

const mapStateToProps = ({ wechatSetting }) => ({
    wechatSetting,
});

const mapDispatchToProps = dispatch => bindActionCreators(WechatSettingActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(WechatSetting);
