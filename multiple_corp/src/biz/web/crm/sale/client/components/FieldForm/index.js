import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { Form, Select, Radio, Input } from 'antd'
const RadioGroup = Radio.Group
const FormItem = Form.Item
const Option = Select.Option

import EditableInputList from '../EditableInputList'

import {
    fetchHandlefield,
    repeatingField,
    fetchAddgroup,
    fetchEditgroup,
    nameVaild,
    nameUnVaild
} from '../../actions'


import { updatedField } from '../../reducers'

import './index.less'

const mapStateToProps = (state) => {
    return {
        salemoneyIndexData: state.salemoneyIndex,
        modalIsVisible: state.modalIsVisible,
        fieldType: state.fieldType,
        updatedField: state.updatedField,
        isRepeatingField: state.isRepeatingField,
        isNameValid: state.isNameValid.isNameValid,
        groupList: state.salemoneyIndex.data.map(
            (d, i) => {
                return {
                    f_group_id: d.f_group_id,
                    f_group_name: d.f_group_name,
                    f_group_status: d.f_group_status
                }
            }
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        postHandlefield: (data) => {
            dispatch(fetchHandlefield(data))
        },
        repeatingField: (data) => {
            dispatch(repeatingField(data))
        },
        postAddGroup: (data) => {
            dispatch(fetchAddgroup(data))
        },
        postEditGroup: (data) => {
            dispatch(fetchEditgroup(data))
        },
        postNameVaild: (data) => {
            dispatch(nameVaild())
        },
        postNameUnVaild: (data) => {
            dispatch(nameUnVaild())
        },
    }
}

class FieldForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            requireValue: 1,
            disbaleValue: 1,
            groupList: props.groupList,
            formDataGroupId: (props.editData && props.editData.f_group_id) || '',
            formDataFieldName: (props.editData && props.editData.f_field_name) || (props.editData && props.editData.f_group_name) || '',
            formDataIsNotnull: (props.editData && props.editData.f_is_notnull) || 0,
            formDataFieldStatus: (props.editData && props.editData.f_field_status) || (props.editData && props.editData.f_group_status) || 0,
            params: [],
            groupStatus: props.groupStatus || '',
            checkFieldNameError: ''
        }
    }


    static propTypes = {
        updatedField: PropTypes.bool.isRequired
    }

    setDefaultData = (editData) => {
        this.setState({
            formDataGroupId: (editData && editData.f_group_id) || (this.state.groupList[0].f_group_id),
            formDataFieldName: (editData && editData.f_field_name) || (editData && editData.f_group_name) || '',
            formDataIsNotnull: (editData && editData.f_is_notnull) || 0,
            formDataFieldStatus: (editData && editData.f_field_status) || (editData && editData.f_group_status) || 0,
            params: editData && editData.params
        })
    }

    setType = (type, data) => {
        let _types = {
            1: '文本', 6: '时间', 7: '货币', 8: '下拉', 9: '单选', 10: '复选', 11: '状态'
        }
        if (data && data.groupType == 'group') {
            return '分组';
        }
        else {
            return _types[type] == '状态' ? '下拉' : _types[type];
        }
    }

    instructionType = (data) => {
        let type = '';
        if (data && data.f_field_type) {
            type = data.f_field_type
        }
        else if ((data && data.groupType) || (data && data.groupType == 'group')) {
            type = 1000
        }
        else {
            return false;
        }

        let _types = {
            1: (<li>1、文本内容最多可以输入100个字。</li>),
            6: (<li> 1、支持年月日，可选时间选项。</li>),
            7: (<span><li>1、支持国际主流货币类型，如没有支持的类型可选择“其他”;</li> <li>2、自动带千位符号，如需要小数点,可自行输入。</li></span>),
            8: (<li>1、最多可以设定40个选项。</li>),
            9: (<li>1、最多可以设定10个选项。</li>),
            10: (<li>1、最多可以设定10个选项。</li>),
            11: (<li>1、最多可以设定7个选项。</li>),
            1000: (<li>1、该字段功能为创建一个字段分组。</li>)
        }
        return _types[type]
    }

    componentDidMount() {
        const { editData, postNameUnVaild, postNameVaild } = this.props
        //如果是编辑状态
        // if (editData) {
        //     postNameVaild();
        // }
        // else {
        //     postNameUnVaild();
        // }
        this.setDefaultData(editData);
    }

    setAjaxData = (editData, fieldType) => {
        let data = {}
        if (editData && editData.f_field_id) {
            data = {
                field_id: editData.f_field_id,
                group_id: parseInt(this.state.formDataGroupId),
                field_name: this.state.formDataFieldName,
                is_notnull: parseInt(this.state.formDataIsNotnull),
                field_status: parseInt(this.state.formDataFieldStatus),
                field_type: parseInt(editData.f_field_type),
                params: this.state.params
            }
        }
        else {
            data = {
                group_id: parseInt(this.state.formDataGroupId),
                field_name: this.state.formDataFieldName,
                is_notnull: parseInt(this.state.formDataIsNotnull),
                field_status: parseInt(this.state.formDataFieldStatus),
                field_type: parseInt(fieldType.type),
                params: this.state.params
            }
        }
        return data;
    }



    checkGroupName(value,isEdit) {
        const { salemoneyIndexData, postNameUnVaild, postNameVaild,editData } = this.props
        let groupName = value;
        groupName = groupName.replace(/^\s+|\s+$/g, "")
        let groupNameList = salemoneyIndexData.data.map((d, i) => {
            return d.f_group_name
        })

        if (groupName.length <= 0) {
            this.setState({
                checkFieldNameError: '名字不能为空！'
            });
            return false;
        }
        else if (groupName.length > 10) {
            this.setState({
                checkFieldNameError: '字数不能超过10个！'
            });
            return false;
        }
        else {
            if (groupNameList && groupNameList.length > 0) {
                if(isEdit){
                    //如果输入的名字和当前分组的名字一样，直接通过
                    if(editData.f_group_name===groupName){
                        this.setState({
                            checkFieldNameError: ''
                        });
                        return true;
                    }
                    //如果不一样，再到分组命数组中检查是否存在
                    else{
                        let lock = groupNameList.indexOf(groupName);

                        if (lock === -1) {
                            this.setState({
                                checkFieldNameError: ''
                            });
                            return true;
                        }
                        else {
                            this.setState({
                                checkFieldNameError: '该字段名已被使用'
                            })
                            return false;
                        }
                    }

                }
                else{
                    let lock = groupNameList.indexOf(groupName);
                    if (lock === -1) {
                        this.setState({
                            checkFieldNameError: ''
                        });
                        return true;
                    }
                    else {
                        this.setState({
                            checkFieldNameError: '该字段名已被使用'
                        })
                        return false;
                    }
                }


            }

        }
    }

    checkFieldName(value,isEdit) {
        const { salemoneyIndexData, postNameUnVaild, postNameVaild, fieldType,editData } = this.props;
        let fieldName = value;
        fieldName = fieldName.replace(/^\s+|\s+$/g, "")
        let fieldNameList = [];
        salemoneyIndexData.data.forEach((item_1, index_1) => {
            if (item_1.fields && item_1.fields.length > 0) {
                item_1.fields.forEach((item_2, index_2) => {
                    fieldNameList.push(item_2.f_field_name);
                });
            }
        });
        if (fieldName.length <= 0) {

            this.setState({
                checkFieldNameError: '名字不能为空！'
            });
            // postNameUnVaild();
            return false;
        }
        else if (fieldName.length > 10) {
            this.setState({
                checkFieldNameError: '字数不能超过10个！'
            });
            // postNameUnVaild();
            return false;
        }
        else {
            if (fieldNameList && fieldNameList.length > 0) {
                if(isEdit){
                    if(editData.f_field_name===fieldName){
                        if (['8', '9', '10','11'].indexOf(fieldType.type.toString()) > -1) {
                            if (this.state.params && this.state.params.length > 0) {
                                this.setState({
                                    checkFieldNameError: ''
                                });
                                return true;
                            }
                            else {
                                this.setState({
                                    checkFieldNameError: '',
                                    editInputValidateStatus:"error",
                                    editInputValidateTip:"选项个数不能为0"
                                });
                                return false;
                            }
                        }
                        else {
                            this.setState({
                                checkFieldNameError: ''
                            });
                            return true;
                        }
                    }
                    else{
                        let lock = fieldNameList.indexOf(fieldName)
                        if (lock === -1) {
                            if (['8', '9', '10','11'].indexOf(fieldType.type.toString()) > -1) {
                                if (this.state.params && this.state.params.length > 0) {
                                    this.setState({
                                        checkFieldNameError: ''
                                    });
                                    return true;
                                }
                                else {
                                    this.setState({
                                        checkFieldNameError: '',
                                        editInputValidateStatus:"error",
                                        editInputValidateTip:"选项个数不能为0"
                                    });
                                    return false;
                                }
                            }
                            else {
                                this.setState({
                                    checkFieldNameError: ''
                                });
                                return true;
                            }

                        }
                        else {
                            this.setState({
                                checkFieldNameError: '该字段名已被使用'
                            })
                            return false;
                        }
                    }


                }
                else{
                    let lock = fieldNameList.indexOf(fieldName)
                        if (lock === -1) {
                            if (['8', '9', '10','11'].indexOf(fieldType.type.toString()) > -1) {
                                if (this.state.params && this.state.params.length > 0) {
                                    this.setState({
                                        checkFieldNameError: ''
                                    });
                                    return true;
                                }
                                else {
                                    this.setState({
                                        checkFieldNameError: '',
                                        editInputValidateStatus:"error",
                                        editInputValidateTip:"选项个数不能为0"
                                    });
                                    return false;
                                }
                            }
                            else {
                                this.setState({
                                    checkFieldNameError: ''
                                });
                                return true;
                            }

                        }
                        else {
                            this.setState({
                                checkFieldNameError: '该字段名已被使用'
                            })
                            return false;
                        }
                }

            }
        }
    }

    componentWillReceiveProps(nextProps) {
        const { updatedField,
            postHandlefield,
            postAddGroup,
            postEditGroup,
            editData,
            fieldType,
            isRepeatingField,
            modalIsVisible,
            groupData,
            isNameValid,
            postNameUnVaild,
            postNameVaild
    } = nextProps;

        if (updatedField.isUpdate === true) {
            if (isNameValid) {
                //编辑分组
                if (editData && editData.groupType == 'group') {
                    let data = {
                        id: editData.f_group_id,
                        name: this.state.formDataFieldName,
                        status: parseInt(this.state.formDataFieldStatus)
                    }
                    postEditGroup(data);
                }
                //新增分组
                else if (fieldType && fieldType.type == 'group') {
                    let data = {
                        name: this.state.formDataFieldName,
                        status: parseInt(this.state.formDataFieldStatus)
                    }
                    postAddGroup(data);
                }
                //新增字段
                else {
                    postHandlefield(this.setAjaxData(editData, fieldType));
                }
            }
            //如果检查没有通过检测一下
            else {
                //编辑分组
                if (editData && editData.groupType == 'group') {
                    if (this.checkGroupName(this.state.formDataFieldName,true)) {
                        postNameVaild();
                    }
                }
                //新增分组
                else if (fieldType && fieldType.type == 'group') {
                    if (this.checkGroupName(this.state.formDataFieldName,false)) {
                        postNameVaild();
                    }
                }
                //编辑字段
                else if (editData && editData.groupType !== 'group') {
                    if (this.checkFieldName(this.state.formDataFieldName,true)) {
                        postNameVaild();
                    }
                }
                //新增字段
                else {
                    if (this.checkFieldName(this.state.formDataFieldName,false)) {
                        postNameVaild();
                    };
                }
            }
        }
    }

    onRequiredChange = (e) => {
        this.setState({
            requireValue: e.target.value
        })
    }

    onDisableChange = (e) => {
        this.setState({
            disbaleValue: e.target.value
        })
    }


    handleFieldName = (e) => {
        const { repeatingField, fieldType, groupData, salemoneyIndexData } = this.props;

        let value = e.target.value;

        this.setState({
            formDataFieldName: value,
            checkFieldNameError: ''
        })
    }

    handleGroup = (data) => {
        this.setState({
            formDataGroupId: data
        })
    }

    handleNotNull = (e) => {
        this.setState({
            formDataIsNotnull: e.target.value
        })
    }

    handleStatus = (e) => {
        this.setState({
            formDataFieldStatus: e.target.value
        })
    }

    isParamsType = (field_type) => {
        if ((field_type == 11) || (field_type == 8) || (field_type == 9) || (field_type == 10) || !field_type) {
            return field_type;
        }
        else {
            return false;
        }
    }


    updateParams = (data) => {
        this.setState({
            params: data,
            editInputValidateStatus:"",
            editInputValidateTip:""
        });
    }

    checkField(rule, value, callback) {
        if (value && value.length > 10) {
            callback('10个字以内');
        }
        else {
            callback();
        }
    }

    render() {
        const { editData, groupList, fieldType, groupStatus, postNameUnVaild, postNameVaild } = this.props;
        const { getFieldDecorator, getFieldError } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 10 },
        };

        return (
            <div className="field-wrapper">
                {editData && (<div className="crm-type-global-title">
                    <h3>详细设置</h3>
                </div>)}
                {editData && (<div className="crm-type-title">
                    <span className="ant-col-4 ant-form-item-label"><h4 className="">类型</h4></span>
                    <span className="crm-type-value">{this.setType(editData.f_field_type, editData)}</span>
                </div>)}
                <FormItem
                    label="字段名"
                    {...formItemLayout}
                    validateStatus={(this.state.checkFieldNameError ? 'error' : '')}
                    help={this.state.checkFieldNameError ? this.state.checkFieldNameError : ''}
                >
                    <Input placeholder="10个字以内"
                        className="field-name"
                        onChange={(e) => { this.handleFieldName(e) }}
                        name="fieldName"
                        maxLength="10"
                        value={this.state.formDataFieldName || ''}
                        disabled={((editData && editData.f_sys_id == 3)) ? true : false}
                    />
                </FormItem>

                {(fieldType && fieldType.type == 'group') || (editData && editData.groupType == 'group') ?
                    (<FormItem
                        label="状态"
                        {...formItemLayout}
                    >
                        <RadioGroup
                            onChange={(e) => { this.handleStatus(e) }}
                            defaultValue={(this.state.formDataFieldStatus) || 0}
                            disabled={(groupStatus == 1 || (editData && editData.f_sys_id == 3)) ? true : false}
                        >
                            <Radio value={0}>启用</Radio>
                            <Radio value={1}>禁用</Radio>
                        </RadioGroup>
                    </FormItem>) :
                    (<div><FormItem
                        label="分组"
                        {...formItemLayout}
                    >
                        <Select
                            className="field-group"
                            size="large"
                            defaultValue={(this.state.formDataGroupId + '') || (this.state.groupList[0].f_group_name) || "--空--"}
                            placeholder="请选择一个分组"
                            optionFilterProp="children"
                            name="fieldGroup"
                            ref="fieldGroup"
                            onChange={(e) => { this.handleGroup(e) }}
                            disabled={((editData && editData.f_sys_id == 3)) ? true : false}
                        >
                            {this.state.groupList.map((dd, ii) => {
                                return (<Option key={ii} value={dd.f_group_id + ''}>{dd.f_group_name}</Option>)
                            })}
                        </Select>
                    </FormItem>

                        <FormItem
                            label="是否必填"
                            {...formItemLayout}
                        >
                            <RadioGroup
                                onChange={(e) => { this.handleNotNull(e) }}
                                defaultValue={(this.state.formDataIsNotnull) || 0}
                                disabled={((editData && editData.f_sys_id == 3)) ? true : false}
                            >
                                <Radio value={1}>必填</Radio>
                                <Radio value={0}>非必填</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem
                            label="状态"
                            {...formItemLayout}
                        >
                            <RadioGroup
                                onChange={(e) => { this.handleStatus(e) }}
                                defaultValue={(this.state.formDataFieldStatus) || 0}
                                disabled={(groupStatus == 1 || (editData && editData.f_sys_id == 3)) ? true : false}
                            >
                                <Radio value={0}>启用</Radio>
                                <Radio value={1}>禁用</Radio>
                            </RadioGroup>
                        </FormItem>
                        {(this.isParamsType(editData && editData.f_field_type) || ((fieldType && fieldType.type != 'group') && this.isParamsType(fieldType.type))) &&
                            (
                                <EditableInputList
                                    fieldType={fieldType ? fieldType.type : ''}
                                    list={this.state.params || []}
                                    updateParams={this.updateParams}
                                    validateStatus={this.state.editInputValidateStatus}
                                    validateTip={this.state.editInputValidateTip}
                                />

                            )}</div>)}

                {this.instructionType(editData) && (<div className="instruction-wrapper">
                    <h4>帮助说明：</h4>
                    <ul>
                        {this.instructionType(editData)}
                    </ul>
                </div>)}

            </div>
        )
    }
}

FieldForm.propTypes = {
    postHandlefield: PropTypes.func.isRequired,
    updatedField: PropTypes.any,
    groupList: PropTypes.array.isRequired,
    repeatingField: PropTypes.func.isRequired,
    postNameVaild: PropTypes.func.isRequired,
    postNameUnVaild: PropTypes.func.isRequired,
    postAddGroup: PropTypes.func.isRequired,
    postEditGroup: PropTypes.func.isRequired
}

FieldForm = Form.create()(FieldForm)

export default connect(mapStateToProps, mapDispatchToProps)(FieldForm);
