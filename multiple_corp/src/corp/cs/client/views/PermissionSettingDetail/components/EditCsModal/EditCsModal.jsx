/* eslint-disable */
import React, { PropTypes } from 'react';
import { Form, Select, Checkbox, Radio } from 'antd';
import CorpInput from 'components/CorpInput';
import { transformPropsFitForm } from '~comm/utils';

const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 18 },
};

const Option = Select.Option;
const RadioGroup = Radio.Group;

class EditCsModal extends React.Component {
    static propTypes = {
        csGroups: PropTypes.array.isRequired,
        form: PropTypes.object.isRequired,
        csInfo: PropTypes.object.isRequired,
        isEdit: PropTypes.bool.isRequired,
        formErrorMsg: PropTypes.string.isRequired,
        updateFormErrorMsg: PropTypes.func.isRequired,
        validateName: PropTypes.func.isRequired,
        validatePosition: PropTypes.func.isRequired,
        validateTel: PropTypes.func.isRequired,
        validatePhone: PropTypes.func.isRequired,
        validateEmail: PropTypes.func.isRequired,
        onSelectEmployee: PropTypes.func.isRequired,
        validateQQNumber: PropTypes.func.isRequired,
    }

    state = {
        disableEditInfo: false,
    }

    componentWillMount() {
        const { isManager, isCs } = this.props.csInfo;
        this.setState({
            disableEditInfo: !!(isManager === 1 && isCs === 0),
        });
    }

    componentDidMount() {
        if (!this.props.isEdit) {
            this.initZtree();
        }
    }

    componentWillReceiveProps(nextProps) {
        const { isManager: nextIsManager, isCs: nextIsCs } = nextProps.csInfo;
        if (nextIsManager !== this.props.csInfo.isManager || nextIsCs !== this.props.csInfo.isCs) {
            this.setState({
                disableEditInfo: !!(nextIsManager === 1 && nextIsCs === 0),
            });
        }
    }

    componentDidUpdate() {
        const { isEdit } = this.props;
        if (!isEdit) {
            this.initZtree();
        }
    }

    onUpdateErrorMsg = (result) => {
        const { updateFormErrorMsg } = this.props;
        if (!result.ok) {
            updateFormErrorMsg(result.msg);
        } else {
            updateFormErrorMsg('');
        }
    }

    onNameBlur = (name) => {
        const { validateName } = this.props;
        const result = validateName(name);
        this.onUpdateErrorMsg(result);
    }

    onQQNumberBlur = (qqNumber) => {
        const { validateQQNumber } = this.props;
        const result = validateQQNumber(qqNumber);
        this.onUpdateErrorMsg(result);
    }

    onPositionBlur = (position) => {
        const { validatePosition } = this.props;
        const result = validatePosition(position);
        this.onUpdateErrorMsg(result);
    }

    onTelBlur = (tel) => {
        const { validateTel } = this.props;
        const result = validateTel(tel);
        this.onUpdateErrorMsg(result);
    }

    onPhoneBlur = (mobile) => {
        const { validatePhone } = this.props;
        const result = validatePhone(mobile);
        this.onUpdateErrorMsg(result);
    }

    onEmailBlur = (email) => {
        const { validateEmail } = this.props;
        const result = validateEmail(email);
        this.onUpdateErrorMsg(result);
    }

    onGetUser = (userId, name, type) => {
        if (type === 1) {
            return false;
        }

        this.props.onSelectEmployee(userId).then(({ errorMsg }) => {
            if (!errorMsg) {
                jq('#L_EcCropTree').hide();
            }
        });
    }

    initZtree() {
        jq(this.employeeTree).ztree({
            url: '//api.workec.com/usercenter/usergroup/corpstruct?with_staff=1',
            searchUrl: '//api.workec.com/usercenter/usergroup/employee',
            multi: true,
            callback: this.onGetUser,
        });
    }

