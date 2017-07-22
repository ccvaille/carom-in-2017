import React, { PropTypes } from 'react';
import ReactEcharts from 'echarts-for-react';
import { baseStatsTableScrollDelta } from 'constants/shared';
import statisticsHOC from 'components/StatisticsHOC';
import StatsGraphTitle from 'components/StatsGraphTitle';
import resizableTableHOC from 'components/ResizableTableHOC';
import THeadWithIcon from 'components/THeadWithIcon';
import StatsDataOperation from 'components/StatsDataOperation';
import * as TableHeadTipsTypes from 'constants/TableHeadTipsStatsTypes';
import './search-engine.less';

const SearchStatsTable = resizableTableHOC(baseStatsTableScrollDelta);

class SearchEngineStats extends React.Component {
    static propTypes = {
        updateSearchStatsParams: PropTypes.func.isRequired,
        getSearchStats: PropTypes.func.isRequired,
        expandDelta: PropTypes.number.isRequired,
        datePickerVisible: PropTypes.bool.isRequired,
        onToggleDatePicker: PropTypes.func.isRequired,
        searchStats: PropTypes.object.isRequired,
        exportSearchStatsData: PropTypes.func.isRequired,
        getCountChartOptionsCommon: PropTypes.object.isRequired,
        onDateSelectDone: PropTypes.func.isRequired,
        params: PropTypes.object.isRequired,
    };

    componentDidMount() {
        this.props.getSearchStats();
    }

    onExport = () => {
        this.props.exportSearchStatsData();
    };

    render() {
        const {
            getSearchStats,
            updateSearchStatsParams,
            expandDelta,
            datePickerVisible,
            onToggleDatePicker,
        } = this.props;
        const { tableDataAll, params } = this.props.searchStats;

        const columns = [{
            title: '搜索引擎',
            dataIndex: 'SearchName',
            key: 'searchName',
            width: '16%',
        }, {
            title: (
                <THeadWithIcon
                    popContent={TableHeadTipsTypes.KEYWORD_COUNT}
                    theadContent="关键词个数"
                />
            ),
            dataIndex: 'keywords',
            key: 'keywordNum',
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
            key: 'serviceNum',
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

        // console.log(this.props.searchStats.tableData, 'props')
        const mockChartOptions = this.props.getCountChartOptionsCommon;
        // console.log(mockChartOptions, 'covertData8jsfghdsg98989', params)

        return (
            <div className="statistics-searchengine">
                <StatsDataOperation
                    updateParams={updateSearchStatsParams}
                    getData={getSearchStats}
                    datePickerVisible={datePickerVisible}
                    toggleVisible={onToggleDatePicker}
                    onExport={this.onExport}
                    onDateSelectDone={this.props.onDateSelectDone}
                    dateTypeKey="date"
                    startDate={params.pickerStart}
                    endDate={params.pickerEnd}
                />

                <StatsGraphTitle
                    title="搜索引擎之关键词个数分布图"
                    startDate={params.startDate}
                    endDate={params.endDate}
                />

                <ReactEcharts
                    option={mockChartOptions}
                />

                <div className="stats-table">
                    <SearchStatsTable
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

export default statisticsHOC(SearchEngineStats, {
    updateParamsFnName: 'updateSearchStatsParams',
    getDataFnName: 'getSearchStats',
    successFn: 'getSearchStatsSuccess',
    dateTypeKey: 'date',
});
