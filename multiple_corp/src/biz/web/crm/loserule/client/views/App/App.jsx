import React from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ManagerTips from '../../components/ManagerTips'
import { getWindowHeight } from '../../util';
import { Modal, Button, Icon } from 'antd';
import './index.less';
import './media.less';


import ruleLeadImg from '../../images/rule_lead_msg.png';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentWillMount() {
        this.state.height = getWindowHeight();
    }
    onModalClose = () => {
        this.props.actions.closeGuide();
    }
    render() {
        const mySubNavAuth = window.ecbiz.modules.sublist;
        return (<div>
            <div className="ant-layout-left">
                <Sidebar />
            </div>
            <div className="ant-layout-right" style={{ height: this.state.height + 'px' }}>
                <ManagerTips />
                <Header ref='header'>
                    <div className="back-rule-head">
                        <p>
                            {
                                mySubNavAuth.indexOf(30100401) !== -1 ? <a href="https://corp.workec.com/crm/set/stage">客户阶段与上限</a> : null
                            }
                            {
                                mySubNavAuth.indexOf(30100402) !== -1 ? <a href="https://corp.workec.com/crm/set/rule">撞单规则</a> : null
                            }
                            {
                                mySubNavAuth.indexOf(30100403) !== -1 ? <a className="active" disabled>客户收回策略</a> : null
                            }
                            {
                                mySubNavAuth.indexOf(30100404) !== -1 ? <a href="https://corp.workec.com/crm/set/rule?f=2">客户资料保护</a> : null
                            }
                        </p>
                    </div>
                </Header>
                <div className="ant-layout-main">
                    <Modal title="设置上限预警" footer={<Button type="primary" onClick={this.onModalClose}>确定</Button>}
                        visible={this.props.showGuide && this.props.theRuleIsOpen} wrapClassName="back_lead_modal" onCancel={this.onModalClose}>
                        <img className="back_rule_leadimg" src={ruleLeadImg} />
                        <div className="back_lead_place">
                            <Icon type="setting" style={{ marginRight: 12 }} />设置上限预警
                        </div>
                    </Modal>
                    <div className="ant-layout-container">
                        <div className="ant-layout-content" >
                            {this.props.children}
                        </div>
                        <Footer ref='footer' />
                    </div>
                </div>
            </div>
        </div>)
    }
}

export default App;
