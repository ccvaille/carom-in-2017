import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    updateLeftMsgFields,
    saveLeftMsg,
    getTrackHistoryList,
    getTrackHistoryListSuccess,
    updateTrackParams,
    getChatList,
    updateChatParams,
    openAddCustomPV,
    getChatListSuccess,
} from 'actions/history';
import ChatRecord from './ChatRecord';

const mapDispatchToProps = (dispatch) => ({
    updateLeftMsgFields: bindActionCreators(updateLeftMsgFields, dispatch),
    saveLeftMsg: bindActionCreators(saveLeftMsg, dispatch),
    getTrackHistoryList: bindActionCreators(getTrackHistoryList, dispatch),
    updateTrackParams: bindActionCreators(updateTrackParams, dispatch),
    updateChatParams: bindActionCreators(updateChatParams, dispatch),
    getChatList: bindActionCreators(getChatList, dispatch),
    openAddCustomPV: bindActionCreators(openAddCustomPV, dispatch),
    getChatListSuccess: bindActionCreators(getChatListSuccess, dispatch),
    getTrackHistoryListSuccess: bindActionCreators(getTrackHistoryListSuccess, dispatch),
});

export default connect(null, mapDispatchToProps)(ChatRecord);
