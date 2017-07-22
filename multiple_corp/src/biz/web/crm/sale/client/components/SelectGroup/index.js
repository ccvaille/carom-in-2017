import React, {Component, PropTypes} from 'react'
import {Form, Select} from 'antd'
import './index.less'

export default class Group  extends Component {
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
            <Select
                  className=""
                  size="large"
                  defaultValue="lucy"
                  placeholder="请选择一个分组"
                  optionFilterProp="children"
                  onChange={this.handleSelect}
                >
                  <option value="jack">jack</option>
                  <option value="lucy">lucy</option>
                  <option value="tom">tom</option>
                </Select>
      </div>
    )
  }
}

