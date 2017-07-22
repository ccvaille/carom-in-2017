import React, { PropTypes } from 'react';
import { Router, browserHistory, Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import fetch from 'isomorphic-fetch';
import { message } from 'antd';

import Cookie from 'react-cookie';
import { DatePicker, Popover, Select } from 'antd';

import CrmMessage from '../../../components/CrmMessage';
import NoContent from '../../../components/NoContent';
import ErrorMessage from '../../../components/Error';
import { default as mapDispatchToProps } from '../../../actions/index';

import ReactEcharts from 'echarts-for-react';

const Option = Select.Option;

var url = 'http://static.workec.com/ecapp/share/get'

class ViewMessage extends React.Component {

    componentWillMount() {
        this.props.fetchCrmmsgMessage();
    }

    componentDidUpdate() {
        //滚动到当前窗口，需要异步处理一下
        var needShowIndex = this.props.crmmsgData.needShowIndex;
        if (needShowIndex) {
            setTimeout(function () {
                if (this.props.crmmsgData.isFirstPage) {
                    window.scrollTo(0, 20000);
                } else {
                    this.refs["item_" + needShowIndex].scrollIntoView();
                }
                this.props.resetShowIndex();
            }.bind(this), 200);
        }
    }

    componentDidMount() {
        this.props.bindScrollGetMore(function () {
            var state = this.props.crmmsgData;
            if (state.end == 0 || state.loading) {
                return;
            }
            var params = {type: state.crmType, begin_id: state.list[0].id, begin_time: state.list[0].create_time};
            this.props.fetchCrmmsgMessage(params)
        }.bind(this));
    }

    handleChange(value) {
        this.props.fetchCrmmsgMessage({type: value});
    }

    render() {
        var state = this.props.crmmsgData;

        /*var msgSelect = <div className="msg-type-select">
            <Select defaultValue="0" style={{ width: 110 }} onChange={(value) => this.handleChange(value)} dropdownClassName="select-fixed">
                <Option value="0">全部类型</Option>
                <Option value="11">新增客户</Option>
                <Option value="12">删除客户</Option>
                <Option value="13">放弃客户</Option>
                <Option value="14">转让客户</Option>
                <Option value="15">领取分配客户</Option>
                <Option value="16">合并客户</Option>
                <Option value="17">共享客户</Option>
                <Option value="18">导出客户</Option>
                <Option value="19">导出报表</Option>
            </Select>
        </div>*/

        var loading = <div className="ecTeam-box ecTeam-box-sno">
            <div className="more-btn loading">
                <div>正在加载中...</div>
            </div>
        </div>

        var hasMore = <div className="ecTeam-box ecTeam-box-sno">
            <div className="more-btn">
                <a href="javascript:;" onClick={() => this.props.fetchCrmmsgMessage({type: state.type, begin_id: state.list[0].id, begin_time: state.list[0].create_time})}>查看更多消息</a>
            </div>
        </div>

        var noMessage = <div className="ecTeam-box ecTeam-box-sno">
            <NoContent />
        </div>

        //首屏出错
        if (state.emptyError) {
            return <ErrorMessage getData={this.props.fetchCrmmsgMessage} />
        }

        //没有消息
        if (state.list.length == 0 && state.end == 0 && state.loading == false) {
            return <div>
                {
                    noMessage
                }
            </div>
        }

        return <div>
            {
                state.loading ?
                    loading//正在加载更多消息
                    :
                    state.end == 0
                        ?
                        ""//没有更多
                        :
                        hasMore//有更多消息
            }
            
            {
                state.list && state.list.map((item, index) => {
                    return (<div data-index={index} ref={"item_" + index}>
                        <CrmMessage data={item} reqData={state.reqData} userid={state.userid} />
                    </div>)
                })
            }
        </div>

    }
}


const mapStateToProps = (state) => {
    return {
        crmmsgData: state.crmmsgData
    }
};


ViewMessage.contextTypes = {
    // crmmsgData: PropTypes.object.isRequired,
    //history: PropTypes.object.isRequired,
    //store: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewMessage);

