import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import saleFetch from '../../utils/fetch'
import { connect } from 'react-redux'
import { Row, Col, Icon, Menu, Dropdown, Button, Checkbox, Radio, Modal } from 'antd'
import {fetchSalemoneyIndex} from '../../actions/'
import './index.less'


const tips = [
    '一日之计在于寅，今日的努力成就明天的您！',
    '善于利用零星时间的人，更能做出成绩：）',
    '再多的金钱也难买健康，要按时吃饭喔^_^',
    '生命就是一个不断联系的过程，要与客户保持沟通哦',
    '勉之今,以成辉煌于翌日！晚上好好休息喔！'
];

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userInfo: {},
      myNavAuth: []
    }
  }

    componentWillMount() {
        this.setState({
            'isSureLoginOut': false
        })

    }


    componentDidMount() {
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

    loginOut() {
        this.state.isSureLoginOut = true;
        this.setState(this.state);
    }
    sureLoginOut() {
        location.href = "https://biz.workec.com/logout";
    }
    cancelLoginOut() {
        this.state.isSureLoginOut = false;
        this.setState(this.state);
    }
    render() {
        let userInfo = this.state.userInfo //window.ecbiz.userinfo;
        const h = new Date().getHours();
        let tipText = '';
        if( h < 3 ) {
            tipText = tips[4]
        } else if(h < 8) {
            tipText = tips[0]
        } else if(h < 11) {
            tipText = tips[1]
        } else if(h < 14) {
            tipText = tips[2]
        } else if(h < 20) {
            tipText = tips[3]
        } else {
            tipText = tips[4]
        }

        const myNavAuth = this.state.myNavAuth //window.ecbiz.modules.list;

        return (
            <div className="new-label-header">
            <div className="new-label-left">
                <h2>CRM</h2>
                <ul className="new-label-nav">
                {
                   myNavAuth && myNavAuth.indexOf(301001) !== -1 ? <li><a href="https://corp.workec.com/corp/role?f=-1">权限管理</a></li> : null
                }{
                   myNavAuth &&  myNavAuth.indexOf(301002) !== -1 ? <li><a href="https://corp.workec.com/crm/set/field">自定义字段</a></li> : null
                }{
                   myNavAuth &&  myNavAuth.indexOf(301003) !== -1 ? <li><a href="https://biz.workec.com/web/crm/tag">客户标签</a></li> : null
                }{
                   myNavAuth &&  myNavAuth.indexOf(301004) !== -1 ? <li><a href="https://corp.workec.com/crm/set/stage">客户库规则</a></li> : null
                }{
                   myNavAuth &&  myNavAuth.indexOf(301005) !== -1 ? <li><a href="https://corp.workec.com/crm/qq/index">QQ授权管理</a></li> : null
                }{
                   myNavAuth &&  myNavAuth.indexOf(301006) !== -1 ? <li  className="active"><a href="javascript:;">销售金额配置</a></li> : null
                }
                </ul>
            </div>
          {userInfo.uname ?  (<div className="customer-info">
                <img src={userInfo.uface} alt={ userInfo.uname } title={ userInfo.uname + '(' + userInfo.uaccont + ')' }/>
                <div className="customer-text">
                    <p><i alt={ userInfo.uname } title={ userInfo.uname}>{ userInfo.uname }</i><i>({ userInfo.uaccont })</i></p>
                    <p>{ tipText }</p>
                </div>
                <Button type="ghost" onClick={this.loginOut.bind(this)}>退出</Button>
            </div>) : ''}
            <Modal width="440"
                   title="温馨提示"
                   visible={this.state.isSureLoginOut}
                   wrapClassName="vertical-center-modal"
                   onOk={this.sureLoginOut.bind(this)}
                   onCancel={this.cancelLoginOut.bind(this)}>
                   <p>确定要退出当前帐号吗？</p>
            </Modal>
        </div>
        )
    }
}
const mapStateToProps = (state) => {
    const {postsByReddit} = state;
    return {postsByReddit}
}
export default connect(mapStateToProps)(Header)
