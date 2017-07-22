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
function makeTree(data) {
    if (data === undefined || data.length < 0) return null;
    if (Array.isArray(data)) {
        let nodeArray = [];
        nodeArray = data.map(function (item) {
            if (!item.children) {
                // addToSearchArray(searchArray, item);
                return TreeNodeFactory({ id: item.id, title: item.name, data: item, key: item.id+Math.random().toFixed(5) });
            } else if (item.children.length >= 0) {
                return TreeNodeFactory({ id: item.id, title: item.name, data: item, key: item.id+Math.random().toFixed(5) }, makeTree(item.children));
            } else return null;
        });
        nodeArray = nodeArray.filter(function (item) {
            return item !== null;
        })
        return nodeArray;

    } else {
        if (data.children && data.children.length >= 0)
            return TreeNodeFactory({ id: data.id, title: data.name, data: data, key: data.id+Math.random().toFixed(5) }, makeTree(data.children));
        else {
            // addToSearchArray(searchArray, data);
            return TreeNodeFactory({ id: data.id, title: data.name, data: data, key: data.id+Math.random().toFixed(5) });
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


function jsonTree(data, config) {
    let id = config.id || 'id',
        pid = config.pid || 'pid',
        children = config.children || 'children';

    let idMap = [],
        jsonTree = [];

    if(data&&data.length>0){
        data.forEach(v => {
            idMap[v[id]] = v;
        });

        data.forEach(v => {
            let parent = idMap[v[pid]];
            if(parent) {
                !parent[children] && (parent[children] = []);
                parent[children].push(v);
            } else {
                jsonTree.push(v);
            }
        });
    }
    return jsonTree;
};

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
            searchArray: [],
            isSearchShow: false,
            arrayViews:[]
        }
        this.searchFn = throttle(this.searchFn.bind(this), 300);
    }


    componentWillMount=()=>{

    }
    //修改已选数据
    componentWillReceiveProps = (nextProps) => {
        if(nextProps.data!=this.props.data){
            let data = jsonTree(nextProps.data,{
                id: 'id',
                pid: 'pId',
            });
            this.setState({
                arrayViews: makeTree(data)
            });
        }
        this.setState({
            checkedArray:nextProps.checkedArray
        });
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
        this.props.onOk(this.state.checkedArray);
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
        let value = e.target.value.trim();
        if (value != null && value != '' && value != undefined && value.trim().length > 0) {
            let result = this.props.data.filter((item,index)=>{
                return item.name.indexOf(value)>-1;
            });
            this.setState({
                resultArray:result,
                isSearchShow:true
            });

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
                    <p>请选择部门/员工</p>
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
                        {
                            this.state.resultArray.length > 0 ? <Tree onSelect={this.handleSelect} hideItems={this.state.checkedArray}>
                                {
                                    this.state.resultArray.map(function (item) {
                                        return TreeNodeFactory({ id: item.id, title: item.name, data: item, key: item.id+Math.random().toFixed(5) });
                                    })
                                }
                            </Tree>:(<span title=' 没找到哦！' className="ec-tree-node-no-found">
                                        没找到哦！
                                    </span>)
                        }

                    </div>
                </div>
                <div className="right checked_list">
                    <p>已选择部门/员工</p>
                    <div className="list">
                        <Tree onSelect={this.handleUnselect}>
                            {this.state.checkedArray.map(function (item) {
                                return TreeNodeFactory({ id: item.id, title: item.name, data: item, key: item.id+Math.random().toFixed(5) });
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
