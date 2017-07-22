import React, { PropTypes } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { Icon, Popover, Button } from 'antd';
import {
    baseStatsTableScrollDelta,
    datePickerHeight,
    dateFormat,
    today,
} from 'constants/shared';
import { weeklyNameMap } from 'utils/chartsUtils';
// import ECBridge from 'utils/ECBridge';
import resizableTableHOC from 'components/ResizableTableHOC';
import THeadWithIcon from 'components/THeadWithIcon';
import TimeFilterTab from 'components/TimeFilterTab';
import RangeDatePicker from 'components/RangeDatePicker';
import './overview-stats.less';

const ResizableOverviewTable = resizableTableHOC(baseStatsTableScrollDelta);
const ResizableConversationTable = resizableTableHOC(baseStatsTableScrollDelta + 132);

const VISITOR_TYPE = 0;
const IN_STORAGE_TYPE = 1;
const CONSULT_TYPE = 2;
const RECEIVE_TYPE = 3;
const RECEIVE_RATIO_TYPE = 4;
const AVERAGE_TIME_TYPE = 5;
const FIRST_RESPONSE_TYPE = 6;

const now = moment().format(dateFormat);

class Overview extends React.Component {
    static propTypes = {
        getOverviewStats: PropTypes.func.isRequired,
        updateOverviewParams: PropTypes.func.isRequired,
        overviewStats: PropTypes.shape({
            trafficData: PropTypes.array.isRequired,
            conversationData: PropTypes.array.isRequired,
            params: PropTypes.shape({
                date: PropTypes.number.isRequired,
                startDate: PropTypes.string,
                endDate: PropTypes.string,
            }),
            originalData: PropTypes.object.isRequired,
        }).isRequired,
        userInfo: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);
        this.prevPopDate = now;
    }

    state = {
        datePickerVisible: false,
        expandDelta: 0,
        startDate: now,
        endDate: now,
    }

    componentDidMount() {
        this.props.getOverviewStats();
    }

    componentWillUnmount() {
        this.props.updateOverviewParams({
            date: 0,
            startDate: today,
            endDate: today,
        });
    }

    onDateChange = (index) => {
        const { updateOverviewParams, getOverviewStats } = this.props;
        const { startDate, endDate } = this.props.overviewStats.params;
        const mToday = moment();

        this.setState({
            datePickerVisible: false,
            expandDelta: 0,
        });
        switch (index) {
            case 0: {
                const value = mToday.format(dateFormat);
                this.onDateNotCustom(value, value, index);
                break;
            }
            case 1: {
                const start = mToday.subtract(1, 'd').format(dateFormat);
                this.onDateNotCustom(start, start, index);
                break;
            }
            case 2: {
                // const end = today.format(dateFormat);
                // const start = today.subtract(6, 'd').format(dateFormat);
                const end = moment().subtract(1, 'd').format(dateFormat);
                const start = moment().subtract(7, 'd').format(dateFormat);
                this.onDateNotCustom(start, end, index);
                break;
            }
            case 3: {
                // const end = today.format(dateFormat);
                // const start = today.subtract(29, 'd').format(dateFormat);
                const end = moment().subtract(1, 'd').format(dateFormat);
                const start = moment().subtract(30, 'd').format(dateFormat);
                this.onDateNotCustom(start, end, index);
                break;
            }
            case 4: {
                this.setState({
                    datePickerVisible: true,
                    expandDelta: datePickerHeight,
                });
                updateOverviewParams({
                    date: index,
                });
                if (startDate && endDate) {
                    getOverviewStats();
                }
                break;
            }
            default:
                break;
        }
    }

    onDateNotCustom = (start, end, date) => {
        const { updateOverviewParams, getOverviewStats } = this.props;
        this.setState({
            startDate: start,
            endDate: end,
        });
        updateOverviewParams({
            date,
        });
        getOverviewStats();
    }

    onDateSelectDone = (dates) => {
        const { updateOverviewParams, getOverviewStats } = this.props;
        const { start, end } = dates;
        updateOverviewParams({
            date: 4,
            startDate: start.format(dateFormat),
            endDate: end.format(dateFormat),
        });
        getOverviewStats();
    }

    onViewOldStats = () => {
        // 打开旧版统计 pv 页
        window.ECBridge.exec({
            command: 504,
            url: 'https://my.workec.com/analytics',
            title: '网站客服管理',
            needLogin: '1', //0:不需要登录态，1：需要登录态，打开PV时直接写cookie pv_key,httponly格式
            width: '820', //宽度，单位像
            height: '600', //高度 ，单位像素
            status: '', //状态，max：最大化，不填则为宽高的值，宽高不填，则用默认的宽高
            minButton: '0', //0：需要，1：不需要；如果不传，默认是0
            maxButton: '0', //0：需要，1：不需要；如果不传，默认是0
            titleBar: '0', //0：native的，1：web控制的，如果是1，minButton和maxButton失效，如果不传，默认是0
            resizeAble: '0', //0：可以拖拉变更窗口大小，1：不可以拖拉变更窗口大小，默认0
            callback: (json) => {
                console.log(json);
            },
        });
    }

    getPopLastDate = () => {
        // 获取要显示的上期时间，根据过滤的开始时间，开始时间是上期的结束时间
        const { date: dateType } = this.props.overviewStats.params;
        const { startDate } = this.state;

        switch (dateType) {
            case 0:
            case 1: {
                const date = moment(startDate).subtract(1, 'd').format(dateFormat);
                this.prevPopDate = date;
                return date;
            }
            case 2: {
                const date = moment(startDate).subtract(7, 'd').format(dateFormat);
                this.prevPopDate = date;
                return date;
            }
            case 3: {
                const date = moment(startDate).subtract(30, 'd').format(dateFormat);
                this.prevPopDate = date;
                return date;
            }
            default:
                return this.prevPopDate;
        }
    }

    renderPercent = (num) => {
        if (!isNaN(num)) {
            return `${num}%`;
        }
        return num;
    }

    renderArrow = (num) => {
        if (num > 0) {
            return (
                <Icon type="arrow-up" />
            );
        } else if (num < 0) {
            return (
                <Icon type="arrow-down" />
            );
        }
        return null;
    }

    renderPopContent = (num, type, unit = '') => {
        // 获取时间及周几
        // 时间需要根据选中类型计算
        const { startDate } = this.state;
        const popLastDate = this.getPopLastDate();

        const startName = weeklyNameMap[moment(popLastDate).format('d')];
        const endName = weeklyNameMap[moment(startDate).format('d')];
        const { originalData } = this.props.overviewStats;
        let startNum = 0;
        let endNum = 0;
        let text = '';

        switch (type) {
            case VISITOR_TYPE:
                startNum = originalData.visitorLast;
                endNum = originalData.visitor;
                break;
            case IN_STORAGE_TYPE:
                startNum = originalData.saveLast;
                endNum = originalData.save;
                break;
            case CONSULT_TYPE:
                startNum = originalData.consultLast;
                endNum = originalData.consult;
                break;
            case RECEIVE_TYPE:
                startNum = originalData.serviceLast;
                endNum = originalData.service;
                break;
            case RECEIVE_RATIO_TYPE:
                startNum = originalData.receiveRatioLast;
                endNum = originalData.receiveRatio;
                break;
            case AVERAGE_TIME_TYPE:
                startNum = originalData.sessLast;
                endNum = originalData.sess;
                break;
            case FIRST_RESPONSE_TYPE:
                startNum = originalData.replyLast;
                endNum = originalData.reply;
                break;
            default:
                break;
        }

        if (num > 0) {
            text = '上升';
        } else if (num < 0) {
            text = '下降';
        }

        const textClasses = classNames({
            'stats-percent': true,
            'stats-percent-up': num > 0,
            'stats-percent-down': num < 0,
        });

        const percentNode = this.renderPercent(num);

        return (
            <div className="pop-content">
                <div className={textClasses}>
                   环比{text} <span className="pop-percent">{percentNode}</span>
                </div>

                <div className="date-wrapper end clearfix">
                    <span className="date">{popLastDate} {startName}</span>
                    <span className="num">{startNum}{unit}</span>
                </div>
                <div className="date-wrapper start clearfix">
                    <span className="date">{startDate} {endName}</span>
                    <span className="num">{endNum}{unit}</span>
                </div>
            </div>
        );
    }

    renderPercentRowPop = ({
        text,
        popContent,
        place,
        needQMark = false,
    }) => {
        const textClasses = classNames({
            'stats-percent': true,
            'stats-percent-up': text > 0,
            'stats-percent-down': text < 0,
        });
        const percentNode = this.renderPercent(text);
        const arrowNode = this.renderArrow(text);

        return (
            <div className="percent-row">
                <Popover
                    placement={place}
                    content={popContent}
                >
                    <span className={textClasses}>
                        {percentNode} {arrowNode}
                    </span>
                </Popover>

                {
                    needQMark
                    ?
                        <Popover
                            placement={place}
                            content="（本期数 - 上期数）/ 上期数 * 100%"
                        >
                            <Icon type="question-circle-o" style={{ color: '#c3ccd9' }} />
                        </Popover>
                    : null
                }
            </div>
        );
    }

    renderPercentRow = (opts = {
        text: '',
        popContent: '',
        placement: 'bottom',
        needQMark: false,
    }) => {
        const { placement, popContent, text, needQMark } = opts;
        const place = placement || 'bottom';
        const percentRow = this.renderPercentRowPop({
            text,
            popContent,
            place,
            needQMark,
        });
        return (
            <div>
                {percentRow}
            </div>
        );
    }

    render() {
        const { userInfo } = this.props;
        const { trafficData, conversationData } = this.props.overviewStats;
        const { expandDelta, datePickerVisible } = this.state;
        const trafficColumns = [{
            title: (
                <THeadWithIcon
                    popContent="访问网站的访客数"
                    theadContent="访客数"
                />
            ),
            dataIndex: 'visitor',
            width: '50%',
            render: (text, record, index) => {
                if (index === 0) {
                    return (<span>{text}个</span>);
                } else if (index === 1) {
                    const popContent = this.renderPopContent(text, VISITOR_TYPE);
                    // eslint-disable-next-line max-len
                    const percentRowWithPop = this.renderPercentRow({ text, popContent, needQMark: true });

                    return (
                        <div className="percent-wrapper">
                            {percentRowWithPop}
                        </div>
                    );
                }
                return null;
            },
        }, {
            title: (
                <THeadWithIcon
                    popContent="客服将访客导入CRM的个数"
                    theadContent="入库量"
                />
            ),
            dataIndex: 'inStorage',
            width: '50%',
            render: (text, record, index) => {
                if (index === 0) {
                    return (<span>{text}个</span>);
                } else if (index === 1) {
                    const popContent = this.renderPopContent(text, IN_STORAGE_TYPE);
                    // eslint-disable-next-line max-len
                    const percentRowWithPop = this.renderPercentRow({ text, popContent, needQMark: true });

                    return (
                        <div className="stats-percent-wrapper">
                            {percentRowWithPop}
                        </div>
                    );
                }
                return null;
            },
        }];

        const conversationColumns = [{
            title: (
                <THeadWithIcon
                    popContent="访客发起咨询的数量"
                    theadContent="咨询量"
                />
            ),
            dataIndex: 'consult',
            width: '17%',
            render: (text, record, index) => {
                if (index === 0) {
                    return (<span>{text}次</span>);
                } else if (index === 1) {
                    const popContent = this.renderPopContent(text, CONSULT_TYPE);
                    const percentRowWithPop = this.renderPercentRow({ text, popContent });

                    return (
                        <div className="stats-percent-wrapper">
                            {percentRowWithPop}
                        </div>
                    );
                }
                return null;
            },
        }, {
            title: (
                <THeadWithIcon
                    popContent="访客接入人工的会话总量"
                    theadContent="接待量"
                />
            ),
            dataIndex: 'receive',
            width: '17%',
            render: (text, record, index) => {
                if (index === 0) {
                    return (<span>{text}次</span>);
                } else if (index === 1) {
                    const popContent = this.renderPopContent(text, RECEIVE_TYPE);
                    const percentRowWithPop = this.renderPercentRow({ text, popContent });

                    return (
                        <div className="stats-percent-wrapper">
                            {percentRowWithPop}
                        </div>
                    );
                }
                return null;
            },
        }, {
            title: (
                <THeadWithIcon
                    popContent="接待量/咨询量"
                    theadContent="接待率"
                />
            ),
            dataIndex: 'receiveRatio',
            width: '20%',
            render: (text, record, index) => {
                if (index === 0) {
                    return (<span>{text}%</span>);
                } else if (index === 1) {
                    const popContent = this.renderPopContent(text, RECEIVE_RATIO_TYPE, '%');
                    const percentRowWithPop = this.renderPercentRow({ text, popContent });

                    return (
                        <div className="stats-percent-wrapper">
                            {percentRowWithPop}
                        </div>
                    );
                }
                return null;
            },
        }, {
            title: (
                <THeadWithIcon
                    popContent="访客结束会话与访客建立会话的时间差"
                    theadContent="平均对话时长"
                />
            ),
            dataIndex: 'averageTime',
            width: '23%',
            render: (text, record, index) => {
                if (index === 0) {
                    return (<span>{text}秒</span>);
                } else if (index === 1) {
                    const popContent = this.renderPopContent(text, AVERAGE_TIME_TYPE);
                    const percentRowWithPop = this.renderPercentRow({ text, popContent });

                    return (
                        <div className="stats-percent-wrapper">
                            {percentRowWithPop}
                        </div>
                    );
                }
                return null;
            },
        }, {
            title: (
                <THeadWithIcon
                    popContent="客服响应时间与访客接入客服时间的时间差"
                    theadContent="平均首次响应时长"
                />
            ),
            dataIndex: 'firstResponse',
            width: '23%',
            render: (text, record, index) => {
                if (index === 0) {
                    return (<span>{text}秒</span>);
                } else if (index === 1) {
                    const popContent = this.renderPopContent(text, FIRST_RESPONSE_TYPE);
                    const percentRowWithPop = this.renderPercentRow({ text, popContent });

                    return (
                        <div className="stats-percent-wrapper">
                            {percentRowWithPop}
                        </div>
                    );
                }
                return null;
            },
        }];

        return (
            <div
                className="statistics-overview"
                style={{ marginBottom: 20 }}
            >
                <TimeFilterTab onDateChange={this.onDateChange} />

                <RangeDatePicker
                    show={datePickerVisible}
                    onDateSelectDone={this.onDateSelectDone}
                />

                <div className="overview-wrapper">
                    <h3>流量</h3>
                    <ResizableOverviewTable
                        className="traffic-table"
                        columns={trafficColumns}
                        dataSource={trafficData}
                        pagination={false}
                        delta={expandDelta}
                    />
                </div>

                <div className="overview-wrapper">
                    <h3>对话</h3>
                    <ResizableConversationTable
                        className="conversation-table"
                        columns={conversationColumns}
                        dataSource={conversationData}
                        pagination={false}
                        delta={expandDelta}
                    />
                </div>

                {/*<div className="old-statistics">
                    <Button
                        type="ghost"
                        onClick={this.onViewOldStats}
                    >
                        查询旧版数据
                    </Button>
                    <span className="hint">温馨提示：数据查询是查看旧版网站客服的相关数据，与新版网站客服无关联</span>
                </div>*/}

                {
                    userInfo.isoldmanager === 1
                    ?
                        <div className="old-statistics">
                            <Button
                                type="ghost"
                                onClick={this.onViewOldStats}
                            >
                            查询旧版数据
                        </Button>
                            <span className="hint">温馨提示：数据查询是查看旧版在线客服的相关数据，与新版在线客服无关联</span>
                        </div>
                    : null
                }
            </div>
        );
    }
}

export default Overview;
