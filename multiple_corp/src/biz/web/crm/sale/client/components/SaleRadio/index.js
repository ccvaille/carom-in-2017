import React, {Component, PropTypes} from 'react'
import './index.less'
import SelectGroup from '../SelectGroup'
import UtilitiesRadioGroup from '../UtilitiesRadioGroup'

import {Form, Input, Button, Radio, Select} from 'antd'
const FormItem = Form.Item;


import FieldForm from '../FieldForm'

export default class SaleRadio  extends Component {
  constructor(props) {
    super(props)
  }

  handleSelect = (value) => {
    console.log(value)
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
          <img src={'//1.staticec.com/biz/web/crm/sale/comm/public/images/example_radio.png'} alt=""/>
          <div className="instruction-wrapper">
            <h3 className="title">帮助说明：</h3>
            <ul>
              <li>1、最多可以设定10个选项。</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}
