import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChatSettingActions from 'actions/chatSetting';
import PcChatSetting from './PcChatSetting';

const mapStateToProps = ({ chatSetting }) => ({
    pcChatSetting: chatSetting.pc,
});

const mapDispatchToProps = dispatch => bindActionCreators(ChatSettingActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PcChatSetting);
