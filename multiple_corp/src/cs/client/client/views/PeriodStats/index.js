import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as PeriodStatsActions from 'actions/periodStats';
import { getChartOptions } from './selectors';
import PeriodStats from './PeriodStats';

const mapStateToProps = ({ periodStats }) => ({
    periodStats,
    chartOptions: getChartOptions(periodStats),
});

const mapDispatchToProps = dispatch => bindActionCreators(PeriodStatsActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PeriodStats);
