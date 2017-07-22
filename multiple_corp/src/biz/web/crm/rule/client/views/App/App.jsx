import React from 'react';
import restHub from '~comm/services/restHub';
import Message from 'components/Message';    
import Sidebar from '../../components/Sidebar';
import Header from '~comm/components/Header';
import Footer from '../../components/Footer';
import ManagerTips from '../../components/ManagerTips'
import { getWindowHeight } from '../../util';
import { Modal, Button, Icon } from 'antd';
import { Link, withRouter } from 'react-router';
import './index.less';
import './media.less';



class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            crmStageGrayRelease: 1, //客户库规则灰度状态, 0为全网， 1为灰度
            gettingInfo: true,
            gettingAuth: true,
            navList: []
        };
    }
    componentWillMount() {
        this.state.height = getWindowHeight();
    }

    componentDidMount() {
        const currentHref = location.href;
        window.addEventListener('auth', function() {
            restHub.get('https://biz.workec.com/info').then((result) => {
                if (!result.errorMsg) {
                    let jsonResult = result.jsonResult;
                    if (jsonResult.code !== 200) {
                        Message.error(jsonResult.msg);
                    } else {
                        let data = jsonResult.data.ecbiz;
                        var grayRelease = data.grayrelease;
                        var crmStageGrayRelease;
                        if({}.toString.call(grayRelease) == '[object Object]' && grayRelease.crm_stage == 1) {
                            crmStageGrayRelease = 1;
                            if(currentHref.indexOf('/web/crm/rule') > 0 && currentHref.indexOf('/lose') < 0) {
                                location.href="https://corp.workec.com/crm/set/stage"
                            }
                        } else {
                            crmStageGrayRelease = 0;
                        }
                        this.setState({
                            crmStageGrayRelease: crmStageGrayRelease,
                            gettingInfo: false,
                            ecbiz: data
                        })
                    }
                } else {
                    Message.error(result.errorMsg);
                }
            });

            restHub.get('https://biz.workec.com/crm/rule/check').then((result) => {
                if (!result.errorMsg) {
                    let jsonResult = result.jsonResult;
                    if (jsonResult.code !== 200) {
                        Message.error(jsonResult.msg);
                    } else {
                        let data = jsonResult.data.list;
                        this.setState({
                            gettingAuth: false,
                            navList: data
                        })
                    }
                } else {
                    Message.error(result.errorMsg);
                }
            });
        }.bind(this))

        var timer;
        window.addEventListener('resize', function() {
            const that = this;
            if(timer) clearTimeout(timer);
            timer = setTimeout(function() {
                that.countHeight();
                that.setState({
                    height: getWindowHeight()
                })
            }, 500)
        }.bind(this))

        window.onload = function() {
            this.countHeight();
        }.bind(this)
    }
    
    countHeight = () => {
        const scrollArea = document.querySelector('#scrollArea');
        const scrollWrap = document.querySelector('#scrollWrap');
        if(scrollArea && scrollWrap) {
            scrollWrap.style.height = window.innerHeight - scrollArea.offsetTop - 40 + 'px';
            scrollArea.style.minHeight = window.innerHeight - scrollArea.offsetTop - 40 + 'px';
        } else {
            setTimeout(function() {
                this.countHeight();
            }.bind(this), 50);
        }
    }
   
    render() {
        const mySubNavAuth = this.state.navList;
        const pathname = this.props.location.pathname;
        return (<div>
            <div className="ant-layout-left">
                <Sidebar />
            </div>
            <div className="ant-layout-right" style={{ height: this.state.height + 'px' }}>
                <ManagerTips ecbiz={ this.state.ecbiz }/>
                <Header />
                {
                    !this.state.gettingInfo && !this.gettingAuth ?
                    <div className="ant-layout-main">
                        <div className="back-rule-head">
                            <div className="rule-head-wrap">
                                {
                                this.state.crmStageGrayRelease == 1 ?
                                <p>
                                    {
                                        mySubNavAuth.indexOf(30100401) !== -1 ? 
                                        <a href="https://corp.workec.com/crm/set/stage">客户阶段与上限</a>
                                        : 
                                        null
                                    }
                                    {
                                        mySubNavAuth.indexOf(30100402) !== -1 ? 
                                        <a href="https://corp.workec.com/crm/set/rule">撞单规则</a>
                                        : 
                                        null
                                    }
                                    {
                                        mySubNavAuth.indexOf(30100403) !== -1 ? 
                                        <Link to="/biz/web/crm/rule/lose.html" className={ pathname.indexOf('rule/lose') > 0 ? 'active' : '' }>客户收回策略</Link> 
                                        : 
                                        null
                                    }
                                    {
                                        mySubNavAuth.indexOf(30100404) !== -1 ? 
                                        <a href="https://corp.workec.com/crm/set/rule?f=2">客户资料保护</a> 
                                        : 
                                        null
                                    }
                                </p>
                                :
                                <p>
                                    {
                                        mySubNavAuth.indexOf(30100401) !== -1 ? 
                                        <Link to="/biz/web/crm/rule/stage.html" className={pathname.indexOf('rule/stage') > 0 ? 'active' : ''}>客户阶段</Link>
                                        : 
                                        null
                                    }
                                    {
                                        mySubNavAuth.indexOf(30100401) !== -1 ? 
                                        <Link to="/biz/web/crm/rule/limit.html" className={pathname.indexOf('rule/limit') > 0 ? 'active' : ''}>客户上限</Link> 
                                        : 
                                        null
                                    }
                                    {
                                        mySubNavAuth.indexOf(30100402) !== -1 ? 
                                        <Link to="/biz/web/crm/rule/hit.html" className={pathname.indexOf('rule/hit') > 0 ? 'active' : ''}>撞单规则</Link>
                                        : 
                                        null
                                    }
                                    {
                                        mySubNavAuth.indexOf(30100403) !== -1 ? 
                                        <Link to="/biz/web/crm/rule/lose.html" className={pathname.indexOf('rule/lose') > 0 ? 'active' : ''}>客户收回策略</Link> 
                                        : 
                                        null
                                    }
                                    {
                                        mySubNavAuth.indexOf(30100404) !== -1 ? 
                                        <Link to="/biz/web/crm/rule/protect.html" className={pathname.indexOf('rule/protect') > 0 ? 'active' : ''}>客户资料保护</Link> 
                                        : 
                                        null
                                    }
                                </p>
                                }
                            </div>
                        </div>
                        <div className="ant-layout-container" id="scrollWrap">
                            <div className="ant-layout-content" id="scrollArea">
                                {this.props.children}
                            </div>
                            <Footer ref='footer' />
                        </div>
                    </div>
                    :
                    ''
                }
            </div>
        </div>)
    }
}


export default withRouter(App);
