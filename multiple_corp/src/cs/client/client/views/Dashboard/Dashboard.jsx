import React, { PropTypes } from 'react';
import classNames from 'classnames';
import shortid from 'shortid';
import { Table, Select, Icon } from 'antd';
import THeadWithIcon from 'components/THeadWithIcon';
import {
    baseTableScrollDelta,
    tablePaginationHeight,
    dateFormat,
    today,
} from 'constants/shared';
import TimeFilterTab from 'components/TimeFilterTab';
import RangeDatePicker from 'components/RangeDatePicker';
import resizableTableHOC from 'components/ResizableTableHOC';
import './dashboard.less';

const Option = Select.Option;

const timeFilterHeight = 28;
const upperTableHeight = 156;

// eslint-disable-next-line max-len
const ResizableCsTable = resizableTableHOC((baseTableScrollDelta - tablePaginationHeight) + timeFilterHeight + upperTableHeight);

class Dashboard extends React.Component {
    static propTypes = {
        updateParams: PropTypes.func.isRequired,
        getOverview: PropTypes.func.isRequired,
        updateCsStatsParams: PropTypes.func.isRequired,
        dashboard: PropTypes.shape({
            params: PropTypes.shape({
                date: PropTypes.number.isRequired,
                startDate: PropTypes.string.isRequired,
                endDate: PropTypes.string.isRequired,
            }),
            overview: PropTypes.array.isRequired,
            csStats: PropTypes.array.isRequired,
            // csStatsPagination: PropTypes.shape({
            //     total: PropTypes.number.isRequired,
            //     current: PropTypes.number.isRequired,
            //     pageSize: PropTypes.number.isRequired,
            // }),
            csList: PropTypes.array.isRequired,
            csParams: PropTypes.shape({
                csid: PropTypes.number.isRequired,
            }),
            averageMsgs: PropTypes.number.isRequired,
            averageTime: PropTypes.number.isRequired,
            averageFirstResponse: PropTypes.number.isRequired,
            averageService: PropTypes.number.isRequired,
        }).isRequired,
        fallbackAvatar: PropTypes.func.isRequired,
    }

    state = {
        datePickerVisible: false,
        expandDatePickerDelta: 0,
    }

    componentDidMount() {
        this.props.getOverview();
    }

    componentWillUnmount() {
        this.props.updateParams({
            date: 0,
            startDate: today,
            endDate: today,
        });
    }

    onDateChange = (type) => {
        const { updateParams, getOverview } = this.props;
        const { startDate, endDate } = this.props.dashboard.params;
        this.setState({
            datePickerVisible: false,
            expandDatePickerDelta: 0,
        });
        switch (type) {
            case 0:
            case 1:
            case 2:
            case 3: {
                updateParams({
                    date: type,
                });
                break;
            }
            case 4: {
                this.setState({
                    datePickerVisible: true,
                    expandDatePickerDelta: 50,
                });
                if (startDate && endDate) {
                    updateParams({
                        date: type,
                    });
                }
                break;
            }
            default:
                break;
        }

        if (type !== 4) {
            getOverview();
        }

        if (startDate && endDate) {
            getOverview();
        }
    }

    onDateSelectDone = (dates) => {
        const { updateParams, getOverview } = this.props;
        const { start, end } = dates;
        updateParams({
            date: 4,
            startDate: start.format(dateFormat),
            endDate: end.format(dateFormat),
        });

        getOverview();
    }

    onCsChange = (id) => {
        const { updateCsStatsParams, getOverview } = this.props;
        updateCsStatsParams({
            csid: Number(id),
        });
        getOverview();
    }

    onAvatarLoadFailed = (csid) => {
        this.props.fallbackAvatar({
            id: Number(csid),
        });
    }

    // onCsTableChange = (page) => {
    //     const { updateCsStatsParams, getCsStats } = this.props;
    //     if (page.current !== this.props.dashboard.csParams.page.current) {
    //         updateCsStatsParams({
    //             page: page.current,
    //         });
    //     }

    //     getCsStats();
    // }

