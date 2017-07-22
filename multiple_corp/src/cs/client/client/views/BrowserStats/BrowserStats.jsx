import React, { PropTypes } from 'react';
import ReactEcharts from 'echarts-for-react';
import { baseStatsTableScrollDelta } from 'constants/shared';
import statisticsHOC from 'components/StatisticsHOC';
import StatsGraphTitle from 'components/StatsGraphTitle';
import resizableTableHOC from 'components/ResizableTableHOC';
import THeadWithIcon from 'components/THeadWithIcon';
import StatsDataOperation from 'components/StatsDataOperation';
import * as TableHeadTipsTypes from 'constants/TableHeadTipsStatsTypes';

const BrowserStatsTable = resizableTableHOC(baseStatsTableScrollDelta);

class BrowserStats extends React.Component {
    static propTypes = {
        updateBrowserStatsParams: PropTypes.func.isRequired,
        getBrowserStats: PropTypes.func.isRequired,
        expandDelta: PropTypes.number.isRequired,
        datePickerVisible: PropTypes.bool.isRequired,
        onToggleDatePicker: PropTypes.func.isRequired,
        getCountChartOptionsCommon: PropTypes.func.isRequired,
        browserStats: PropTypes.object.isRequired,
        exportBrowserStatsData: PropTypes.func.isRequired,
        onDateSelectDone: PropTypes.func.isRequired,
    };

    componentDidMount() {
        this.props.getBrowserStats();
    }

    onExport = () => {
        this.props.exportBrowserStatsData();
    };

    render() {
        const {
            updateBrowserStatsParams,
            getBrowserStats,
            expandDelta,
            datePickerVisible,
            onToggleDatePicker,
        } = this.props;

        const { tableDataAll, params } = this.props.browserStats;

        const columns = [{
            title: '浏览器',
            width: '25%',
            key: 'browserName',
            dataIndex: 'browserName',
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
            <div className="statistics-browser">
                <StatsDataOperation
                    updateParams={updateBrowserStatsParams}
                    getData={getBrowserStats}
                    datePickerVisible={datePickerVisible}
                    toggleVisible={onToggleDatePicker}
                    onExport={this.onExport}
                    onDateSelectDone={this.props.onDateSelectDone}
                    dateTypeKey="date"
                    startDate={params.pickerStart}
                    endDate={params.pickerEnd}
                />

                <StatsGraphTitle
                    title="来访访客浏览器类型分布图"
                    startDate={params.startDate}
                    endDate={params.endDate}
                />

                <ReactEcharts
                    option={mockChartOptions}
                />
                <div className="stats-table">
                    <BrowserStatsTable
                        columns={columns}
                        dataSource={tableDataAll}
                        pagination={false}
                        delta={expandDelta}
                    />
                </div>
            </div>
        );
    }
}

export default statisticsHOC(BrowserStats, {
    updateParamsFnName: 'updateBrowserStatsParams',
    getDataFnName: 'getBrowserStats',
    successFn: 'getBrowserStatsSuccess',
    dateTypeKey: 'date',
});
