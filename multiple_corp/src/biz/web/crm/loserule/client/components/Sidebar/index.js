import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Icon, Menu, Dropdown } from 'antd';
import { Link } from 'react-router';
import './index.less';
class Sidebar extends React.Component {
    componentWillMount() {
        this.setState(
            {
                "rule": []
            });
    }
    componentDidMount() {
        this.setState({ "rule": window.rule });
    }
    render() {
        return (
            <div className="new-label-sidebar">
                <h1 className="logo">
                    <img src={ecbiz.cdn + 'comm/public/images/ec-logo.png'} alt="" />
                    <span>连接改变生意</span>
                </h1>
                <ul>
                    <li><Link to="/web/crm/rule/lose" className="active"><i className="iconfont">&#xe609;</i><span>CRM</span></Link></li>
                    <li><a href="https://corp.workec.com"><i className="iconfont">&#xe60a;</i><span>旧企业管理</span></a></li>
                </ul>
            </div>
        )
    }
}
export default Sidebar