import React from 'react';
import { connect } from 'react-redux';
import '../ECTeam/index.less';


class CustomerSharing extends React.Component {

    pvCB(command, data) {
        console.log(command + ":" + JSON.stringify(data));
    }

    showCustomerInfo(e, url, name) {
        e.stopPropagation();
        this.props.openPV({
            url: url,
            title: '客户资料-' + name,
            width: "970",
            height: "700",
            needLogin: "1",
            status: 'max',
            callback: this.pvCB
        });
    }

    //打开共享给我的客户
    showSharePV() {
        var url = "https://my.workec.com/crm?f=share&ecuserid=" + this.props.data.f_req_uid;

        this.props.openPV({
            url: url,
            title: '我的客户',
            width: "970",
            height: "700",
            needLogin: "1",
            status: 'max',
            callback: this.pvCB
        });
    }

    openChatWindow(e, uid, name) {
        e.stopPropagation();
        this.props.openChatWindow({
            uid: uid,
            name: name,
            callback: this.pvCB
        });
    }

    //同意或者拒绝请求
    doReq(operator) {
        if (this.props.reqData) {
            console.log("正在请求");
            return;
        }
        var data = this.props.data;
        var url = 'https://my.workec.com/ecapp/share/doreq';
        var crmid = data.f_crm_id;
        var act = operator;
        var reqid = data.f_req_id;
        var requid = data.f_req_uid;
        this.props.operateShareRequest({
            crmid: crmid,
            act: act,
            reqid: reqid,
            requid: requid
        });
    }

    render() {
        var data = this.props.data;
        var f_req_uid = data.f_req_uid;
        var that = this;
        //共享客户
        var toMeMessage =
            <div className="msg-box">
                <p className="time">{data.f_create_time}</p>
                <div className="inner-box" onClick={() => this.showSharePV()}>
                    <div className="header">共享通知</div>
                    <div className="content-box">
                        <a className="name" data-uid={data.f_req_uid} onClick={(e) => { this.openChatWindow(e, data.f_req_uid, data.uname) } }>{data.uname}</a>
                        给你共享了
                        <span className="font-red" >{data.sharelist.length}</span>
                        个客户，已放入客户库
                        <p className="list">
                            {
                                data.sharelist.map(function (item, index, arr) {
                                    var pvHref = "13-" + f_req_uid + "-" + item.crm_id + "-9-";
                                    var href = "http://my.workec.com/crm/detail?crmid=" + item.crm_id + "&t=9&f=";
                                    return <a className="name"
                                        data-href={pvHref}
                                        data-url={window.PVFunction ? pvHref : href}
                                        onClick={(e) => that.showCustomerInfo(e, href, item.crm_name)}>
                                        {item.crm_name}
                                    </a>
                                })
                            }
                        </p>
                    </div>
                    <p className="btn-bot">
                        <a className="bot-more" href="javascript:;" onClick={() => this.showSharePV()}>查看详情</a>
                    </p>
                </div>
            </div>

        //请求共享客户
        var toOtherMessage =
            <div className="msg-box">
                <p className="time">{data.f_create_time}</p>
                <div className="inner-box no-link">
                    <div className="header">共享请求</div>
                    <div className="content-box">
                        <a className="name" data-uid={data.f_req_uid} onClick={(e) => { this.openChatWindow(e, data.f_req_uid, data.uname) } }>{data.uname}</a>
                        请求共享客户
                        {
                            data.sharelist.map(function (item, index, arr) {
                                var pvHref = "13-" + f_req_uid + "-" + item.crm_id + "-9-";
                                var href = "http://my.workec.com/crm/detail?crmid=" + item.crm_id + "&t=9&f=";
                                return <a className="name"
                                    data-href={pvHref}
                                    data-url={window.PVFunction ? pvHref : href}
                                    onClick={(e) => that.showCustomerInfo(e, href, item.crm_name)}>
                                    {item.crm_name}
                                </a>
                            })
                        }
                        <p className="sm-tips">附加信息：{data.f_msg}
                            <br/>
                            同意后，{data.uname}将可查看该客户的全部信息和记录，并可跟进此客户</p>
                    </div>
                    {
                        data.f_status == 0 ?
                            <p className="btn-bot">
                                <div>
                                    <a href="javascript:;" style={{marginRight:"20px"}} onClick={() => this.doReq(1)}>同意</a>
                                    <a href="javascript:;" onClick={() => this.doReq(2)}>拒绝</a>
                                </div>
                            </p>
                            :
                            data.f_status == 1 ?
                                <div className="btn-bot">
                                    <div className="bot-state">已同意</div>
                                </div>
                                :
                                <div className="btn-bot">
                                    <div className="bot-state">已拒绝</div>
                                </div>
                    }
                </div>
            </div>
            
        //您请求别人共享
        var pleaseShareToMe = (function () {
            var pvHref = "13-" + f_req_uid + "-" + data.sharelist[0].crm_id + "-9-";
            var href = "https://my.workec.com/crm/detail?crmid=" + data.sharelist[0].crm_id + "&t=9&f=";
            var name = data.sharelist[0].crm_name;

            return <div className="msg-box">
                <p className="time">{data.f_create_time}</p>
                <div className={data.f_status == 1 ? 'inner-box' : 'inner-box no-link'} onclick={() => { data.f_status == 1 ? this.showSharePV() : '' }}>
                    <div className="header">共享请求</div>
                    <div className="content-box">
                        您向
                    <a className="name" data-uid={data.f_rev_uid} onClick={(e) => { this.openChatWindow(e, data.f_rev_uid, data.uname) } } >
                            {data.uname}</a>
                        发起将客户
                    {
                            data.f_status == 1 ?
                                <a className="name" data-url={pvHref}
                                    onClick={(e) => that.showCustomerInfo(e, href, name)}>{data.sharelist[0].crm_name}</a>
                                :
                                <a className="no-hand name">{data.sharelist[0].crm_name}</a>
                        }
                        共享给您的请求已被
                    {data.f_status == 1 ? "接受" : "拒绝"}
                    </div>
                    {
                        data.f_status == 1 ?
                            <div className="btn-bot">
                                <div className="bot-more" onClick={() => this.showSharePV()}>查看详情</div>
                            </div>
                            :
                            <div className="btn-bot">
                                <div className="bot-state">被拒绝</div>
                            </div>
                    }
                </div>
            </div>
        }.bind(this))();

        if (data.f_type == 1) {//别人请求您共享
            return <div className="ecTeam-box share-box-ou">{toOtherMessage}</div>
        } else if (data.f_type == 2) {//别人共享给您
            return <div className="ecTeam-box share-box-ou">{toMeMessage}</div>
        } else if (data.f_type == 3) {//您请求别人共享
            return <div className="ecTeam-box share-box-ou">{pleaseShareToMe}</div>
        }
    }
}

const mapStateToProps = (state) => {
    //const obj = Object.assign({}, state.historyData);
    const obj = {};
    return obj;
};


CustomerSharing.contextTypes = {
    //history: PropTypes.object.isRequired,
    //store: PropTypes.object.isRequired
};

import { default as mapDispatchToProps } from '../../actions/index';

export default connect(mapStateToProps, mapDispatchToProps)(CustomerSharing);