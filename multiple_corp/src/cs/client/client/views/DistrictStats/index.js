import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DistrictActions from 'actions/districtStats';
import { getCountChartOptionsCommon } from 'utils/statsSelectors.js';
import * as ChartColorTypes from 'constants/ChartColorTypes';
import DistrictStats from './DistrictStats';

const mapStateToProps = ({ districtStats }) => ({
    districtStats,
    getCountChartOptionsCommon: getCountChartOptionsCommon({
        color: ChartColorTypes.MALIBU_COLOR,
        legend: ['全部访客UV'],
        series: [{
            name: '全部访客UV',
        }],
        keys: 'province',
        counts: 'visitor',
        xPosition: 'top',
    })(districtStats),
});

const mapDispatchToProps = dispatch => bindActionCreators(DistrictActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DistrictStats);
