import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import './index.less';
import './media.less';

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.setState({
            'antLeft': "ant-layout-left"
        });

    }
    componentDidMount() {

    }
    addClass() {
        this.state.antLeft = 'ant-layout-left ' + 'left-hover';
        this.setState(this.state);
    }
    removeClass() {
        this.state.antLeft = 'ant-layout-left';
        this.setState(this.state);
    }
    render() {
        return (
            <div>
                <div className={this.state.antLeft} style={{'position':'fixed','top':'0','bottom':'0'}}
                    onMouseOver={this.addClass.bind(this)} onMouseLeave={this.removeClass.bind(this)}>
                    <Sidebar />
                </div>
                <div className="ant-layout-right" style={{'position':'fixed','top':'0','bottom':'0','right':'0','left':'0'}}>
                    <Header />
                    <div className="ant-layout-main">
                        <div className="ant-layout-container">
                            {/*<div className="ant-layout-content" >*/}
                                { this.props.children }

                            {/*</div>*/}
                        </div>
                        <Footer />
                    </div>
                </div>
            </div>
        );
    }
}

App.propTypes = {
    children: PropTypes.node.isRequired,
};

App.contextTypes = {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};
function mapStateToProps(state) {
    const {postsByReddit} = state;
    return {postsByReddit}
}
export default connect(mapStateToProps)(App);