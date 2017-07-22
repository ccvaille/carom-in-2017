import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Row, Col, Icon, Menu, Dropdown } from 'antd'
import {Link} from 'react-router';
import './index.less'
class Sidebar extends React.Component {
  componentWillMount(){
    this.setState(
      {
        "rule":[]
      });
  }
  componentDidMount(){
    this.setState({"rule":window.rule});
  }
  render () {
    return (
      <div className="new-label-sidebar">
        <h1 className="logo">
        <img src={ecbiz.cdn + 'comm/public/images/ec-logo.png'} alt=""/>
        <span>连接改变生意</span>
        </h1>
        <ul>
          <li >
            <Link className="active" to="/web/crm/sale" activeClassName="active">
            <i className="iconfont"></i>
              <span>CRM</span>
            </Link>
          </li>
          <li>
            <a href="https://corp.workec.com">
              <span>旧企业管理</span>
            </a>
          </li>
        </ul>
        </div>
    )
  }
}
export default Sidebar
