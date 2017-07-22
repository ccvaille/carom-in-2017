import React, { PropTypes } from 'react';
import shortid from 'shortid';
import { Select } from 'antd';
import { baseStatsTableScrollDelta } from 'constants/shared';
import statisticsHOC from 'components/StatisticsHOC';
import resizableTableHOC from 'components/ResizableTableHOC';
import THeadWithIcon from 'components/THeadWithIcon';
import StatsDataOperation from 'components/StatsDataOperation';

const Option = Select.Option;

const EfficiencyStatsTable = resizableTableHOC(baseStatsTableScrollDelta - 73);

class CsEfficiencyStats extends React.Component {
    static propTypes = {
        getEfficiencyStats: PropTypes.func.isRequired,
        updateEfficiencyStatsParams: PropTypes.func.isRequired,
        expandDelta: PropTypes.number.isRequired,
        datePickerVisible: PropTypes.bool.isRequired,
        onToggleDatePicker: PropTypes.func.isRequired,
        efficiencyStats: PropTypes.func.isRequired,
        onDateSelectDone: PropTypes.func.isRequired,
        filterCsData: PropTypes.func.isRequired,
    }

    componentDidMount() {
        this.props.getEfficiencyStats();
    }

    componentWillUnmount() {
        this.onFiterCs('0');
    }

    onExport = () => {
        this.props.getEfficiencyStats(true);
    }

    onFiterCs = (value) => {
        this.props.filterCsData(value);
    }

    onDateChange = () => {
        // this.onFiterCs('0');
    }

    render() {
        const {
            getEfficiencyStats,
            updateEfficiencyStatsParams,
            expandDelta,
            datePickerVisible,
            onToggleDatePicker,
            onDateSelectDone,
            // chartOptions,
        } = this.props;
        const { tableData, params, filterCsId, csList } = this.props.efficiencyStats;
        const csOptions = csList.map(cs => (
            <Option key={shortid.generate()} value={`${cs.f_cs_id}`}>{cs.f_cs_name}</Option>
        ));

        const columns = [{
            title: '客服',
            dataIndex: 'f_cs_name',
            key: 'csName',
            width: '18%',
        }, {
            title: (
                <THeadWithIcon
                    popContent="访客接入人工的会话总量"
                    theadContent="接待量"
                />
            ),
            dataIndex: 'f_web_service',
            key: 'receiveCount',
            width: '16%',
        }, {
            title: (
                <THeadWithIcon
                    popContent="客服有效回复的接待量，不包含系统回复"
                    theadContent="有效接待量"
                />
            ),
            dataIndex: 'f_web_effect',
            key: 'effectReceive',
            width: '15%',
        }, {
            title: (
                <THeadWithIcon
                    popContent="客服将访客导入CRM的个数"
                    theadContent="入库量"
                />
            ),
            dataIndex: 'f_web_save',
            key: 'inStorage',
            width: '14%',
        }, {
            title: (
                <THeadWithIcon
                    popContent="访客结束会话与访客建立会话的时间差"
                    theadContent="平均对话时长"
                />
            ),
            dataIndex: 'f_sess_length',
            key: 'averageTime',
            width: '17%',
        }, {
            title: (
                <THeadWithIcon
                    popContent="客服响应时间与访客接入客服时间的时间差"
                    theadContent="平均首次响应时长"
                />
            ),
            dataIndex: 'f_first_reply_length',
            key: 'firstResponse',
            width: '21%',
        }];

        const csSelect = (
            <div
                className="cs-filter"
                style={{
                    float: 'left',
                    marginRight: 10,
                }}
            >
                <Select
                    value={filterCsId}
                    style={{ minWidth: 100 }}
                    onChange={this.onFiterCs}
                >
                    <Option value="0">全部客服</Option>
                    {csOptions}
                </Select>
            </div>
        );

        return (
            <div className="statistics-cs-efficiency">
                <StatsDataOperation
                    updateParams={updateEfficiencyStatsParams}
                    getData={getEfficiencyStats}
                    onExport={this.onExport}
                    datePickerVisible={datePickerVisible}
                    toggleVisible={onToggleDatePicker}
                    onDateSelectDone={onDateSelectDone}
                    csFilter={csSelect}
                    timeTabClassName="auto-width"
                    onDateChange={this.onDateChange}
                    startDate={params.pickerStart}
                    endDate={params.pickerEnd}
                />

                {/*<StatsGraphTitle
                    title="客服效率分析图"
                    startDate={params.startDate}
                    endDate={params.endDate}
                />

                <ReactEcharts
                    option={chartOptions}
                />*/}

                <div className="stats-table">
                    <EfficiencyStatsTable
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

export default statisticsHOC(CsEfficiencyStats, {
    updateParamsFnName: 'updateEfficiencyStatsParams',
    getDataFnName: 'getEfficiencyStats',
    successFn: 'getEfficiencyStatsSuccess',
});
