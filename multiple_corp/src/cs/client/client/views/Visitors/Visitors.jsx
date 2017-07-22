import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { Icon, Tooltip, Menu, Radio } from 'antd';
import { baseTableScrollDelta } from 'constants/shared';
import resizableTableHOC from 'components/ResizableTableHOC';
import pcAvatar from 'images/client-device-pc.png';
import mobileAvatar from 'images/client-device-phone.png';
// import inviteIcon from 'images/invite-icon.png';
import './visitors.less';

const MenuItem = Menu.Item;
const ResizeableVisitorTable = resizableTableHOC(baseTableScrollDelta + 10);


const statusFilters = [{
    text: '全部',
    value: -1,
}, {
    text: '浏览中',
    value: 0,
}, {
    text: '邀请中',
    value: 1,
}, {
    text: '被拒绝',
    value: 2,
}, {
    text: '对话中',
    value: 3,
}];

class Visitors extends React.Component {
    static propTypes = {
        visitors: PropTypes.object.isRequired,
        getVisitors: PropTypes.func.isRequired,
        updateGetParams: PropTypes.func.isRequired,
        sendInvite: PropTypes.func.isRequired,
        updateVisitorStatus: PropTypes.func.isRequired,
        getInviteSetting: PropTypes.func.isRequired,
        inviteSetting: PropTypes.object.isRequired,
        offlineModalVisible: PropTypes.bool.isRequired,
        userInfo: PropTypes.object.isRequired,
    }

    state = {
        invitedIds: [],
        selectedKeys: ['-1'],
        filterDropdownVisible: false,
    }

