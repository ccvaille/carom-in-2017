import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import shortid from 'shortid';
import { Select, Button, Modal, Input, Icon } from 'antd';
import message from '~comm/components/Message';
import { headerHeight } from 'constants/shared';
import resizableElemHOC from 'components/ResizableElemHOC';
import curvedArrowUpImg from 'images/curved-arrow-up.png';
import './reply-sidebar.less';

const Option = Select.Option;

const headHeight = 51;
const footerHeight = 49;

const GroupsWrapper = resizableElemHOC('div', headerHeight + headHeight + footerHeight);

// 筛选分组是固定两组的
const groupTypes = [{
    title: '公共回复',
    value: '0',
}, {
    title: '我的回复',
    value: '1',
}];

const typeOptions = groupTypes.map(type => (
    <Option key={shortid.generate()} value={type.value}>{type.title}</Option>
));

let groupChooseNode = null;
let groupList = null;

class ReplySidebar extends React.Component {
    static propTypes = {
        commonReplyGroups: PropTypes.array.isRequired,
        myReplyGroups: PropTypes.array.isRequired,
        getReplyGroups: PropTypes.func.isRequired,
        updateGroupName: PropTypes.func.isRequired,
        addGroup: PropTypes.func.isRequired,
        addGroupRemote: PropTypes.func.isRequired,
        activeId: PropTypes.number.isRequired,
        userInfo: PropTypes.object.isRequired,
        saveGroupEdit: PropTypes.func.isRequired,
        removeGroupModalVisible: PropTypes.bool.isRequired,
        toggleRemoveGroupModal: PropTypes.func.isRequired,
        removeGroupRemote: PropTypes.func.isRequired,
        routerPush: PropTypes.func.isRequired,
    }

    state = {
        currentGroupType: '1',
        editGroupId: -1,
        editGroupName: '',
        editGroupType: 'my',
        removeGroupId: -1,
        showAddInput: false,
        isSubmitting: false,
    }

    // componentWillMount() {
    //     // this.changeActiveGroupType(this.props);
    // }

    componentDidMount() {
        this.props.getReplyGroups();
    }

    componentWillReceiveProps = (nextProps) => {
        if (
            nextProps.commonReplyGroups !== this.props.commonReplyGroups ||
            nextProps.myReplyGroups !== this.props.myReplyGroups
        ) {
            const {
                activeId,
                userInfo,
                commonReplyGroups,
                myReplyGroups,
                routerPush,
            } = nextProps;

            if (activeId) {
                // 在子路由内，只切换分组类型，不存在的跳转到快捷回复首页
                const myIndex = myReplyGroups.findIndex(elem => elem.f_id === activeId);
                const commonIndex = commonReplyGroups.findIndex(elem => elem.f_id === activeId);
                if (userInfo.ismanager === 1) {
                    if (commonIndex > -1) {
                        this.setState({
                            currentGroupType: '0',
                        });
                    } else if (myIndex > -1) {
                        this.setState({
                            currentGroupType: '1',
                        });
                    } else {
                        routerPush('/kf/client/quickreply');
                    }
                } else if (myIndex > -1) {
                    this.setState({
                        currentGroupType: '1',
                    });
                } else {
                    this.pushToFirstReply(myReplyGroups);
                }
            } else if (this.afterFirstTime) {
                if (userInfo.ismanager) {
                    if (this.state.currentGroupType === '1') {
                        this.pushToFirstReply(myReplyGroups);
                    } else {
                        this.pushToFirstReply(commonReplyGroups);
                    }
                } else {
                    this.pushToFirstReply(myReplyGroups);
                }
            } else if (userInfo.ismanager) {
                this.setState({
                    currentGroupType: '0',
                });
                this.pushToFirstReply(commonReplyGroups);
            } else {
                this.pushToFirstReply(myReplyGroups);
            }
        }

        if (nextProps.removeGroupModalVisible) {
            document.body.addEventListener('keydown', this.onKeyDown);
        } else {
            document.body.removeEventListener('keydown', this.onKeyDown);
        }

        this.afterFirstTime = true;
    }

    onKeyDown = (e) => {
        if (e.keyCode === 13) {
            this.onConfirmRemoveGroup();
        }
    }

    onGroupTypeChange = (value) => {
        const { myReplyGroups, commonReplyGroups } = this.props;
        this.setState({
            currentGroupType: value,
        });

        switch (value) {
            case '0': {
                this.pushToFirstReply(commonReplyGroups);
                break;
            }
            case '1': {
                this.pushToFirstReply(myReplyGroups);
                break;
            }
            default:
                break;
        }
    }

