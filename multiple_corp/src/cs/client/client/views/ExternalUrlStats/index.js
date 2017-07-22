import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCountChartOptionsCommon } from 'utils/statsSelectors.js';
import * as UrlStatsActions from 'actions/externalUrlStats';
import * as ChartColorTypes from 'constants/ChartColorTypes';
import ExternalUrlStats from './ExternalUrlStats';

const mapStateToProps = ({ externalUrlStats }) => ({
    externalUrlStats,
    getCountChartOptionsCommon: getCountChartOptionsCommon({
        color: ChartColorTypes.MALIBU_COLOR,
        legend: ['来访次数'],
        series: [{
            name: '来访次数',
        }],
        keys: 'domain',
        counts: 'count',
        xPosition: 'top',
    })(externalUrlStats),
});

const mapDispatchToProps = dispatch => bindActionCreators(UrlStatsActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ExternalUrlStats);
