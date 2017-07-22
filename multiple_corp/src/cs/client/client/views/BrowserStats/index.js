import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as BrowserStatsActions from 'actions/browserStats';
import { getCountChartOptionsCommon } from 'utils/statsSelectors.js';
import * as ChartColorTypes from 'constants/ChartColorTypes';
import BrowserStats from './BrowserStats';

const mapStateToProps = ({ browserStats }) => ({
    browserStats,
    getCountChartOptionsCommon: getCountChartOptionsCommon({
        color: ChartColorTypes.MALIBU_COLOR,
        legend: ['全部访客UV'],
        series: [{
            name: '全部访客UV',
        }],
        keys: 'browserName',
        counts: 'visitor',
        xPosition: 'top',
    })(browserStats),
});

const mapDispatchToProps = dispatch => bindActionCreators(BrowserStatsActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(BrowserStats);
