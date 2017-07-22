/* eslint-disable */
import React, { PropTypes } from 'react';
import { Table, Modal, Icon } from 'antd';
import CenterModalFooter from 'components/CenterModalFooter';
import EditCsModal from './components/EditCsModal';
import modalWarningImg from 'img/modal-warning.png';
import './permission-setting-detail.less';

class PermissionSettingDetail extends React.Component {
    static propTypes = {
        currentGroup: PropTypes.string.isRequired,
        getCsList: PropTypes.func.isRequired,
        csList: PropTypes.array.isRequired,
        getCsInfo: PropTypes.func.isRequired,
        currentEditCs: PropTypes.object.isRequired,
        updateCsInfoFields: PropTypes.func.isRequired,
        addOrEditCs: PropTypes.func.isRequired,
        updateActiveGroup: PropTypes.func.isRequired,
        toggleCsModalVisible: PropTypes.func.isRequired,
        csModalVisible: PropTypes.bool.isRequired,
        csRemoveModalVisible: PropTypes.bool.isRequired,
        toggleCsRemoveModal: PropTypes.func.isRequired,
        updateCsInfo: PropTypes.func.isRequired,
        removeCs: PropTypes.func.isRequired,
        csFormErrorMsg: PropTypes.string,
        updateCsFormErrorMsg: PropTypes.func.isRequired,
        // getQQCsStatus: PropTypes.func.isRequired,
        // qqCsStatus: PropTypes.number.isRequired,
    }

    state = {
        currentRemoveCs: {},
        isEditCs: false,
    }

