import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    ListView,
    RefreshControl,
    ActivityIndicator,
    Modal,
    Button,
} from 'antd-mobile';
import { Link, browserHistory } from 'react-router';
import './index.less';
import DepDateFilterPanel from '../../component/depDateFilterPanel'
import LoadMore from '../../component/loadMore'
import { formatNumber,getDPR } from '../../util/utils.js'
import noRankPng from '../../images/no-rank.png';
import noRankDeptPng from '../../images/no-rank-dept.png';
import firstPng from '../../images/first.png'
import secondPng from '../../images/second.png'
import thirdPng from '../../images/third.png'
import deptPng from '../../images/dept.png';
import moment from 'moment';
import 'moment/locale/zh-cn';
import * as rankActions from '../../actions/rankActions'


class Rank extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            tabIndex:0
        };
    }

    static propTypes = {
        userRankData: PropTypes.object,
        deptRankData:PropTypes.object
    };

    static defaultProps = {
        userRankData: {
            
        },
        deptRankData:{

        }
    };

    componentWillMount() {

    }
    componentDidMount() {
        document.addEventListener('scroll',this.handleScroll,false);
        let { rankActions, rankReducers } = this.props;
        let {dept,year,month} = this.props.location.state;
        rankActions.filterChange({
            year:year,
            month:month,
            dept:dept,
        });
        rankActions.getAuth();
        rankActions.fetchUserRankData({
            users:[{
                name:dept.name,
                parent_id:dept.parentId,
                type:dept.type,
                id:dept.id,
            }],
            year:year,
            m:month,
            show:1
        });
    }
    componentWillUnmount() {
        document.removeEventListener('scroll',this.handleScroll,false); 
        let { rankActions, rankReducers } = this.props;
        rankActions.initState();
    }
    componentWillReceiveProps(nextProps) {
        let { rankActions, rankReducers } = this.props;
    }

    handleFilterChange = (value) => {
        let { rankActions, rankReducers } = this.props;
        let {tabIndex} = rankReducers;
        
        rankActions.filterChange({
            year: value.year,
            month: value.month,
            dept: value.dept,
        });

        // type == 1时是部门
        let users = value.dept.id?[{
                    name:value.dept.name,
                    id:value.dept.id,
                    type:value.dept.type,
                    parent_id:value.dept.parentId
                }]:[];

        if(typeof(value.dept.type)==='undefined'||value.dept.type===1){
            if (tabIndex===0) {
                rankActions.fetchUserRankData({
                    year: value.year,
                    m: value.month,
                    users:users,
                    show:1
                });
            }
            else if(tabIndex===1) {
                rankActions.fetchDeptRankData({
                    year: value.year,
                    m: value.month,
                    users:users,
                });
            }
        }
        //员工
        else if(value.dept.type===0){
            rankActions.switchTab(0);
            rankActions.fetchUserRankData({
                year: value.year,
                m: value.month,
                users:users,
                show:1
            });
        }
    }

    openModal = () => {
        this.setState({
            modalVisible: true
        });
    }
    closeModal = () => {
        this.setState({
            modalVisible: false
        });
    }

    toggleView =(value)=>{
        const { rankActions, rankReducers } = this.props; 
        let { dept, tabIndex, month, year, ...others } = rankReducers;
        rankActions.switchTab(value);

        if(tabIndex===value){
            return;
        }

        let users = dept.id?[{
                    name:dept.name,
                    id:dept.id,
                    type:dept.type,
                    parent_id:dept.parentId
                }]:[];

        if (value===0) {
            rankActions.fetchUserRankData({
                year: year,
                m: month,
                users:users,
                show:1
            });
        }
        else {
            rankActions.fetchDeptRankData({
                year: year,
                m: month,
                users:users,
            });
        }
    }


    //下拉加载
    handleScroll=()=>{
        const { rankActions, rankReducers } = this.props; 
        console.log(rankReducers.pageIndex);
        if(rankReducers.isMore){
            let vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            let bottom_dis = ReactDOM.findDOMNode(this.refs.loadMore).getBoundingClientRect().bottom;
            if((bottom_dis-20)<=vh){
                rankActions.pageChange(rankReducers.pageIndex + 1);
            }
        }
    }

    render = () => {
        let { rankData,pageData, dept, isMore,tabIndex, month, year,auth,fetching, ...others } = this.props.rankReducers;

        return (
            <div className="sale-rank">
                <DepDateFilterPanel
                    dept={dept}
                    year={year}
                    month={month}
                    defaultUser={null}
                    style={{position:'fixed',top:0,right:0,left:0,'zIndex':'666'}}
                    onFilterChange={(value) => this.handleFilterChange(value)}
                />
                <div className="wrapper" onScroll={()=>this.handleScroll()} onTouchStart="">
                    <div className="stat-panel">
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th className="money"><i className="iconfont">&#xe679;</i>金额</th>
                                    <th className="total"><i className="iconfont">&#xe678;</i>单量</th>
                                    <th className="rate"><i className="iconfont">&#xe677;</i>完成率</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="type">总共</td>
                                    <td className="money">{rankData.sumMoney ? formatNumber(rankData.sumMoney) : '--'}</td>
                                    <td className="total">{rankData.sumTotal ? rankData.sumTotal : '--'}</td>
                                    <td className="finishRate">{rankData.eachFinishedRate ? rankData.eachFinishedRate + '%' : '--'}</td>
                                </tr>
                                <tr>
                                    <td className="type">人均</td>
                                    <td className="money">{rankData.eachMoney ? formatNumber(rankData.eachMoney) : '--'}</td>
                                    <td className="total">{rankData.eachTotal ? rankData.eachTotal : '--'}</td>
                                    <td className="finishRate">{rankData.eachFinishedRate ? rankData.eachFinishedRate + '%' : '--'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="list-panel">
                        <div className="tips"><span onClick={() => this.openModal()}><span>业绩贡献排行</span><i className="iconfont">&#xe602;</i></span></div>
                        {
                            auth.dept_num<2?null:(
                                <div className="tabs">
                                    <div className={tabIndex===0?"tab tab-left active":"tab tab-left"} onClick={()=>this.toggleView(0)}>员工</div>
                                    <div className="split-line"></div>
                                    <div className={tabIndex===1?"tab tab-right active":"tab tab-right"} onClick={()=>this.toggleView(1)}>部门</div>
                                </div>
                            )
                        }
                        {
                            pageData && pageData.length > 0 ? (
                                <div className="content">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th colSpan="2" className="name-title-cell">排名</th>
                                                <th>金额</th>
                                                <th>单量</th>
                                            </tr>
                                        </thead>
                                        
                                        <tbody>
                                            {
                                                tabIndex === 0 ? pageData.map((item, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td className="empty-cell"></td>
                                                            <td className="name-cell">{[0, 1, 2,].indexOf(index) > -1 ? (<img className="rank-img" src={{ 0: firstPng, 1: secondPng, 2: thirdPng }[index]} />) : (<span className="index">{index + 1}</span>)}<img className="avatar" src={item.face} /><span className="name">{item.name.length > 6 ? item.name.slice(0, 6) + '...' : item.name}</span></td>
                                                            <td className="performance">{item.money ? formatNumber(item.money) : '--'}</td>
                                                            <td className="quantity">{item.total ? item.total : '--'}</td>
                                                        </tr>
                                                    )
                                                }) : pageData.map((item, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td className="empty-cell"></td>
                                                            <td className="name-cell">{[0, 1, 2,].indexOf(index) > -1 ? (<img className="rank-img" src={{ 0: firstPng, 1: secondPng, 2: thirdPng }[index]} />) : (<span className="index">{index + 1}</span>)}<span className="dept-name">{item.dept_name.length > 6 ? item.dept_name.slice(0, 6) + '...' : item.dept_name}</span></td>
                                                            <td className="performance">{item.money ? formatNumber(item.money) : '--'}</td>
                                                            <td className="quantity">{item.total ? item.total : '--'}</td>
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
                            ) : (
                                    <div className="no-data-content">
                                        <img className="no-data-img" src={tabIndex === 0?noRankPng:noRankDeptPng} />
                                        <p>还没有{tabIndex === 0?'员工':'部门'}，榜单空空的</p>
                                    </div>
                                )
                        }
                    </div>
                </div>
                <Modal
                    className="goal-tips-modal"
                    title="业绩指标说明"
                    transparent
                    platform="ios"
                    maskClosable={false}
                    visible={this.state.modalVisible}
                    onClose={() => this.closeModal()}
                    style={{ width:(getDPR()/2* 645).toFixed(0)+'px', height: 'cross' }}
                    footer={[{ text: '我知道了', onPress: () => { this.closeModal(); } }]}
                >
                    <ul>
                        <li>1、金额：筛选时间内销售金额状态为“结束”时的金额总和；</li>
                        <li>2、单量：筛选时间内销售金额单据个数总和；</li>
                        <li>3、完成率：筛选时间内销售金额状态为“结束”时的金额总和除以“销售目标”；</li>
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


const mapStateToProps = ({ rankReducers }) => ({
    rankReducers,
});

const mapDispatchToProps = dispatch => ({
    rankActions: bindActionCreators(rankActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Rank);
