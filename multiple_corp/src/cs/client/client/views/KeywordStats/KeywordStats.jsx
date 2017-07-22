import React, { PropTypes } from 'react';
import ReactEcharts from 'echarts-for-react';
import { baseStatsTableScrollDelta } from 'constants/shared';
import statisticsHOC from 'components/StatisticsHOC';
import StatsGraphTitle from 'components/StatsGraphTitle';
import resizableTableHOC from 'components/ResizableTableHOC';
import THeadWithIcon from 'components/THeadWithIcon';
import StatsDataOperation from 'components/StatsDataOperation';
import * as TableHeadTipsTypes from 'constants/TableHeadTipsStatsTypes';

const KeywordStatsTable = resizableTableHOC(baseStatsTableScrollDelta);

class KeywordStats extends React.Component {
    static propTypes = {
        getKeywordStats: PropTypes.func.isRequired,
        updateKeywordStatsParams: PropTypes.func.isRequired,
        expandDelta: PropTypes.number.isRequired,
        datePickerVisible: PropTypes.bool.isRequired,
        onToggleDatePicker: PropTypes.func.isRequired,
        keywordStats: PropTypes.object.isRequired,
        getCountChartOptionsCommon: PropTypes.func.isRequired,
        exportKeywordStatsData: PropTypes.func.isRequired,
        onDateSelectDone: PropTypes.func.isRequired,
        params: PropTypes.object.isRequired,
    };

    componentDidMount() {
        this.props.getKeywordStats();
    }

    onExport = () => {
        this.props.exportKeywordStatsData();
    };

    onTableChange = (page) => {
        const { pagination } = this.props.keywordStats;
        const { updateKeywordStatsParams, getKeywordStats } = this.props;

        if (page && page.current !== pagination.current) {
            updateKeywordStatsParams({
                page: page.current,
            });
        }

        getKeywordStats();
    }

    render() {
        const {
            getKeywordStats,
            updateKeywordStatsParams,
            expandDelta,
            datePickerVisible,
            onToggleDatePicker,
        } = this.props;
        const { tableDataAll, params, pagination } = this.props.keywordStats;

        const columns = [{
            title: '关键词',
            dataIndex: 'keyword',
            key: 'keyword',
            width: '16%',
        }, {
            title: (
                <THeadWithIcon
                    popContent={TableHeadTipsTypes.SEARCH_COUNT}
                    theadContent="搜索次数"
                />
            ),
            dataIndex: 'count',
            key: 'searchNum',
            width: '17%',
        }, {
            title: (
                <THeadWithIcon
                    popContent={TableHeadTipsTypes.ALL_VISITOR_UV}
                    theadContent="全部访客UV"
                />
            ),
            dataIndex: 'visitor',
            key: 'visitorNum',
            width: '17%',
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
        // console.log(mockChartOptions, ' hello world');

        return (
            <div className="statistics-keyword">
                <StatsDataOperation
                    updateParams={updateKeywordStatsParams}
                    getData={getKeywordStats}
                    datePickerVisible={datePickerVisible}
                    toggleVisible={onToggleDatePicker}
                    onExport={this.onExport}
                    onDateSelectDone={this.props.onDateSelectDone}
                    dateTypeKey="date"
                    startDate={params.pickerStart}
                    endDate={params.pickerEnd}
                />

                <StatsGraphTitle
                    title="关键词搜索次数分析图"
                    startDate={params.startDate}
                    endDate={params.endDate}
                />

                <ReactEcharts
                    option={mockChartOptions}
                />

                <div className="stats-table">
                    <KeywordStatsTable
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

export default statisticsHOC(KeywordStats, {
    updateParamsFnName: 'updateKeywordStatsParams',
    getDataFnName: 'getKeywordStats',
    successFn: 'getKeywordStatsSuccess',
    dateTypeKey: 'date',
});
