import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as SearchStatsActions from 'actions/searchStats';
import { getCountChartOptionsCommon } from 'utils/statsSelectors.js';
import * as ChartColorTypes from 'constants/ChartColorTypes';
import SearchEngineStats from './SearchEngineStats';

const mapStateToProps = ({ searchStats }) => ({
    searchStats,
    getCountChartOptionsCommon: getCountChartOptionsCommon({
        color: ChartColorTypes.MALIBU_COLOR,
        legend: ['关键词个数'],
        series: [{
            name: '关键词个数',
        }],
        keys: 'SearchName',
        counts: 'keywords',
        xPosition: 'top',
    })(searchStats),
});

const mapDispatchToProps = dispatch => bindActionCreators(SearchStatsActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SearchEngineStats);
