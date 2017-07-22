import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import './index.less';
import { formatNumber } from '../../util/utils.js'
import moment from 'moment';
import 'moment/locale/zh-cn';
import * as billDetailActions from '../../actions/billDetailActions'
import {
    ActivityIndicator
} from 'antd-mobile';

class BillDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }
    componentWillMount() {

    }
    componentDidMount() {
        let { billDetailActions, billDetailReducers } = this.props;
        billDetailActions.fetchBillDetail({
            saleid:this.props.params.id[1],
        });

    }
    componentWillUnmount() {
        let { billDetailActions, billDetailReducers } = this.props;
        billDetailActions.initState();
        clearInterval(this.interval);
    }
    componentWillReceiveProps(nextProps) {
        let { billDetailActions, billDetailReducers } = this.props;
    }
    linToDetail=(item)=>{
        browserHistory.push({
            pathname: '/mobile/sale/app/funnel/stage/'+item.sid+'/detail',
            state: { 
                sname:item.sname,
                total:item.total,
                sid:item.sid
            }
        });
    }
    render = () => {
        let { billDetail,fetching,...others } = this.props.billDetailReducers;
        return (
            <div className="bill-detail">
                <div className="card">
                    <div className="header">
                        <p><span className="t">客户</span><span className="v">{billDetail.crmname}</span></p>
                    </div>
                    <div className="content">
                        <p><span className="t">编号</span><span className="v">{billDetail.numcode}</span></p>
                        <p><span className="t">建单时间</span><span className="v">{billDetail.create_time}</span></p>
                        <p><span className="t">最后更新时间</span><span className="v">{billDetail.change_time}</span></p>
                        <p><span className="t">建单人</span><span className="v">{billDetail.username}</span></p>
                    </div>
                </div>
                {
                    billDetail&&billDetail.fields&&billDetail.fields.length>0?(
                        billDetail.fields.map((item_1,index_1)=>{
                            return (
                                <div className="card">
                                    <div className="title">
                                        {item_1.groupname}
                                    </div>
                                    <div className="content">
                                        {
                                            item_1.fields&&item_1.fields.length>0?(
                                                item_1.fields.map((item_2,index_2)=>{
                                                    if(item_2.value){
                                                        if(['8','10','11'].indexOf(item_2.type)>-1){
                                                            return (
                                                                <p><span className="t">{item_2.name}</span><span className="v">{item_2.params.filter((item_3,index_3)=>{return item_3.key==item_2.value})[0].value}</span></p>
                                                            )
                                                        }
                                                        else if(item_2.stype==4){
                                                            return (
                                                                    <p><span className="t">{item_2.name}</span><span className="v">{formatNumber(item_2.value)}</span></p>
                                                                )
                                                        }
                                                        else{
                                                            if(item_2.value){
                                                                return (
                                                                    <p><span className="t">{item_2.name}</span><span className="v">{item_2.value}</span></p>
                                                                )
                                                            }
                                                        }
                                                    }
                                                    else{
                                                        return null;
                                                    }
                                                    
                                                })
                                            ):null
                                        }
                                    </div>
                                </div>
                                )
                        })
                    ):null
                }
                <ActivityIndicator
                    ref= 'activityIndicator'
                    toast
                    text="正在加载"
                    animating={fetching}
                />
            </div>
        )
    }
}


const mapStateToProps = ({ billDetailReducers }) => ({
    billDetailReducers,
});

const mapDispatchToProps = dispatch => ({
    billDetailActions: bindActionCreators(billDetailActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(BillDetail);
