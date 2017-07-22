import React from 'react';
import './Header.less';

const Header = () => (
    <div id="header">
        <div className="header-content">
            <h1 className="logo" title="让客户与企业紧密相连"><a className="icon-logo" /></h1>
            <div id="nav">
                <a href="https://www.workec.com/">首页</a>
                <a href="https://www.workec.com/html/product/product.html" >产品</a>
                <a href="https://www.workec.com/case/successcase.html" >案例</a>
                <a href="https://www.workec.com/html/buy.html" >价格</a>
                <a href="https://www.workec.com/html/support.html" >下载</a>
                <a href="https://www.workec.com/html/agent.html" >代理合作</a>
            </div>
            <div className="status">
                <a className="active" href="javascript:;" >注册</a>
                <a href="javascript:;" >登陆</a>
            </div>
        </div>
    </div>
);

module.exports = Header;
