import React from 'react';

class MainLayout extends React.Component {
    render() {
        return (
            <div className="main-layout">
                {this.props.children}
                <h2>Hello World</h2>
            </div>
        );
    }
}

export default MainLayout;
