import React, { PropTypes } from 'react';
import ReactEcharts from 'echarts-for-react';
import { baseStatsTableScrollDelta } from 'constants/shared';
import statisticsHOC from 'components/StatisticsHOC';
import StatsGraphTitle from 'components/StatsGraphTitle';
import resizableTableHOC from 'components/ResizableTableHOC';
import THeadWithIcon from 'components/THeadWithIcon';
import StatsDataOperation from 'components/StatsDataOperation';

const FromStatsTable = resizableTableHOC(baseStatsTableScrollDelta);

class FromLinkStats extends React.Component {
    static propTypes = {
        getFromLinkStats: PropTypes.func.isRequired,
        updateFromLinkStatsParams: PropTypes.func.isRequired,
        expandDelta: PropTypes.number.isRequired,
        datePickerVisible: PropTypes.bool.isRequired,
        onToggleDatePicker: PropTypes.func.isRequired,
        fromLinkStats: PropTypes.object.isRequired,
        chartOptions: PropTypes.object.isRequired,
        onDateSelectDone: PropTypes.func.isRequired,
    }

    componentDidMount() {
        this.props.getFromLinkStats();
    }

    onExport = () => {
        this.props.getFromLinkStats(true);
    }

    onTableChange = (pagination) => {
        const { getFromLinkStats, updateFromLinkStatsParams } = this.props;
        updateFromLinkStatsParams({
            page: pagination.current,
        });

        getFromLinkStats();
    }

    render() {
        const {
            getFromLinkStats,
            updateFromLinkStatsParams,
            expandDelta,
            datePickerVisible,
            onToggleDatePicker,
            chartOptions,
        } = this.props;
        const { tableData, params, pagination } = this.props.fromLinkStats;

        const columns = [{
            title: '序号',
            width: '25%',
            render: (text, record, index) => (
                <span>{((pagination.current - 1) * pagination.pageSize) + index + 1}</span>
            ),
            key: 'dataIndex',
        }, {
            title: (
                <THeadWithIcon
                    popContent="页面url地址"
                    theadContent="页面地址"
                />
            ),
            dataIndex: 'f_url',
            width: '25%',
            render: (text) => {
                if (text) {
                    return (
                        <a target="_blank" href={text}>{text}</a>
                    );
                }

                return (<span>直接访问</span>);
            },
        }, {
            title: (
                <THeadWithIcon
                    popContent="当天访问网站的访客数"
                    theadContent="全部访客UV"
                />
            ),
            dataIndex: 'f_visitor',
            width: '25%',
            key: 'visitor',
        }, {
            title: (
                <THeadWithIcon
                    popContent="访问当前网站的次数"
                    theadContent="来访次数"
                />
            ),
            dataIndex: 'f_count',
            width: '25%',
            key: 'count',
        }];

        return (
            <div className="statistics-link-from">
                <StatsDataOperation
                    updateParams={updateFromLinkStatsParams}
                    getData={getFromLinkStats}
                    datePickerVisible={datePickerVisible}
                    toggleVisible={onToggleDatePicker}
                    onExport={this.onExport}
                    onDateSelectDone={this.props.onDateSelectDone}
                    needExport={false}
                    startDate={params.pickerStart}
                    endDate={params.pickerEnd}
                />

                <StatsGraphTitle
                    title="来路页面来访次数分析"
                    startDate={params.startDate}
                    endDate={params.endDate}
                />

                <ReactEcharts
                    option={chartOptions}
                />

                <div className="stats-table">
                    <FromStatsTable
                        columns={columns}
                        dataSource={tableData}
                        delta={expandDelta}
                        pagination={pagination.total <= pagination.pageSize ? false : pagination}
                        onChange={this.onTableChange}
                    />
                </div>
            </div>
        );
    }
}

export default statisticsHOC(FromLinkStats, {
    updateParamsFnName: 'updateFromLinkStatsParams',
    getDataFnName: 'getFromLinkStats',
    successFn: 'getFromLinkStatsSuccess',
});
