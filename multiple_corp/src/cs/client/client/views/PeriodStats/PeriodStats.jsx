import React, { PropTypes } from 'react';
import ReactEcharts from 'echarts-for-react';
import { baseStatsTableScrollDelta } from 'constants/shared';
import statisticsHOC from 'components/StatisticsHOC';
import StatsGraphTitle from 'components/StatsGraphTitle';
import resizableTableHOC from 'components/ResizableTableHOC';
import THeadWithIcon from 'components/THeadWithIcon';
import StatsDataOperation from 'components/StatsDataOperation';

const PeriodStatsTable = resizableTableHOC(baseStatsTableScrollDelta);

class PeriodStats extends React.Component {
    static propTypes = {
        getPeriodStats: PropTypes.func.isRequired,
        updatePeriodStatsParams: PropTypes.func.isRequired,
        expandDelta: PropTypes.number.isRequired,
        datePickerVisible: PropTypes.bool.isRequired,
        onToggleDatePicker: PropTypes.func.isRequired,
        periodStats: PropTypes.object.isRequired,
        onDateSelectDone: PropTypes.func.isRequired,
        chartOptions: PropTypes.object.isRequired,
    }

    componentDidMount() {
        this.props.getPeriodStats();
    }

    onExport = () => {
        this.props.getPeriodStats(true);
    }

    render() {
        const {
            getPeriodStats,
            updatePeriodStatsParams,
            expandDelta,
            datePickerVisible,
            onToggleDatePicker,
            onDateSelectDone,
        } = this.props;
        const { tableData, params } = this.props.periodStats;
        const columns = [{
            title: '时间',
            dataIndex: 'date',
            key: 'date',
            width: '25%',
        }, {
            title: (
                <THeadWithIcon
                    popContent="当天访问网站的访客数"
                    theadContent="全部访客UV"
                />
            ),
            dataIndex: 'uv',
            key: 'uv',
            width: '19%',
        }, {
            title: (
                <THeadWithIcon
                    popContent="访客发起咨询的数量"
                    theadContent="咨询量"
                />
            ),
            dataIndex: 'consult',
            key: 'consult',
            width: '19%',
        }, {
            title: (
                <THeadWithIcon
                    popContent="访客接入人工的会话总量"
                    theadContent="接待量"
                />
            ),
            dataIndex: 'web_talk',
            key: 'webTalk',
            width: '18%',
        }, {
            title: (
                <THeadWithIcon
                    popContent="客服将访客导入CRM的个数"
                    theadContent="入库量"
                />
            ),
            dataIndex: 'storage',
            key: 'storage',
            width: '18%',
        }];

        return (
            <div className="statistics-period">
                <StatsDataOperation
                    updateParams={updatePeriodStatsParams}
                    getData={getPeriodStats}
                    onExport={this.onExport}
                    datePickerVisible={datePickerVisible}
                    toggleVisible={onToggleDatePicker}
                    onDateSelectDone={onDateSelectDone}
                    startDate={params.pickerStart}
                    endDate={params.pickerEnd}
                />

                <StatsGraphTitle
                    title="来访访客小时段分布图"
                    startDate={params.startDate}
                    endDate={params.endDate}
                />

                <ReactEcharts
                    option={this.props.chartOptions}
                />

                <div className="stats-table">
                    <PeriodStatsTable
                        columns={columns}
                        dataSource={tableData}
                        pagination={false}
                        delta={expandDelta}
                    />
                </div>
            </div>
        );
    }
}

export default statisticsHOC(PeriodStats, {
    updateParamsFnName: 'updatePeriodStatsParams',
    getDataFnName: 'getPeriodStats',
    successFn: 'getPeriodStatsSuccess',
});