    onAddGroup = () => {
        this.setState({
            showAddInput: true,
        }, () => {
            this.addInput.focus();
        });
    }

    onAddBlur = (e) => {
        this.saveAddGroup(e.target.value);
    }

    onAddGroupKeyUp = (e) => {
        if (e.keyCode === 13) {
            this.saveAddGroup(e.target.value);
        }
    }

    // eslint-disable-next-line consistent-return
    onEdit = (e, group, type) => {
        e.stopPropagation();
        e.preventDefault();
        if (!group.f_id) {
            return false;
        }

        if (this.state.showAddInput) {
            this.addInput.blur();
        }
        this.setState({
            editGroupId: group.f_id,
            editGroupName: group.f_name,
            editGroupType: type,
        });
    }

    // eslint-disable-next-line consistent-return
    onDelete = (e, group) => {
        e.stopPropagation();
        e.preventDefault();
        if (!group.f_id) {
            return false;
        }

        this.setState({
            removeGroupId: group.f_id,
        });
        this.props.toggleRemoveGroupModal(true);
    }

    onGroupNameChange = (value, id, type) => {
        this.props.updateGroupName({
            id,
            name: value,
            type,
        });
    }

    onEditGroupBlur = (e) => {
        this.saveEditGroup(e.target.value);
    }

    onEditGroupKeyUp = (e) => {
        if (e.keyCode === 13) {
            this.saveEditGroup(e.target.value);
        }
    }

    onCancelRemoveGroup = () => {
        this.props.toggleRemoveGroupModal(false);
    }

    // eslint-disable-next-line consistent-return
    onConfirmRemoveGroup = () => {
        if (this.state.isSubmitting) {
            return false;
        }
        this.setState({
            isSubmitting: true,
        });
        if (this.state.currentGroupType !== -1) {
            const { activeId, commonReplyGroups, myReplyGroups } = this.props;
            const { removeGroupId, currentGroupType } = this.state;
            this.props.removeGroupRemote(removeGroupId, currentGroupType)
                        .then(({ errorMsg }) => {
                            this.setState({
                                isSubmitting: false,
                            });
                            if (!errorMsg && removeGroupId === activeId) {
                                let removeIndex = -1;
                                switch (currentGroupType) {
                                    case '0': {
                                        // eslint-disable-next-line max-len
                                        removeIndex = commonReplyGroups.findIndex(elem => elem.f_id === removeGroupId);
                                        this.onActiveGroupRemoved(removeIndex, commonReplyGroups);
                                        break;
                                    }
                                    case '1': {
                                        // eslint-disable-next-line max-len
                                        removeIndex = myReplyGroups.findIndex(elem => elem.f_id === removeGroupId);
                                        this.onActiveGroupRemoved(removeIndex, myReplyGroups);
                                        break;
                                    }
                                    default:
                                        break;
                                }
                            }
                        });
        }
    }

    onActiveGroupRemoved = (removeIndex, groups) => {
        const { routerPush } = this.props;
        if (removeIndex > -1) {
            if (removeIndex === 0) {
                if (groups.length > 1) {
                    routerPush(`/kf/client/quickreply/${groups[1].f_id}`);
                } else {
                    routerPush('/kf/client/quickreply');
                }
            } else {
                routerPush(`/kf/client/quickreply/${groups[removeIndex - 1].f_id}`);
            }
        }
    }

    getGroupNode = (group, i, type) => {
        const linkClasses = classNames({
            active: this.props.activeId === group.f_id,
        });

        return (
            <li key={i} className="clearfix">
                {group.f_id === this.state.editGroupId
                    ?
                        <div className="edit">
                            <Input
                                autoFocus
                                value={group.f_name}
                                maxLength={10}
                                // eslint-disable-next-line max-len
                                onChange={e => this.onGroupNameChange(e.target.value, group.f_id, type)}
                                onBlur={this.onEditGroupBlur}
                                onKeyUp={this.onEditGroupKeyUp}
                            />
                        </div>
                    :
                        <Link to={`/kf/client/quickreply/${group.f_id}`} className={linkClasses}>
                            <span className="group-title">{group.f_name}</span>
                            <div className="operates">
                                <i
                                    role="button"
                                    tabIndex="0"
                                    className="icon icon-edit-rect"
                                    onClick={e => this.onEdit(e, group, type)}
                                />
                                <i
                                    role="button"
                                    tabIndex="-1"
                                    className="icon icon-delete"
                                    onClick={e => this.onDelete(e, group)}
                                />
                            </div>
                        </Link>
                }
            </li>
        );
    }

