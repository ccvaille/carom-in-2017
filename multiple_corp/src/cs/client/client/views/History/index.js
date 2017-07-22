import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as HistoryActions from 'actions/history';
import History from './History';

const mapStateToProps = ({ history, app }) => ({
    history,
    app,
});

const mapDispatchToProps = (dispatch) => ({
    historyActions: bindActionCreators(HistoryActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(History);
