import React, { PropTypes } from 'react';
import { Form, Input } from 'antd';
import { transformPropsFitForm, isManagePasswordValid } from '~comm/utils';

const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        span: 5,
    },
    wrapperCol: {
        span: 17,
    },
};

class ModifyPassword extends React.Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        updateModifyForm: PropTypes.func.isRequired,// eslint-disable-line
        updateErrorText: PropTypes.func.isRequired,
        modifyForm: PropTypes.object.isRequired,
        errorText: PropTypes.string.isRequired,// eslint-disable-line
        checkOldPassword: PropTypes.func.isRequired,
    }

    validatePassword = (value, type) => {
        const { updateErrorText, modifyForm } = this.props;
        switch (type) {
            case 1: {
                if (!value) {
                    updateErrorText('请输入旧管理密码!');
                } else {
                    this.props.checkOldPassword(value);
                    updateErrorText('');
                }
                break;
            }
            case 2: {
                if (!value) {
                    updateErrorText('请输入新管理密码!');
                } else if (!isManagePasswordValid(value)) {
                    updateErrorText('新管理密码格式错误！');
                } else {
                    updateErrorText('');
                }
                break;
            }
            case 3: {
                if (!value) {
                    updateErrorText('请重复输入管理密码!');
                } else if (value !== modifyForm.password) {
                    updateErrorText('两次输入的密码不一致!');
                } else if (isManagePasswordValid(modifyForm.password)) {
                    updateErrorText('');
                }
                break;
            }
            default:
                break;
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const oldPasswordInput = getFieldDecorator('oldPassword')(
            <Input
                autoComplete="new-password"
                type="password"
                onBlur={e => this.validatePassword(e.target.value, 1)}
            />
    );

        const passwordInput = getFieldDecorator('password')(
            <Input
                autoComplete="new-password"
                type="password"
                onBlur={e => this.validatePassword(e.target.value, 2)}
                placeholder="6位数字"
            />
    );

        const repeatPasswordInput = getFieldDecorator('repeatPassword')(
            <Input
                autoComplete="new-password"
                type="password"
                onBlur={e => this.validatePassword(e.target.value, 3)}
            />
    );

        return (
            <div className="manage-password-modify">
                <Form>
                    <FormItem
                        label="旧管理密码"
                        {...formItemLayout}
                    >
                        {oldPasswordInput}
                    </FormItem>

                    <FormItem
                        label="新管理密码"
                        {...formItemLayout}
                    >
                        {passwordInput}
                    </FormItem>

                    <FormItem
                        label="确认新密码"
                        {...formItemLayout}
                    >
                        {repeatPasswordInput}
                    </FormItem>
                </Form>
            </div>
        );
    }
}

const mapPropsToFields = props => transformPropsFitForm(props.modifyForm);
const onFieldsChange = (props, fields) => props.updateModifyForm({ fields });

export default Form.create({
    mapPropsToFields,
    onFieldsChange,
})(ModifyPassword);
