import React, { PropTypes } from 'react';
import UserInfo from '../UserInfo';
import './header.less';

const Header = ({ children }) => (
    <div className="biz-header">
        <div className="biz-nav-wrapper">
            {children}
        </div>
        <UserInfo />
    </div>
);

Header.propTypes = {
    children: PropTypes.element.isRequired,
};

export default Header;
