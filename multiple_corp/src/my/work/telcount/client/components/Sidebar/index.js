import React, {PropTypes} from 'react'
import './index.less'
import {Router, browserHistory, Link} from 'react-router';

class Sidebar extends React.Component {
    componentWillMount() {

    }

    componentDidMount() {

    }

    render() {
        return (

            <div className="leftMenu pv_leftMenu">
                <div className="panel-group leftNav" id="leftMenu">
                    <div className="panel panel-default"><a data-parent="#leftMenu" href="###"
                                                            className="panel-title panel-heading aName"><span>客户分析</span></a>
                        <div id="total" className="panel-collapse collapse in">
                            <div className="panel-body">
                                <ul className="eList">
                                    <li><a href="http://my.workec.com/work/crmpic/index">客户数量统计</a></li>
                                    <li><a href="http://my.workec.com/work/crmpic/ctimes">客户活跃度统计</a></li>
                                    <li><a href="http://my.workec.com/work/crmpic/tag">客户标签变化统计</a></li>
                                </ul>
                            </div>
                            <div className="panel-body x_ul">
                                <ul className="eList">
                                    <li><a href="http://my.workec.com/work/crm/index">客户管理</a></li>
                                    <li><a href="http://my.workec.com/work/crm/log">客户创建记录</a></li>
                                    <li><a href="http://my.workec.com/work/weixin/index">微信访客</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="panel panel-default"><a data-parent="#leftMenu" href="###"
                                                            className="panel-title panel-heading aName"><span>工作分析</span></a>
                        <div id="user" className="panel-collapse collapse in">
                            <div className="panel-body">
                                <ul className="eList">
                                    <li><a href="http://my.workec.com/work/user/report" target="_blank">工作报告</a></li>
                                    <li><a href="http://my.workec.com/work/user/job">工作效率统计</a></li>
                                    <li><a href="http://my.workec.com/work/user/telcount">电话联系统计</a></li>
                                    <li><a href="http://my.workec.com/work/remind/list">销售计划统计</a></li>
                                    <li><a href="http://my.workec.com/work/sale/index">销售金额统计</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="panel panel-default"><a data-parent="#leftMenu" href="###"
                                                            className="panel-title panel-heading aName"><span>电话分析</span></a>
                        <div id="analyse" className="panel-collapse collapse in">
                            <div className="panel-body">
                                <ul className="eList">
                                    <li><Link to="/salemanage/phoneanalyse/today" activeClassName={"cred"}>今日统计</Link></li>
                                    <li><Link to="/salemanage/phoneanalyse/history" activeClassName={"cred"}>历史趋势</Link></li>
                                    <li><Link to="/salemanage/phoneanalyse/employee" activeClassName={"cred"}>员工排行</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="newDownLink w_export n_export pre " id=""><a href="/work/export/log"
                                                                                 className="pa downData btn btn-default"><span>我的导出</span></a><span
                        className="pa red_circle" id="undowns" style={{display: "none"}}></span></div>
                </div>
            </div>
        )
    }
}
export default Sidebar