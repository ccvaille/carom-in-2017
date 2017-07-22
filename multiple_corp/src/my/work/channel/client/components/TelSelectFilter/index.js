import React from 'react';
import './index.less'

class TelSelectFilter extends React.Component {

    componentWillMount() {
        this.setState({
            selected: [],
            fun: this.props.setSelect
        });
    }

    componentDidMount() {
        var that = this;
       !ISPERSON && $(this.refs.testTree).ztree({
            url: '//api.workec.com/usercenter/usergroup/struct?t=role&with_staff=1',
            searchUrl: '//api.workec.com/usercenter/usergroup/employee?t=role',
            callback: function (nodeId, name, type) {
                var arr = that.state.selected;
                var index = arr.findIndex(function (item) {
                    return item.id == nodeId;
                });

                if (index == -1) {
                    if(arr.length >= 5){
                        that.layerAlert("最多只能选择5个统计对象，请删除一些所选对象后再进行添加！",{btn:['知道了']});
                        return;
                    }
                    arr.push({
                        id: nodeId,
                        name: name,
                        type: type
                    });
                } else {
                    arr.splice(index, 1);

                }
                that.setState({
                    selected: arr
                });
                that.state.fun(arr);
            }
        });
    }

    //删除选中的
    delSelected = (index) => {
        var arr = this.state.selected;
        arr.splice(index, 1);
        this.setState({
            selected: arr
        });
        this.state.fun(arr);
    }
    sureClick(){
        this.setState({
            selected: []
        }); 
        this.props.clickFun();       
    }

    clearFun(){
        this.setState({
            selected: []
        }); 
        this.props.clearFun();         
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
        var that = this;

        return (
            !ISPERSON ? 
            <div className="ec_select_manage">
                <p>员工/部门：</p>
                <span id="testTree" ref="testTree">筛选</span>
                <span className="on" onClick={() => {this.clearFun()}}>不限</span>
                {
                    this.state.selected.length == 0 ? '' :
                        <div className="ec_select_list">
                            <ul id="select_obj" className="fl2">
                                {
                                    this.state.selected.map(function (item, index) {
                                        return <li key={index} onClick={() => that.delSelected(index)}><a href="javascript:void(0)" className="a1">{item.name}</a><a href="javascript:void(0)" className="a2"></a></li>
                                    })
                                }
                            </ul>
                        <input className="sureBtn" type="button" value="确认" onClick={() => {this.sureClick();}}/>
                    </div>
                }                                     
            </div> : <div></div>        
        );
    }
}

export default TelSelectFilter;