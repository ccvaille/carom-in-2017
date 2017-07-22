import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Row, Col, Icon, Menu, Dropdown, Button, Checkbox, Radio, Popover, Modal} from 'antd'
import {Link} from 'react-router';

import { getWindowHeight } from '../../views/App/index'

import './index.less'
class LabelSetup extends React.Component {
	componentWillMount() {
        this.setState({
            _height: getWindowHeight() < 836 ? 620 + 20 : getWindowHeight() - 200 + 20
        });
        // window.onresize = function () {
        //     this.setState({
        //         _height: getWindowHeight(),
        //     });
        // }.bind(this);
        
        window.addEventListener('resize', this.setLabelHeight);
    }
    componentWillUnmount() {
    	 window.removeEventListener('resize', this.setLabelHeight);
    }
    setLabelHeight = () => {
    	this.setState({
            _height: getWindowHeight() < 836 ? 620 : getWindowHeight() - 200
        });
    }
	componentDidMount(){
		//this.setState({"rule":window.rule});
	}
	onSub(){
		this.props.handleStatus();
		this.setState({"visible":"none"});
	}
  render () {
    return (
			<div className="prompt-up-box" style={{height: this.state._height + 'px'}}>
			<div className="ec-steps">
				<div className="ec-steps-tail">
					<div className="ec-steps-active"></div>
				</div>
				<ul>
				    <li className="active">
				        <div className="ec-steps-text">
							<div className="ec-steps-num">1</div>
				       		 <span>同意升级新版</span>
				        </div>
				    </li>
				    <li>
				        <div className="ec-steps-text">
							<div className="ec-steps-num">2</div>
				       		 <span>旧标签分类整理</span>
				        </div>
				    </li>
				    <li>
				        <div className="ec-steps-text">
							<div className="ec-steps-num">3</div>
				       		 <span>升级完成</span>
				        </div>
				    </li>
			    </ul>
			</div>
				<div className="prompt-up-img">
					<img src={ecbiz.cdn + 'comm/public/images/prompt-up.png'} alt=""/>
				</div>
				<div className="prompt-up-text">
					<p>
						<i>您的工作将得到的全新体验，就在标签2.0版本新增的几项功能中。</i>
						对客户进行分类时，只需要建一个标签组就搞定；</p>
					<p>想对某个标签进行特别标记，轻松配置一个颜色就可以；想解决客户一次性买了同一个分类的产品？</p>
					<p>That was easy！对分组设定是否允许多选就可以！标签体验从未如此之“便”！</p>
				</div>
				<div className="prompt-up-items">
					<p>
						<span>只需<i>2</i>步</span>
						<span>您即可获得</span>
					</p>
					<p className="colon">:</p>
					<ul>
						<li>
							<img src={ecbiz.cdn + 'comm/public/images/up1.png'} alt=""/>
							<span>分类管理</span>
						</li>
						<li>
							<img src={ecbiz.cdn + 'comm/public/images/up2.png'} alt=""/>
							<span>多彩标签</span>
						</li>
						<li>
							<img src={ecbiz.cdn + 'comm/public/images/up3.png'} alt=""/>
							<span>属性筛选</span>
						</li>
						<li>
							<img src={ecbiz.cdn + 'comm/public/images/up4.png'} alt=""/>
							<span>单选多选</span>
						</li>
					</ul>
					<Button type="primary" onClick={ this.onSub.bind(this) } size="large">马上升级</Button>
				</div>
			</div>
    )
  }
}
export default LabelSetup