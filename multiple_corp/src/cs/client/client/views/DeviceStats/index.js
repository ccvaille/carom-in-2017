import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DeviceStatsActions from 'actions/deviceStats';
import { getCountChartOptionsCommon } from 'utils/statsSelectors.js';
import * as ChartColorTypes from 'constants/ChartColorTypes';
import DeviceStats from './DeviceStats';

const mapStateToProps = ({ deviceStats }) => ({
    deviceStats,
    getCountChartOptionsCommon: getCountChartOptionsCommon({
        color: ChartColorTypes.MALIBU_COLOR,
        legend: ['全部访客UV'],
        series: [{
            name: '全部访客UV',
        }],
        keys: 'f_terminal',
        counts: 'f_visitor',
        xPosition: 'top',
    })(deviceStats),
});

const mapDispatchToProps = dispatch => bindActionCreators(DeviceStatsActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DeviceStats);
