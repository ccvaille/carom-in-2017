import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as OverviewStatsActions from 'actions/overviewStats';
import OverviewStats from './OverviewStats';

const mapStateToProps = ({ overviewStats, app }) => ({
    userInfo: app.userInfo,
    overviewStats,
});

const mapDispatchToProps = dispatch => bindActionCreators(OverviewStatsActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OverviewStats);
