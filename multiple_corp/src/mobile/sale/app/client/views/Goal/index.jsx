import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom'
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
import ReactEcharts from 'echarts-for-react';
import {formatNumber,getDPR} from '../../util/utils.js'
import LoadMore from '../../component/loadMore'
import noGoalPng from '../../images/no-goal.png';
import peoNoData from '../../images/peo-no-data.png';
import deptPng from '../../images/dept.png';
import moment from 'moment';
import 'moment/locale/zh-cn';
import * as goalActions from '../../actions/goalActions'

let chart1Options = {
    title: [{
        text: '80%',
        left: '47%',
        top: '45%',
        textAlign: 'center',
        textBaseline: 'middle',
        textStyle: {
            color: '#303642',
            fontWeight: 'bold',
            fontSize:(getDPR()/2*40).toFixed(0)
        }
    },
    {
        text: '目标完成率',
        left: '47%',
        top: '60%',
        textAlign: 'center',
        textBaseline: 'middle',
        textStyle: {
            color: '#727C8F',
            fontWeight: 'normal',
            fontSize: (getDPR()/2*22).toFixed(0)
        }
    }],
    series: [{
        hoverAnimation:false,
        name: '饼图二',
        type: 'pie',
        radius: ['80%', '100%'],
        label: {
            normal: {
                show: false
            }
        },
        data: [{
            value: 20,
            name: '缺口率',
            label: {
                normal: {
                    textStyle: {
                        fontSize: (getDPR()/2*90).toFixed(0)
                    }
                }
            },
            itemStyle: {
                normal: {
                    color: '#F76F57'
                },
                emphasis: {
                    color: '#F76F57'
                }
            },
        }, {
            value: 80,
            name: '完成率',
            label: {
                normal: {
                    textStyle: {
                        color: '#555',
                        fontSize: (getDPR()/2*20).toFixed(0)
                    }
                }
            },

            itemStyle: {
                normal: {
                    color: '#60ABF8'
                },
                emphasis: {
                    color: '#60ABF8'
                }
            },
        }]
    }]
};

