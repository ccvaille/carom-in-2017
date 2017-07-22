import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Icon, Menu, Dropdown } from 'antd';
import './index.less';
import { getWindowHeight } from '../../util';


class Footer extends React.Component {
    render() {
        const footerClass = getWindowHeight() < 826 ? "new-label-footer" : "new-label-footer new-label-footer-fixed";
        return (
            <div ref='root' className="new-label-footer new-label-footer-fixed">全国服务电话：400-0060-100 Copyright © 2008-2016 workec.com, All Rights Reserved.    粤ICP备09049701号</div>
        );
    }
}
export default Footer;
