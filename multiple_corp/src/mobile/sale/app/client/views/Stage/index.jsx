import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link, browserHistory } from 'react-router';
import './index.less';
import { formatNumber } from '../../util/utils.js'
import moment from 'moment';
import 'moment/locale/zh-cn';
import * as stageActions from '../../actions/stageActions'
import noStagePng from '../../images/no-stage.png';
import LoadMore from '../../component/loadMore'
import {
    ActivityIndicator,
} from 'antd-mobile';

class Stage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }
    componentWillMount() {

    }
    componentDidMount() {
        document.addEventListener('scroll',this.handleScroll,false);
        let { stageActions, stageReducers } = this.props;
        let bill = this.props.location.state;
        if(this.props.location.state.total!=0){
            stageActions.fetchBillList({
                sid:this.props.params.id,
                total:this.props.location.state.total,
                page:stageReducers.pageIndex
            });
        }

        if (window.__ec_bridge__ && window.__ec_native__) {
            __ec_bridge__.setTitle({
                title: bill.sname?bill.sname:'漏斗阶段'
            }, (result, error) => {
                if (result.code === 0) {
                    console.log('我要更新title了哟');
                }
            })
        }
    }
    componentWillUnmount() {
        document.removeEventListener('scroll',this.handleScroll,false); 
        let { stageActions, stageReducers } = this.props;
        stageActions.initState();
    }
    componentWillReceiveProps(nextProps) {
        let { stageActions, stageReducers } = this.props;
    }
    linkToDetail=(item)=>{
        browserHistory.push({
            pathname: this.props.location.pathname+'/bill/'+item.f_id,
        });
    }

    //下拉加载
    handleScroll=()=>{
        let {stageActions,stageReducers}  = this.props;
        if(stageReducers.isMore){
            let vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            let bottom_dis = ReactDOM.findDOMNode(this.refs.loadMore).getBoundingClientRect().bottom;
            if((bottom_dis-20)<=vh){
                stageActions.pageChange(stageReducers.pageIndex + 1);
                stageActions.fetchBillList({
                    sid:this.props.params.id,
                    total:this.props.location.state.total,
                    page:stageReducers.pageIndex+1
                });
            }
        }
    }

    render = () => {
        let { billList,isMore,fetching,...others } = this.props.stageReducers;

        let bill = this.props.location.state;

        return (
            <div className="sale-stage">
                <div className="content">
                <div className="header">状态：{bill.sname}（总：{bill.total}单）</div>
                    {
                        billList&&billList.length>0?(
                            billList.map((item,index)=>{
                                return (
                                    <div className="stage-card" onClick={()=>this.linkToDetail(item)}>
                                        <div className="code"><span className="t">编号</span><span className="v">{item.f_code}</span><i className="iconfont">&#xe67e;</i></div>
                                        <p><span className="t">状态</span><span className="v">{bill.sname}</span></p>
                                        <p><span className="t">主题</span><span className="v">{item.f_project_name}</span></p>
                                        <p><span className="t">总金额</span><span className="v">{(!item.f_money || item.f_money == '0.00') ? '--' : formatNumber(item.f_money)}</span></p>
                                        <p><span className="t">建单人</span><span className="v">{item.f_user_name}({item.f_group_name})</span></p>
                                    </div>)
                            })
                            ):(
                                <div className="no-data-content">
                                    <img className="no-data-img" src={noStagePng} />
                                    <p>太低调了，还没有订单</p>
                                </div>
                            )
                    }
                </div>
                {
                    isMore ? <LoadMore ref='loadMore'/> : null
                }
                 <ActivityIndicator
                    toast
                    text="正在加载"
                    animating={fetching}
                />
            </div>
        )
    }
}


const mapStateToProps = ({ stageReducers }) => ({
    stageReducers,
});

const mapDispatchToProps = dispatch => ({
    stageActions: bindActionCreators(stageActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Stage);
