import React, { PropTypes } from 'react';
import { Button, Modal } from 'antd';
import ShareRequestItem from './components/ShareRequestItem';

//共享请求列表
class ShareRequestList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalShow: false,
        };
    }
    componentDidMount = () => {
        //获取共享请求数据
        if (this.props.shareList.length <= 0) this.props.shareActions.getShareList(this.props.shareListPageIndex);
        //增加滚动监听函数
        this.refs.list.addEventListener('scroll', this.handleScorll);
        //重置样式
        this.formatList();
    }
    componentDidUpdate = () => {
       this.formatList();
    }
    //重置样式
    formatList=()=>{
        if (this.refs.content.offsetHeight > this.refs.list.offsetHeight && this.refs.content.className.indexOf('fix_list') < 0) {
            this.refs.content.className += 'fix_list'
        }
    }
    //滚动监听函数
    handleScorll = () => {
        if (this.refs.list.offsetHeight + this.refs.list.scrollTop >= this.refs.content.offsetHeight) {
            let pageIndex = this.props.shareListPageIndex;
            if (!this.props.isShareListLoading && !this.props.isShareListLoadOver) {
                this.props.shareActions.getShareList(pageIndex + 1);
            }
        }
    }
    componentWillUnmount = () => {
        //去除滚动监听函数
        this.refs.list.removeEventListener('scroll', this.handleScorll);
    }
    //同意
    onAgreeShare = (crmId, reqId, userId) => {
        return () => {
            this.props.shareActions.setShareRequestComment(crmId, reqId, userId, 1);
        }
    }
    //不同意
    onRejectShare = (crmId, reqId, userId) => {
        return () => {
            this.props.shareActions.setShareRequestComment(crmId, reqId, userId, 2);
        }
    }
    //同意所有
    onAgreeAllShare = () => {
        this.props.shareActions.setAllShareRequestComments();
        this.state.isModalShow = false;
    }
    //取消同意
    onRejectAllShare = () => {
        this.setState({
            isModalShow: false,
        })
    }
    //批量同意确认框
    onAgreeConfirmShow = () => {
        this.setState({
            isModalShow: true,
        })
    }
    render() {
        //滚动提示模块
        let loadText = <li className="loading-item">加载更多</li>;
        if (this.props.isShareListLoading) {
            loadText = <li className="loading-item">正在加载</li>;
        } else if (this.props.isShareListLoadOver) {
            loadText = <li className="loading-item">没有更多了</li>;
        } else if (this.props.shareList.length <= 0) {
            loadText = <div className='no_data_get'><p>暂无客户共享请求</p></div>;
        } else if (this.props.isShareListLoadLess) {
            loadText = null;
        }
        return (
            <div className="mess_tab" style={{ paddingBottom: 60 }}>
                <div className="mess_tab_content" ref="list">
                    <ul ref="content">
                        {
                            this.props.shareList.map(item => {
                                return <ShareRequestItem data={item} key={item.id} onAgree={this.onAgreeShare} onReject={this.onRejectShare} />
                            })
                        }
                        {loadText}
                    </ul>
                </div>
                <div className="share_request_action">
                    同意后，申请人将可查看该客户的全部信息和记录，并可跟进此客户
                    <Button className="white_btn" onClick={this.onAgreeConfirmShow}>批量同意</Button>
                </div>
                <Modal title="删除提示" onOk={this.onAgreeAllShare} onCancel={this.onRejectAllShare} visible={this.state.isModalShow}>
                    确定批量同意共享请求？
                </Modal>
            </div>
        );
    }
}

export default ShareRequestList;
