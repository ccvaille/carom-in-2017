import React, { PropTypes } from 'react';
import { Button } from 'antd';
import WarnInfoItem from './components/WarnInfoItem';
import urlConfig from '../../config'


class WarnInfoList extends React.Component {
    static contextTypes = {
        router: PropTypes.object,
    }
    constructor(props) {
        super(props);
    }
    componentDidMount = () => {
        //获取数据
        if (this.props.wranList.length <= 0) this.props.wranActions.getWarnList(this.props.wranListPageIndex);
        //添加滚动监听
        this.refs.list.addEventListener('scroll', this.handleScorll);
        //重置样式
        this.formatList();
    }
    componentDidUpdate = () => {
        //重置样式
        this.formatList();
    }
    //重置样式
    formatList = () => {
        if (this.refs.content.offsetHeight > this.refs.list.offsetHeight && this.refs.content.className.indexOf('fix_list') < 0) {
            this.refs.content.className += 'fix_list'
        }
    }
    //滚动监听
    handleScorll = () => {
        if (this.refs.list.offsetHeight + this.refs.list.scrollTop >= this.refs.content.offsetHeight) {
            let pageIndex = this.props.wranListPageIndex;
            if (!this.props.iswranListLoading && !this.props.isWranListLoadOver) {
                this.props.wranActions.getWarnList(pageIndex + 1);
            }
        }
    }
    componentWillUnmount = () => {
        //去除滚动监听
        this.refs.list.removeEventListener('scroll', this.handleScorll);
    }
    //查看预警详情
    onCheckCustomer = (number, id) => {
        return () => {
            this.context.router.push({
                pathname: urlConfig.customerBackDetail,
                query: {
                    id,
                }
            });
        }
    }
    //同意
    onAgreeBack = (id) => {
        return () => {
            this.props.wranActions.setWarnComment(id, true);
        }
    }
    //不同意
    onRejectBack = (id) => {
        return () => {
            this.props.wranActions.setWarnComment(id, false);
        }
    }
    //查看其他页面
    onLookClick = () => {
        if (window.parent && window.parent.crmActObj && window.parent.crmActObj.msgBox && window.parent.crmActObj.msgBox.goOtherPath) {
            window.parent.crmActObj.msgBox.goOtherPath('/crm/lose');
        }else if (window.parent && window.parent.pc10Obj && window.parent.pc10Obj.msgBox && window.parent.pc10Obj.msgBox.goOtherPath) {
            window.parent.pc10Obj.msgBox.goOtherPath('/crm/lose');
        }
    }
    render() {
        let listView = [], firstItem = this.props.wranList[0] || { lose_number: 0 };
        if (this.props.wranList.length > 1) {
            for (let i = 1, len = this.props.wranList.length; i < len; i++) {
                let item = this.props.wranList[i];
                listView.push(<WarnInfoItem
                    key={i}
                    data={item}
                    goDetail={this.onCheckCustomer}
                    agreeBack={this.onAgreeBack}
                    rejectBack={this.onRejectBack} />)
            }
        }
        let loadText = <li className="loading-item">加载更多</li>;
        if (this.props.iswranListLoading) {
            loadText = <li className="loading-item">正在加载</li>;
        } else if (this.props.isWranListLoadOver) {
            loadText = <li className="loading-item">没有更多了</li>;
        } else if (this.props.wranList.length <= 1 && firstItem.lose_number === 0) {
            loadText = <div className='no_data_get'><p>暂无客户收回通知</p></div>;
        } else if (this.props.wranList.length <= 1 && firstItem.lose_number >= 0) {
            loadText = null;
        } else if (this.props.isWranlistLoadLess) {
            loadText = null;
        }
        return (
            <div className="mess_tab" style={firstItem.lose_number <= 0 ? null : { paddingTop: 120 }}>
                {
                    firstItem.lose_number <= 0 ? null :
                        <div className="warn_info_item fix_sigle_line fix_detail" style={{ padding: '0 20px', border: 'none', lineHeight: '80px' }}>
                            <div className="detail" style={{ borderBottom: 'solid 1px #e0e8f6' }} >
                                <p className="content">有<span className="mess_bold_text">{firstItem.lose_number}</span>位客户即将被收回</p>
                                <div className="item_action">
                                    <Button size="small" type="primary" onClick={this.onLookClick}>查看</Button>
                                </div>
                            </div>
                        </div>
                }
                <div className="mess_tab_content" ref="list">
                    <ul ref="content" >
                        {listView}
                        {loadText}
                    </ul>
                </div>
            </div>
        );
    }
}
export default WarnInfoList;
