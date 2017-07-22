import React from 'react';
import './sidebar.less';

class Sidebar extends React.Component {
    render() {
        return (
            <div className="biz-sidebar">
                <h1 className="logo">
                    <img src={`${window.ecbiz.cdn}comm/public/images/ec-logo.png`} alt="" />
                    <span>连接改变生意</span>
                </h1>
                <ul>
                    <li>
                        <a href="/web/crm/tag">
                            <i className="iconfont">&#xe609;</i>
                            <span>CRM</span>
                        </a>
                    </li>
                    <li>
                        <a href="https://corp.workec.com">
                        <i className="iconfont">&#xe60a;</i>
                        <span>旧企业管理</span></a>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Sidebar;
