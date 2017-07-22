import React, {Component, PropTypes} from 'react'
import './index.less'
import SelectGroup from '../SelectGroup'
import UtilitiesRadioGroup from '../UtilitiesRadioGroup'

import {Form, Input, Button, Radio, Select} from 'antd'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

import FieldForm from '../FieldForm'

export default class SaleGroup  extends Component {
  constructor(props) {
    super(props)
    this.state = {
      disbaleValue: 1
    }
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
        <div className="from-wrapper">
          <h3 className="title">详细设置</h3>
          <FieldForm/>
         </div>
        <div className="example-wrapper">
          <h3 className="title">示例</h3>
          <img src={'//1.staticec.com/biz/web/crm/sale/comm/public/images/example_group.png'} alt=""/>
          <div className="instruction-wrapper">
            <h3 className="title">帮助说明：</h3>
            <ul>
              <li>1、该字段功能为创建一个字段分组。</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}
