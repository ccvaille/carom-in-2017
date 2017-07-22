import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChatSettingActions from 'actions/chatSetting';
import MobileChatSetting from './MobileChatSetting';

const mapStateToProps = ({ chatSetting }) => ({
    mobileChatSetting: chatSetting.mobile,
});

const mapDispatchToProps = dispatch => bindActionCreators(ChatSettingActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MobileChatSetting);
