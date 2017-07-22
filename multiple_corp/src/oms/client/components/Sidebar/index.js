import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Row, Col, Icon, Menu, Dropdown } from 'antd'
import { Link } from 'react-router';
import './index.less';
import classNames from 'classnames';

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
		let locationStr = location.href;
		let orderManCls = classNames({
				'active':locationStr.indexOf('orderManage')>-1
		});

		let shopDataCls = classNames({
				'active':locationStr.indexOf('shopData')>-1
		});

		return (
			<div className="new-label-sidebar">
				<h1 className="logo">
					<img src={ecoms.cdn + 'comm/public/images/ec-logo.png'} alt="" />
					<span>连接改变生意</span>
					<p>数据运营系统</p>
				</h1>
				<ul>
					<li><Link to="/web/orderManage" className={orderManCls}><span>订单数据</span></Link></li>
					<li><Link to="/web/shopData" className={shopDataCls}><span>帐号数据</span></Link></li>
					<li><a href="https://admin.workec.com/export"><span>我的导出</span></a></li>
				</ul>
			</div>
		)
	}
}
export default Sidebar