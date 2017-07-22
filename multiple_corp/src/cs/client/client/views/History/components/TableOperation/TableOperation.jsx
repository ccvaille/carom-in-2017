import React, { PropTypes } from 'react';
import moment from 'moment';
import shortid from 'shortid';
import { Select, Button } from 'antd';
import RangeDatePicker from 'components/RangeDatePicker';
import { dateFormat } from 'constants/shared';
import HistoryListTypes from 'constants/HistoryListTypes';
import * as LeftMsgStatusTypes from 'constants/LeftMsgStatusTypes';
import './table-operation.less';

const Option = Select.Option;
const timeFilters = [{
    title: '今天',
    value: '0',
}, {
    title: '昨天',
    value: '1',
}, {
    title: '最近7天',
    value: '2',
}, {
    title: '最近30天',
    value: '3',
}, {
    title: '自定义时间',
    value: '4',
}];

const typeFilter = [{
    title: '网页会话',
    value: HistoryListTypes.CHAT_WEB.toString(),
}, {
    title: '离线留言',
    value: HistoryListTypes.CHAT_LEAVE_MSG.toString(),
}, {
    title: 'QQ临时会话',
    value: HistoryListTypes.CHAT_QQ.toString(),
}, {
    title: '微信会话',
    value: HistoryListTypes.CHAT_WX.toString(),
}];

const msgStateFilter = [{
    title: '全部状态',
    value: LeftMsgStatusTypes.ALL,
}, {
    title: '已回复',
    value: LeftMsgStatusTypes.REPLIED,
}, {
    title: '未回复',
    value: LeftMsgStatusTypes.UNANSWERED,
}, {
    title: '待跟进',
    value: LeftMsgStatusTypes.TO_FOLLOW_UP,
}];

const webChatFilter = [{
    title: '全部会话',
    value: '3',
}, {
    title: '有效会话',
    value: '2',
}, {
    title: '无效会话',
    value: '1',
}];

class TableOperation extends React.Component {
    static propTypes = {
        getKfList: PropTypes.func.isRequired,
        updateGetParams: PropTypes.func.isRequired,
        getHistoryList: PropTypes.func.isRequired,
        exportHistoryList: PropTypes.func.isRequired,
        params: PropTypes.object.isRequired,
        setShowDatePicker: PropTypes.func.isRequired,
        getHistoryListSuccess: PropTypes.func.isRequired,
        isManager: PropTypes.number.isRequired,
        kfList: PropTypes.array.isRequired,
        showDatePicker: PropTypes.func.isRequired,
    };

    state = {
        show: false,
    };

    componentDidMount() {
        this.props.getKfList();
    }

    onTimeChange = (v) => {
        const { updateGetParams, getHistoryList, setShowDatePicker } = this.props;
        const { pickerStart, pickerEnd } = this.props.params;
        const value = Number(v);
        const today = moment();
        const todayValue = today.format('YYYY-MM-DD');
        switch (value) {
            case 0: {
                setShowDatePicker(false);

                updateGetParams({
                    date: 0,
                    start: todayValue,
                    end: todayValue,
                    page: 1,
                });
                break;
            }
            case 1: {
                setShowDatePicker(false);
                const yestoday = today.subtract(1, 'd');
                const yestodayValue = yestoday.format('YYYY-MM-DD');
                updateGetParams({
                    date: 1,
                    start: yestodayValue,
                    end: yestodayValue,
                    page: 1,
                });
                break;
            }
            case 2: {
                setShowDatePicker(false);
                const sevenDayEarlier = today.subtract(6, 'd');
                const sevenDayEarlierValue = sevenDayEarlier.format('YYYY-MM-DD');
                updateGetParams({
                    date: 2,
                    start: sevenDayEarlierValue,
                    end: todayValue,
                    page: 1,
                });
                break;
            }
            case 3: {
                setShowDatePicker(false);
                const thirtyDayEarlier = today.subtract(29, 'd');
                const thirtyDayEarlierValue = thirtyDayEarlier.format('YYYY-MM-DD');
                updateGetParams({
                    date: 3,
                    start: thirtyDayEarlierValue,
                    end: todayValue,
                    page: 1,
                });
                break;
            }
            case 4: {
                setShowDatePicker(true);
                updateGetParams({
                    date: 4,
                });
                if (pickerStart && pickerEnd) {
                    updateGetParams({
                        date: 4,
                        start: pickerStart,
                        end: pickerEnd,
                        page: 1,
                    });
                }
                break;
            }
            default:
                break;
        }

        getHistoryList();
    }

