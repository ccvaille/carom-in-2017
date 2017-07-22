import React, { PropTypes } from 'react';
import ReactEcharts from 'echarts-for-react';
import { baseStatsTableScrollDelta } from 'constants/shared';
import statisticsHOC from 'components/StatisticsHOC';
import StatsGraphTitle from 'components/StatsGraphTitle';
import resizableTableHOC from 'components/ResizableTableHOC';
import THeadWithIcon from 'components/THeadWithIcon';
import StatsDataOperation from 'components/StatsDataOperation';
import * as TableHeadTipsTypes from 'constants/TableHeadTipsStatsTypes';

const UrlStatsTable = resizableTableHOC(baseStatsTableScrollDelta);

class ExternalUrlStats extends React.Component {
    static propTypes = {
        getUrlStats: PropTypes.func.isRequired,
        updateUrlStatsParams: PropTypes.func.isRequired,
        expandDelta: PropTypes.number.isRequired,
        datePickerVisible: PropTypes.bool.isRequired,
        onToggleDatePicker: PropTypes.func.isRequired,
        externalUrlStats: PropTypes.object.isRequired,
        exportUrlStatsData: PropTypes.func.isRequired,
        onDateSelectDone: PropTypes.func.isRequired,
        getCountChartOptionsCommon: PropTypes.func.isRequired,
        params: PropTypes.object.isRequired,
    };

    componentDidMount() {
        this.props.getUrlStats();
    }

    onExport = () => {
        this.props.exportUrlStatsData();
    };

    onTableChange = (page) => {
        const { pagination } = this.props.externalUrlStats;
        const { updateUrlStatsParams, getUrlStats } = this.props;

        if (page && page.current !== pagination.current) {
            updateUrlStatsParams({
                page: page.current,
            });
        }

        getUrlStats();
    };

    render() {
        const {
            getUrlStats,
            updateUrlStatsParams,
            expandDelta,
            datePickerVisible,
            onToggleDatePicker,
        } = this.props;
        const { tableDataAll, params, pagination } = this.props.externalUrlStats;

        const columns = [{
            title: '外部链接',
            dataIndex: 'domain',
            key: 'domain',
            width: '20%',
        }, {
            title: (
                <THeadWithIcon
                    popContent={TableHeadTipsTypes.VISITOR_COUNT}
                    theadContent="来访次数"
                />
            ),
            dataIndex: 'count',
            key: 'countNum',
            width: '15%',
        }, {
            title: (
                <THeadWithIcon
                    popContent={TableHeadTipsTypes.ALL_VISITOR_UV}
                    theadContent="全部访客UV"
                />
            ),
            dataIndex: 'visitor',
            key: 'visitorNum',
            width: '16%',
        }, {
            title: (
                <THeadWithIcon
                    popContent={TableHeadTipsTypes.NEW_VISITOR_COUNT}
                    theadContent="新访客数"
                />
            ),
            dataIndex: 'visitorn',
            key: 'newVisitorNum',
            width: '16%',
        }, {
            title: (
                <THeadWithIcon
                    popContent={TableHeadTipsTypes.RECEIVE_NUM}
                    theadContent="接待量"
                />
            ),
            dataIndex: 'service',
            key: 'receiveNum',
            width: '16%',
        }, {
            title: (
                <THeadWithIcon
                    popContent={TableHeadTipsTypes.SAVE_NUM}
                    theadContent="入库量"
                />
            ),
            dataIndex: 'save',
            key: 'saveNum',
            width: '16%',
        }];

        const mockChartOptions = this.props.getCountChartOptionsCommon;

        return (
            <div className="statistics-external-url">
                <StatsDataOperation
                    updateParams={updateUrlStatsParams}
                    getData={getUrlStats}
                    datePickerVisible={datePickerVisible}
                    toggleVisible={onToggleDatePicker}
                    onExport={this.onExport}
                    onDateSelectDone={this.props.onDateSelectDone}
                    dateTypeKey="date"
                    startDate={params.pickerStart}
                    endDate={params.pickerEnd}
                />

                <StatsGraphTitle
                    title="外部链接带来访问次数分析图"
                    startDate={params.startDate}
                    endDate={params.endDate}
                />

                <ReactEcharts
                    option={mockChartOptions}
                />

                <div className="stats-table">
                    <UrlStatsTable
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

export default statisticsHOC(ExternalUrlStats, {
    updateParamsFnName: 'updateUrlStatsParams',
    getDataFnName: 'getUrlStats',
    dateTypeKey: 'date',
    successFn: 'getUrlStatsSuccess',
});
