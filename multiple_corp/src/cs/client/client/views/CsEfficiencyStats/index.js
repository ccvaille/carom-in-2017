import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as EfficiencyStatsActions from 'actions/efficiencyStats';
import CsEfficiencyStats from './CsEfficiencyStats';

const mapStateToProps = ({ efficiencyStats }) => ({
    efficiencyStats,
    // chartOptions: getCsChartOptions(efficiencyStats),
});

const mapDispatchToProps = dispatch => bindActionCreators(EfficiencyStatsActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CsEfficiencyStats);
