import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import shortid from 'shortid';
import { Input, Modal } from 'antd';
import message from '~comm/components/Message';
import CenterModalFooter from 'components/CenterModalFooter';
import './group-sidebar.less';

class GroupSidebar extends React.Component {
    static propTypes = {
        getCsGroups: PropTypes.func.isRequired,
        addOrEditGroupRemote: PropTypes.func.isRequired,
        sortGroupRemote: PropTypes.func.isRequired,
        upGroup: PropTypes.func.isRequired,
        downGroup: PropTypes.func.isRequired,
        removeGroup: PropTypes.func.isRequired,
        removeGroupRemote: PropTypes.func.isRequired,
        csGroups: PropTypes.array.isRequired,
        activeGroup: PropTypes.string.isRequired,
        updateGroupErrorMsg: PropTypes.func.isRequired,
        groupErrorMsg: PropTypes.string.isRequired,
        routerReplace: PropTypes.func.isRequired,
        totalCsNum: PropTypes.number.isRequired,
    }

    state = {
        addGroupModalVisible: false,
        removeGroupModalVisible: false,
        removeGroupId: '',
        removeIndex: -1,
        editGroupId: '',
        addGroupName: '',
        addGroupModalTitle: '',
        activeId: 'all',
    }

    componentWillMount() {
        this.setState({
            activeId: this.props.activeGroup,
        });
    }