    render() {
        const {
            csInfo,
            isEdit,
            formErrorMsg,
        } = this.props;
        const { getFieldDecorator } = this.props.form;
        const groupOptions = this.props.csGroups.map((group, i) => (
            <Option key={i} value={`${group.f_id}`}>{group.f_group_name}</Option>
        ));

        // console.log(csInfo, 'csInfo')

        // const employeeInput = getFieldDecorator('employee')(
        //     <Input ref={(wrapper) => { this.employeeTree = wrapper && wrapper.refs.input; } } />
        // );
        // console.log(csInfo);

        const nameInput = getFieldDecorator('name', {
            initialValue: csInfo.name,
        })(
            <CorpInput
                disabled={!csInfo.csId || this.state.disableEditInfo}
                onBlur={(e) => this.onNameBlur(e.target.value)}
            />
            );

        const positionInput = getFieldDecorator('contact', {
            initialValue: csInfo.contact,
        })(
            <CorpInput
                disabled={!csInfo.csId || this.state.disableEditInfo}
                onBlur={(e) => this.onPositionBlur(e.target.value)}
            />
            );

        const telInput = getFieldDecorator('tel', {
            initialValue: csInfo.tel,
        })(
            <CorpInput
                disabled={!csInfo.csId || this.state.disableEditInfo}
                onBlur={(e) => this.onTelBlur(e.target.value)}
            />
            );

        const phoneInput = getFieldDecorator('mobile', {
            initialValue: csInfo.mobile,
        })(
            <CorpInput
                disabled={!csInfo.csId || this.state.disableEditInfo}
                onBlur={(e) => this.onPhoneBlur(e.target.value)}
            />
            );

        const emailInput = getFieldDecorator('email', {
            initialValue: csInfo.email,
        })(
            <CorpInput
                disabled={!csInfo.csId || this.state.disableEditInfo}
                onBlur={(e) => this.onEmailBlur(e.target.value)}
            />
            );

        const managerCheck = getFieldDecorator('isManager', {
            initialValue: csInfo.isManager,
        })(
            <Checkbox
                className="role-check"
                checked={csInfo.isManager === 1}
            >
                客服经理
            </Checkbox>
            );

        const csCheck = getFieldDecorator('isCs', {
            initialValue: csInfo.isCs,
        })(
            <Checkbox
                className="role-check"
                checked={csInfo.isCs === 1}
            >
                客服
            </Checkbox>
            );

        const groupChoose = getFieldDecorator('groupId', {
            initialValue: `${csInfo.groupId}`,
        })(
            <Select
                disabled={this.state.disableEditInfo}
                style={{ width: 130 }}
            >
                {groupOptions}
            </Select>
            );


        // 在线客服2期---配置QQ客服
        const qqInput = getFieldDecorator('qqNumber', {
            initialValue: csInfo.qqNumber,
        })(
            <CorpInput
                placeholder=""
                disabled={!csInfo.showQQ || !(csInfo.isCs === 1)}
                onBlur={(e) => this.onQQNumberBlur(e.target.value)}
                maxLength="12"
                style={{ width: 180 }}
            />
        );

        const qqStatus = getFieldDecorator('showQQ', {
            initialValue: csInfo.showQQ,
        })(
            <RadioGroup>
                <Radio value={1} disabled={!(csInfo.isCs === 1)} >开启</Radio>
                <Radio value={0} disabled={!(csInfo.isCs === 1)} >关闭</Radio>
            </RadioGroup>
        );

        const qqFirst = getFieldDecorator('isQQFirst', {
            initialValue: csInfo.isQQFirst,
        })(
            <Checkbox
                className="role-check"
                checked={csInfo.isQQFirst === 1}
                disabled={!csInfo.showQQ || !(csInfo.isCs === 1)}
            >
                优先使用QQ接待
            </Checkbox>
        );

        // console.log(this.props, 'props')

        return (
            <Form>
                <FormItem
                    {...formItemLayout}
                    label={
                        isEdit ? '所选员工' : '现有员工'
                    }
                >
                    {
                        isEdit
                            ?
                            <span>
                                {csInfo.employeeName}
                            </span>
                            :
                            <div
                                className="add-operate"
                                ref={(node) => { this.employeeTree = node; }}
                                style={{
                                    position: 'relative',
                                    top: 4,
                                    width: 92,
                                }}
                            >
                                <span className="setting-icon add-icon"></span>
                                <span>配置客服</span>
                            </div>
                    }

                    {/* {employeeInput} */}
                </FormItem>

                <FormItem className="paralleling first-l"
                    {...formItemLayout}
                    label={(
                        <span style={{ fontWeight: 'bold', color: '#666' }}>
                            <span className="must-dot">*</span>
                            姓名
                        </span>
                    )}
                >
                    {nameInput}
                </FormItem>

                <FormItem className="paralleling"
                    {...formItemLayout}
                    label="职位"
                >
                    {positionInput}
                </FormItem>

                <FormItem className="paralleling first-l"
                    {...formItemLayout}
                    label="电话"
                >
                    {telInput}
                </FormItem>

                <FormItem className="paralleling"
                    {...formItemLayout}
                    label="手机"
                >
                    {phoneInput}
                </FormItem>

                <FormItem className="paralleling first-l"
                    {...formItemLayout}
                    label="邮箱"
                >
                    {emailInput}
                </FormItem>

                <FormItem>
                    <div className="select-role">
                        <div className="ant-col-4 ant-form-item-label">
                            <label className="">
                                <span className="must-dot">*</span>
                                选择角色
                            </label>
                        </div>
                        <div className="role-list">
                            <div className="list-item item-first">
                                {managerCheck}
                                <span className="greyed-text">具有全部查询权限和编辑权限</span>
                            </div>
                            <div className="list-item">
                                {csCheck}
                                <span className="greyed-text">仅有会话和查询历史记录以及快捷回复权限</span>
                            </div>

                        </div>
                    </div>
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="选择分组"
                >
                    {groupChoose}
                </FormItem>

                <FormItem>
                    <div className="select-role">
                        <div className="ant-col-4 ant-form-item-label">
                            <label className="">
                                QQ客服
                            </label>
                        </div>
                        <div className="ant-col-18 role-list" >
                            <div
                                className="list-item  item-first"
                                style={{ paddingLeft: 5 }}
                            >
                                {qqStatus}
                            </div>
                            <div className="list-item" >
                                <FormItem
                                    {...formItemLayout}
                                    label={csInfo.showQQ === 0 ? "QQ号码" : (
                                        <span>
                                            <span className="must-dot">*</span>
                                            <span  style={{ fontWeight: 'bold', color: '#666' }}>QQ号码</span>
                                        </span>
                                    )}
                                >
                                    {qqInput}
                                    <span
                                        className="greyed-text"
                                        style={{ display: 'block', marginTop: 5, marginBottom: 5 }}
                                    >
                                        请输入该客服授权的QQ号码来获得临时会话记录
                                    </span>
                                </FormItem>
                            </div>

                            <div
                                className="list-item"
                                style={{ clear: 'both', paddingLeft: 5, paddingTop: 5 }}
                            >
                                {qqFirst}
                            </div>
                        </div>
                    </div>
                </FormItem>

                {/* @todo QQ 客服选项 */}

                <p className="form-error-msg">{formErrorMsg}</p>
            </Form>
        );
    }
}

const mapPropsToFields = (props) => transformPropsFitForm(props.csInfo);
const onFieldsChange = (props, fields) => props.updateCsInfoFields({ fields });

export default Form.create({ mapPropsToFields, onFieldsChange })(EditCsModal);
