import React, {Component, PropTypes} from 'react'
import './index.less'
import FieldForm from '../FieldForm'
import {Form, Input, Button, Radio, Select} from 'antd'
const FormItem = Form.Item;

export default class SaleText  extends Component {
  constructor(props) {
    super(props)
  }

  static propTypes = {}

  componentWillReceiveProps(nextProps) {}

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
          <FieldForm />
         </div>
        <div className="example-wrapper">
          <h3 className="title">示例</h3>
          <img src={'//1.staticec.com/biz/web/crm/sale/comm/public/images/example_text.png'} alt=""/>
          <div className="instruction-wrapper">
            <h3 className="title">帮助说明：</h3>
            <ul>
              <li>1、文本内容最多可以输入100个字。</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}
