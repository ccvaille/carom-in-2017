import React, { PropTypes } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    ActivityIndicator,
} from 'antd-mobile';
import { Link } from 'react-router';
import './index.less';
import GoalCard from '../../component/GoalCard'
import RankCard from '../../component/RankCard'
import FunnelCard from '../../component/FunnelCard'
import * as saleIndexActions from '../../actions/saleIndexActions'

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            viewState:0
        }
    }
    componentWillMount() {
    }
    componentDidMount() {
        const { saleIndexActions, saleIndexReducers } = this.props;
        //获取分类数据
        saleIndexActions.getAuth();
    }
    componentWillUnmount() {
        const { saleIndexActions, saleIndexReducers } = this.props;
        saleIndexActions.initState();
    }
        
    componentWillReceiveProps(nextProps) {
        console.log(nextProps.saleIndexReducers);
    }

    toggleView =(value)=>{
        const { saleIndexActions, saleIndexReducers } = this.props;
        saleIndexActions.switchTab(value);
    }

    render = () => {
        let { auth,goalData,funnelData,rankData,tabIndex,fetching, } = this.props.saleIndexReducers;
        return (
            <div className="sale-index">

                <div className="nav">
                    <div className={tabIndex===0?"nav-btn nav-left active":"nav-btn nav-left"} onClick={()=>this.toggleView(0)}><i className="iconfont">&#xe67d;</i>缩略图</div>
                    <div className={tabIndex===1?"nav-btn nav-right active":"nav-btn nav-right"} onClick={()=>this.toggleView(1)}><i className="iconfont">&#xe67c;</i>列表</div>
                </div>
                
                {
                    tabIndex===0?(<div className="detail-view">
                         {auth.target === 0?null:(<Link to="/mobile/sale/app/goalAll"><GoalCard data={goalData} style={{'marginTop':'30px'}}/></Link>)}
                         {auth.rank !== 2?null:(<Link to="/mobile/sale/app/rankAll"><RankCard data={rankData} style={{'marginTop':'30px'}}/></Link>)}
                         {auth.funnel  === 0?null:(<Link to="/mobile/sale/app/funnelAll"><FunnelCard data={funnelData} style={{'marginTop':'30px'}}/></Link>)}
                    </div>):(<div className="list-view">
                        <ul className="items-list">
                            {auth.target === 0?null:(
                                <li>
                                    <Link to="/mobile/sale/app/goalAll">
                                        <i className="iconfont left">&#xe680;</i>
                                        <span className="title">销售目标 (本月)</span>
                                        <i className="iconfont right">&#xe67e;</i>
                                    </Link>
                                </li>
                            )}
                            {auth.rank === 2?(<li>
                                <Link to="/mobile/sale/app/rankAll">
                                    <i className="iconfont left">&#xe681;</i>
                                    <span className="title">业绩贡献排行 (本月)</span>
                                    <i className="iconfont right">&#xe67e;</i>
                                </Link>
                            </li>):null}
                            {auth.funnel  === 0?null:(<li>
                                <Link to="/mobile/sale/app/funnelAll">
                                    <i className="iconfont left">&#xe67f;</i>
                                    <span className="title">销售漏斗 (单量)</span>
                                    <i className="iconfont right">&#xe67e;</i>
                                </Link>
                            </li>)}
                        </ul>
                    </div>)
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

const mapStateToProps = ({ saleIndexReducers }) => ({
    saleIndexReducers,
});

const mapDispatchToProps = dispatch => ({
    saleIndexActions: bindActionCreators(saleIndexActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);
