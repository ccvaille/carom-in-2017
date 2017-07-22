import React, { PropTypes } from 'react';
import ReactEcharts from 'echarts-for-react';
import { baseStatsTableScrollDelta } from 'constants/shared';
import statisticsHOC from 'components/StatisticsHOC';
import StatsGraphTitle from 'components/StatsGraphTitle';
import resizableTableHOC from 'components/ResizableTableHOC';
import THeadWithIcon from 'components/THeadWithIcon';
import StatsDataOperation from 'components/StatsDataOperation';

import * as TableHeadTipsTypes from 'constants/TableHeadTipsStatsTypes';

const DeviceStatsTable = resizableTableHOC(baseStatsTableScrollDelta);

class DeviceStats extends React.Component {
    static propTypes = {
        getDeviceStats: PropTypes.func.isRequired,
        updateDeviceStatsParams: PropTypes.func.isRequired,
        expandDelta: PropTypes.number.isRequired,
        datePickerVisible: PropTypes.bool.isRequired,
        onToggleDatePicker: PropTypes.func.isRequired,
        getCountChartOptionsCommon: PropTypes.func.isRequired,
        deviceStats: PropTypes.object.isRequired,
        onDateSelectDone: PropTypes.func.isRequired,
    };

    componentDidMount() {
        this.props.getDeviceStats();
    }

    onExport = () => {
        this.props.getDeviceStats(true);
    };

    render() {
        const {
            getDeviceStats,
            updateDeviceStatsParams,
            expandDelta,
            datePickerVisible,
            onToggleDatePicker,
        } = this.props;

        const { tableDataAll, params } = this.props.deviceStats;

        const columns = [{
            title: '浏览类型',
            width: '25%',
            key: 'f_terminal',
            dataIndex: 'f_terminal',
        }, {
            title: (
                <THeadWithIcon
                    popContent={TableHeadTipsTypes.ALL_VISITOR_UV}
                    theadContent="全部访客UV"
                />
            ),
            width: '25%',
            key: 'f_visitor',
            dataIndex: 'f_visitor',
        }, {
            title: (
                <THeadWithIcon
                    popContent={TableHeadTipsTypes.RECEIVE_NUM}
                    theadContent="接待量"
                />
            ),
            width: '25%',
            key: 'f_web_service',
            dataIndex: 'f_web_service',
        }, {
            title: (
                <THeadWithIcon
                    popContent={TableHeadTipsTypes.SAVE_NUM}
                    theadContent="入库量"
                />
            ),
            width: '25%',
            key: 'f_web_save',
            dataIndex: 'f_web_save',
        }];

        const mockChartOptions = this.props.getCountChartOptionsCommon;

        return (
            <div className="statistics-device">
                <StatsDataOperation
                    updateParams={updateDeviceStatsParams}
                    getData={getDeviceStats}
                    datePickerVisible={datePickerVisible}
                    toggleVisible={onToggleDatePicker}
                    onExport={this.onExport}
                    onDateSelectDone={this.props.onDateSelectDone}
                    dateTypeKey="date"
                    startDate={params.pickerStart}
                    endDate={params.pickerEnd}
                />

                <StatsGraphTitle
                    title="来访访客上网终端分布图"
                    startDate={params.startDate}
                    endDate={params.endDate}
                />

                <ReactEcharts
                    option={mockChartOptions}
                />

                <div className="stats-table">
                    <DeviceStatsTable
                        columns={columns}
                        pagination={false}
                        dataSource={tableDataAll}
                        delta={expandDelta}
                    />
                </div>
            </div>
        );
    }
}

export default statisticsHOC(DeviceStats, {
    updateParamsFnName: 'updateDeviceStatsParams',
    getDataFnName: 'getDeviceStats',
    dateTypeKey: 'date',
    successFn: 'getDeviceStatsSuccess',
});
