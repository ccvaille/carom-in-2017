import React, { Component, PropTypes } from "react";
import { Modal, Table } from 'antd';
import "./setting.less";
import "./mix.less";

class SelectNoRound extends Component {
	componentDidMount = () => {
       	this.props.show && $(this.refs.testTree).ztree({
            url: '//api.workec.com/usercenter/usergroup/struct?t=role&with_staff=1',
            searchUrl: '//api.workec.com/usercenter/usergroup/employee?t=role',
            callback: function (nodeId, name, type) {
                var arr = that.props.selected;
                var index = arr.findIndex(function (item) {
                    return item.id == nodeId;
                });
                if (index == -1) {
                    if(arr.length >= 5){
                        that.layerAlert("最多只能选择5个统计对象，请删除一些所选对象后再进行添加！",{btn:['知道了']});
                        return;
                    }
                    that.props.addSelected({
                        id: nodeId,
                        name: name,
                        type: type
                    });
                } else {
                    that.props.delSelected(index);
                }
            }
        });
    }
	layerAlert(msg, opt){
        var c = {'icon':0,'title':'<i class="ec_logo"></i>温馨提示'};
        if(typeof(opt) == 'undefined'){
            var opt = c;
        }
        if(typeof(opt.title) == 'undefined'){
            opt.title = '<i class="ec_logo"></i>温馨提示';
        }
        if(typeof(opt.icon) == 'undefined'){
            opt.icon = 0;
        }
        layer.alert(msg, opt);
    } 
    render() {
		const { show, selected, delSelected, sureClick, clearSelected} = this.props;
        return (
            show ? 
            <div className="ec_select_manage">
                <p>员工/部门：</p>
                <span id="testTree" ref="testTree">筛选</span>
                <span className="on" onClick={() => {clearSelected()}}>不限</span>
                {
                    selected.length == 0 ? '' :
                        <div className="ec_select_list">
                            <ul id="select_obj" className="fl2">
                                {
                                    selected.map(function (item, index) {
                                        return (<li key={index} onClick={() => delSelected(index)}><a href="javascript:;" className="a1">{item.name}</a><a href="javascript:;" className="a2"></a></li>)
                                    })
                                }
                            </ul>
                        <input className="sureBtn" type="button" value="确认" onClick={() => {sureClick()}}/>
                    </div>
                }                                     
            </div> : <div></div>         
        )
    }    

}