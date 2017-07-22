import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as KeywordActions from 'actions/keywordStats';
import { getCountChartOptionsCommon } from 'utils/statsSelectors.js';
import * as ChartColorTypes from 'constants/ChartColorTypes';
import KeywordStats from './KeywordStats';

const mapStateToProps = ({ keywordStats }) => ({
    keywordStats,
    getCountChartOptionsCommon: getCountChartOptionsCommon({
        color: ChartColorTypes.MALIBU_COLOR,
        legend: ['搜索次数'],
        series: [{
            name: '搜索次数',
        }],
        keys: 'keyword',
        counts: 'count',
        xPosition: 'top',
    })(keywordStats),
});

const mapDispatchToProps = dispatch => bindActionCreators(KeywordActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(KeywordStats);
