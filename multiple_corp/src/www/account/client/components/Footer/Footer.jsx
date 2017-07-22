import React from 'react';
import './Footer.less';

const Footer = () => (
    <div id="footer">
        <div className="footer-items">
            <div className="footer-item">
                <ul>
                    <li><a href="/html/about/about.html" target="_blank">关于公司</a></li>
                    <li><a href="/html/buy.html" target="_blank">如何购买</a></li>
                    <li><a href="/hotnews" target="_blank">公司动态</a></li>

                </ul>
            </div>
            <div className="footer-item">
                <ul>
                    <li><a href="http://form.workec.com/html/form/MHl2WW1PRU43VlElM0Q=.html?chan=100" target="_blank">人才招聘</a></li>
                    <li><a href="/html/agent.html" target="_blank">代理合作</a></li>
                    <li><a href="/hotnews?cat=5" target="_blank">产品资讯</a></li>
                </ul>
            </div>
            <div className="footer-item">
                <ul>
                    <li><a href="/html/about/contact.html" target="_blank">联系我们</a></li>
                    <li><a href="/tech/help" target="_blank">技术支持</a></li>
                    <li><a href="/hotnews?cat=1" target="_blank">媒体报道</a></li>
                </ul>
            </div>
            <img src="http://www.staticec.com/www/images/cs/footer.png" alt="" />
        </div>
        <p>
            <img src="https://szcert.ebs.org.cn/Images/govIcon.gif" alt="" width="26" />
            <span>© 2008-2017 www.workec.com
                <i />粤ICP备09049701号<i />
                增值电信业务经营许可证：粤B2-201500191
            </span>
        </p>     
    </div>
);

module.exports = Footer;
