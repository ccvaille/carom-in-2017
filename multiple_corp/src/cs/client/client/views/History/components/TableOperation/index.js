import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    updateGetParams,
    getHistoryList,
    exportHistoryList,
    getKfList,
    getHistoryListSuccess,
    setShowDatePicker,
} from 'actions/history';
import TableOperation from './TableOperation';

const mapDispatchToProps = (dispatch) => ({
    updateGetParams: bindActionCreators(updateGetParams, dispatch),
    getHistoryList: bindActionCreators(getHistoryList, dispatch),
    exportHistoryList: bindActionCreators(exportHistoryList, dispatch),
    getKfList: bindActionCreators(getKfList, dispatch),
    getHistoryListSuccess: bindActionCreators(getHistoryListSuccess, dispatch),
    setShowDatePicker: bindActionCreators(setShowDatePicker, dispatch),
});

export default connect(null, mapDispatchToProps)(TableOperation);
