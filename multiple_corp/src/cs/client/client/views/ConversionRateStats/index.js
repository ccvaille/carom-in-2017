import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import * as ConversionStatsActions from 'actions/conversionStats';
import { getChartOptions } from './selectors';
import ConversionRateStats from './ConversionRateStats';

const mapStateToProps = ({ conversionStats }) => {
    const start = moment(conversionStats.params.startDate);
    const end = moment(conversionStats.params.endDate);
    const isOneDay = start.diff(end, 'days') <= 1;

    return {
        conversionStats,
        // chartOptions: selector(conversionStats.statsData),
        // chartOptions: selector(conversionStats.tableData),
        chartOptions: getChartOptions({
            isOneDay,
        })(conversionStats),
    };
};

const mapDispatchToProps = dispatch => bindActionCreators(ConversionStatsActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ConversionRateStats);
