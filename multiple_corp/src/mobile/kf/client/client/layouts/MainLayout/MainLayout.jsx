import React, { PropTypes } from 'react';

const MainLayout = ({ children }) => (
    <div className="cs-webview-main-layout">{children}</div>
);

MainLayout.propTypes = {
    children: PropTypes.element.isRequired,
};

export default MainLayout;