    render() {
        // const { services } = this.props;
        const { datePickerVisible } = this.state;
        const {
            overview,
            csStats,
            csList,
            averageMsgs,
            averageTime,
            averageFirstResponse,
            averageService,
            csParams,
        } = this.props.dashboard;

        const visitorColumns = [{
            title: (
                <THeadWithIcon
                    popContent="访问网站的访客数"
                    theadContent="访客数"
                />
            ),
            key: 'visitorsCount',
            dataIndex: 'visitor',
            render: text => (
                <div className="overview-num">
                    <span>{text}</span> 个
                </div>
            ),
        }, {
            title: (
                <THeadWithIcon
                    popContent="客服将访客导入CRM的个数"
                    theadContent="入库量"
                />
            ),
            key: 'storageCount',
            dataIndex: 'save',
            render: text => (
                <div className="overview-num">
                    <span>{text}</span> 个
                </div>
            ),
        }, {
            title: (
                <THeadWithIcon
                    popContent="访客发起咨询的数量"
                    theadContent="咨询量"
                />
            ),
            key: 'adviseCount',
            dataIndex: 'consult',
            render: text => (
                <div className="overview-num">
                    <span>{text}</span> 次
                </div>
            ),
        }, {
            title: (
                <THeadWithIcon
                    popContent="访客接入人工的会话总量"
                    theadContent="接待量"
                />
            ),
            key: 'receiveCount',
            dataIndex: 'service',
            render: text => (
                <div className="overview-num">
                    <span>{text}</span> 次
                </div>
            ),
        }, {
            title: (
                <THeadWithIcon
                    popContent="接待量/咨询量"
                    theadContent="接待率"
                />
            ),
            key: 'receivePercent',
            dataIndex: 'serviceRatio',
            render: text => (
                <span style={{ fontWeight: 600 }}>{text}%</span>
            ),
        }];

        const csColumns = [{
            title: '序列',
            key: 'id',
            width: '7%',
            dataIndex: 'index',
            render: text => (
                <span>{text}</span>
            ),
        }, {
            title: '客服',
            key: 'csName',
            dataIndex: 'csname',
            width: '15%',
            render: (text, record) => (
                <div style={{ textAlign: 'left' }}>
                    <img
                        className="cs-avatar"
                        src={record.face}
                        alt="头像"
                        onError={() => this.onAvatarLoadFailed(record.csid)}
                    />
                    <span>{text || '客服已删'}</span>
                </div>
            ),
        }, {
            title: (
                <THeadWithIcon
                    popContent="访客接入人工的会话总量"
                    theadContent="接待量"
                />
            ),
            key: 'service',
            dataIndex: 'service',
            width: '13%',
            render: (text) => {
                const spanClasses = classNames({
                    'low-profile': text < averageService,
                });
                return (
                    <span className={spanClasses}>{text} 次</span>
                );
            },
        }, {
            title: (
                <THeadWithIcon
                    popContent="指每个会话，客服回复的平均消息数"
                    theadContent="消息数"
                />
            ),
            key: 'messageCount',
            dataIndex: 'msgs',
            width: '16%',
            render: (text) => {
                const spanClasses = classNames({
                    'low-profile': text < averageMsgs,
                });
                return (
                    <span className={spanClasses}>{text} 条</span>
                );
            },
        }, {
            title: (
                <THeadWithIcon
                    popContent="访客结束会话与访客建立会话的时间差"
                    theadContent="平均对话时长(S)"
                />
            ),
            key: 'sess',
            dataIndex: 'sess',
            width: '17%',
            render: (text) => {
                const spanClasses = classNames({
                    'low-profile': text > averageTime,
                });
                return (
                    <span className={spanClasses}>{text} 秒</span>
                );
            },
        }, {
            title: (
                <THeadWithIcon
                    popContent="客服响应时间与访客接入客服时间的时间差"
                    theadContent="平均首次响应时长(S)"
                />
            ),
            key: 'firstResponse',
            dataIndex: 'reply',
            width: '17%',
            render: (text) => {
                const spanClasses = classNames({
                    'low-profile': text > averageFirstResponse,
                });
                return (
                    <span className={spanClasses}>{text} 秒</span>
                );
            },
        }];

        const csMemberOptions = csList.map(member => (
            <Option key={shortid.generate()} value={`${member.id}`}>{member.name}</Option>
        ));

        return (
            <div className="cs-dashboard">
                <TimeFilterTab onDateChange={this.onDateChange} />
                <RangeDatePicker
                    show={datePickerVisible}
                    onDateSelectDone={this.onDateSelectDone}
                />
                <Table
                    className="dash-table"
                    style={{ margin: '20px 0 25px' }}
                    columns={visitorColumns}
                    dataSource={overview}
                    pagination={false}
                    locale={{
                        emptyText: (<span><Icon type="exclamation-circle-o" />暂无数据</span>),
                    }}
                />

                <div className="cs-list-operation clearfix">
                    <Select
                        defaultValue={csParams.csid.toString()}
                        onChange={this.onCsChange}
                    >
                        <Option value="0">全部客服</Option>
                        {csMemberOptions}
                    </Select>

                    <span className="note">备注：接待量和消息数低于均值标红，平均对话时长和平均首次响应时长高于均值标红</span>
                </div>

                <ResizableCsTable
                    rowKey={record => record.csid}
                    columns={csColumns}
                    dataSource={csStats}
                    pagination={false}
                    delta={this.state.expandDatePickerDelta}
                />
            </div>
        );
    }
}

export default Dashboard;
