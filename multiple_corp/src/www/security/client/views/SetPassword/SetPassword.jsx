import React, { PropTypes } from 'react';
import { Form, Input } from 'antd';
import { transformPropsFitForm, isManagePasswordValid } from '~comm/utils';

const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        span: 5,
    },
    wrapperCol: {
        span: 18,
    },
};

class SetPassword extends React.Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        managePasswordActions: PropTypes.object.isRequired,
        settingForm: PropTypes.object.isRequired,
        errorText: PropTypes.string.isRequired,
    }

    validatePassword = (value, type) => {
        const { managePasswordActions, settingForm } = this.props;
        switch (type) {
            case 1: {
                if (!isManagePasswordValid(value)) {
                    managePasswordActions.updateErrorText('请输入6位数字的管理密码！');
                } else {
                    managePasswordActions.updateErrorText('');
                }

                break;
            }
            case 2:
                if (!value) {
                    managePasswordActions.updateErrorText('请输入确认管理密码!');
                } else if (isManagePasswordValid(settingForm.password) && value !== settingForm.password) {// eslint-disable-line
                    managePasswordActions.updateErrorText('两次输入的密码不一致!');
                } else if (isManagePasswordValid(settingForm.password)) {
                    managePasswordActions.updateErrorText('');
                }
                break;
            default:
                break;
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { errorText, managePasswordActions } = this.props;// eslint-disable-line

        const passwordInput = getFieldDecorator('password')(
            <Input
                autoComplete="new-password"
                type="password"
                placeholder="请输入6位数字"
                onBlur={e => this.validatePassword(e.target.value, 1)}
            />
    );

        const repeatPasswordInput = getFieldDecorator('repeatPassword')(
            <Input
                autoComplete="new-password"
                type="password"
                onBlur={e => this.validatePassword(e.target.value, 2)}
            />
    );

        return (
            <div className="manage-password-setting">
                <div
                    className="text-center password-prompt"
                    style={{
                        fontSize: 14,
                        color: 'red',
                        fontWeight: 'normal',
                        backgroundColor: '#ffffba',
                        marginBottom: 20,
                        padding: 10,
                    }}
                >为保障企业管理和数据资料的安全，请设置登录的平台管理密码。</div>

                <Form>
                    <FormItem
                        label="管理密码"
                        {...formItemLayout}
                    >
                        {passwordInput}
                    </FormItem>

                    <FormItem
                        label="确认管理密码"
                        {...formItemLayout}
                    >
                        {repeatPasswordInput}
                    </FormItem>
                </Form>
            </div>
        );
    }
}

const mapPropsToFields = props => transformPropsFitForm(props.settingForm);
const onFieldsChange = (props, fields) => props.managePasswordActions.updateSettingForm({ fields });

export default Form.create({
    mapPropsToFields,
    onFieldsChange,
})(SetPassword);
