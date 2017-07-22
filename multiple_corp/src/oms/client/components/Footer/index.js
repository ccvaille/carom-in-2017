import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Row, Col, Icon, Menu, Dropdown } from 'antd'
import './index.less'
class Footer extends React.Component {

  render () {
    return (
      <div className="new-label-footer">全国服务电话：400-0060-100 Copyright © 2008-2016 workec.com, All Rights Reserved.    粤ICP备09049701号</div>
    )
  }
}
export default Footer