    onTypeChange = (v) => {
        const { updateGetParams, getHistoryList, getHistoryListSuccess } = this.props;
        updateGetParams({
            type: v,
            page: 1,
        });

        getHistoryListSuccess({
            data: {
                list: [],
            }
        });
        getHistoryList();
    }

    onCsChange = (v) => {
        const { updateGetParams, getHistoryList } = this.props;
        updateGetParams({
            csId: v,
            page: 1,
        });
        getHistoryList();
    }

    onHandleExport = () => {
        this.props.exportHistoryList();
    };

    onDateSelectDone = (dates) => {
        const { updateGetParams, getHistoryList } = this.props;
        const { start, end } = dates;
        updateGetParams({
            date: 4,
            start: start.format(dateFormat),
            end: end.format(dateFormat),
            pickerStart: start.format(dateFormat),
            pickerEnd: end.format(dateFormat),
            page: 1,
        });
        getHistoryList();
    };

    // 离线留言记录-状态筛选
    onLeftMsgStatusFilter = (v) => {
        const value = v;
        const { updateGetParams, getHistoryList } = this.props;
        switch (value) {
            case LeftMsgStatusTypes.UNANSWERED: {
                updateGetParams({
                    msgFilter: v,
                    page: 1,
                });
                break;
            }
            case LeftMsgStatusTypes.ALL:
                updateGetParams({
                    msgFilter: v,
                    page: 1,
                });
                break;
            case LeftMsgStatusTypes.REPLIED:
                updateGetParams({
                    msgFilter: v,
                    page: 1,
                });
                break;
            case LeftMsgStatusTypes.TO_FOLLOW_UP:
                updateGetParams({
                    msgFilter: v,
                    page: 1,
                });
                break;
            default: {
                updateGetParams({
                    msgFilter: LeftMsgStatusTypes.ALL,
                    page: 1,
                });
                break;
            }
        }
        getHistoryList();
    };

    onWebChatFilterChange = (v) => {
        const { updateGetParams, getHistoryList } = this.props;
        updateGetParams({
            webChatType: v,
        });
        getHistoryList();
    }

    render() {
        const { type, msgFilter, date, csId, webChatType } = this.props.params;
        const { isManager } = this.props;
        const { kfList } = this.props;

        let webChatFilterNode = null;

        const timeOptions = timeFilters.map(filter => (
            <Option key={shortid.generate()} value={filter.value}>{filter.title}</Option>
        ));

        const typeOptions = typeFilter.map(filter => (
            <Option key={shortid.generate()} value={filter.value}>{filter.title}</Option>
        ));

        const csOptions = kfList.map(filter => (
            <Option key={shortid.generate()} value={filter.id.toString()}>{filter.name}</Option>
        ));

        const msgStateOptions = msgStateFilter.map(filter => (
            <Option key={shortid.generate()} value={filter.value}>{filter.title}</Option>
        ));

        if (Number(type) === HistoryListTypes.CHAT_WEB) {
            const webChatOptions = webChatFilter.map(filter => (
                <Option value={filter.value}>{filter.title}</Option>
            ));
            webChatFilterNode = (
                <Select
                    value={`${webChatType}`}
                    onChange={this.onWebChatFilterChange}
                >
                    {webChatOptions}
                </Select>
            );
        }

        return (
            <div className="history-table-operations">
                <Select
                    value={`${date}`}
                    onChange={this.onTimeChange}
                    dropdownClassName="ant-select-dropdown-style-custom"
                >
                    {timeOptions}
                </Select>

                <RangeDatePicker
                    show={this.props.showDatePicker}
                    onDateSelectDone={this.onDateSelectDone}
                />

                <Select
                    value={type.toString()}
                    onChange={this.onTypeChange}
                    dropdownClassName="ant-select-dropdown-style-custom"
                >
                    {typeOptions}
                </Select>

                {
                    isManager * 1 === 1 ? (
                        <Select
                            defaultValue={csId.toString()}
                            onChange={this.onCsChange}
                            dropdownClassName="ant-select-dropdown-style-custom"
                        >
                            {csOptions}
                        </Select>
                        ) : ''
                }

                {webChatFilterNode}

                {
                    type * 1 === HistoryListTypes.CHAT_LEAVE_MSG ? (
                        <Select
                            value={msgFilter.toString()}
                            onChange={this.onLeftMsgStatusFilter}
                            dropdownClassName="ant-select-dropdown-style-custom"
                        >
                            {msgStateOptions}
                        </Select>
                    ) : ''
                }

                {
                    isManager * 1 === 1 ? (
                        <Button
                            type="ghost"
                            className="export"
                            onClick={this.onHandleExport}
                        >
                            导出数据
                        </Button>
                    ) : ''
                }

            </div>
        );
    }
}

export default TableOperation;
