import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCountChartOptions } from 'utils/statsSelectors';
import * as VisitLinkStatsActions from 'actions/visitLinkStats';
import * as ChartColorTypes from 'constants/ChartColorTypes';
import VisitLinkStats from './VisitLinkStats';

const mapStateToProps = ({ visitLinkStats }) => ({
    visitLinkStats,
    chartOptions: getCountChartOptions({
        legend: ['浏览量'],
        series: [{
            name: '浏览量',
        }],
        xPosition: 'top',
        color: ChartColorTypes.MALIBU_COLOR,
        statsFnType: 1,
    })(visitLinkStats),
});

const mapDispatchToProps = dispatch => bindActionCreators(VisitLinkStatsActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(VisitLinkStats);
