import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';// eslint-disable-line
import { Link } from 'react-router';
import { Form, Input } from 'antd';
import { transformPropsFitForm } from '~comm/utils';

import './index.less';

const FormItem = Form.Item;
const formItemLayout = {// eslint-disable-line
    labelCol: {
        span: 5,
    },
    wrapperCol: {
        span: 17,
    },
};
class ConfirmPassword extends React.Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        // updateConfirmForm: PropTypes.func.isRequired,
        updateErrorText: PropTypes.func.isRequired,
        confirmPassword: PropTypes.func.isRequired,
        confirmForm: PropTypes.object.isRequired,
        // errorText: PropTypes.string.isRequired,
    }

  // eslint-disable-next-line consistent-return
    onPasswordUp = (e) => {
        const { confirmForm, updateErrorText, confirmPassword } = this.props;
        if (e.keyCode === 13) {
            if (!confirmForm.password) {
                updateErrorText('密码错误！');
                return false;
            }

            updateErrorText('');
            confirmPassword();
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const passwordInput = getFieldDecorator('password')(
            <Input
                placeholder="为了安全保障，请输入您管理平台的二次密码"
                autoComplete="new-password"
                ref={wrapper => setTimeout(() => {
                    wrapper.refs.input.focus();
                }, 500)}
                type="password"
                onKeyUp={this.onPasswordUp}
                autoFocus
            />
        );
        return (
            <div className="manage-password-confirm">
                {/*<div className="center-title text-center">您正在登录管理平台，请输入管理密码</div>*/}
                <Form className="confirm-password-form">
                    <FormItem label="">
                        {passwordInput}
                        <div style={{ textAlign: 'right' }}>
                            <Link to="/manage/password/modify" style={{ paddingRight: 20 }}>修改密码</Link>
                            <Link to="/manage/password/find">忘记密码</Link>
                        </div>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

const mapPropsToFields = props => transformPropsFitForm(props.confirmForm);
const onFieldsChange = (props, fields) => props.updateConfirmForm({ fields });

export default Form.create({
    mapPropsToFields,
    onFieldsChange,
})(ConfirmPassword);