    componentDidMount() {
        const { getInviteSetting } = this.props;
        getInviteSetting();

        // 定时拉取新的访客数据
        this.startGetVisitorInterval();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.offlineModalVisible !== this.props.offlineModalVisible) {
            if (nextProps.offlineModalVisible) {
                // 离线
                this.stopGetVisitorInterval();
            } else if (!nextProps.offlineModalVisible) {
                // 上线
                this.startGetVisitorInterval();
            }
        }
    }

    componentDidUpdate() {
        const $statusTd = document.querySelector('.status-filter-td i');
        if (this.state.selectedKeys.length > 0 && this.state.selectedKeys.indexOf('-1') === -1) {
            $statusTd.style.color = '#108ee9';
        } else {
            $statusTd.style.color = '#aaa';
        }
    }

    componentWillUnmount() {
        this.stopGetVisitorInterval();
    }

    onTableChange = (page, filters) => {
        const { pagination } = this.props.visitors;
        const { updateGetParams, getVisitors } = this.props;

        if (page && page.current !== pagination.current) {
            updateGetParams({
                page: page.current,
            });

            if (filters && filters.status && filters.status.length > 0) {
                updateGetParams({
                    status: Number(filters.status[0]),
                });
            } else {
                updateGetParams({
                    status: -1,
                });
            }
        }

        getVisitors();
    }

    onInvite = (guid) => {
        this.props.sendInvite(guid, this.inviteCallback.bind(this, guid));
    }

    onSelectFilter = (item) => {
        const { updateGetParams, getVisitors } = this.props;
        updateGetParams({
            status: Number(item.key),
        });
        getVisitors();
        this.setState({
            filterDropdownVisible: false,
        });
    }

    setSelectedKeys = ({ selectedKeys }) => {
        this.setState({ selectedKeys });
    }

    startGetVisitorInterval = () => {
        const { getVisitors } = this.props;
        this.getInterval = setInterval(() => {
            getVisitors();
        }, 5000);
    }

    stopGetVisitorInterval = () => {
        if (this.getInterval) {
            clearInterval(this.getInterval);
            this.getInterval = null;
        }
    }

    inviteCallback = (guid) => {
        this.props.updateVisitorStatus({
            guid,
            status: 1,
        });
    }

    render() {
        const { inviteSetting, userInfo } = this.props;
        const { visitors, pagination } = this.props.visitors;

        /* eslint-disable max-len */
        const statusFilterMenu = (
            <Menu
                prefixCls="ant-dropdown-menu"
                onClick={this.onSelectFilter}
                onSelect={this.setSelectedKeys}
                onDeselect={this.setSelectedKeys}
                selectedKeys={this.state.selectedKeys}
            >
                {
                statusFilters.map(item => (
                    <MenuItem
                        key={item.value}
                    >
                        <Radio checked={this.state.selectedKeys.indexOf(item.value.toString()) >= 0} />
                        <span>{item.text}</span>
                    </MenuItem>
                ))
            }
            </Menu>
        );
        /* eslint-enable max-len */

        const columns = [{
            title: '访客姓名',
            dataIndex: 'guidinfo.guidName',
            width: '16%',
            key: 'name',
            render: (text, record) => {
                let avatarUrl = '';
                switch (record.guidinfo.terminal) {
                    case 0:
                    case 1:
                        avatarUrl = pcAvatar;
                        break;
                    case 2:
                        avatarUrl = mobileAvatar;
                        break;
                    default:
                        break;
                }
                return (
                    <div
                        className="user-info"
                    >
                        <img className="user-avatar" src={avatarUrl} alt="头像" />
                        <Tooltip
                            placement="topLeft"
                            title={text}
                        >
                            <span>{text}</span>
                        </Tooltip>
                    </div>
                );
            },
        }, {
            title: '地区',
            dataIndex: 'guidinfo.province',
            width: '16%',
            render: (text, record) => (
                <span>{text}{record.guidinfo.city}</span>
            ),
        }, {
            title: '时间',
            dataIndex: 'guidinfo.visitTime',
            width: '16%',
            key: 'time',
        }, {
            title: '来源',
            dataIndex: 'guidinfo.referDomain',
            width: '16%',
            key: 'referDomain',
            render: (text) => {
                if (!text) {
                    return (<span>直接访问</span>);
                }

                return (<a target="_blank" href={`http://${text}`}>{text}</a>);
            },
        }, {
            title: '着陆页',
            dataIndex: 'guidinfo.landingPage',
            width: '16%',
            key: 'landingPage',
            render: text => (<a target="_blank" href={text}>{text}</a>),
        }, {
            title: '状态',
            dataIndex: 'status',
            width: '16%',
            key: 'status',
            className: 'status-filter-td',
            filters: [{
                text: '全部',
                value: -1,
            }, {
                text: '浏览中',
                value: 0,
            }, {
                text: '邀请中',
                value: 1,
            }, {
                text: '被拒绝',
                value: 2,
            }, {
                text: '对话中',
                value: 3,
            }],
            filterMultiple: false,
            filterDropdownVisible: this.state.filterDropdownVisible,
            onFilterDropdownVisibleChange: (visible) => {
                this.setState({
                    filterDropdownVisible: visible,
                });
            },
            filterDropdown: (
                <div className="ant-table-filter-dropdown visitor-status-filter">
                    {statusFilterMenu}
                </div>
            ),
            render: (text, record) => {
                let statusNode = null;
                const { terminal } = record.guidinfo;
                const { pc, mobile } = inviteSetting;
                const statusClasses = classNames({
                    'visitor-status': true,
                    'allow-invite': userInfo.iscs === 1 && (((terminal === 0 || terminal === 1) && pc.inviteActive === 1)
                                    || (terminal === 2 && mobile.inviteActive === 1)),
                });

                switch (text) {
                    case 0: {
                        let inviteNode = null;
                        if (terminal === 1) {
                            if (
                                (inviteSetting.pc.inviteActive === undefined && userInfo.iscs === 1)
                                || (inviteSetting.pc.inviteActive === 1 && userInfo.iscs === 1)
                            ) {
                                inviteNode = (
                                    <div
                                        role="button"
                                        tabIndex="-1"
                                        className="invite"
                                        onClick={() => this.onInvite(record.guidinfo.guid)}
                                    >
                                        <i className="icon icon-user-add" />
                                        <span>邀请会话</span>
                                    </div>
                                );
                            }
                        } else if (terminal === 2) {
                            if (
                                // eslint-disable-next-line max-len
                                (inviteSetting.mobile.inviteActive === undefined && userInfo.iscs === 1)
                                || (inviteSetting.mobile.inviteActive === 1 && userInfo.iscs === 1)
                            ) {
                                inviteNode = (
                                    <div
                                        role="button"
                                        tabIndex="-1"
                                        className="invite"
                                        onClick={() => this.onInvite(record.guidinfo.guid)}
                                    >
                                        <i className="icon icon-user-add" />
                                        <span>邀请会话</span>
                                    </div>
                                );
                            }
                        }

                        statusNode = (
                            <div>
                                <span className="browsing">浏览中</span>
                                {inviteNode}
                            </div>
                        );
                        break;
                    }
                    case 1:
                        statusNode = (<span>邀请中</span>);
                        break;
                    case 3:
                        statusNode = (<span>与 {record.csname} 对话中</span>);
                        break;
                    case 2:
                        statusNode = (<span>被拒绝</span>);
                        break;
                    default:
                        // statusNode = (<span></span>);
                        break;
                }
                return (
                    <div className={statusClasses}>
                        {statusNode}
                    </div>
                );
            },
        }];

        return (
            <div className="cs-visitors">
                <div className="list-wrapper">
                    <ResizeableVisitorTable
                        className="visitor-table"
                        rowKey={(record, index) => index}
                        columns={columns}
                        dataSource={visitors}
                        pagination={pagination.total <= pagination.pageSize ? false : pagination}
                        onChange={this.onTableChange}
                        locale={{
                            emptyText: (<span><Icon type="exclamation-circle-o" />暂无访客</span>),
                        }}
                    />
                </div>

                <div className="visistors-statistics">
                    在线访客：<span style={{ color: 'red' }}>{pagination.total}</span>人在线
                </div>
            </div>
        );
    }
}

export default Visitors;
