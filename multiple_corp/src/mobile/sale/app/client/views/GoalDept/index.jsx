import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    ActivityIndicator,
    Modal, 
    Button,
} from 'antd-mobile';
import { Link,browserHistory } from 'react-router';
import './index.less';
import DepDateFilterPanel from '../../component/depDateFilterPanel'
import LoadMore from '../../component/loadMore'
import ReactEcharts from 'echarts-for-react';
import {formatNumber} from '../../util/utils.js'
import noGoalPng from '../../images/no-goal.png';
import deptPng from '../../images/dept.png';
import moment from 'moment';
import 'moment/locale/zh-cn';
import * as goalDeptActions from '../../actions/goalDeptActions'


class GoalDept extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            
        };
    }
    componentWillUnmount() {
        document.removeEventListener('scroll',this.handleScroll,false); 
        let {goalDeptActions,goalDeptReducers}  = this.props;
        goalDeptActions.initState();
    }

    componentDidMount() {
        document.addEventListener('scroll',this.handleScroll,false);
        let {goalDeptActions,goalDeptReducers}  = this.props;
        let {dept,year,month} = this.props.location.state;
        goalDeptActions.fetchGoalStat({
            users:[{
                name:dept.name,
                parent_id:dept.parentId,
                type:dept.type,
                id:dept.id,
            }],
            m:month,
            year:year,
            show:1
        });

        if (window.__ec_bridge__ && window.__ec_native__) {
            __ec_bridge__.setTitle({
                title: dept.name?(dept.name.length>5?dept.name.slice(0,5)+'...':dept.name):'销售目标'
            }, (result, error) => {
                if (result.code === 0) {
                    console.log('我要更新title了哟');
                }
            })
        }
    }

    componentWillReceiveProps(nextPros){
        let {dept,year,month} = this.props.location.state;
        let nextDept = nextPros.location.state.dept;
        let nextYear = nextPros.location.state.nextYear;
        let nextMonth = nextPros.location.state.nextMonth;
        let {goalDeptActions,goalDeptReducers}  = this.props;

        if(nextDept.id!==dept.id){
            goalDeptActions.fetchGoalStat({
                users:[{
                    name:nextDept.name,
                    parent_id:nextDept.parentId,
                    type:nextDept.type,
                    id:nextDept.id,
                }],
                m:month,
                year:year,
                show:1
            });
        }
        // console.log(this.props.location.state);
        // console.log(nextPros.location.state);
    }

    handleRowClick = (item)=>{
        let {year,month} = this.props.location.state;

        let dept = {
            name:item.name,
            id:item.key,
            parentId:item.parent_id,
            type:item.type
        };

        // type == 1时是部门
        if(item.type===1){
            if(item.children_num===0){
                browserHistory.push({
                    pathname: '/mobile/sale/app/goal/detail/'+item.key,
                    state: { dept:dept,month:month,year:year }
                });
            }
            else{
                browserHistory.push({
                    pathname: '/mobile/sale/app/goal/dept/'+item.key,
                    state: { dept:dept,month:month,year:year }
                });
            }
        }
        // type === 0时为员工
        else if(item.type === 0){
            browserHistory.push({
                pathname: '/mobile/sale/app/goal/detail/'+item.key,
                state: { dept:dept,month:month,year:year }
            });
        }
    }

    linkToDetail=()=>{
        let {dept,month,year} = this.props.location.state;
        browserHistory.push({
            pathname: '/mobile/sale/app/goal/detail/'+dept.id,
            state: { dept:dept,month:month,year:year }
        });
    }

    //下拉加载
    handleScroll=()=>{
        let {goalDeptActions,goalDeptReducers}  = this.props;
        if(goalDeptReducers.isMore){
            let vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            let bottom_dis = ReactDOM.findDOMNode(this.refs.loadMore).getBoundingClientRect().bottom;
            if(bottom_dis-20<=vh){
                goalDeptActions.pageChange(goalDeptReducers.pageIndex + 1);
            }
        }
    }

    render = () => {
        let {pageData,isMore,fetching,...others} = this.props.goalDeptReducers;
        let {dept,month,year} = this.props.location.state;
        return (
            <div className="goal-dept">
                    <ul className="items-list">
                        <li onClick={()=>this.linkToDetail()}>
                            <i className="iconfont left">&#xe664;</i>
                            <span className="title">部门完成情况分析</span>
                            <i className="iconfont right">&#xe67e;</i>
                        </li>
                    </ul>
                    <div className="list-panel" >
                            <table>
                                <thead>
                                    <tr>
                                        <th className="name-title-cell">部门/员工</th>
                                        <th colSpan="2">已完成/目标</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        pageData.map((item,index)=>{
                                            return (
                                                <tr key = {item.key} onClick={()=>{this.handleRowClick(item)}}>
                                                    <td className="name-cell"><img className="avatar" src={item.type===1?deptPng:item.face}/><span className="name">{item.name.length>8?item.name.slice(0,8)+'...':item.name}</span></td>
                                                    <td className="goal-cell"><div className="num"><span className="finished">{item.finished?formatNumber(item.finished):'--'}</span><span className="split-line">/</span><span className="goal">{item.goal?formatNumber(item.goal):'--'}</span></div><div className="progress"><div className="rate-num">{item.finishedRate+"%"}</div><div className="fin-rate" style={{ 'width': item.finishedRate > 100 ? '100%' : ((item.finishedRate<9&&item.finishedRate>0)?'9%':(item.finishedRate + '%') )}}></div></div></td>
                                                    <td className="link-cell"><i className="iconfont">&#xe67e;</i></td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                            {
                                isMore ? <LoadMore ref='loadMore'/> : null
                            }
                    </div>
                    <ActivityIndicator
                        toast
                        text="正在加载"
                        animating={fetching}
                    />
            </div>
        )
    }
}

const mapStateToProps = ({ goalDeptReducers }) => ({
    goalDeptReducers,
});

const mapDispatchToProps = dispatch => ({
    goalDeptActions: bindActionCreators(goalDeptActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(GoalDept);
