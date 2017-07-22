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

  componentWillReceiveProps(nextProps) {

  }

  handleSelect = (value) => {
    //console.log(value)
  }

  render () {
   const formItemLayout = {
          labelCol: { span: 4 },
          wrapperCol: { span: 10 },
        };
    return (
      <div>
      </div>
    )
  }
}
