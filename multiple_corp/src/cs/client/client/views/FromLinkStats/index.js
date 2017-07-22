import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCountChartOptions } from 'utils/statsSelectors';
import * as FromLinkStatsActions from 'actions/fromLinkStats';
import * as ChartColorTypes from 'constants/ChartColorTypes';
import FromLinkStats from './FromLinkStats';

const mapStateToProps = ({ fromLinkStats }) => ({
    fromLinkStats,
    chartOptions: getCountChartOptions({
        legend: ['来访次数'],
        series: [{
            name: '来访次数',
        }],
        xPosition: 'top',
        color: ChartColorTypes.MALIBU_COLOR,
        statsFnType: 1,
    })(fromLinkStats),
});

const mapDispatchToProps = dispatch => bindActionCreators(FromLinkStatsActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FromLinkStats);
