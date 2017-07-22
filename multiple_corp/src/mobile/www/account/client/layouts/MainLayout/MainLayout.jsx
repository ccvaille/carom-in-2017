import React from 'react';
import { Icon } from 'antd-mobile';
import './layout.less';

class MainLayout extends React.Component {
    render() {
        return (
            <div className="main-layout">
                <div className="back">
                    <Icon className="back-icon" type="left" size="lg" />
                </div>
                <div className="child-wrapper">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default MainLayout;
