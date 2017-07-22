import React, {Component, PropTypes} from 'react'
import {Link,withRouter} from 'react-router';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as actionCreators from '../../actions'

import Header from '../../components/Header'
import TableList from '../../components/TableList'

import {Table, Button, Select, Modal, message} from 'antd';
const Option = Select.Option;

import './index.less'

var data = [];

class BroadcastList extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '作者',
                dataIndex: 'f_name',
                width: '11%',
                render: (text, record) => {
                    return (
                        <span  className='title-wrap'>
                             { text }
                        </span>
                    )
                }
            }, {
                title: '标题',
                dataIndex: 'f_title',
                width: '42%',
                render: (text, record) => {
                    return (
                        <span  className='title-wrap'>
                             { text }
                        </span>
                    )
                }
            }, {
                title: '状态',
                dataIndex: 'f_status',
                width: '11%',
                render: (text, record) => {
                    return (
                        <span
                            className={
                            record.f_status == 1
                            ? 'title-wrap draft'
                            : record.f_status == 2
                            ? 'title-wrap published'
                            : 'title-wrap recalled'
                        }>
                        {
                            record.f_status == 1
                            ? '草稿'
                            : record.f_status == 2
                            ? '已发布'
                            : '已撤回'
                        }</span>
                    )
                }
            }, {
                title: '更新时间',
                dataIndex: 'f_mtime',
                width: '20%',
                render: (text, record) => {
                    return (
                        <span  className='title-wrap'>
                                { text }
                        </span>
                    )
                }
            }, {
                title: '操作',
                width: '16%',
                render: (text, record) => {
                    return record.f_status == 2
                        ? (
                            <span className="actions">
                                <span className="act-recall" onClick={() => this.handleRecall(record.f_id)}>撤回</span>
                            </span>
                        )
                        : (
                            <span className="actions">
                                <Link to={'/mzone/broadcast/editor.html?bdid='+record.f_id} className="act-edit">编辑</Link>
                                <span className="act-remove" onClick={() => this.handleRemove(record.f_id)}>删除</span>
                            </span>
                        )
                }
            }
        ];

        this.state = {
            scrollY: 500,
            pageSize: 20,
            loading: true,
            type: 1
        }
    }

    handleChange = (value) => {
        // this.removeChildDom();
        data.splice(0, data.length);
        this.setState({type: value, loading: true})
        this.props.fetchBroadcastList({type: +value});
    }

    handleRecall = (id) => {
        const _this = this;
        Modal.confirm({
            title: '撤回', 
            content: '确认撤回这条广播？',
            onOk: function() {
                _this.props.changeState({
                    bdid: id,
                    status: 3
                })
            }
        })
    }

    handleRemove = (id) => {
        const _this = this;
        Modal.confirm({
            title: '撤回',
            content: '确认删除这条广播？',
            onOk: function () {
                _this.props.changeState({
                    bdid: id,
                    status: 4
                })
            }
        })
    }

    loadMore = () => {
        const curPage = this.props.curPage;
        const type = this.state.type;
        this.props.fetchBroadcastList({page: curPage + 1, type: type})
    }

    removeChildDom = () => {
        const tableDom = document.querySelector('.ant-table-body');
        const childDom = document.querySelector('.no-more-data');
        if(childDom) {
            tableDom.removeChild(childDom);
        }
    }

    resizeFn = () => {
        this.setState({
            scrollY: window.innerHeight - 110,
        })
    }

    componentWillReceiveProps = (nextProps) => {
       if(this.state.loading) {
           this.setState({loading: false})
       }
    }

    componentDidMount = () => {
        const scrollDom = document.querySelector('.ant-table-body');
        const _this = this;
        var flag = true;
        const filter = this.props.filter;
        this.props.fetchBroadcastList({type: filter});
        this.props.bindScrollGetMore(function() {
            if(this.props.noMoreData) {
                return;
            }
            this.loadMore();
        }.bind(this), scrollDom)
        this.setState({
            scrollY: window.innerHeight - 110,
        })
        window.addEventListener('resize', _this.resizeFn)
    }
    
    componentDidUpdate = () => {
        this.removeChildDom();
        const tableDom = document.querySelector('.ant-table-body');
        if(this.props.noMoreData) {
            const div = document.createElement('div');
            div.className = 'no-more-data'
            div.style.cssText = "text-align: center; color: #ccc; line-height: 50px; font-size: 14px;"
            div.innerHTML = '无更多广播';
            tableDom.appendChild(div)
        }
    }

    componentWillUnmount = () => {
        const _this = this;
        window.removeEventListener('resize', _this.resizeFn)
    }
    render() {
        const { pageSize} = this.state;
        const { broadcastList, noMoreData, filter} = this.props;

        const columns = this.columns;
        return (
            <div className="broadcast-list">
                <Header handleChange={this.handleChange} filter={filter}/>
                <TableList
                    loading={this.state.loading}
                    columns={columns}
                    dataSource={broadcastList}
                    pagination={false}
                    scrollY={this.state.scrollY}/>
            </div>
        );
    }
}

BroadcastList.propTypes = {
    broadcastList: PropTypes.array.isRequired,
    noData: PropTypes.bool.isRequired,
    noMoreData: PropTypes.bool.isRequired,
    curPage: PropTypes.number.isRequired,
    filter: PropTypes.number.isRequired,
}

function mapStateToProps(state) {
    return {
        broadcastList: state.broadcastList.broadcastList,
        noData: state.broadcastList.noData, 
        noMoreData: state.broadcastList.noMoreData, 
        curPage: state.broadcastList.curPage,
        filter: state.broadcastList.filter
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BroadcastList))
