import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Row, Col, Icon, Menu, Dropdown, Button, Checkbox, Radio, Popover, Modal, Input} from 'antd'
import {Link} from 'react-router';
import LeftGroup from './leftGroup';
import './index.less'

class NewLabel extends React.Component {
 componentWillMount(){
     // console.info("进的新标签");
 }
  render () {
    return (
        <div>
            <div className="grouping-sorting-box">
                <LeftGroup componentType="newLabel" />
                <div className="help-notes">
                    <h4><i className="iconfont">&#xe60b;</i>帮助说明</h4>
                    <ul>
                        <li>1、您最多可以创建30个分组，200个标签，每个分组所容纳的标签数量不限；</li>
                        <li>2、对标签组设定不同的颜色，有助于销售员在客户资料上快速确认标签的分类信息；</li>
                    </ul>
                </div>
            </div>
        </div>
    )
  }
}
export default NewLabel