import React, { PropTypes } from 'react';
import ReactEcharts from 'echarts-for-react';
import { baseStatsTableScrollDelta } from 'constants/shared';
import statisticsHOC from 'components/StatisticsHOC';
import StatsGraphTitle from 'components/StatsGraphTitle';
import resizableTableHOC from 'components/ResizableTableHOC';
import THeadWithIcon from 'components/THeadWithIcon';
import StatsDataOperation from 'components/StatsDataOperation';
import * as TableHeadTipsTypes from 'constants/TableHeadTipsStatsTypes';

const DistrictStatsTable = resizableTableHOC(baseStatsTableScrollDelta);

class DistrictStats extends React.Component {
    static propTypes = {
        getDistrictStats: PropTypes.func.isRequired,
        updateDistrictStatsParams: PropTypes.func.isRequired,
        expandDelta: PropTypes.number.isRequired,
        datePickerVisible: PropTypes.bool.isRequired,
        onToggleDatePicker: PropTypes.func.isRequired,
        districtStats: PropTypes.object.isRequired,
        exportDistrictStatsData: PropTypes.func.isRequired,
        onDateSelectDone: PropTypes.func.isRequired,
        getCountChartOptionsCommon: PropTypes.func.isRequired,
    };

    componentDidMount() {
        this.props.getDistrictStats();
    }

    onExport = () => {
        this.props.exportDistrictStatsData();
    };

    onTableChange = (page) => {
        const { pagination } = this.props.districtStats;
        const { updateDistrictStatsParams, getDistrictStats } = this.props;

        if (page && page.current !== pagination.current) {
            updateDistrictStatsParams({
                page: page.current,
            });
        }

        getDistrictStats();
    }

    render() {
        const {
            getDistrictStats,
            updateDistrictStatsParams,
            expandDelta,
            datePickerVisible,
            onToggleDatePicker,
        } = this.props;
        const { tableDataAll, params, pagination } = this.props.districtStats;

        const columns = [{
            key: 'province',
            dataIndex: 'province',
            title: '地区',
            width: '25%',
        }, {
            title: (
                <THeadWithIcon
                    popContent={TableHeadTipsTypes.ALL_VISITOR_UV}
                    theadContent="全部访客UV"
                />
            ),
            width: '25%',
            key: 'visitor',
            dataIndex: 'visitor',
        }, {
            title: (
                <THeadWithIcon
                    popContent={TableHeadTipsTypes.RECEIVE_NUM}
                    theadContent="接待量"
                />
            ),
            width: '25%',
            key: 'service',
            dataIndex: 'service',
        }, {
            title: (
                <THeadWithIcon
                    popContent={TableHeadTipsTypes.SAVE_NUM}
                    theadContent="入库量"
                />
            ),
            width: '25%',
            key: 'save',
            dataIndex: 'save',
        }];

        const mockChartOptions = this.props.getCountChartOptionsCommon;
        return (
            <div className="statistics-district">
                <StatsDataOperation
                    updateParams={updateDistrictStatsParams}
                    getData={getDistrictStats}
                    datePickerVisible={datePickerVisible}
                    toggleVisible={onToggleDatePicker}
                    onExport={this.onExport}
                    onDateSelectDone={this.props.onDateSelectDone}
                    dateTypeKey="date"
                    startDate={params.pickerStart}
                    endDate={params.pickerEnd}
                />

                <StatsGraphTitle
                    title="来访访客地区分布图"
                    startDate={params.startDate}
                    endDate={params.endDate}
                />

                <ReactEcharts
                    option={mockChartOptions}
                />

                <div className="stats-table">
                    <DistrictStatsTable
                        columns={columns}
                        dataSource={tableDataAll}
                        delta={expandDelta}
                        pagination={pagination.total <= pagination.pageSize ? false : pagination}
                        onChange={this.onTableChange}
                    />
                </div>
            </div>
        );
    }
}

export default statisticsHOC(DistrictStats, {
    updateParamsFnName: 'updateDistrictStatsParams',
    getDataFnName: 'getDistrictStats',
    dateTypeKey: 'date',
    successFn: 'getDistrictStatsSuccess',
});
