import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fetchSalemoneyIndex} from '../../actions/'
//import Header from '../../components/Header';

import Header from '../../../../../../../comm/components/Header';

import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Guide from '../Label/guide';
import './index.less';
import ManagerTips from '../../components/ManagerTips';
import './media.less';

import saleFetch from '../../utils/fetch'


class App extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.setState({
            _height: 0,
            'antLeft': "ant-layout-left"
        });
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
        
        const dispatch = this.props.dispatch;
        saleFetch('auth', 'get')
            .then(json => {
                if (json.code == 200) {
                    dispatch(fetchSalemoneyIndex());
                    return saleFetch('info', 'get')
                        .then(json => {
                            let data = json.data.ecbiz;
                            this.setState({
                                userInfo: data.userinfo,
                                myNavAuth: data.modules.list || []
                            })
                        })
                }
                else  {
                    // 未登录
                    location.href = 'https://www.workec.com/login?from=https://html.workec.com/biz/web/crm/sale/index.html';
                }
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
                <ManagerTips />
                <Guide />
                {/*左侧边栏 */}
                {
                    /*!isWelcome ?*/
                    <div className={this.state.antLeft}
                        onMouseOver={this.addClass.bind(this)} onMouseLeave={this.removeClass.bind(this)}>
                        <Sidebar />
                    </div>
                    /* :
                    <div className="ant-layout-left left-hover">
                        <Sidebar />
                    </div>*/
                   
                }
                <div className="ant-layout-right" style={{height: this.state._height + 'px'}}>
                    <Header />

                    {/*页面内容 begin*/}
                    <div className="ant-layout-main">
                        <div className="ant-layout-container">
                            <div className="ant-layout-content" >
                                { this.props.children }
                            </div>
                          <div className="help-wrapper help-notes">
                            <h4><i className="iconfont">&#xe60b;</i>帮助说明</h4>
                            <ul className="desc">
                              <li>1、表单支持最多100个字段，每个分组所容纳的字段数量不限；</li>
                              <li>2、“基础信息”、“主题”、“客户”、“状态”、“总金额”字段不支持删除，“基础信息”、“主题”字段不支持排序，“状态”支持自定义参数；</li>
                              <li>3、系统自动为您记录单据编号、建单人、建单时间、最后更新时间，无需手动填写；</li>
                              <li>4、设置为禁用的字段，后台字体颜色为浅灰色，销售金额单据页面则直接隐藏。</li>
                            </ul>
                          </div>
                        </div>
                    </div>

                    {/*页面内容 end*/}

                    <Footer />
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
