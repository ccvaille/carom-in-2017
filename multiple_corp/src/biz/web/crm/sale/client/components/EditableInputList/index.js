import React, { Component, PropTypes } from 'react'
import './index.less'

import {  Modal, Form, Icon, Input, Button, Radio, Select } from 'antd';
const confirm = Modal.confirm;
const FormItem = Form.Item;


export default class EditableInputList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formDataParams: '',
            list: [],
            fieldType: props.fieldType || '',
            validateStatus: '',
            validateTip: '',
            EditValidateStatus: '',
            EditValidateTip: '',
            groupStatus: '',
            tipVisible:false,
            warnVisible:false
        }
    }

    static propTypes = {
        list: PropTypes.array.isRequired,
        fieldType: PropTypes.any.isRequired,
        groupStatus: PropTypes.any
    }

    componentDidMount() {
        // const {list, fieldType, groupStatus} = this.props
        // this.setState({
        //   list: list,
        //   fieldType: fieldType,
        //   groupStatus: groupStatus||0
        // })
    }


    componentWillReceiveProps(nextProps) {
        const { validateStatus, validateTip } = nextProps;
        this.setState({
            validateStatus: validateStatus,
            validateTip: validateTip
        });
        // this.setState({
        //   list: list
        // })
    }


    swapItems = (arr, index_1, index_2) => {
        arr[index_1] = arr.splice(index_2, 1, arr[index_1])[0]
        return arr;
    }

    handleMoveUp = (index, arr) => {
        const { updateParams } = this.props;
        if (index == 0) {
            return null;
        }
        let list = this.swapItems(arr, index, index - 1)
        updateParams(list);
    }

    handleMoveDown = (index, arr) => {
        const { updateParams } = this.props;
        if (index == arr.length - 1) {
            return null;
        }
        let list = this.swapItems(arr, index, index + 1)
        updateParams(list)
    }

    handleDelete = (index, arr) => {
        console.log(index,arr);
        if(arr[index].is_use&&arr[index].is_use==1){
            this.setState({
                warnVisible:true
            });
        }
        else{
            this.setState({tipVisible:true,delItem:{index:index,arr:arr}});
            
        }
    }

    warnHandleOk=()=>{
        this.setState({
            warnVisible:false
        });
    }
     warnHandleCancel=()=>{
        this.setState({
            warnVisible:false
        });
    }

    tipHandleOk = () => {
        let delItem = this.state.delItem;
        let index = delItem.index;
        let arr = delItem.arr;
        const { updateParams } = this.props;
        let list = arr.splice(index, 1) && arr;
        updateParams(list)
        this.setState({tipVisible: false});
    }

    tipHandleCancel = () => {
        this.setState({
            tipVisible: false
        })
    }

    handleEdit = (index, arr) => {
        const { updateParams } = this.props;
        arr[index].edit = true;
        arr[index].ori_f_param_name = arr[index].f_param_name;
        updateParams(arr);
    }

    // handleEditBlur = (e, index, arr) => {
    //   arr[index].f_param_name = e.target.value
    //   return this.setState({list: arr})
    // }

    handleOk = (index, arr) => {
        const { updateParams } = this.props;
        arr[index].edit = false;
        updateParams(arr);
    }

    handleCancel = (index, arr) => {
        const { updateParams } = this.props;
        arr[index].edit = false;
        arr[index].f_param_name = arr[index].ori_f_param_name;
        updateParams(arr)
    }

    handleSubmit = (e) => {
        const { list, updateParams, fieldType } = this.props
        let arr = list.concat([]);
        let value = this.state.formDataParams;

        let lock = arr.filter((d, i) => {
            return d.f_param_name == this.state.formDataParams
        })

        let _length = {
            8: 40,
            9: 10,
            10: 10,
            11: 7
        }
        let maxLength = _length[this.state.fieldType]

        if (value == '') {
            this.setState({
                validateStatus: 'error',
                validateTip: '名字不能为空'
            })
            return false;
        }
        else {
            this.setState({
                validateStatus: '',
                validateTip: ''
            })
        }

        if (lock && lock.length > 0) {
            this.setState({
                validateStatus: 'error',
                validateTip: '该名字已被使用'
            })
            return false;
        }
        else {
            this.setState({
                validateStatus: '',
                validateTip: ''
            })
        }

        if (this.state.formDataParams.length > 6) {
            this.setState({
                validateStatus: 'error',
                validateTip: '6个字以内'
            })
            return false;
        }
        else {
            this.setState({
                validateStatus: '',
                validateTip: ''
            })
        }

        if (maxLength && arr.length > maxLength - 1) {
            this.setState({
                validateStatus: 'error',
                validateTip: '已有' + maxLength + '个选项，无法添加更多'
            })
            return false;
        }
        else {
            let param = {
                f_param_id: 0,
                f_param_name: this.state.formDataParams,
                //f_param_sort: 1,
                //f_can_edit: 8,
                //f_can_del: 1
            }

            const { fieldType } = this.props;

            if (fieldType == 11) {
              arr.splice(arr.length - 2, 0, param)
            }
            else {
              arr.push(param)
            }

            updateParams(arr);
            this.setState({
                formDataParams: '',
                validateStatus: '',
                validateTip: ''
            })
        }
    }

    handleParams = (e) => {
        this.setState({
            formDataParams: e.target.value
        })
        if (e.target.value.length > 6) {
            this.setState({
                validateStatus: 'error',
                validateTip: '6个字以内'
            })
        }
        else {
            this.setState({
                validateStatus: '',
                validateTip: ''
            })
        }
    }

    handleEditOk = (e, index, arr) => {
        const { updateParams } = this.props;
        if (e.target.value.length > 6) {
            this.setState({
                EditValidateStatus: 'error',
                EditValidateTip: '6个字以内'
            })
        }
        else if (e.target.value.length === 0) {
            this.setState({
                EditValidateStatus: 'error',
                EditValidateTip: '字段不能为空'
            })
        }
        else {
            this.setState({
                EditValidateStatus: '',
                EditValidateTip: ''
            })
        }
        arr[index].f_param_name = e.target.value;
        updateParams(arr);
    }

    isEdit = (name, index, arr) => {
        const { fieldType } = this.props;
        let list = ["发现机会", "成交", "无效"]

        if (fieldType == 11) {
        //   let has = list.indexOf(name.replace(/(^\s+)|(\s+$)/g, "")) != -1;
          var item =  arr[index];
          if(item.f_can_edit==1){
            return true;
          }
          else{
              return false;
          }
        //   if (has) {
        //     return false;
        //   }
        //   else {
        //     return true;
        //   }
        }
        else {
            return true;
        }
    }

    isStatusUpEdit = (name, index, arr) => {
      const { fieldType } = this.props;
      if (fieldType == 11) {
        if (this.isEdit(name, index, arr)) {
          return index == 2 ? false : true;
        }
        else {
          return false;
        }
      }
      else {
        return true;
      }
    }

    isStatusDownEdit =  (name, index, arr) => {
      const { fieldType } = this.props;
      let len = 0;
        if (arr) {
          len = arr.length;
        }
        else {
          len = 0;
        }
      if (fieldType == 11) {
        if (this.isEdit(name, index, arr)) {
          return index == len - 3 ? false : true;
        }
        else {
          return false;
        }
      }
      else {
        return true;
      }
    }

    isAllowMove = (name, index, arr)=>{
        const { fieldType } = this.props;
        if (fieldType == 11) {
            return false;
        }
        else {
            return true;
        }
    }


    render() {
        const { list, fieldType, groupStatus = 0 } = this.props;
        return (
            <div className="editabelList-content">
                <h3 className="title">字段选项({list.length})</h3>
                <Form inline
                    className="add-line"
                >
                    <FormItem
                        validateStatus={this.state.validateStatus}
                        help={this.state.validateTip}
                    >
                        <Input placeholder="6个字以内"
                            className="add-input"
                            maxLength="6"
                            value={this.state.formDataParams || ''}
                            onChange={(e) => { this.handleParams(e) }}
                            disabled={groupStatus == 1 ? true : false}
                        />
                    </FormItem>
                    <FormItem className="add-link">
                        <a
                            disabled={(this.state.formDataParams.length > 6 || groupStatus == 1) ? true : false}
                            onClick={(e) => { this.handleSubmit(e) }}
                        >
                            添加
            </a>
                    </FormItem>
                </Form>
                <div className="list-content">
                    {list && list.map((ele, index) => {
                        return (
                            <div key={index} className="editabelList-wrapper">
                                <div className="input-wrapper">
                                    {ele.edit ?
                                        (<div>
                                            <FormItem
                                                validateStatus={this.state.EditValidateStatus}
                                                help={this.state.EditValidateTip}
                                            >
                                                <Input placeholder="6个字以内"
                                                    maxLength="6"
                                                    className="add-input"
                                                    onChange={(e) => { this.handleEditOk(e, index, list) }}
                                                    value={ele.f_param_name}
                                                    className="ant-input ant-input-lg"
                                                    disabled={(groupStatus == 1) ? true : false}
                                                />
                                            </FormItem>
                                        </div>) :
                                        <p>{ele.f_param_name}</p>
                                    }
                                </div>
                                <ul className="editabel-btn-wrapper">
                                    {!ele.edit &&
                                      (this.isEdit(ele.f_param_name, index, list) && this.isAllowMove(ele.f_param_name, index, list))  &&
                                      index != 0 &&
                                      groupStatus == 0 &&
                                      (<li onClick={(e) => { this.handleMoveUp(index, list) }}>
                                        <Icon type="arrow-up" />
                                        </li>)}
                                    {!ele.edit &&
                                      (this.isEdit(ele.f_param_name, index, list) && this.isAllowMove(ele.f_param_name, index, list) ) &&
                                      (index != list.length - 1) &&
                                      groupStatus == 0 &&
                                      (<li onClick={(e) => { this.handleMoveDown(index, list) }}>
                                        <Icon type="arrow-down" />
                                    </li>)}
                                    {!ele.edit &&
                                      this.isEdit(ele.f_param_name, index, list) &&
                                      groupStatus == 0 &&
                                      <li onClick={(e) => { this.handleEdit(index, list) }}>
                                        <Icon type="edit" />
                                        </li>}
                                    {!ele.edit &&
                                      this.isEdit(ele.f_param_name, index, list) &&
                                      groupStatus == 0 &&
                                      <li onClick={(e) => { this.handleDelete(index, list) }}>
                                        <Icon type="delete" />
                                        </li>}
                                    {ele.edit && (<li onClick={(e) => { this.handleOk(index, list) }}><Button className="ant-btn ant-btn-primary" disabled={this.state.EditValidateStatus === 'error' ? 'disabled' : ''} size="small"> 确定 </Button></li>)}
                                    {ele.edit && (<li onClick={(e) => { this.handleCancel(index, list) }}><Button className="ant-btn ant-btn-ghost " size="small"> 取消 </Button></li>)}
                                </ul>
                            </div>
                        )
                    })}
                </div>
                {this.state.tipVisible && (<Modal
                    title="删除选项"
                    visible={this.state.tipVisible}
                    wrapClassName="vertical-center-modal"
                    width={450}
                    maskClosable={false}
                    onOk={this.tipHandleOk}
                    onCancel={this.tipHandleCancel}
                >
                    <div>
                        删除后，销售金额对应的字段数据也会被删除，确定删除吗？
                     </div>
                </Modal>)}

                {this.state.warnVisible && (<Modal
                    title="温馨提示"
                    visible={this.state.warnVisible}
                    wrapClassName="vertical-center-modal"
                    width={450}
                    maskClosable={false}
                    onOk={this.warnHandleOk}
                    onCancel={this.warnHandleCancel}
                    okText="我知道了"
                    footer = {
                        [<Button type="primary" onClick={this.warnHandleOk}>我知道了</Button>]
                    }
                >
                    <div>
                        贵公司有销售金额单据正在使用该状态，请先将单据流转到下一状<br/>态，再执行删除操作。
                     </div>
                </Modal>)}
            </div>
        )
    }
}
