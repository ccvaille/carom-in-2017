import React, { PropTypes } from 'react';
import { Icon, Tooltip } from 'antd';
import moment from 'moment';
import { baseTableScrollDelta } from 'constants/shared';
import * as LeftMsgStatusTypes from 'constants/LeftMsgStatusTypes';
import HistoryListTypes from 'constants/HistoryListTypes';
import resizableTableHOC from 'components/ResizableTableHOC';
import csDefaultAvatar from 'images/cs-default.png';
import customerDefaultAvatar from 'images/client-device-wx.png';
import TableOperation from './components/TableOperation';
import ChatRecord from './components/ChatRecord';
import './history.less';

// eslint-disable-next-line max-len
const ResizeableHistoryTable = resizableTableHOC(baseTableScrollDelta + 8);

class History extends React.Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        historyActions: PropTypes.object.isRequired,
        app: PropTypes.object.isRequired,
    };

    state = {
        isAddMsg: 0,    // false: 拉取聊天记录，true: 留言窗口,
        messageInfos: {},
    };

    componentDidMount() {
        this.props.historyActions.getHistoryList();
    }

    onTableChange = (page) => {
        const { pagination } = this.props.history;
        const { updateGetParams, getHistoryList } = this.props.historyActions;
        if (page && page.current !== pagination.current) {
            updateGetParams({
                page: page.current,
            });
        }

        getHistoryList();
    };

    onTableRowClick = (record) => {
        const typeFilter = this.props.history.params.type * 1;  // 1: 网页会话； 2： 离线留言
        const {
            updateGetParams,
            updateModalStatus,
            getChatList,
            updateChatParams,
            updateLeftMsgParams,
            getLeftMsg,
            updateMessageInfos,
            getChatListSuccess,
        } = this.props.historyActions;
        const messageInfos = {
            talkId: record.talkid,  // 会话记录id,
            csId: record.csid,
            csPic: record.csface,
            guId: '',   // 访客id
            guTerminal: record.terminal,
            visitorName: record.guidname,
            kfName: record.csname,
            crmId: record.crmid,
        };

        getChatListSuccess({
            data: {
                list: [],
            },
        });

        if (typeFilter === HistoryListTypes.CHAT_WEB) {  // 聊天记录
            messageInfos.guId = record.guid;
            this.setState({
                isAddMsg: typeFilter,
            });

            updateChatParams({
                csId: record.csid,
                guId: record.guid,
                isNext: false,
                isCompleted: false,
                begin: 0,
                period: 'today',
            });

            getChatList();
        } else if (typeFilter === HistoryListTypes.CHAT_LEAVE_MSG) {  // 离线留言
            messageInfos.guId = record.guid;
            this.setState({
                isAddMsg: typeFilter,
            });
            updateLeftMsgParams({
                msgId: record.msgid,
                guId: record.guid,
            });

            getLeftMsg();
        } else if (typeFilter === HistoryListTypes.CHAT_QQ) {
            messageInfos.guId = record.qqid;
            messageInfos.customerName = record.qqname;
            this.setState({
                isAddMsg: typeFilter,
            });

            // console.log(record,'record')
            updateChatParams({
                csId: record.csid,
                guId: record.qqid,
                isNext: false,
                isCompleted: false,
                begin: 0,
                period: 'today',
            });

            getChatList();
        } else if (typeFilter === HistoryListTypes.CHAT_WX) {
            messageInfos.guId = record.wxid;
            messageInfos.openId = record.openid;
            messageInfos.face = record.face;
            this.setState({
                isAddMsg: typeFilter,
            });

            // console.log(record,'record')
            updateChatParams({
                csId: record.csid,
                guId: record.wxid,
                openId: record.openid,
                isNext: false,
                isCompleted: false,
                begin: 0,
                period: 'today',
            });

            getChatList();
        }

        updateMessageInfos(messageInfos);

        updateGetParams({
            crmId: record.crmid,
        });

        updateModalStatus(true);
    };

    onModalHandleOk = () => {
        const { updateModalStatus } = this.props.historyActions;
        updateModalStatus(false);
    };

    onModalHandleCancel = () => {
        const { updateModalStatus } = this.props.historyActions;
        updateModalStatus(false);
    };

    // 离线留言记录-状态筛选
    onLeftMsgStatusFilter = (v) => {
        const value = v;
        const { updateGetParams, getHistoryList } = this.props.historyActions;
        switch (value) {
            case LeftMsgStatusTypes.UNANSWERED: {
                updateGetParams({
                    msgFilter: v,
                });
                break;
            }
            case LeftMsgStatusTypes.ALL:
                updateGetParams({
                    msgFilter: v,
                });
                break;
            case LeftMsgStatusTypes.REPLIED:
                updateGetParams({
                    msgFilter: v,
                });
                break;
            case LeftMsgStatusTypes.TO_FOLLOW_UP:
                updateGetParams({
                    msgFilter: v,
                });
                break;
            case LeftMsgStatusTypes.ALL_STATUS:
                updateGetParams({
                    msgFilter: v,
                });
                break;
            default: {
                updateGetParams({
                    msgFilter: LeftMsgStatusTypes.ALL,
                });
                break;
            }
        }
        getHistoryList();
    };

    onAvatarLoadFailed = (id, type) => {
        this.props.historyActions.fallbackAvatar({
            id: Number(id),
            type,
        });
    }

    render() {
        const { historyList, pagination, messageInfos } = this.props.history;
        const { type } = this.props.history.params;

        // 0:纯客服，1：客服经理
        const isManager = this.props.app ? this.props.app.userInfo.ismanager * 1 : 0;

        let resizeableHtml = '';
        let columns;
        if (type * 1 === HistoryListTypes.CHAT_WEB) {
            columns = [{
                title: '开始时间',
                width: '16%',
                key: 'begin',
                dataIndex: 'begin',
                render: text => (
                    <div>
                        {moment(text * 1000).format('YYYY-MM-DD HH:mm')}
                    </div>
                ),
            }, {
                title: '访客姓名',
                width: '20%',
                key: 'guidname',
                dataIndex: 'guidname',
                className: 'gu-name-td',
                render: (text, record) => {
                    let terminalHtml = '';

                    switch (record.terminal * 1) {
                        case 0:
                            break;
                        case 1:
                            terminalHtml = (<span className="table-device-pc" />);
                            break;
                        case 2:
                            terminalHtml = (<span className="table-device-phone" />);
                            break;
                        default:
                            break;
                    }
                    return (
                        <div className="text-ellipsis" style={{ textAlign: 'left' }}>
                            {terminalHtml}
                            <span>{text}</span>
                        </div>
                    );
                },
            }, {
                title: '地区',
                width: '14%',
                key: 'address',
                dataIndex: 'address',
            }, {
                title: '来源',
                width: '14%',
                key: 'referDomain',
                dataIndex: 'referDomain',
            }, {
                title: '首次响应时间',
                width: '13%',
                key: 'firstreply',
                dataIndex: 'firstreply',
            }, {
                title: '对话时长',
                width: '10%',
                key: 'sesslength',
                dataIndex: 'sesslength',
            }];

            if (isManager === 1) {
                columns.unshift({
                    title: '客服',
                    dataIndex: 'csname',
                    width: '14%',
                    key: 'csname',
                    className: 'cs-name-td',
                    render: (text, record) => (
                        <div className="text-ellipsis" style={{ textAlign: 'left' }}>
                            <img
                                className="cs-avatar"
                                src={record.csface || csDefaultAvatar}
                                onError={() => this.onAvatarLoadFailed(record.talkid, 'talk')}
                                alt="头像"
                            />
                            <Tooltip
                                placement="topLeft"
                                title={text || '客服已删'}
                            >
                                <span>{text || '客服已删'}</span>
                            </Tooltip>
                        </div>
                    ),
                });
            }

            resizeableHtml = (
                <ResizeableHistoryTable
                    rowKey={record => record.id}
                    columns={columns}
                    dataSource={historyList}
                    pagination={pagination.total <= pagination.pageSize ? false : pagination}
                    onChange={this.onTableChange}
                    onRowClick={this.onTableRowClick}
                    locale={{
                        emptyText: (<span><Icon type="exclamation-circle-o" />访客暂无咨询</span>),
                    }}
                />
            );
        } else if (type * 1 === HistoryListTypes.CHAT_LEAVE_MSG) {
            columns = [{
                title: '开始时间',
                width: '16%',
                key: 'time',
                dataIndex: 'time',
                render: text => (
                    <div>
                        {moment(text * 1000).format('YYYY-MM-DD HH:mm')}
                    </div>
                ),
            }, {
                title: '访客姓名',
                width: '20%',
                key: 'guidname',
                dataIndex: 'guidname',
                className: 'gu-name-td',
                render: (text, record) => {
                    let terminalHtml = '';

                    switch (record.terminal * 1) {
                        case 0:
                            break;
                        case 1:
                            terminalHtml = (<span className="table-device-pc" />);
                            break;
                        case 2:
                            terminalHtml = (<span className="table-device-phone" />);
                            break;
                        default:
                            break;
                    }
                    return (
                        <div className="text-ellipsis" style={{ textAlign: 'left' }}>
                            {terminalHtml}
                            <span>{text}</span>
                        </div>
                    );
                },
            }, {
                title: '地区',
                width: '14%',
                key: 'address',
                dataIndex: 'address',
            }, {
                title: '来源',
                width: '14%',
                key: 'referDomain',
                dataIndex: 'referDomain',
            }, {
                title: '状态',
                width: '12%',
                key: 'statusTxt',
                dataIndex: 'statusTxt',
            }];

            if (isManager === 1) {
                columns.unshift({
                    title: '客服',
                    dataIndex: 'csname',
                    width: '14%',
                    key: 'csname',
                    render: (text, record) => (
                        <div style={{ textAlign: 'left' }}>
                            <img
                                className="cs-avatar"
                                src={record.csface || csDefaultAvatar}
                                onError={(e) => {
                                    e.target.src = csDefaultAvatar;
                                    this.onAvatarLoadFailed(record.msgid, 'message');
                                }}
                                alt="头像"
                            />
                            <span>{text || '客服已删'}</span>
                        </div>
                    ),
                });
            }
        } else if (type * 1 === HistoryListTypes.CHAT_QQ) {
            columns = [{
                title: '开始时间',
                width: '16%',
                key: 'begin',
                dataIndex: 'begin',
                render: text => (
                    <div>
                        {moment(text * 1000).format('YYYY-MM-DD HH:mm')}
                    </div>
                ),
            }, {
                title: '访客姓名',
                width: '20%',
                key: 'guidname',
                dataIndex: 'guidname',
                className: 'gu-name-td',
            }, {
                title: '来源',
                width: '14%',
                key: 'from',
                dataIndex: 'from',
            }];

            if (isManager === 1) {
                columns.unshift({
                    title: '客服',
                    dataIndex: 'csname',
                    width: '14%',
                    key: 'csname',
                    render: (text, record) => (
                        <div style={{ textAlign: 'left' }}>
                            <img
                                className="cs-avatar"
                                src={record.csface || csDefaultAvatar}
                                onError={(e) => {
                                    e.target.src = csDefaultAvatar;
                                    this.onAvatarLoadFailed(record.msgid, 'message');
                                }}
                                alt="头像"
                            />
                            <Tooltip
                                placement="topLeft"
                                title={text || '客服已删'}
                            >
                                <span>{text || '客服已删'}</span>
                            </Tooltip>
                        </div>
                    ),
                });
            }
        } else if (type * 1 === HistoryListTypes.CHAT_WX) {
            columns = [{
                title: '开始时间',
                width: '16%',
                key: 'createtime',
                dataIndex: 'createtime',
            }, {
                title: '访客姓名',
                width: '20%',
                key: 'guidname',
                dataIndex: 'guidname',
                className: 'gu-name-td',
                render: (text, record) => (
                    <div className="text-ellipsis" style={{ textAlign: 'left' }}>
                        <img
                            className="cs-avatar"
                            src={record.face || customerDefaultAvatar}
                            alt="头像"
                            onError={(e) => {
                                e.target.src = customerDefaultAvatar;
                            }}
                        />
                        <span>{text}</span>
                    </div>
                ),
            }, {
                title: '地区',
                width: '14%',
                key: 'address',
                dataIndex: 'address',
            }, {
                title: '来源',
                width: '14%',
                key: 'referDomain',
                dataIndex: 'referDomain',
                render: () => (<div>微信访客</div>),
            }];

            if (isManager === 1) {
                columns.unshift({
                    title: '客服',
                    dataIndex: 'csname',
                    width: '14%',
                    key: 'csname',
                    render: (text, record) => (
                        <div style={{ textAlign: 'left' }}>
                            <img
                                className="cs-avatar"
                                src={record.csface || csDefaultAvatar}
                                onError={(e) => {
                                    e.target.src = csDefaultAvatar;
                                    this.onAvatarLoadFailed(record.msgid, 'message');
                                }}
                                alt="头像"
                            />
                            <span>{text || '客服已删'}</span>
                        </div>
                    ),
                });
            }
        }

        let statsNode = null;
        if (type * 1 !== HistoryListTypes.CHAT_LEAVE_MSG) {
            statsNode = (
                <span
                    className="receive-stats"
                >
                    总计：共接待 <span style={{ color: 'red' }}>{pagination.total || 0}</span> 条
                </span>
            );
        }

        // console.log(pagination, 'pa')
        resizeableHtml = (
            <ResizeableHistoryTable
                rowKey={record => record.id}
                columns={columns}
                dataSource={historyList}
                pagination={pagination.total <= pagination.pageSize ? false : pagination}
                onChange={this.onTableChange}
                onRowClick={this.onTableRowClick}
                locale={{
                    emptyText: (<span><Icon type="exclamation-circle-o" />访客暂无咨询</span>),
                }}
            />
        );

        return (
            <div className="cs-history">
                <TableOperation
                    params={this.props.history.params}
                    isManager={isManager}
                    kfList={this.props.history.kfList}
                    showDatePicker={this.props.history.showDatePicker}
                />
                {resizeableHtml}
                {statsNode}
                <ChatRecord
                    leftMsg={this.props.history.leftMsg}
                    isAddMsg={this.state.isAddMsg}
                    visible={this.props.history.visible}
                    messageInfos={messageInfos}
                    onModalHandleOk={this.onModalHandleOk}
                    onModalHandleCancel={this.onModalHandleCancel}
                    trackList={this.props.history.trackList}
                    trackParams={this.props.history.trackParams}
                    trackPagination={this.props.history.trackPagination}
                    chat={this.props.history.chat}
                    currentCrmId={this.props.history.params.crmId}
                    date={this.props.history.params.date}
                />
            </div>
        );
    }
}

export default History;
