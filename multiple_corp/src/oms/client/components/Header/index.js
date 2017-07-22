import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import {Link} from 'react-router';
import { Row, Col, Icon, Menu, Dropdown, Button, Checkbox, Radio, Modal } from 'antd'
import './index.less'

const tips = [
    '一日之计在于寅，今日的努力成就明天的您！',
    '善于利用零星时间的人，更能做出成绩：）',
    '再多的金钱也难买健康，要按时吃饭喔^_^',
    '生命就是一个不断联系的过程，要与客户保持沟通哦',
    '勉之今,以成辉煌于翌日！晚上好好休息喔！'
];

class Header extends React.Component {
    static propTypes = {
        orderManage:React.PropTypes.bool,
        shopData:React.PropTypes.bool
    };

    static defaultProps = {
        orderManage:true,
        shopData:false
    };

    componentWillMount() {
        this.setState({
            'isSureLoginOut': false
        })
    }

    loginOut() {
        this.setState({isSureLoginOut:true});
    }
    sureLoginOut() {
        location.href = "https://oms.workec.com/logout";
    }
    cancelLoginOut() {
        this.setState({isSureLoginOut:false});
    }
    render() {
        let locationStr=location.href;
        let userInfo = window.ecoms.userinfo;
        const h = new Date().getHours();
        let tipText = '';
        if( h < 3 ) {
            tipText = tips[4]
        } else if(h < 8) {
            tipText = tips[0]
        } else if(h < 11) {
            tipText = tips[1]
        } else if(h < 14) {
            tipText = tips[2]
        } else if(h < 20) {
            tipText = tips[3]
        } else {
            tipText = tips[4]
        }

        return (
            <div className="new-label-header">
            <div className="new-label-left">
                <h2>CRM</h2>
                <ul className="new-label-nav">
                {
                    locationStr.indexOf('web/orderManage')>-1? <li><Link to="/web/orderManage/orderDetail" activeClassName="active">订单详情</Link></li>:null
                }
                {
                    locationStr.indexOf('web/orderManage')>-1? <li><Link to="/web/orderManage/orderChart" activeClassName="active">分析图表</Link></li> :null
                }
                {
                    locationStr.indexOf('web/shopData')>-1? <li className="active"><Link to="/web/shopData/accountNum" activeClassName="active">购买账号数</Link></li>:null
                    
                }
                {
                    locationStr.indexOf('web/shopData')>-1? <li><Link to="/web/shopData/companyNum" activeClassName="active">购买企业数</Link></li> :null
                }
                </ul>
            </div>
            <div className="customer-info">
                <img src={userInfo.uface} alt={ userInfo.uname } title={ userInfo.uname + '(' + userInfo.uaccont + ')' }/>
                <div className="customer-text">
                    <p><i alt={ userInfo.uname } title={ userInfo.uname}>{ userInfo.uname }</i><i>({ userInfo.uaccont })</i></p>
                    <p>{ tipText }</p>
                </div>
                <Button type="ghost" onClick={this.loginOut.bind(this)}>退出</Button>
            </div>
            <Modal width="440" 
                   title="温馨提示"
                   visible={this.state.isSureLoginOut}
                   wrapClassName="vertical-center-modal" 
                   onOk={this.sureLoginOut.bind(this)}
                   onCancel={this.cancelLoginOut.bind(this)}>
                   <p>确定要退出当前帐号吗？</p>
            </Modal>
        </div>
        )
    }
}

export default Header



