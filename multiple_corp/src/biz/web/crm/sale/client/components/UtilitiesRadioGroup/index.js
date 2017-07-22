import React, {Component, PropTypes} from 'react'
import {Form} from 'antd'
import './index.less'
import { Radio } from 'antd';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;

export default class UtilitiesRadioGroup  extends Component {
  constructor(props) {
    super(props)
    this.state = {
      requireValue: 1,
      disbaleValue: 1
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

  render () {
   const formItemLayout = {
          labelCol: { span: 4 },
          wrapperCol: { span: 10 },
        };
    return (
      <div>
        <FormItem
             label="是否必填"
             {...formItemLayout}
           >
           <RadioGroup onChange={this.onRequiredChange} value={this.state.requireValue}>
           <Radio value={1}>必填</Radio>
           <Radio value={2}>非必填</Radio>
         </RadioGroup>
        </FormItem>
        <FormItem
             label="状态"
             {...formItemLayout}
           >
           <RadioGroup onChange={this.onDisableChange} value={this.state.disbaleValue}>
           <Radio value={1}>启用</Radio>
           <Radio value={2}>禁用</Radio>
         </RadioGroup>
        </FormItem>
      </div>
    )
  }
}

