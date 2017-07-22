import React, { PropTypes } from 'react';
import Sidebar from '../Sidebar';
import './main-layout.less';

const MainLayout = ({ children }) => (
    <div className="biz-layout">
        <div className="layout-sidebar">
            <Sidebar />
        </div>
        <div className="layout-main">
            {children}
        </div>
    </div>
);

MainLayout.propTypes = {
    children: PropTypes.array.isRequired,
};

export default MainLayout;
