import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getChatSetting } from 'actions/chatSetting';
import ChatBoxSet from './ChatBoxSet';

const mapDispatchToProps = dispatch => ({
    getChatSetting: bindActionCreators(getChatSetting, dispatch),
});

export default connect(null, mapDispatchToProps)(ChatBoxSet);
