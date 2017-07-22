import React, { PropTypes } from 'react';
import ReactEcharts from 'echarts-for-react';
import { baseStatsTableScrollDelta } from 'constants/shared';
import statisticsHOC from 'components/StatisticsHOC';
import StatsGraphTitle from 'components/StatsGraphTitle';
import resizableTableHOC from 'components/ResizableTableHOC';
import THeadWithIcon from 'components/THeadWithIcon';
import StatsDataOperation from 'components/StatsDataOperation';

const VisitStatsTable = resizableTableHOC(baseStatsTableScrollDelta);

class VisitLinkStats extends React.Component {
    static propTypes = {
        getVisitLinkStats: PropTypes.func.isRequired,
        updateVisitStatsParams: PropTypes.func.isRequired,
        expandDelta: PropTypes.number.isRequired,
        datePickerVisible: PropTypes.bool.isRequired,
        onToggleDatePicker: PropTypes.func.isRequired,
        visitLinkStats: PropTypes.object.isRequired,
        chartOptions: PropTypes.object.isRequired,
        onDateSelectDone: PropTypes.func.isRequired,
    }

    componentDidMount() {
        this.props.getVisitLinkStats();
    }

    onExport = () => {
        this.props.getVisitLinkStats(true);
    }

    onTableChange = (pagination) => {
        const { getVisitLinkStats, updateVisitStatsParams } = this.props;
        updateVisitStatsParams({
            page: pagination.current,
        });

        getVisitLinkStats();
    }

    render() {
        const {
            getVisitLinkStats,
            updateVisitStatsParams,
            expandDelta,
            datePickerVisible,
            onToggleDatePicker,
            chartOptions,
        } = this.props;
        const { tableData, params, pagination } = this.props.visitLinkStats;

        const columns = [{
            title: '序号',
            width: '30%',
            render: (text, record, index) => (
                <span>{((pagination.current - 1) * pagination.pageSize) + index + 1}</span>
            ),
            key: 'dataIndex',
        }, {
            title: (
                <THeadWithIcon
                    popContent="访客访问的页面"
                    theadContent="受访页面"
                />
            ),
            dataIndex: 'f_url',
            width: '35%',
            render: text => (
                <a target="_blank" href={text}>{text}</a>
            ),
            key: 'url',
        }, {
            title: (
                <THeadWithIcon
                    popContent="对应页面的打开次数"
                    theadContent="浏览量"
                />
            ),
            dataIndex: 'f_count',
            width: '35%',
            key: 'count',
        }];

        return (
            <div
                className="statistics-link-visit"
            >
                <StatsDataOperation
                    updateParams={updateVisitStatsParams}
                    getData={getVisitLinkStats}
                    datePickerVisible={datePickerVisible}
                    toggleVisible={onToggleDatePicker}
                    onExport={this.onExport}
                    onDateSelectDone={this.props.onDateSelectDone}
                    needExport={false}
                    startDate={params.pickerStart}
                    endDate={params.pickerEnd}
                />

                <StatsGraphTitle
                    title="所在页面浏览量分析图"
                    startDate={params.startDate}
                    endDate={params.endDate}
                />

                <ReactEcharts
                    option={chartOptions}
                />

                <div className="stats-table">
                    <VisitStatsTable
                        rowKey={(record, index) => index}
                        columns={columns}
                        dataSource={tableData}
                        pagination={pagination.total <= pagination.pageSize ? false : pagination}
                        delta={expandDelta}
                        onChange={this.onTableChange}
                    />
                </div>
            </div>
        );
    }
}

export default statisticsHOC(VisitLinkStats, {
    updateParamsFnName: 'updateVisitStatsParams',
    getDataFnName: 'getVisitLinkStats',
    successFn: 'getVisitLinkStatsSuccess',
});
