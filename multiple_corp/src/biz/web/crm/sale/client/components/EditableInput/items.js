import React, { Component, PropTypes } from 'react'
import { Form, Icon, Input, Button, Checkbox, Radio, Select, Modal } from 'antd'

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

import './index.less'

import FieldForm from '../FieldForm'
import SaleGuide from '../SaleGuide'
import {
    updateUIField,
    nameVaild,
    nameUnVaild,
} from '../../actions'

export default class Item extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editVisible: false,
            items: {},
            editData: {},
            groupStatus: '',
            radioValue: '',
            checkboxValue: '',
            tipVisible: false,
            delFieldData: {},
            delFieldIndex: ''
        }
    }

    static propTypes = {
        items: PropTypes.any.isRequired,
        postMovefield: PropTypes.func.isRequired,
        postDelfield: PropTypes.func.isRequired,
        uiUpdateField: PropTypes.func.isRequired,
        showSuccessMessage:PropTypes.any.isRequired,
    }

    componentDidMount() {
        const { items } = this.props
        this.setState({
            items: items
        })
    }

    componentWillReceiveProps(nextProps) {
        const { items, modalIsVisible,showSuccessMessage } = nextProps;

        if (showSuccessMessage && showSuccessMessage.success === true) {
            this.setState({
                editVisible: false
            });
        }
        else if (showSuccessMessage && showSuccessMessage.success === false) {
            this.setState({
                editVisible: false
            });
        }

        this.setState({
            items: items,
        })
    }

    swapItems = (arr, index_1, index_2) => {
        arr[index_1] = arr.splice(index_2, 1, arr[index_1])[0]
        return arr;
    }

    handleMoveUp = (index, items, group_id) => {
        const { postMovefield } = this.props

        if (index == 0) {
            return null;
        }

        let previousId = items.fields[index - 1].f_field_id
        let thisId = items.fields[index].f_field_id
        items.fields = this.swapItems(items.fields, index, index - 1)

        postMovefield(group_id, [thisId, previousId])

        return this.setState({ items: items })
    }

    handleMoveDown = (index, items, group_id) => {
        const { postMovefield } = this.props
        if (index == items.fields.length - 1) {
            return null;
        }

        let nextId = items.fields[index + 1].f_field_id
        let thisId = items.fields[index].f_field_id
        items.fields = this.swapItems(items.fields, index, index + 1)

        postMovefield(group_id, [thisId, nextId])

        return this.setState({ items: items })
    }

    handleDelete = (e, index, data) => {
        this.setState({
            tipVisible: true,
            delFieldData: data,
            delFieldIndex: index
        })

    }

    tipHandleOk = () => {
        const { postDelfield } = this.props
        this.setState({
            tipVisible: false
        })
        postDelfield(this.state.delFieldData.f_group_id, this.state.delFieldData.f_field_id)
        let arr = this.state.items.fields
        let items = arr.splice(this.state.delFieldIndex, 1) && arr;

        let _stateItem = this.state.items
        _stateItem.fields = items

        this.setState({ items: _stateItem })
    }

    tipHandleCancel = () => {
        this.setState({
            tipVisible: false
        })
    }


    handleEdit = (index, arr) => {
        const { postDelfield } = this.props
        arr[index].edit = true

        postDelfield(group_id, id)
        return this.setState({ items: { fields: arr } })
    }

    handleOk = () => {
        const { uiUpdateField } = this.props

        uiUpdateField({ isUpdate: true })

        // this.setState({
        //     editVisible: false,
        //     updateSaleField: true
        // });
    }

    handleCancel = (e) => {
        this.setState({
            editVisible: false,
        });
    }

    editModal = (e, d, status) => {
        let {uiUpdateField,changeType,postNameUnVaild}=this.props;
        changeType({type:d.f_field_type || 1});
        this.setState({
            editData: d,
            editVisible: true,
            groupStatus: status
        });

        uiUpdateField({ isUpdate: false });
        postNameUnVaild();
    }

    onRadioChange = (e) => {
        this.setState({
            radioValue: e.target.value
        })
    }

    onCheckboxChange = (e) => {
        this.setState({
            checkboxValue: e.target.value
        })
    }

    htmlTitle  = (title, status, isNotnull) => {
      if (status == 0) {
        return (<h3 className={isNotnull == 1 ? 'label-title ant-form-item-required' : 'label-title'}>{title}</h3>)
      }
      else {
        return (<h3 className={isNotnull == 1 ? 'label-title ant-form-item-required disabled-title' : 'label-title disabled-title'}>{title}</h3>)
      }

    }

    handleSelectChange = (e) => { }

    selectType = (type, title, params, isNotnull, status) => {
        let options = []
        if (params) {
            options = params.map((d, i) => {
                return { label: d.f_param_name, value: d.f_param_id }
            })
        }
        let DOM = {
            1: (<div>{this.htmlTitle(title, status, isNotnull)}<Input disabled={true} className="ant-input-wrapper" /></div>),
            6: (<div>{this.htmlTitle(title, status, isNotnull)}<span className="ant-radio-group"><Input disabled={true} className="ant-input-wrapper crm-sale-short-input" /></span></div>),
            7: (<div>{this.htmlTitle(title, status, isNotnull)}<Input disabled={true} className="ant-input-wrapper" /></div>),
            8: (<div>{this.htmlTitle(title, status, isNotnull)}
                <span className="ant-radio-group">
                <Select disabled={true}
                    onChange={this.handleSelectChange}
                >
                    {options.map((d, i) => {
                        return (<Option key={i} value={d.value}>{d.label}</Option>)
                    })}
                </Select>
                </span>
            </div>),
            9: (<div>{this.htmlTitle(title, status, isNotnull)}
                <RadioGroup disabled={true} value={title}
                    onChange={this.onRadioChange}
                    value={this.state.radioValue}>
                    {params && params.map((d, i) => {
                        return (<Radio key={i} value={d.f_param_id}>{d.f_param_name}</Radio>)
                    })}
                </RadioGroup></div>),
            10: (<div>{this.htmlTitle(title, status, isNotnull)}<CheckboxGroup disabled={true}  options={options} defaultValue={['']} />
            </div>),
            11: (<div>{this.htmlTitle(title, status, isNotnull)}
                <RadioGroup value={title}
                    disabled={true}
                    onChange={this.onRadioChange}
                    value={this.state.radioValue}>
                    {params && params.map((d, i) => {
                        return (<Radio key={i} value={d.f_param_id}>{d.f_param_name}</Radio>)
                    })}
                </RadioGroup></div>)
        }
        return (DOM[type])
    }

    baseInfo = (sysId, data, isNotnull,status) => {
        let options = []
        if (data.params) {
            options = data.params.map((d, i) => {
                return { label: d.f_param_name, value: d.f_param_id }
            })
        }
        let DOM = {
            1: (<div>{this.htmlTitle(data.f_field_name, status, isNotnull)}<Input disabled={true} className="ant-input-wrapper" /></div>),
            2: (<div>{this.htmlTitle(data.f_field_name, status, isNotnull)}<span className="ant-input-wrapper customer-name">具体客户名称</span></div>),
            3: (<div>{this.htmlTitle(data.f_field_name, status, isNotnull)}
                <span className="ant-radio-group">
                <Select disabled={true}
                    onChange={this.handleSelectChange}
                >
                    {options.map((d, i) => {
                        return (<Option key={i} value={d.value}>{d.label}</Option>)
                    })}
                </Select>
                </span>
            </div>),
            4: (<div>{this.htmlTitle(data.f_field_name, status, isNotnull)}<Input disabled={true} className="ant-input-wrapper" /></div>),
            5: (<div>{this.htmlTitle(data.f_field_name, status, isNotnull)}<Input disabled={true} className="ant-input-wrapper" /></div>),
            6: (<div>{this.htmlTitle(data.f_field_name, status, isNotnull)}<Input disabled={true} type="textarea" rows={4} className="ant-input-wrapper" /></div>),
            11: (<div>{this.htmlTitle(data.f_field_name, status, isNotnull)}
                <RadioGroup value={data.f_field_name}
                    disabled={true}
                    onChange={this.onRadioChange}
                    value={this.state.radioValue}>
                    {options && options.map((d, i) => {
                        return (<Radio key={i} value={d.f_param_id}>{d.f_param_name}</Radio>)
                    })}
                </RadioGroup></div>)
        }

        let html = DOM[sysId]

        return html
    }

    baseInfoNondeletable = (sysId) => {
        let nondeletable = {
            1: true,
            2: true,
            3: true,
            4: true
        }
        return nondeletable[sysId] || false
    }

    baseInfoNoneditable = (sysId) => {
        let noneditable = {
            1: true
        }
        return noneditable[sysId] || false
    }

    baseInfoNonsortable = (sysId, index, up) => {
        let nonsortable = {
            1: true
        }
        let isSecond = index == 1 && up && sysId == 1 ? true : false;
        return nonsortable[sysId] || isSecond || false
    }

    isBaseInfo = (items) => {
        return items && items.f_group_name && (items.f_group_name).replace(/(^\s+)|(\s+$)/g, "") == '基础信息'
    }

    render() {
        let {isNameValid,isShowGuide,onGuideOk}=this.props;
        return (
            <div>
                {this.state.editVisible && (<Modal
                    title="编辑字段"
                    visible={this.state.editVisible}
                    width={450}
                    wrapClassName="vertical-center-modal"
                    maskClosable={false}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
                        <Button key="submit" type="primary"  onClick={this.handleOk}>
                        确定
                        </Button>,
                    ]}
                >
                    <FieldForm
                        editData={this.state.editData}
                        groupStatus={this.state.groupStatus}
                    />
                </Modal>)}

                {this.state.tipVisible && (<Modal
                    title="删除字段"
                    visible={this.state.tipVisible}
                    wrapClassName="vertical-center-modal"
                    width={450}
                    maskClosable={false}
                    onOk={this.tipHandleOk}
                    onCancel={this.tipHandleCancel}
                >
                    <div>
                        删除后，销售金额对应的字段数据将同时被清除，确定删除吗？
          </div>
                </Modal>)}

                {this.state.items && this.state.items.fields && this.state.items.fields.map((dd, ii) => {
                    return (
                        <div key={ii} className={this.state.items.f_group_status == 1 ? "editabel-wrapper disabled-editable" : "editabel-wrapper"} style={dd.f_field_type==11?({position:'relative'}):{}}>
                            <div className={dd.f_field_type==11&&isShowGuide?"input-wrapper guide-status":"input-wrapper"}>
                                {!this.isBaseInfo(this.state.items) ?
                                    this.selectType(dd.f_field_type, dd.f_field_name, dd.params, dd.f_is_notnull, dd.f_field_status) :
                                    (this.baseInfo(dd.f_sys_id, dd, dd.f_is_notnull, dd.f_field_status) || this.selectType(dd.f_field_type, dd.f_field_name, dd.params, dd.f_is_notnull, dd.f_field_status))}
                            </div>
                            {
                                dd.f_field_type==11&&isShowGuide?<SaleGuide onOk={onGuideOk} position={{top: '-95px',left: '451px'}}/>:null
                            }
                            <ul className="editabel-btn-wrapper">
                                {(this.isBaseInfo(this.state.items) ? (ii != 1 && ii != 0) : !this.baseInfoNonsortable(dd.f_sys_id, ii, true) && ii != 0) && (<li title="向上移动" onClick={(e) => { this.handleMoveUp(ii, this.state.items, dd.f_group_id) }}>
                                    <Icon type="arrow-up" />
                                </li>)}
                                {!this.baseInfoNonsortable(dd.f_sys_id, ii) && ii != this.state.items.fields.length - 1 && (<li
                                    title="向下移动"
                                   onClick={(e) => { this.handleMoveDown(ii, this.state.items, dd.f_group_id) }}>
                                    <Icon type="arrow-down" />
                                </li>)}
                                {dd.f_can_edit == 1 && !this.baseInfoNoneditable(dd.f_sys_id) &&
                                    (<li title="编辑" onClick={(e) => { this.editModal(e, dd, this.state.items.f_group_status) }}>
                                        <Icon type="edit" />
                                    </li>)
                                }
                                {dd.f_can_edit == 1 && !this.baseInfoNondeletable(dd.f_sys_id) &&
                                    (<li title="删除" onClick={(e) => { this.handleDelete(e, ii, dd) }}>
                                        <Icon type="delete" />
                                    </li>)}
                            </ul>
                        </div>)
                })}
            </div>)
    }
}