    componentDidMount() {
        const { getCsList, currentGroup, getQQCsStatus } = this.props;
        this.props.updateActiveGroup(currentGroup === 'all' ? '' : currentGroup);
        getCsList(currentGroup);
        // getQQCsStatus();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.currentGroup !== this.props.currentGroup) {
            this.props.updateActiveGroup(nextProps.currentGroup);
            this.props.getCsList(nextProps.currentGroup === 'all' ? '' : nextProps.currentGroup);
        }
    }

    onAddCs = () => {
        this.setState({
            isEditCs: false,
        });
        this.props.toggleCsModalVisible(true);
        this.props.updateCsInfo(false);
    }

    onCancelCsModal = () => {
        this.props.toggleCsModalVisible(false);
        this.props.updateCsFormErrorMsg('');
    }

    onSelectEmployee = (userId) => {
        return this.props.getCsInfo(userId);
        // this.setState({
        //     editCsInfo: info,
        // });
    }

    onConfirmAddCs = () => {
        const { addOrEditCs, updateCsFormErrorMsg } = this.props;
        const { ok, msg } = this.validateForm(this.props.currentEditCs);

        if (!ok) {
            updateCsFormErrorMsg(msg);
        } else {
            addOrEditCs(this.state.isEditCs);
            updateCsFormErrorMsg('');
        }
    }

    onEditCs = (record) => {
        this.setState({
            isEditCs: true,
        });

        this.props.updateCsInfo({
            csId: record.csid,
            employeeName: record.name,
            name: record.showname,
            contact: record.contact, // 职位，不想改名了
            email: record.email,
            mobile: record.mobile,
            tel: record.tel,
            isManager: record.ismanager,
            isCs: record.iscs,
            groupId: `${record.groupid}`,
            qqNumber: record.qq,
            showQQ: record.showqq,
            isQQFirst: record.qqfirst,
        });
        this.props.toggleCsModalVisible(true);
    }

    onRemoveCs = (csInfo) => {
        this.setState({
            currentRemoveCs: csInfo,
        });

        const { type } = csInfo;
        if (type === 'manager') {
            this.removeContent = (
                <div className="warning-content">
                    <h4>确定删除其权限吗？</h4>
                    <p>删除后将不能查看在线客服接待的相关数据。</p>
                </div>
            );
        } else if (type === 'cs') {
            this.removeContent = (
                <div className="warning-content">
                    <h4>确定删除该客服吗？</h4>
                    <p>删除该客服后，他将不再做在线客服接待工作。</p>
                </div>
            );
        }
        this.props.toggleCsRemoveModal(true);
    }

    onConfirmRemoveCs = () => {
        this.props.removeCs(this.state.currentRemoveCs);
    }

    onRemoveCancel = () => {
        this.props.toggleCsRemoveModal(false);
    }

    validateCsId = (csId) => {
        if (!csId) {
            return {
                ok: false,
                msg: '请选择已有员工进行客服配置',
            };
        }

        return {
            ok: true,
            msg: '',
        };
    }

    validateName = (name) => {
        if (!name) {
            return {
                ok: false,
                msg: '请填写姓名',
            };
        }

        if (name.length < 2 || name.length > 8) {
            return {
                ok: false,
                msg: '姓名为2到8个字',
            };
        }

        return {
            ok: true,
            msg: '',
        };
    }

    validateQQNumber = (qqNumber, showQQ) => {
        const qqNumberTrim = qqNumber ? qqNumber.trim() : qqNumber;
        const isQQNumberValid = /^\d+$/.test(qqNumberTrim);
        const msg = qqNumber ? '请输入正确的QQ号码' : '请输入QQ号码';
        if ((qqNumber && isQQNumberValid && showQQ) || !showQQ) {
            return {
                ok: true,
                msg: '',
            };
        }

        return {
            ok: false,
            msg,
        };
    }

    validatePosition = (position) => {
        // if (!position) {
        //     return {
        //         ok: false,
        //         msg: '请填写职位',
        //     };
        // }

        // if (position && (position.length < 2 || position.length > 8)) {
        //     return {
        //         ok: false,
        //         msg: '职位为2到8个字',
        //     };
        // }

        return {
            ok: true,
            msg: '',
        };
    }

    validateTel = (tel) => {
        const isTelephoneValid = /^(?:(?:\(?0?\d{0,3}[\+\-]?\d{2,3}\)?)[\s-]?)?[0][0-9]{2,4}[\-]?[0-9]{5,8}(-[0-9]{3,5})?$/.test(tel);
        if (tel && !isTelephoneValid) {
            return {
                ok: false,
                msg: '电话号码格式错误',
            };
        }

        return {
            ok: true,
            msg: '',
        };
    }

    validatePhone = (mobile) => {
        const isMainlandPhone = /^1[3|4|5|7|8]\d{9}$/.test(mobile);
        const isTaiwanPhone = /^09\d{8}$/.test(mobile);

        // if (!mobile) {
        //     return {
        //         ok: false,
        //         msg: '请填写手机号码',
        //     };
        // }
        if (mobile
            && (
                !isMainlandPhone
                && !isTaiwanPhone
            )
        ) {
            return {
                ok: false,
                msg: '手机格式不正确',
            };
        }

        return {
            ok: true,
            msg: '',
        };
    }

    validateEmail = (email) => {
        const isEmailValid = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/.test(email);

        // if (!email) {
        //     return {
        //         ok: false,
        //         msg: '请填写邮箱',
        //     };
        // }

        if (email && !isEmailValid) {
            return {
                ok: false,
                msg: '邮箱格式不正确',
            };
        }

        return {
            ok: true,
            msg: '',
        };
    }

    validateForm = (info) => {
        const csIdResult = this.validateCsId(info.csId);
        const nameResult = this.validateName(info.name);
        const positionResult = this.validatePosition(info.contact);
        const telResult = this.validateTel(info.tel);
        const phoneResult = this.validatePhone(info.mobile);
        const emailResult = this.validateEmail(info.email);
        const qqCsResult = this.validateQQNumber(info.qqNumber, info.showQQ);
        const showQQ = info.showQQ;

        // console.log(info, 'info', qqCsResult, 'iii', info.qqNumber)

        if (!csIdResult.ok) {
            return csIdResult;
        }

        if (!nameResult.ok) {
            return nameResult;
        }

        if (!positionResult.ok) {
            return positionResult;
        }

        if (!telResult.ok) {
            return telResult;
        }

        if (!phoneResult.ok) {
            return phoneResult;
        }

        if (!emailResult.ok) {
            return emailResult;
        }

        if (showQQ && !qqCsResult.ok) {
            return qqCsResult;
        }

        if (info.isManager !== 1 && info.isCs !== 1) {
            return {
                ok: false,
                msg: '请选择角色',
            };
        }

        if (info.isCs === 1 && (!info.groupId || info.groupId == 0)) {
            return {
                ok: false,
                msg: '请选择分组',
            };
        }

        return {
            ok: true,
            msg: '',
        };
    }

    render() {
        const {
            csList,
            csFormErrorMsg,
            currentEditCs,
            updateCsInfoFields,
            updateCsFormErrorMsg,
            // qqCsStatus,
        } = this.props;
        const columns = [{
            title: '姓名',
            dataIndex: 'name',
            width: '25%',
        }, {
            title: '角色',
            width: '25%',
            render: (text, record) => {
                switch (record.type) {
                    case 'manager':
                        return (<span>客服经理</span>);
                    case 'cs':
                        return (<span>客服</span>);
                    default:
                        return (<span></span>);
                }
            },
        }, {
            title: '组别',
            dataIndex: 'groupname',
            width: '25%',
            render: (text, record) => {
                if (record.type === 'manager') {
                    return (<span></span>);
                }

                return (<span>{text}</span>);
            },
        }, {
            title: '操作',
            width: '25%',
            render: (text, record) => (
                <div className="operates">
                    <span
                        className="setting-icon edit-icon"
                        onClick={() => this.onEditCs(record)}
                    />
                    <span
                        className="setting-icon remove-icon"
                        onClick={() => this.onRemoveCs(record)}
                    />
                </div>
            ),
        }];

        return (
            <div className="permission-setting-detail">
                <div
                    className="add-operate head"
                    style={{ marginBottom: 15 }}
                    onClick={this.onAddCs}
                >
                    <span className="setting-icon add-icon"></span>
                    <span>配置客服</span>
                </div>

                <Table
                    className="corp-cs-table permission-table-list"
                    rowKey={(record, index) => index}
                    columns={columns}
                    dataSource={csList}
                    pagination={false}
                    locale={{
                        emptyText: (<span><Icon type="smile-o" />请您配置客服</span>),
                    }}
                />

                <Modal
                    className="deploy-service"
                    title="配置客服"
                    visible={this.props.csModalVisible}
                    footer={(
                        <CenterModalFooter
                            onOk={this.onConfirmAddCs}
                            onCancel={this.onCancelCsModal}
                        />
                    )}
                    onCancel={this.onCancelCsModal}
                    width={600}
                    maskClosable={false}
                >
                    <EditCsModal
                        isEdit={this.state.isEditCs}
                        formErrorMsg={csFormErrorMsg}
                        csInfo={currentEditCs}
                        onSelectEmployee={this.onSelectEmployee}
                        updateCsInfoFields={updateCsInfoFields}
                        updateFormErrorMsg={updateCsFormErrorMsg}
                        validateName={this.validateName}
                        validatePosition={this.validatePosition}
                        validateTel={this.validateTel}
                        validatePhone={this.validatePhone}
                        validateEmail={this.validateEmail}
                        validateQQNumber={this.validateQQNumber}
                    />
                </Modal>

                <Modal
                    className="warning-modal"
                    title="删除提醒"
                    visible={this.props.csRemoveModalVisible}
                    width={440}
                    footer={(
                        <CenterModalFooter
                            onOk={this.onConfirmRemoveCs}
                            onCancel={this.onRemoveCancel}
                        />
                    )}
                    onCancel={this.onRemoveCancel}
                >
                    <div className="clearfix">
                        <img className="modal-warning-icon" src={modalWarningImg} alt="" />
                        {this.removeContent}
                    </div>
                </Modal>

            </div>
        );
    }
}

export default PermissionSettingDetail;
