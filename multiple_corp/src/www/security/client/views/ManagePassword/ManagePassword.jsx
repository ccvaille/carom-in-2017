import React, { PropTypes } from 'react';
import { withRouter } from 'react-router';
import { Modal, Button } from 'antd';
import { isManagePasswordValid } from '~comm/utils';
import './manage-password.less';

const mainSite = 'https://www.workec.com';

class SecondaryPassword extends React.Component {
    static propTypes = {
        children: PropTypes.element.isRequired,
        router: PropTypes.object.isRequired,
        managePasswordActions: PropTypes.object.isRequired,
        errorText: PropTypes.string.isRequired,
        settingForm: PropTypes.object.isRequired,
        confirmForm: PropTypes.object.isRequired,
        modifyForm: PropTypes.object.isRequired,
        findForm: PropTypes.object.isRequired,
    }

    state = {
        visible: true,
    }

    onOk = () => {// eslint-disable-line
        const { managePasswordActions,
                settingForm,
                confirmForm,
                modifyForm,
                findForm } = this.props;
        const childPath = this.props.children.props.route.path;

        if (childPath === 'password/setting') {
      // 设置密码
            if (!settingForm.password) {
                managePasswordActions.updateErrorText('管理密码不能为空！');
                return false;
            }

            if (!isManagePasswordValid(settingForm.password)) {
                managePasswordActions.updateErrorText('请输入6位数字的管理密码！');
                return false;
            }

            if (!settingForm.repeatPassword) {
                managePasswordActions.updateErrorText('请输入确认管理密码！');
                return false;
            }

            if (settingForm.password !== settingForm.repeatPassword) {
                managePasswordActions.updateErrorText('两次输入的密码不一致！');
                return false;
            }

            managePasswordActions.updateErrorText('');
            managePasswordActions.setPassword();
        } else if (childPath === 'password') {
      // 确认密码
            if (!confirmForm.password) {
                managePasswordActions.updateErrorText('请输入管理密码！');
                return false;
            }
            managePasswordActions.updateErrorText('');
            managePasswordActions.confirmPassword();
        } else if (childPath === 'password/modify') {
      // 修改密码
            if (!modifyForm.oldPassword) {
                managePasswordActions.updateErrorText('请输入旧管理密码!');
                return false;
            }

            if (!modifyForm.password) {
                managePasswordActions.updateErrorText('请输入新密码!');
                return false;
            }

            if (!isManagePasswordValid(modifyForm.password)) {
                managePasswordActions.updateErrorText('新密码格式错误!');
                return false;
            }

            if (modifyForm.repeatPassword !== modifyForm.password) {
                managePasswordActions.updateErrorText('两次输入的密码不一致!');
                return false;
            }

            if (isManagePasswordValid(modifyForm.password)) {
                managePasswordActions.updateErrorText('');
            }

            managePasswordActions.modifyPassword();
        } else if (childPath === 'password/find') {
      // 忘记管理密码
            if (!findForm.userName) {
                managePasswordActions.updateErrorText('用户名不能为空');
                return false;
            }

            if (!findForm.corpName) {
                managePasswordActions.updateErrorText('公司全称不能为空');
                return false;
            }

            if (!findForm.smsCode) {
                managePasswordActions.updateErrorText('验证码不能为空');
                return false;
            }

            if (!findForm.password) {
                managePasswordActions.updateErrorText('管理密码不能为空');
                return false;
            }

            if (!isManagePasswordValid(findForm.password)) {
                managePasswordActions.updateErrorText('请输入6位数字');
                return false;
            }

            if (!findForm.repeatPassword) {
                managePasswordActions.updateErrorText('请输入确认密码');
                return false;
            }

            if (findForm.repeatPassword !== findForm.password) {
                managePasswordActions.updateErrorText('两次输入的密码不一致');
                return false;
            }

            managePasswordActions.findPassword();
        }
    }

    onCancel = () => {
        const { router, children } = this.props;
        const childPath = children.props.route.path;

        if (childPath === 'password/setting') {
      // 设置密码
            if (document.referer) {
                location.href = `${mainSite}/login?from=${document.referer}`;
            } else {
                location.href = `${mainSite}/login`;
            }
        } else if (childPath === 'password') {
      // 确认密码
            if (document.referer) {
                location.href = `${mainSite}/login?from=${document.referer}`;
            } else {
                location.href = `${mainSite}/login`;
            }
        } else if (childPath === 'password/modify') {
      // 修改密码
            router.push({
                pathname: '/manage/password',
            });
        } else if (childPath === 'password/find') {
      // 忘记管理密码
            router.push({
                pathname: '/manage/password',
            });
        }
    }

    render() {
        const { children, errorText } = this.props;
        const childPath = children.props.route.path;
        let cancelText = '取消';
        let okText = '确定';
        let childTitle = '管理密码验证';
        let currWidth;

        if (childPath === 'password') {
            currWidth = 440;
        }

        if (childPath === 'password/setting') {
            childTitle = '设置管理密码';
        }

        if (childPath === 'password/modify' || childPath === 'password/setting') {
            okText = '保存';
        }

        if (childPath === 'password/find') {
            okText = '提交';
        }

        if (childPath === 'password/modify' || childPath === 'password/find') {
            cancelText = '返回';
        }

        if (childPath === 'password/modify') {
            childTitle = '修改管理密码';
        }

        if (childPath === 'password/find') {
            childTitle = '忘记管理密码';
        }

        const footer = (
            <div className="manage-footer clearfix">
                <div className="modal-error-text">{errorText}</div>
                <Button type="ghost" onClick={this.onCancel}>{cancelText}</Button>
                <Button type="primary" onClick={this.onOk}>{okText}</Button>
            </div>
    );

        return (
            <div>
                <Modal
                    title={childTitle}
                    visible={this.state.visible}
                    className="manage-password"
                    wrapClassName="vertical-center-modal"
                    onCancel={this.onCancel}
                    footer={footer}
                    maskClosable={false}
                    width={currWidth}
                >
                    {children}
                </Modal>
            </div>
        );
    }
}

export default withRouter(SecondaryPassword);
