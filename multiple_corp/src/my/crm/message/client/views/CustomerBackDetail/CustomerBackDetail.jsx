import React, { PropTypes } from 'react';
import { Button,Icon } from 'antd';
import DetailByUserItem from './components/DetailByUserItem';

class CustomerBackDetail extends React.Component {
    static contextTypes = {
        router: PropTypes.object,
    }
    constructor(props) {
        super(props);
        this.state = {
            backId: props.location.query.id,//预警详情ID
            isScrollBackShow:false,//回到顶部按钮是否显示
        }
    }
    componentDidMount() {
        //加载下拉加载方法
        if (this.props.wranDetail.length <= 0)
            this.props.wranAction.getWarnDetail(1);
        this.refs.list.addEventListener('scroll', this.handleScorll);
        //根据是否超出页面重置样式
        this.formatList();
    }
    componentDidUpdate = () => {
        //重置样式
       this.formatList();
    }
    //超出一页增加样式
    formatList=()=>{
        if (this.refs.content.offsetHeight > this.refs.list.offsetHeight && this.refs.content.className.indexOf('fix_list') < 0) {
            this.refs.content.className += 'fix_list'
        }
    }
    //下拉加载方法
    handleScorll = () => {
        if (this.refs.list.offsetHeight + this.refs.list.scrollTop >= this.refs.content.offsetHeight) {
            let pageIndex = this.props.wranDetailPageIndex;
            if (!this.props.isWranDetailLoading && !this.props.isWranDetailLoadOver) {
                this.props.wranAction.getWarnDetail(pageIndex + 1);
            }
        }
        //判断是否显示回到顶部按钮
        if(this.refs.list.scrollTop>300){
            if(!this.state.isScrollBackShow)
            this.setState({
                isScrollBackShow:true,
            });
        }else{
            if(this.state.isScrollBackShow)
            this.setState({
                isScrollBackShow:false,
            })
        }
    }
    componentWillUnmount = () => {
        //去除滑动处理函数
        this.refs.list.removeEventListener('scroll', this.handleScorll);
    }
    //显示更多客户
    onLoadMore = (pageIndex, id) => {
        if (pageIndex >= 0)
            this.props.wranAction.loadWarnMore(pageIndex, id);
        else
            this.props.wranAction.resetWarnMore(id);
    }
    //同意
    onAgreeBack = () => {
        this.props.wranAction.setWarnComment(this.state.backId, true, this.onBack);
    }
    //不同意
    onRejectBack = () => {
        this.props.wranAction.setWarnComment(this.state.backId, false, this.onBack);
    }
    //返回顶部
    onScrollTopClick=()=>{
        this.refs.list.scrollTop=0;
    }
    //返回上级
    onBack = () => {
        this.context.router.goBack();
    }
    render() {
        //修改下拉提示模块
        let loadText = <li className="loading-item">加载更多</li>;
        if (this.props.isWranDetailLoading) {
            loadText = <li className="loading-item">正在加载</li>;
        } else if (this.props.isWranDetailLoadOver) {
            loadText = <li className="loading-item">没有更多了</li>;
        } else if (this.props.wranDetail.length <= 0) {
            loadText = <div className='no_data_get'><p>暂无客户收回详情</p></div>;
        } else if (this.props.isWranDetailLoadLess) {
            loadText = null;
        }
        return (<div className="mess_tab"  style={{ paddingTop: 135 }}>
            <div className="fix_detail" style={{top:'41px'}}>
                <div className="customer_detail_total">
                    <Button size="small" className="white_btn back" onClick={this.onBack} style={{width:'60px'}}>返回</Button>
                    明天待收回客户<span className="mess_bold_text">{this.props.wranDetailLoseNumber}</span>个
                    <Button size="small" className="white_btn right" onClick={this.onRejectBack}>暂不收回</Button>
                    <Button size="small" type="primary" className="right" style={{ marginRight: 10 }} onClick={this.onAgreeBack}>确认收回</Button>
                </div>
                <div className="customer_detail_tablehead">
                    <span className="customer_detail_130" style={{ paddingLeft: 35 }}>员工</span>
                    <span className="customer_detail_230">待回收客户</span>
                    <span className="customer_detail_150">入库时间</span>
                    <span className="customer_detail_150">收回时间</span>
                </div>
            </div>
            <div className="mess_tab_content" ref="list">
                <ul ref="content" >
                    {
                        this.props.wranDetail.map(item => {
                            return <DetailByUserItem key={item.user_id} data={item} onLoadMore={this.onLoadMore} />
                        })
                    }
                    {loadText}
                </ul>
            </div>
            {
              this.state.isScrollBackShow?<div className="customer_detail_backtop" onClick={this.onScrollTopClick}><Icon type="arrow-up" /></div>:null
            }
        </div>);
    }
};

export default CustomerBackDetail;
