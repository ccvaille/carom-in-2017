import React from 'react';
import { connect } from 'react-redux';
import '../ECTeam/index.less';
import crypto from 'crypto';

class CrmMessage extends React.Component {

    pvCB(command, data) {
        console.log(command + ":" + JSON.stringify(data));
    }

    showCustomerInfo(e, url, title, id) {
        e.stopPropagation();
        var path = "my.workec.com/crm/detail,crmid=" + id;
        var key = crypto.createHash('md5').update(path).digest('hex');
        this.props.openPV({
            url: url,
            key: key,
            title: title,
            width: "970",
            minButton: "1",
            maxButton: "1",
            height: "700",
            needLogin: "1",
            status: 'max',
            callback: this.pvCB
        });
    }

    //打开共享给我的客户
    showSharePV() {
        var url = "https://my.workec.com/crm?f=share";

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

    // 打开CRM明细
    showDetailPV(title) {
        var data = this.props.data;
        var url = "https://my.workec.com/crm/msg/msgdetail?msgId=" + data.id + "&createTime=" + data.create_time;
        var title = data.title + '明细';
        if(data.stype == 171004) {
            title = '取消共享明细';
        }
        
        this.props.openPV({
            url: url,
            title: title,
            width: "600",
            height: "420",
            minButton: "1",
            status: 'max',
            callback: this.pvCB
        });
    }

    showImportPV() {
        var url = "https://my.workec.com/crm/import/record";

        var path = "my.workec.com/crm/user/newuser";
        var key = crypto.createHash('md5').update(path).digest('hex');
        
        this.props.openPV({
            url: url,
            key: key,
            title: '新增客户',
            width: "900",
            height: "600",
            minButton: "1",
            maxButton: "1",
            needLogin: "1",
            status: 'max',
            callback: this.pvCB
        });
    }

    showExportPV() {
        var url = "https://my.workec.com/work/export/log";
        var path = "my.workec.com/work/crmpic/index";
        var key = crypto.createHash('md5').update(path).digest('hex');
        
        this.props.openPV({
            url: url,
            title: '销售管理',
            width: "980",
            height: "660",
            minButton: "1",
            maxButton: "1",
            needLogin: "1",
            status: 'max',
            key: key,
            callback: this.pvCB
        });
    }

    openChatWindow(e, uid, name) {
        e.stopPropagation();
        this.props.openChatWindow({
            type: '1',
            uid: uid + '',
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
        var msgId = this.props.data.id;
        var createTime = this.props.data.create_time;
        var doType = operator;
        this.props.operateCrmmsgRequest({
            msg_id: msgId,
            time: createTime,
            do_type: doType
        });
    }

    render() {
        var data = this.props.data;
        var that = this;
        var temp = [], 
            tempHref,
            msgString = data.msg,
            msgType = parseInt(data.type),
            msgStype = parseInt(data.stype);

        for(let i = 0, j = data.msg_data.length; i < j; i++) {
            if(data.msg_data[i].type == 0) {
                temp[i] = <a className="name" 
                            onClick={(e) => { this.openChatWindow(e, data.msg_data[i].id, data.msg_data[i].name) } } 
                            title="发起会话">
                            {data.msg_data[i].name}
                        </a>
            } else if(data.msg_data[i].type == 1) {
                tempHref = "http://my.workec.com/crm/detail?crmid=" + data.msg_data[i].id + "&t=9&f=";
                temp[i] = <a className="name"
                            title="查看客户资料"
                            onClick={(e) => this.showCustomerInfo(e, tempHref, '客户资料', data.msg_data[i].id)}>
                            {data.msg_data[i].name}
                        </a>
            } else if(data.msg_data[i].type == 2) {
                tempHref = "https://my.workec.com/crm/corp/detail?cid=" + data.msg_data[i].id;
                temp[i] = <a className="name"
                            title="查看公司资料"
                            onClick={(e) => this.showCustomerInfo(e, tempHref, '公司资料', data.msg_data[i].id)}>
                            {data.msg_data[i].name}
                        </a>
            } else if(data.msg_data[i].type == 4) {
                temp[i] = <span className="font-num">
                            {data.msg_data[i].name}
                        </span>
            } else if(data.msg_data[i].type == 3) {
                temp[i] = <span className="plain-text">
                            {data.msg_data[i].name}
                        </span>
            } else if(data.msg_data[i].type == 5) {
                temp[i] = <span className="plain-text no-space">【{data.msg_data[i].name}】</span>
            } 
        }

        var msgArray = (msgString ? msgString.split('%s') : []);
        var msgCombineArray = [];
        for(let i = 0, j = msgArray.length; i < j; i++) {
            msgCombineArray.push(msgArray[i])
            msgCombineArray.push(temp[i])
        }
        msgString = <p>
                    {
                        msgCombineArray
                    }
                </p> 
        

        //  新增客户 EXCEL导入，导入给自己、导入给同事、导入到公共库
        var addCustomer =
            <div className="msg-box" >
                <p className="time">{data.create_time}</p>
                <div className="inner-box" onClick={() => this.showImportPV()}>
                    <div className="header">{data.title}</div>
                    <div className="content-box">
                        {
                            msgString
                        }
                    </div>
                    <p className="btn-bot">
                        <a className="bot-more" href="javascript:;" >查看详情</a>
                    </p> 
                </div>
            </div>

        //  新增客户 同事为我导入
        var addCustomerToMe =
            <div className="msg-box" >
                <p className="time">{data.create_time}</p>
                <div className="inner-box" onClick={() => this.showDetailPV()}>
                    <div className="header">{data.title}</div>
                    <div className="content-box">
                        {
                            msgString
                        }
                    </div>
                    <p className="btn-bot">
                        <a className="bot-more" href="javascript:;">查看详情</a>
                    </p> 
                </div>
            </div>

        //  新增公司 ，qq导入
        var addCorp =
            <div className="msg-box">
                <p className="time">{data.create_time}</p>
                <div className="inner-box no-link">
                    <div className="header">{data.title}</div>
                    <div className="content-box">
                        {
                            msgString
                        }
                    </div>
                </div>
            </div>

        // 删除客户
        var deleteCustomer =
            <div className="msg-box" >
                <p className="time">{data.create_time}</p>
                <div className="inner-box" onClick={() => this.showDetailPV()}>
                    <div className="header">{data.title}</div>
                    <div className="content-box">
                        {
                            msgString
                        }
                        <p className="list">
                            {
                                data.list.map(function (item) {
                                    return <a className="no-hand name">{item.list_name}</a>
                                })
                            }
                        </p>
                    </div>
                    <p className="btn-bot">
                        <a className="bot-more" href="javascript:;" >查看详情</a>
                    </p> 
                </div>
            </div> 
            
        // 转让客户, 领取分配客户， 放弃客户
        var tranAssignAbandonCustomer =
            <div className="msg-box" >
                <p className="time">{data.create_time}</p>
                <div className="inner-box" onClick={() => this.showDetailPV()}>
                    <div className="header">{data.title}</div>
                    <div className="content-box">
                        {
                            msgString
                        }
                        <p className="list">
                            {
                                data.list.map(function (item, index, arr) {
                                    //var pvHref = "13-" + f_req_uid + "-" + item.crm_id + "-9-"; 
                                    var href = "http://my.workec.com/crm/detail?crmid=" + item.list_id + "&t=9&f=";
                                    var crmTitle = "客户资料";
                                    if(item.list_type == 2) {
                                        href = "https://my.workec.com/crm/corp/detail?team=1&cid=" + item.list_id;
                                        crmTitle = "公司资料";
                                    }
                                    return <a className="name"
                                        title={'查看' + crmTitle}
                                        onClick={(e) => that.showCustomerInfo(e, href, crmTitle, item.list_id)}>
                                        {item.list_name}
                                    </a>
                                })
                            }
                        </p>
                    </div>
                    <p className="btn-bot">
                        <a className="bot-more" href="javascript:;" >查看详情</a>
                    </p> 
                </div>
            </div>

        // 合并客户
        var combineCustomer =
            <div className="msg-box" >
                <p className="time">{data.create_time}</p>
                <div className="inner-box" onClick={() => this.showDetailPV()}>
                    <div className="header">{data.title}</div>
                    <div className="content-box">
                        {
                            msgString
                        }
                    </div>
                    <p className="btn-bot">
                        <a className="bot-more" href="javascript:;" >查看详情</a>
                    </p> 
                </div>
            </div>    
        
        //同事共享给我
        var toMeMessage =
            <div className="msg-box">
                <p className="time">{data.create_time}</p>
                <div className="inner-box" onClick={() => this.showSharePV()}>
                    <div className="header">{data.title}</div>
                    <div className="content-box">
                        {
                            msgString
                        }
                        <p className="list">
                            {
                                data.list.map(function (item, index) {
                                    var href = "http://my.workec.com/crm/detail?crmid=" + item.list_id + "&t=9&f=";
                                    return <a className="name"
                                        title="查看客户资料"
                                        onClick={(e) => that.showCustomerInfo(e, href, '客户资料', item.list_id)}>
                                        {item.list_name}
                                    </a>
                                })
                            }
                        </p>
                    </div>

                    <p className="btn-bot">
                        <a className="bot-more" href="javascript:;">查看详情</a>
                    </p>
                </div>
            </div>

        //同事取消共享权限
        var cancelToMeMessage =
            <div className="msg-box">
                <p className="time">{data.create_time}</p>
                <div className="inner-box" onClick={() => this.showDetailPV()}>
                    <div className="header">{data.title}</div>
                    <div className="content-box">
                        {
                            msgString
                        }
                        <p className="list">
                            {
                                data.list.map(function (item) {
                                    return <a className="no-hand name">{item.list_name}</a>
                                })
                            }
                        </p>
                    </div>
                    <div className="btn-bot">
                        <div className="bot-more">查看详情</div>
                    </div>
                </div>
            </div>

        //同事向我请求共享
        var toOtherMessage =
            <div className="msg-box">
                <p className="time">{data.create_time}</p>
                <div className="inner-box no-link">
                    <div className="header">{data.title}</div>
                    <div className="content-box">
                        {
                            msgString
                        }
                        {
                            data.content != '' ?
                            <p className="sm-tips">附加信息：{data.content}</p>
                            :
                            ''
                        }
                    </div>
                    {
                        data.dotype == 0 ?
                            <p className="btn-bot">
                                <div>
                                    <a href="javascript:;" style={{marginRight:"20px"}} onClick={() => this.doReq(1)}>同意</a>
                                    <a href="javascript:;"  onClick={() => this.doReq(2)}>拒绝</a>
                                </div>
                            </p>
                            :
                            data.dotype == 1 ?
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
            
        //同事已同意共享
        var agreeShareToMe = (function () {
            // var pvHref = "13-" + f_req_uid + "-" + data.list[0].crm_id + "-9-";
            var href;
            // var name = data.list[0].name;
            if(data.stype == 171002) {
                href = "https://my.workec.com/crm/detail?crmid=" + data.msg_data[1].id + "&t=9&f=";
            }
            return <div className="msg-box">
                <p className="time">{data.create_time}</p>
                <div className="inner-box" onClick={(e) => this.showCustomerInfo(e, href, '客户资料', data.msg_data[1].id)} title="查看客户资料">
                    <div className="header">{data.title}</div>
                    <div className="content-box">
                        {
                            msgString
                        }
                    </div>
                    <div className="btn-bot">
                        <div className="bot-more" >查看详情</div>
                    </div>
                </div>
            </div>
        }.bind(this))();

        //同事不同意共享
        var disagreeShareToMe = 
            <div className="msg-box">
                <p className="time">{data.create_time}</p>
                <div className="inner-box no-link">
                    <div className="header">{data.title}</div>
                    <div className="content-box">
                        {
                            msgString
                        }
                    </div>
                </div>
            </div>

        // 导出客户, 导出报表
        var exportCustomer =
            <div className="msg-box" >
                <p className="time">{data.create_time}</p>
                <div className="inner-box" onClick={() => this.showExportPV()}>
                    <div className="header">{data.title}</div>
                    <div className="content-box">
                        {
                            msgString
                        }
                    </div>
                    <div className="btn-bot">
                        <div className="bot-more">查看详情</div>
                    </div>
                </div>
            </div>

        var unknownType = 
            <div className="msg-box">
                    <p className="time">{data.create_time}</p>
                    <div className="inner-box no-link">
                        <div className="header">未知类型-{data.type}</div>
                        <div className="content-box">
                            {
                                msgString
                            }
                        </div>
                    </div>
                </div>

        if ([111001, 111004, 111003].includes(msgStype)) {// 新增客户 EXCEL导入，导入给自己、导入给同事、导入到公共库
            return <div className="ecTeam-box share-box-ou">{addCustomer}</div>
        } else if ([111002, 111005].includes(msgStype)) {// 新增客户 同事为我导入, qq导入
            return <div className="ecTeam-box share-box-ou">{addCustomerToMe}</div>
        } else if ([112001, 112004].includes(msgStype)) {//  新增公司 
            return <div className="ecTeam-box share-box-ou">{addCorp}</div>
        } else if (msgType == 12) {// 删除客户
            return <div className="ecTeam-box share-box-ou">{deleteCustomer}</div>
        } else if ([13, 14, 15].includes(msgType)) {//放弃、转让、领取分配客户
            return <div className="ecTeam-box share-box-ou">{tranAssignAbandonCustomer}</div>
        }  else if (msgType == 16) {//合并客户
            return <div className="ecTeam-box share-box-ou">{combineCustomer}</div>
        } else if (msgStype == 171005) {//同事共享给我
            return <div className="ecTeam-box share-box-ou">{toMeMessage}</div>
        } else if (msgStype == 171004) {//同事取消共享权限
            return <div className="ecTeam-box share-box-ou">{cancelToMeMessage}</div>
        } else if (msgStype == 171001) {//同事向我请求共享
            return <div className="ecTeam-box share-box-ou">{toOtherMessage}</div>
        } else if (msgStype == 171002) {//同事同意共享
            return <div className="ecTeam-box share-box-ou">{agreeShareToMe}</div>
        } else if (msgStype == 171003) {//同事不同意共享
            return <div className="ecTeam-box share-box-ou">{disagreeShareToMe}</div>
        } else if ([18, 19].includes(msgType)) {//导出客户、报表
            return <div className="ecTeam-box share-box-ou">{exportCustomer}</div>
        } else {
            return <div className="ecTeam-box share-box-ou">{unknownType}</div>
        }
    }
}

const mapStateToProps = (state) => {
    //const obj = Object.assign({}, state.historyData);
    const obj = {};
    return obj;
};


CrmMessage.contextTypes = {
    //history: PropTypes.object.isRequired,
    //store: PropTypes.object.isRequired
};

import { default as mapDispatchToProps } from '../../actions/index';

export default connect(mapStateToProps, mapDispatchToProps)(CrmMessage);

