import React, {PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Row, Col, Icon, Menu, Dropdown, Button, Checkbox, Radio,Input} from 'antd'
import './index.less';
import {cookiesHelper} from '../../utils'

class ManagerTips extends React.Component {
    state={
        isShowTips:true
    };

    componentWillMount(){
        //如果管理其他企业的账户
        if(ecbiz.corphook){
            let corpName=ecbiz.corphookinfo.cname;
            //corpIds
            let corpIds=JSON.parse(cookiesHelper.getItem('corpIds'))||[];
            if(corpIds){
                //如果该企业已经加入了免提示名单
                if(corpIds.indexOf(corpName)>-1){
                    this.setState({isShowTips:false});
                }
            }
        }
        //管理自己的账户
        else{
            this.setState({isShowTips:false});
        }
    }

    handleClose(){
        this.setState({
            isShowTips:false
        });
        let corpIds=JSON.parse(cookiesHelper.getItem('corpIds'))||[];
        let corpName=ecbiz.corphookinfo.cname;
        corpIds.push(corpName);
        cookiesHelper.setItem('corpIds',JSON.stringify(corpIds));

    }

    render() {
        //ecbiz.corphookinfo.cname
        return (
            this.state.isShowTips? <div style={{display:'block'}}>
            <div className="top-tip"><p>您正在对“{ ecbiz.corphookinfo.cname }”的企业后台进行相关管理，请谨慎操作，避免影响到他人的使用。<span className="close-btn" onClick={this.handleClose.bind(this)}><i className="iconfont">&#xe611;</i></span></p></div>
            </div> : null
        )
    }
}

export default ManagerTips