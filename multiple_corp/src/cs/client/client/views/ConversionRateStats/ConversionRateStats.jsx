import React, { PropTypes } from 'react';
import ReactEcharts from 'echarts-for-react';
import { baseStatsTableScrollDelta } from 'constants/shared';
import statisticsHOC from 'components/StatisticsHOC';
import StatsGraphTitle from 'components/StatsGraphTitle';
import resizableTableHOC from 'components/ResizableTableHOC';
import THeadWithIcon from 'components/THeadWithIcon';
import StatsDataOperation from 'components/StatsDataOperation';

const ConversionStatsTable = resizableTableHOC(baseStatsTableScrollDelta);

class ConversionRateStats extends React.Component {
    static propTypes = {
        getConversionStats: PropTypes.func.isRequired,
        updateConversionStatsParams: PropTypes.func.isRequired,
        conversionStats: PropTypes.shape({
            tableData: PropTypes.array.isRequired,
            statsData: PropTypes.object.isRequired,
            params: PropTypes.shape({
                startDate: PropTypes.string.isRequired,
                endDate: PropTypes.string.isRequired,
                date: PropTypes.string.isRequired,
            }),
        }).isRequired,
        expandDelta: PropTypes.number.isRequired,
        datePickerVisible: PropTypes.bool.isRequired,
        onToggleDatePicker: PropTypes.func.isRequired,
        chartOptions: PropTypes.object.isRequired,
        onDateSelectDone: PropTypes.func.isRequired,
    }

    componentDidMount() {
        this.props.getConversionStats();
    }

    onExport = () => {
        this.props.getConversionStats(true);
    }

    render() {
        const {
            getConversionStats,
            updateConversionStatsParams,
            expandDelta,
            datePickerVisible,
            onToggleDatePicker,
            onDateSelectDone,
        } = this.props;
        const { tableData, params } = this.props.conversionStats;
        const columns = [{
            title: '时间',
            width: '12.5%',
            dataIndex: 'date',
        }, {
            title: (
                <THeadWithIcon
                    popContent="当天访问网站的访客数"
                    theadContent="全部访客UV"
                />
            ),
            dataIndex: 'uv',
            key: 'uv',
            width: '14%',
        }, {
            title: (
                <THeadWithIcon
                    popContent="未入库访客数"
                    theadContent="未入库访客数"
                />
            ),
            dataIndex: 'not_storage',
            key: 'notStorage',
            width: '14%',
        }, {
            title: (
                <THeadWithIcon
                    popContent="访客发起咨询的数量"
                    theadContent="咨询量"
                />
            ),
            dataIndex: 'consult',
            key: 'consult',
            width: '12%',
        }, {
            title: (
                <THeadWithIcon
                    popContent="访客接入人工的会话总量"
                    theadContent="接待量"
                />
            ),
            dataIndex: 'web_talk',
            key: 'receiveCount',
            width: '12%',
        }, {
            title: (
                <THeadWithIcon
                    popContent="客服将访客导入CRM的个数"
                    theadContent="入库量"
                />
            ),
            dataIndex: 'storage',
            key: 'inStorage',
            width: '9%',
        }, {
            title: (
                <THeadWithIcon
                    popContent="入库量/未入库访客数"
                    theadContent="入库率"
                />
            ),
            dataIndex: 'storage_rate',
            key: 'storageRage',
            width: '9%',
            render: text => (
                <span>{text}%</span>
            ),
        }, {
            title: (
                <THeadWithIcon
                    popContent="接待量/咨询量"
                    theadContent="接待率"
                />
            ),
            dataIndex: 'talk_rate',
            key: 'talkRate',
            width: '9%',
            render: text => (
                <span>{text}%</span>
            ),
        }];

        return (
            <div className="statistics-conversion-rate">
                <StatsDataOperation
                    updateParams={updateConversionStatsParams}
                    getData={getConversionStats}
                    datePickerVisible={datePickerVisible}
                    toggleVisible={onToggleDatePicker}
                    onExport={this.onExport}
                    onDateSelectDone={onDateSelectDone}
                    startDate={params.pickerStart}
                    endDate={params.pickerEnd}
                />

                <StatsGraphTitle
                    title="访客转化分析图"
                    startDate={params.startDate}
                    endDate={params.endDate}
                />

                <ReactEcharts
                    option={this.props.chartOptions}
                />

                <div className="stats-table">
                    <ConversionStatsTable
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

export default statisticsHOC(ConversionRateStats, {
    updateParamsFnName: 'updateConversionStatsParams',
    getDataFnName: 'getConversionStats',
    successFn: 'getConversionStatsSuccess',
});