class Goal extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            modalVisible:false
        };
    }

    static propTypes = {
        goalData:PropTypes.object.isRequired,
    };

    static defaultProps = {
        goalData:{
            tree:[]
        }
    };

    componentWillMount() {
        
    }

    componentDidMount() {
        document.addEventListener('scroll',this.handleScroll,false);
        let {goalActions,goalReducers}  = this.props;
        goalActions.getAuth();
        let {dept,year,month} = this.props.location.state;
        goalActions.filterChange({
            year:year,
            month:month,
            dept:dept,
        });
        let users = dept.id ? [{
                name: dept.name,
                id: dept.id,
                type: dept.type,
                parent_id: dept.parentId
            }] : [];
        goalActions.fetchGoalStat({
            users:users,
            m:month,
            year:year,
            show:1
        });
    }
    componentWillUnmount() {
        document.removeEventListener('scroll',this.handleScroll,false); 
        let {goalActions,goalReducers}  = this.props;
        goalActions.initState();
    }
    componentWillReceiveProps(nextProps) {
        let {goalActions,goalReducers}  = this.props;
    }

    handleFilterChange=(value)=>{
        let {goalActions,goalReducers}  = this.props;
        
        browserHistory.replace({
            pathname: '/mobile/sale/app/goal/',
            state:{
                year:value.year,
                month:value.month,
                dept:value.dept
            }
        });

        goalActions.filterChange({
            year:value.year,
            month:value.month,
            dept:value.dept,
        });

        let users = value.dept.id ? [{
            name: value.dept.name,
            id: value.dept.id,
            type: value.dept.type,
            parent_id: value.dept.parentId
        }] : [];
        //如果是个人权限
        if(goalReducers.auth.target === 1){
            goalActions.fetchGoalStat({
                year:value.year,
                m:value.month,
                users:[],
                show:1,
            });
        }
        //如果是销售经理权限
        else if(goalReducers.auth.target === 2){
            goalActions.fetchGoalStat({
                year:value.year,
                m:value.month,
                users:users,
                show:1,
            });
        }        
    }


    renderWarnText = (data) => {
        let {month,year,...others} = this.props.goalReducers;
        if (data && data.sumGoal) {
            let rate = (data.sumFinished / data.sumGoal * 100).toFixed(0);
            let date = new Date();
            let currentYear = date.getFullYear();
            let currentMonth = date.getMonth() + 1;

            let isShowWarn = false;
            let monthStr = (moment().quarter().toString() + moment().quarter().toString() + moment().quarter().toString());
            if (currentYear == year && month == '000') {
                isShowWarn = true;
            }
            if (currentYear == year && month == monthStr) {
                isShowWarn = true;
            }
            if (currentYear == year && month == currentMonth) {
                isShowWarn = true;
            }

            let timeName = '';
            let daysDiff = 1;
            if (month == '000') {
                timeName = '本年';
                daysDiff = moment().endOf('year').diff(moment(), 'days');
            }
            else if (month == '111' || month == '222' || month == '333' || month == '444') {
                timeName = '本季度';
                daysDiff = moment().endOf('quarter').diff(moment(), 'days');
            }
            else {
                timeName = '本月';
                daysDiff = moment().endOf('month').diff(moment(), 'days');
            }

            if (isShowWarn) {
                if (rate < 100) {
                    return (
                        <div className="warn-less">
                            <i className="icon iconfont">&#xe670;</i>离目标金额完成还差<span className="money">{formatNumber((data.sumGoal - data.sumFinished).toFixed(2))}</span> ，{timeName}接下来平均每天至少要成交<span className="money">{formatNumber(((data.sumGoal - data.sumFinished) / daysDiff).toFixed(2))}</span>的金额才能达标
                        </div>
                    );
                }
                else if (rate > 100 && rate < 105) {
                    return (
                        <div className="warn-good"><i className="icon iconfont">&#xe687;</i><span>太棒了！{timeName}已完成目标！</span><i className="icon iconfont">&#xe687;</i></div>
                    )
                }
                else {
                    return (
                        <div className="warn-awesome"><i className="icon iconfont">&#xe687;</i><span>简直小宇宙爆发！{timeName}已超额完成目标！</span><i className="icon iconfont">&#xe687;</i></div>
                    )
                }
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }

    openModal=()=>{
        this.setState({
            modalVisible:true
        });
    }
    closeModal=()=>{
        this.setState({
            modalVisible:false
        });
    }

    //下拉加载
    handleScroll=()=>{
        let {goalActions,goalReducers}  = this.props;
        if(goalReducers.isMore){
            let vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            let bottom_dis = ReactDOM.findDOMNode(this.refs.loadMore).getBoundingClientRect().bottom;
            if((bottom_dis-20)<=vh){
                goalActions.pageChange(goalReducers.pageIndex + 1);
            }
        }
    }

    handleRowClick = (item)=>{
        let {month,year} = this.props.goalReducers;

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

    render = () => {
        let {goalData,dept,auth,month,year,fetching,pageData,isMore,...others} = this.props.goalReducers;

        if (goalData.sumGoal) {
            let goalRate = (goalData.sumFinished / goalData.sumGoal * 100).toFixed(2);
            chart1Options.title[0].text = goalRate+'%';
            chart1Options.title[1].text = '目标完成率';

            if(goalRate  > 1000 ){
                chart1Options.title[0].textStyle.fontSize = (getDPR()/2*30).toFixed(0) ;
            }
            else if(goalRate  > 100 ){
                chart1Options.title[0].textStyle.fontSize = (getDPR()/2*40).toFixed(0) ;
            }
            
            chart1Options.series[0].data[0].value =goalRate > 100 ? 0 : 100 -goalRate;
            chart1Options.series[0].data[1].value = goalRate > 100 ? 100 : goalRate;

            chart1Options.series[0].data[1].itemStyle={
                    normal: {
                        color: '#60ABF8'
                    },
                    emphasis: {
                        color: '#60ABF8'
                    }
            }
        }
        else {
            chart1Options.title[0].text = '--';
            chart1Options.series[0].data[0].value = 0;
            chart1Options.series[0].data[1].value = 100;

            chart1Options.series[0].data[1].itemStyle={
                    normal: {
                        color: '#DADDE3'
                    },
                    emphasis: {
                        color: '#DADDE3'
                    }
            }

        }

        return (
            <div className="sale-goal">
                <DepDateFilterPanel
                    dept={dept}
                    year={year}
                    month={month}
                    style={{position:'fixed',top:0,right:0,left:0,'zIndex':'666'}}
                    defaultUser = {auth.target===1?auth.name:null}
                    onFilterChange={(value)=>this.handleFilterChange(value)}
                />
                <div className="wrapper">
                    <div className="chart-panel">
                        <div className="tips"><span onClick={()=>this.openModal()}><span>指标说明</span><i className="iconfont">&#xe602;</i></span></div>
                        {
                            (typeof goalData.sumGoal==='undefined')||(goalData&&goalData.sumFinished===0&&goalData.sumGoal===0&&goalData.sumUnFinished===0)?
                            (<div className="no-data-content">
                            <img className="no-data-img" src={noGoalPng} />
                            <p>还没有目标，快去设置目标吧</p>
                        </div>):(
                            <div  className="content">
                                <div className="chart">
                                    <ReactEcharts
                                        option={chart1Options}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        showLoadin g={false}
                                        loadingOption={'default',{
                                            text:''
                                        }}
                                        style={{ 'width': getDPR()/2*220+'px', 'height': getDPR()/2*220+'px','margin':'0 auto' }} />
                                </div>
                                <div className="stat">
                                    <div className="goal">
                                        <i className="icon iconfont">&#xe66c;</i>
                                        <span className="t1">目标</span>
                                        <span className="t2">{goalData.sumGoal ? formatNumber(goalData.sumGoal) : '--'}</span>
                                    </div>
                                    <div className="finished">
                                        <i className="icon"></i>
                                        <span className="t1">已完成</span>
                                        <span className="t2">{goalData.sumFinished ? formatNumber(goalData.sumFinished) : '--'}</span>
                                    </div>
                                    <div className="unfinished">
                                        <i className="icon"></i>
                                        <span className="t1">缺口</span>
                                        <span className="t2">{goalData.sumUnFinished ? formatNumber(goalData.sumUnFinished) : '--'}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                        {
                            this.renderWarnText(goalData)
                        }
                    </div>
                        
                    

                    <div className="list-panel">
                        <div className="panel-header">
                            目标完成明细
                        </div>
                        {
                            pageData&&pageData.length>0?(
                            <div className="list-content">
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
                        ):(<div className="no-data-content">
                                <img className="no-data-img" src={peoNoData} />
                                <p>太低调了，还没有员工</p>
                        </div>)
                        }
                    </div>
                </div>
                <Modal
                    className ="goal-tips-modal"
                    title="销售目标指标说明"
                    transparent
                    platform="ios"
                    maskClosable={false}
                    visible={this.state.modalVisible}
                    onClose={()=>this.closeModal()}
                    style={{width:(getDPR()/2* 645).toFixed(0)+'px',height: 'cross'}}
                    footer={[{ text: '我知道了', onPress: () => { this.closeModal(); }}]}
                    >
                    <ul>
                        <li>1、目标：管理员为部门/员工设置的销售目标</li>
                        <li>2、已完成：销售金额状态为“结束”时金额总和</li>
                        <li>3、完成率：“已完成”除以“目标”</li>
                        <li>4、缺口：在已经实现的基础上与原定目标的差距</li>
                    </ul>
                </Modal>
                <ActivityIndicator
                    toast
                    text="正在加载"
                    animating={fetching}
                />
            </div>
            
        )
    }
}


const mapStateToProps = ({ goalReducers }) => ({
    goalReducers,
});

const mapDispatchToProps = dispatch => ({
    goalActions: bindActionCreators(goalActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Goal);