    pushToFirstReply = (groups) => {
        const { routerPush } = this.props;
        if (groups.length) {
            if (groups[0].f_id) {
                routerPush(`/kf/client/quickreply/${groups[0].f_id}`);
            }
        } else {
            routerPush('/kf/client/quickreply');
        }
    }

    saveAddGroup = (value) => {
        const {
            addGroup,
            addGroupRemote,
            commonReplyGroups,
            myReplyGroups,
        } = this.props;
        this.setState({
            showAddInput: false,
        });
        if (value) {
            const type = this.state.currentGroupType;
            let exists = -1;
            switch (type) {
                case '0':
                    exists = commonReplyGroups.findIndex(g => g.f_name === value);
                    break;
                case '1':
                    exists = myReplyGroups.findIndex(g => g.f_name === value);
                    break;
                default:
                    break;
            }

            if (exists !== -1) {
                message.error('分组名已存在');
            } else {
                addGroupRemote({
                    value,
                    type,
                });
                addGroup({
                    value,
                    type,
                });
            }
        }
    }

    // eslint-disable-next-line consistent-return
    saveEditGroup = (value) => {
        if (!value) {
            this.props.updateGroupName({
                id: this.state.editGroupId,
                name: this.state.editGroupName,
                type: this.state.editGroupType,
            });
            this.setState({
                editGroupId: -1,
            });
            return false;
        }

        if (this.state.editGroupId !== -1) {
            this.props.saveGroupEdit({
                id: this.state.editGroupId,
                value,
            });
            this.setState({
                editGroupId: -1,
            });
        }
    }

    render() {
        const {
            userInfo,
            commonReplyGroups,
            myReplyGroups,
            removeGroupModalVisible,
        } = this.props;

        const commonGroupList = commonReplyGroups.map((group, i) => this.getGroupNode(group, i, 'common'));
        const myGroupList = myReplyGroups.map((group, i) => this.getGroupNode(group, i, 'my'));
        const groupSelect = (
            <Select
                style={{
                    marginRight: 12,
                    width: '44%',
                }}
                value={this.state.currentGroupType}
                onChange={this.onGroupTypeChange}
            >
                {typeOptions}
            </Select>
        );

        if (userInfo.ismanager === 1) {
            groupChooseNode = groupSelect;
            switch (this.state.currentGroupType) {
                case '0':
                    groupList = commonGroupList;
                    break;
                case '1':
                    groupList = myGroupList;
                    break;
                default:
                    break;
            }
        } else {
            groupChooseNode = (
                <div style={{ display: 'inline-block', marginRight: 12 }}>我的回复：</div>
            );

            groupList = myGroupList;
        }

        let groupNode = (
            <ul className="reply-groups">
                {groupList}
            </ul>
        );

        if (this.state.currentGroupType === '1') {
            if (!myGroupList.length && !this.state.showAddInput) {
                groupNode = (
                    <div className="empty-group-text">
                        <img alt="" src={curvedArrowUpImg} />
                        <p>目前暂无分组</p>
                        <p>您可以点击添加分组</p>
                    </div>
                );
            }
        } else if (this.state.currentGroupType === '0') {
            if (!commonGroupList.length && !this.state.showAddInput) {
                groupNode = (
                    <div className="empty-group-text">
                        <img alt="" src={curvedArrowUpImg} />
                        <p>目前暂无分组</p>
                        <p>您可以点击添加分组</p>
                    </div>
                );
            }
        }

        return (
            <div className="quick-reply-sidebar">
                <div className="head">
                    {groupChooseNode}
                    <Button
                        type="ghost"
                        style={{
                            width: '49%',
                            padding: '5px 12px',
                        }}
                        onClick={this.onAddGroup}
                    >
                        <Icon type="plus" />
                        添加分组
                    </Button>
                </div>

                <GroupsWrapper className="groups-wrapper">
                    {
                        this.state.showAddInput
                        ?
                            <div className="add">
                                <Input
                                    ref={(wrapper) => {
                                        this.addInput = (wrapper && wrapper.refs.input) || null;
                                    }}
                                    maxLength={10}
                                    onBlur={this.onAddBlur}
                                    onKeyUp={this.onAddGroupKeyUp}
                                />
                            </div>
                        : null
                    }
                    {groupNode}
                </GroupsWrapper>

                <Modal
                    title="删除提醒"
                    visible={removeGroupModalVisible}
                    width={360}
                    onOk={this.onConfirmRemoveGroup}
                    onCancel={this.onCancelRemoveGroup}
                    maskClosable={false}
                >
                    确定删除分组吗？
                </Modal>
            </div>
        );
    }
}

export default ReplySidebar;
