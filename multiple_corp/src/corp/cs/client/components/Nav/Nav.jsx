import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Header from '~siteComm/components/Header';

class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.navAuth = window.ecbiz.modules.list;
    }

    render() {
        return (
            <Header>
                <ul className="biz-nav cs-nav">
                    <li>
                        <Link to="">分组与权限</Link>
                    </li>
                    <li>
                        <Link to="">基础设置</Link>
                    </li>
                    <li>
                        <Link to="">自动回复</Link>
                    </li>
                </ul>
            </Header>
        );
    }
}

export default Nav;
