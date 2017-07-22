import React, { Component, PropTypes } from "react";
import { connect } from 'react-redux';

import { changeSelect,fetchTodayData,fetchHistoryData,clearData,fetchRankData } from '../../actions';

import './index.less';

const mapPropToType = {
    dailyData: "CHANGE_TODAY_SELECT",
    historyData: "CHANGE_HISTORY_SELECT",
    employeeData: "CHANGE_RANK_SELECT"
}

const mapPropToTypeOfClear = {
    dailyData: "DAILY_CLEAR_DATA",
    historyData: "HISTORY_CLEAR_DATA",
    employeeData: "EMPLOYEE_CLEAR_DATA"    
}

class TelSelectFilter extends Component {
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
                            <div id="select_obj" className="fl2">
                                {
                                    selected.map(function (item, index) {
                                        return <div key={index} onClick={() => delSelected(index)}><a href="javascript:;" className="a1">{item.name}</a><a href="javascript:;" className="a2"></a></div>
                                    })
                                }
                            <input className="sureBtn" type="button" value="确认" onClick={() => {sureClick()}}/>
                            </div>
                    </div>
                }                                     
            </div> : <div></div>         
        )
    }

    componentDidMount() {
        var that = this;
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
}

TelSelectFilter.PropTypes = {
    show: PropTypes.bool.isRequired,
    selected: PropTypes.object.isRequired,
    addSelected: PropTypes.func.isRequired,
    delSelected: PropTypes.func.isRequired,
    sureClick: PropTypes.func.isRequired,
    clearSelected: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => {
    return {
        show: !state[ownProps.type].isPerson,
        selected: state[ownProps.type].selected
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        addSelected: (obj) => {
            dispatch(changeSelect(mapPropToType[ownProps.type], {
                type: "add",
                obj: obj
            }));
        },
        delSelected: (index) => {
            dispatch(changeSelect(mapPropToType[ownProps.type], {
                type: "del",
                index: index
            }));
        },
        clearSelected: () => {
            dispatch(changeSelect(mapPropToType[ownProps.type], {
                type: "clear"
            }));
            dispatch(clearData(mapPropToTypeOfClear[ownProps.type]));            
            if(ownProps.type == "dailyData"){
                dispatch(fetchTodayData());                
            }else if(ownProps.type == "historyData"){
                dispatch(fetchHistoryData());
            }else{
                dispatch(fetchRankData());
            }             
        },
        sureClick: () => {
            dispatch(clearData(mapPropToTypeOfClear[ownProps.type]));      
            if(ownProps.type == "dailyData"){
                dispatch(fetchTodayData());                
            }else if(ownProps.type == "historyData"){
                dispatch(fetchHistoryData());
            }else{
                dispatch(fetchRankData());
            }    
            // dispatch(changeSelect(mapPropToType[ownProps.type], {
            //     type: "clear"
            // }));     
        }                     
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TelSelectFilter);