    componentDidMount() {
        this.props.getCsGroups();
        // this.props.getCsGroups();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.activeGroup !== this.props.activeGroup) {
            this.setState({
                activeId: nextProps.activeGroup,
            });
        }
    }

    onAddGroup = () => {
        this.props.updateGroupErrorMsg('');
        if (this.props.csGroups.length < 6) {
            this.setState({
                addGroupModalTitle: '添加分组',
                addGroupModalVisible: true,
                addGroupName: '',
                editGroupId: '',
            }, () => {
                this.groupInput.focus();
            });
        } else {
            message.error('最多创建6个分组');
        }
    }

    onAddGroupNameChange = (e) => {
        this.setState({
            addGroupName: e.target.value,
        });
    }

    onAdd = () => {
        const { updateGroupErrorMsg, addOrEditGroupRemote } = this.props;
        if (!this.state.addGroupName) {
            updateGroupErrorMsg('请输入分组名');
        } else {
            updateGroupErrorMsg('');
            // addOrEditGroup({
            //     id: this.state.editGroupId,
            //     name: this.state.addGroupName,
            // });
            addOrEditGroupRemote({
                id: this.state.editGroupId,
                name: this.state.addGroupName,
            }).then(({ errorMsg }) => {
                if (!errorMsg) {
                    this.setState({
                        addGroupModalVisible: false,
                    }, () => {
                        this.setState({
                            addGroupName: '',
                            editGroupId: '',
                        });
                    });
                }
            });
        }
    }

    onCancelAdd = () => {
        this.setState({
            addGroupModalVisible: false,
            editGroupId: '',
        });
    }

    onEdit = (e, group) => {
        this.props.updateGroupErrorMsg('');
        e.stopPropagation();
        e.preventDefault();
        this.setState({
            addGroupModalTitle: '修改组名',
            addGroupModalVisible: true,
            addGroupName: group.f_group_name,
            editGroupId: group.f_id,
        }, () => {
            this.groupInput.focus();
        });
    }

    onRemove = (e, id, index) => {
        e.stopPropagation();
        e.preventDefault();
        this.setState({
            removeGroupModalVisible: true,
            removeGroupId: id,
            removeIndex: index,
        });
    }

    onConfirmRemoveGroup = () => {
        const { removeGroupId, removeIndex } = this.state;
        const {
            removeGroup,
            removeGroupRemote,
            activeGroup,
            csGroups,
            routerReplace,
        } = this.props;
        removeGroup(removeGroupId);
        removeGroupRemote(removeGroupId).then(({ errorMsg }) => {
            if (!errorMsg) {
                if (Number(activeGroup) === removeGroupId) {
                    if (removeIndex !== -1) {
                        if (removeIndex === 0) {
                            if (csGroups.length > 1) {
                                routerReplace({
                                    pathname: '/kf/index',
                                    query: {
                                        groupid: csGroups[1].f_id,
                                    },
                                });
                            } else {
                                routerReplace({
                                    pathname: '/kf/index',
                                    query: {
                                        groupid: 'all',
                                    },
                                });
                            }
                        } else {
                            routerReplace({
                                pathname: '/kf/index',
                                query: {
                                    groupid: csGroups[removeIndex - 1].f_id,
                                },
                            });
                        }
                    }
                }
            }
        });

        this.setState({
            removeGroupModalVisible: false,
            removeGroupId: '',
        });
    }

    onCancelRemoveGroup = () => {
        this.setState({
            removeGroupModalVisible: false,
            removeGroupId: '',
        });
    }

    onUp = (e, index, id) => {
        e.stopPropagation();
        e.preventDefault();
        this.props.upGroup(index);
        if (index > 0) {
            this.props.sortGroupRemote({
                id,
                type: 'up',
            });
        }
    }

    onDown = (e, index, id) => {
        e.stopPropagation();
        e.preventDefault();
        this.props.downGroup(index);
        if (index < this.props.csGroups.length - 1) {
            this.props.sortGroupRemote({
                id,
                type: 'down',
            });
        }
    }

    onClickGroup = (id) => {
        this.setState({
            activeId: id,
        });
    }

    render() {
        const { groupErrorMsg, csGroups, totalCsNum } = this.props;
        const groupNodes = csGroups.map((group, i) => {
            const groupLinkClasses = classNames({
                active: this.state.activeId === `${group.f_id}`,
            });

            const downClasses = classNames({
                'setting-icon': true,
                'down-icon': true,
                'icon-hidden': i === csGroups.length - 1,
            });

            const upClasses = classNames({
                'setting-icon': true,
                'up-icon': true,
                'icon-hidden': i === 0,
            });

            return (
                <li key={shortid.generate()}>
                    <Link
                        className={groupLinkClasses}
                        to={{ pathname: '/kf/index', query: { groupid: `${group.f_id}` } }}
                        onClick={() => this.onClickGroup(`${group.f_id}`)}
                    >
                        <div className="name-wrapper">
                            <span className="name">{group.f_group_name}</span>
                            <span>（{group.totalcs}）</span>
                        </div>
                        <div className="operates">
                            <span
                                role="button"
                                tabIndex="-2"
                                className={upClasses}
                                onClick={e => this.onUp(e, i, group.f_id)}
                            />
                            <span
                                role="button"
                                tabIndex="-3"
                                className={downClasses}
                                onClick={e => this.onDown(e, i, group.f_id)}
                            />
                            <span
                                role="button"
                                tabIndex="-4"
                                className="setting-icon edit-icon"
                                onMouseDown={e => this.onEdit(e, group)}
                            />
                            <span
                                role="button"
                                tabIndex="-5"
                                className="setting-icon remove-icon"
                                onClick={e => this.onRemove(e, group.f_id, i)}
                            />
                        </div>
                    </Link>
                </li>
            );
        });

        const allGroupClasses = classNames({
            active: this.state.activeId === 'all',
        });

        return (
            <div className="cs-group-sidebar">
                <div
                    role="button"
                    tabIndex="-1"
                    className="add-operate add-group"
                    onClick={this.onAddGroup}
                >
                    <span className="setting-icon add-icon" />
                    <span>添加分组</span>
                </div>

                <ul className="groups">
                    <li className="customer-service">
                        <Link
                            className={allGroupClasses}
                            to={{ pathname: '/kf/index', query: { groupid: 'all' } }}
                            onClick={() => this.onClickGroup('all')}
                        >
                            <span>全部（{totalCsNum}）</span>
                        </Link>
                    </li>
                    {groupNodes}
                </ul>

                <Modal
                    title={this.state.addGroupModalTitle}
                    wrapClassName="vertical-align"
                    visible={this.state.addGroupModalVisible}
                    width={420}
                    footer={
                        <CenterModalFooter
                            onOk={this.onAdd}
                            onCancel={this.onCancelAdd}
                        />
                    }
                    onCancel={this.onCancelAdd}
                    maskClosable={false}
                >
                    <Input
                        placeholder="最多6个字"
                        value={this.state.addGroupName}
                        onChange={this.onAddGroupNameChange}
                        maxLength={6}
                        ref={(wrapper) => { this.groupInput = wrapper && wrapper.refs.input; }}
                    />
                    <p className="form-error-msg">{groupErrorMsg}</p>
                </Modal>

                <Modal
                    className="warning-modal"
                    title="删除提醒"
                    visible={this.state.removeGroupModalVisible}
                    footer={
                        <CenterModalFooter
                            onOk={this.onConfirmRemoveGroup}
                            onCancel={this.onCancelRemoveGroup}
                        />
                    }
                    width={440}
                    onCancel={this.onCancelRemoveGroup}
                    maskClosable={false}
                >
                    <div className="warning" />
                    <div className="warning-content">
                        <h4>确定删除分组吗？</h4>
                        <p>删除后分组成员将被移除。</p>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default GroupSidebar;
