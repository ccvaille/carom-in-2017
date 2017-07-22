import React from 'react'
import { Button, Icon, Input } from 'antd';
import './index.less'

//import {Tree} from 'antd';
// const TreeNode = Tree.TreeNode;
import Tree from './Tree';
import TreeNode from './TreeNode';
const Search = Input.Search;
const defaultOption = {
    width: 500,
    height: 400,
    top: 0,
    left: 0
}
const TreeNodeFactory = React.createFactory(TreeNode);


//增加到快捷搜索数组中
function addToSearchArray(searchArray, item) {
    searchArray.push(item);
}
//创建树
function makeTree(data, searchArray) {
    if (data === undefined || data.length < 0) return null;
    if (Array.isArray(data)) {
        let nodeArray = [];
        nodeArray = data.map(function (item) {
            if (item.im0.indexOf('leaf')>=0) {
                addToSearchArray(searchArray, item);
                return TreeNodeFactory({ id: item.id, title: item.name, data: item, key: item.id });
            } else if (item.sublist.length >= 0) {
                return TreeNodeFactory({ id: item.id, title: item.name, data: item, key: item.id }, makeTree(item.sublist, searchArray));
            } else return null;
        });
        nodeArray = nodeArray.filter(function (item) {
            return item !== null;
        })
        return nodeArray;
    } else {
        if (data.sublist && data.sublist.length >= 0)
            return TreeNodeFactory({ id: data.id, title: data.name, data: data, key: data.id }, makeTree(data.sublist, searchArray));
        else {
            addToSearchArray(searchArray, data);
            return TreeNodeFactory({ id: data.id, title: data.name, data: data, key: data.id });
        }
    }
}
//获取整理数据
function formatData(data) {
    let array = [];
    if (Array.isArray(data)) {
        for (let i = 0, len = data.length; i < len; i++) {
            array = array.concat(formatData(data[i]));
        }
    } else if (data.im0.indexOf('leaf')<0) {
        let list = data.sublist;
        for (let i = 0, len = list.length; i < len; i++) {
            array = array.concat(formatData(list[i]));
        }
    }
    else {
        array.push(data);
    }
    return array;
}
//去重
function weedOut(array) {
    let ob = {}, result = [];
    for (let i = 0, len = array.length; i < len; i++) {
        let item = array[i];
        if (ob[item.id]) continue;
        else {
            ob[item.id] = item.id;
            result.push(item);
        }
    }
    return result;
}

function getUserId(array) {
    let result = [];
    for(var item of array) {
        result.push(item.id);
    }
    return result;
}
//修改数据
function changeData(data, rule) {
    if (Array.isArray(data)) {
        let result=[];
        for(let i=0,len=data.length;i<len;i++){
            result.push(changeData(data[i], rule))
        }
        return result;
    } else {
        let result = {};
        for (let key in data) {
            if (key == rule.id) {
                result.id = data[key];
                continue;
            }
            if (key == rule.name) {
                result.name = data[key];
                continue;
            }
            if (key == rule.sublist) {
                result.sublist = changeData(data[key],rule);
                continue;
            }
            result[key] = data[key];
        }
        return result;
    }
}
function resetData(data,rule){
     if (Array.isArray(data)) {
        let result=[];
        for(let i=0,len=data.length;i<len;i++){
            result.push(resetData(data[i], rule))
        }
        return result;
    } else {
        let result = {};
        for (let key in data) {
            if (key == 'id') {
                result[rule.id] = data[key];
                continue;
            }
            if (key == 'name') {
                result[rule.name]= data[key];
                continue;
            }
            if (key == 'sublist') {
                result[rule.sublist] = resetData(data[key],rule);
                continue;
            }
            result[key] = data[key];
        }
        return result;
    }
}

 function throttle (fn, delay) {
        var timer = null;  
        return function () {
            var context = this, args = arguments; 
            clearTimeout(timer);  
            timer = setTimeout(function () {  
                fn(args[0]);
            }, delay);  
        }
    }

class SelectUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedArray: [],
            resultArray: [],
            serarchArray: [],
            isSearchShow: false,
        }
        this.searchFn = throttle(this.searchFn.bind(this), 300);
    }
    //修改已选数据
    componentWillReceiveProps = (nextProps) => {
        let data = changeData(nextProps.data, nextProps.rule);
        this.state.serarchArray.length = 0;
        this.state.arrayViews = makeTree(data, this.state.serarchArray);
        var result = [],
            flag;
        if(nextProps.result != this.props.result) {
            this.state.resultArray.length = 0;
            result = this.state.serarchArray.filter((item) => { 
                flag = false;
                for(let i of nextProps.result) {
                    if(i.f_user_id == item.id) {
                        flag = true;
                        break;
                    }
                }
                return item.name.indexOf(nextProps.searchValue.trim()) > 0 || flag;
            })
            this.setState({
                isSearchShow: true,
                resultArray: result,
            })
        } else {
            this.state.checkedArray = changeData(nextProps.checkedArray, nextProps.rule);
        }
    }
    //选择节点
    handleSelect = (node) => {
        let dataNode = { ...node.props.data };
        this.setState({
            checkedArray: this.state.checkedArray.concat([dataNode]),
        });
    }
    //从已选列表删除
    handleUnselect = (node) => {
        this.setState({
            checkedArray: this.state.checkedArray.filter((item) => { return node.props.id != item.id }),
        })
    }
    //点击确定
    handleOk = () => {
        let array = resetData(weedOut(formatData(this.state.checkedArray)),this.props.rule);
        array = getUserId(array);
        let checkedArray=resetData(this.state.checkedArray,this.props.rule);
        this.props.onOk(checkedArray, array);
    }
    //点击取消
    handleCancel = () => {
        this.props.onCancel();
    }
    //处理搜索框文字
    handleChange = (e) => {
        e.persist();
        this.searchFn(e)
    }

    searchFn = (e) => {
        let value = e.target.value;
        if (value != null && value != '' && value != undefined && value.trim().length > 0) {
            this.props.searchFunc(value);
        } else {
            this.setState({
                isSearchShow: false,
            })
        }
    }

    render() {
        let option;
        if (this.props.option) option = { ...defaultOption, ...this.props.option };
        else option = defaultOption;
        option.top = option.top === 0 ? 0 : Math.max(0, option.top + 10);
        option.left = option.left === 0 ? 0 : Math.max(0, option.left - 35);
        return (<div style={{ display: this.props.visible ? 'block' : 'none' }}>
            <div className="masker"></div>
            <div className="select-user" style={option}>
                <div className="left">
                    <p>请选择员工</p>
                    <span className="input-wrapper">
                        <Search className='search-input' placeholder="请输入用户名搜索" onChange={this.handleChange} />
                    </span>
                    <div className="list" style={{ display: this.state.isSearchShow ? 'none' : 'block' }}>
                        {
                            this.state.arrayViews == undefined ? <Icon type="loading" /> :
                                <Tree onSelect={this.handleSelect} hideItems={this.state.checkedArray}>
                                    {this.state.arrayViews}
                                </Tree>
                        }
                    </div>
                    <div className="list" style={{ display: this.state.isSearchShow ? 'block' : 'none' }}>
                        <Tree onSelect={this.handleSelect} hideItems={this.state.checkedArray}>
                            {
                                this.state.resultArray.map(function (item) {
                                    return TreeNodeFactory({ id: item.id, title: item.name, data: item, key: item.id });
                                })
                            }
                        </Tree>
                    </div>
                </div>
                <div className="right checked_list">
                    <p>已选择员工</p>
                    <div className="list">
                        <Tree onSelect={this.handleUnselect}>
                            {this.state.checkedArray.map(function (item) {
                                return TreeNodeFactory({ id: item.id, title: item.name, data: item, key: item.id });
                            })}
                        </Tree>
                    </div>
                </div>
                <Icon type="right" />
                <div className="footer">
                    <Button type="primary" onClick={this.handleOk}>确定</Button>
                    <Button onClick={this.handleCancel}>取消</Button>
                </div>
            </div>
        </div>);
    }
}

export default SelectUser;