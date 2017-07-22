import React, { PropTypes } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import { transformPropsFitForm, isManagePasswordValid } from '~comm/utils';// eslint-disable-line

const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 18,
    },
};

class FindSecondaryPassword extends React.Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        updateFindForm: PropTypes.func.isRequired,// eslint-disable-line
        updateErrorText: PropTypes.func.isRequired,
        getCurrentPhone: PropTypes.func.isRequired,
        findForm: PropTypes.object.isRequired,// eslint-disable-line
        errorText: PropTypes.string.isRequired,// eslint-disable-line
        currentPhone: PropTypes.string.isRequired,
        isDisableGetCode: PropTypes.bool.isRequired,
        sendSms: PropTypes.func.isRequired,
        codeCountDown: PropTypes.number.isRequired,
    }

    componentDidMount() {
        this.props.getCurrentPhone();
    }

    onGetCode = () => {
        this.props.sendSms();
    }

    validateForm = (value, type) => {
        const { updateErrorText, isDisableGetCode } = this.props;
        switch (type) {
            case 'userName':
                if (!value) {
                    updateErrorText('用户名不能为空');
                } else {
                    updateErrorText('');
                }
                break;
            case 'corpName':
                if (!value) {
                    updateErrorText('公司全称不能为空');
                } else {
                    updateErrorText('');
                }
                break;
            case 'smsCode':
                if (!value) {
                    if (isDisableGetCode) {
                        updateErrorText('验证码不能为空');
                    }
                } else {
                    updateErrorText('');
                }
                break;
            case 'password':
                if (!value) {
                    updateErrorText('管理密码不能为空');
                } else {
                    updateErrorText('');
                }
                break;
            default:
                break;
        }
    }

    render() {
        const { isDisableGetCode, codeCountDown } = this.props;
        const { getFieldDecorator } = this.props.form;
        const userNameInput = getFieldDecorator('userName')(
            <Input autoComplete="new-password" onBlur={e => this.validateForm(e.target.value, 'userName')} placeholder="请输入帐号姓名" />
    );
        const corpNameInput = getFieldDecorator('corpName')(
            <Input autoComplete="new-password" onBlur={e => this.validateForm(e.target.value, 'corpName')} placeholder="请输入公司全称" />
    );
        const smsCodeInput = getFieldDecorator('smsCode')(
            <Input autoComplete="new-password" onBlur={e => this.validateForm(e.target.value, 'smsCode')} />
    );
        const passwordInput = getFieldDecorator('password')(
            <Input autoComplete="new-password" type="password" onBlur={e => this.validateForm(e.target.value, 'password')} placeholder="6位数字" />
    );
        const repeatPasswordInput = getFieldDecorator('repeatPassword')(
            <Input autoComplete="new-password" type="password" />
    );

        return (
            <div className="manage-password-find">

                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <span>您要找回管理密码的手机：</span>
                    <span style={{ fontWeight: 600 }}>{this.props.currentPhone}</span>
                </div>

                <Form>
                    <FormItem
                        label="用户名"
                        {...formItemLayout}
                    >
                        {userNameInput}
                    </FormItem>

                    <FormItem
                        label="公司名"
                        {...formItemLayout}
                    >
                        {corpNameInput}
                    </FormItem>

                    <FormItem
                        label="验证码"
                        {...formItemLayout}
                    >
                        <Row gutter={6}>
                            <Col span={17}>
                                {smsCodeInput}
                            </Col>
                            <Col span={4}>
                                {
                  isDisableGetCode ?
                      <Button
                          type="ghost"
                          className="disabled"
                          style={{ minWidth: 102 }}
                      >
                          {`${codeCountDown}秒`}
                      </Button> :
                      <Button type="ghost" onClick={this.onGetCode}>获取验证码</Button>
                }
                            </Col>
                        </Row>
                    </FormItem>

                    <FormItem
                        label="新密码"
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

const mapPropsToFields = props => transformPropsFitForm(props.findForm);
const onFieldsChange = (props, fields) => props.updateFindForm({ fields });

export default Form.create({
    mapPropsToFields,
    onFieldsChange,
})(FindSecondaryPassword);
