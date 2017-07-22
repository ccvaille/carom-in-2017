import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Header from '~comm/components/Header';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Guide from '../Label/guide';
import './index.less';
import ManagerTips from '../../components/ManagerTips';
import './media.less';

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.setState({
            _height: 0,
            'antLeft': "ant-layout-left"
        });
        // window.onresize = function () {
        //     this.setState({
        //         _height: getWindowHeight(),
        //     });
        // }.bind(this);
        
        window.addEventListener('resize', function() {
            this.setState({
                _height: getWindowHeight() < 768 ? 768 : getWindowHeight()
            });
        }.bind(this));
    }

    componentDidMount() {
        this.setState({
            _height: getWindowHeight() < 768 ? 768 : getWindowHeight()
        })
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
        const { isWelcome } = this.props.postsByReddit;
        return (
            <div>
                <ManagerTips/>
                <Guide />
                {
                    /*!isWelcome ? */                    
                    <div className={this.state.antLeft}
                        onMouseOver={this.addClass.bind(this)} onMouseLeave={this.removeClass.bind(this)}>
                        <Sidebar />
                    </div>
                    /*:
                    <div className="ant-layout-left left-hover">
                        <Sidebar />
                    </div>
                    */
                }
                
                <div className="ant-layout-right" style={{height: this.state._height + 'px'}}>
                    <Header />
                    <div className="ant-layout-main">
                        <div className="ant-layout-container">
                            <div className="ant-layout-content" >
                                { this.props.children }
                                {
                                    this.props.postsByReddit.loadComponent ? 
                                    <Footer /> : null      
                                }
                            </div>
                        </div>
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
export function getWindowHeight() {
    var _height = window.innerHeight;

        if (window.innerHeight)
            _height = window.innerHeight;
        else if ((document.body) && (document.body.clientHeight))
            _height = document.body.clientHeight;
// 通过深入 Document 内部对 body 进行检测，获取窗口大小
        if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
            _height = document.documentElement.clientHeight;
        }
        /*if (_height < 768){
            debugger;
            _height = 768;
        }*/
        return _height;
}