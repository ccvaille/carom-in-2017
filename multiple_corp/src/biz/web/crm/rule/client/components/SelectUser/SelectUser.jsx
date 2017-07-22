import React from 'react'
import { Tree, Button, Icon, Input } from 'antd';
import './index.less'

const TreeNode = Tree.TreeNode;
const defaultOption = {
    width: 500,
    height: 400,
    top: 0,
    left: 0
}

//截取节点名称
function makeName(text) {
    return text.length > 10 ? text.substr(0, 10) : text;
}
//增加到快捷搜索数组中
function addToSearchArray(searchArray, { id, name, account }) {
    searchArray.push({ id, name, account });
}
//是否已存在于已选数组中
function isInCheckedArray(checkedArray, item) {
    for (let i = 0, len = checkedArray.length; i < len; i++) {
        if (checkedArray[i].id == item.id) return true;
    }
    return false;
}
//创建树
function makeTree(data, searchArray, checkedArray) {
    if (data === undefined || data.length <= 0) return null;
    if (Array.isArray(data)) {
        let nodeArray = [];
        nodeArray = data.map(function (item) {
            if (item.data === undefined) {
                if (isInCheckedArray(checkedArray, item)) return null;
                addToSearchArray(searchArray, item);
                return <TreeNode key={item.id} title={makeName(item.name)} ></TreeNode>;
            } else if (item.data.length > 0) {
                return <TreeNode key={item.id} title={makeName(item.name)} >{makeTree(item.data, searchArray, checkedArray)}</TreeNode>;
            } else return null;
        });
        nodeArray = nodeArray.filter(function (item) {
            return item !== null;
        })
        return nodeArray;
    } else {
        if (data.data && data.data.length > 0)
            return <TreeNode key={data.id} title={makeName(data.name)} >{makeTree(data.data, searchArray, checkedArray)}</TreeNode>;
        else {
            if (isInCheckedArray(checkedArray, item)) return null;
            addToSearchArray(searchArray, item);
            return <TreeNode key={data.id} title={makeName(data.name)} ></TreeNode>;
        }
    }
}
//从树获取数据
function getDataFromTree(array, node) {
    if (array === null) {
        array = [];
    }
    if (node.props.children) {
        for (let i = 0, length = node.props.children.length; i < length; i++) {
            getDataFromTree(array, node.props.children[i]);
        }
    } else {
        array.push({ id: node.key || node.props.eventKey, name: node.props.title });
    }
}

//整理数据
function formatArray(newArray, oldArray) {
    oldArray = oldArray.filter(function (item) {
        for (let i = 0, length = newArray.length; i < length; i++) {
            if (newArray[i].id == item.id)
                return false;
        }
        return true;
    });
    return oldArray.concat(newArray);
}

class SelectUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedArray: [],
            resultArray: [],
            serarchArray: [],
            isSearchShow: false,
            searchValue: '',
        }
    }
    //修改已选数据
    componentWillReceiveProps = (nextProps) => {
        this.state.checkedArray = [].concat(nextProps.checkedArray);
    }
    componentDidUpdate = () => {
        let list = this.refs.selectedList;
        let ul = this.refs.selectedList.children[0];
        list.scrollTop = ul.offsetHeight - list.offsetHeight;
    }
    //选择节点
    handleSelect = (keys, e) => {
        let array = [];
        getDataFromTree(array, e.node);
        this.setState({
            checkedArray: formatArray(array, this.state.checkedArray),
        });
    }
    //从已选列表删除
    handleUnselect = (keys, e) => {
        this.setState({
            checkedArray: this.state.checkedArray.filter((item) => { return keys[0] != item.id }),
        })
    }
    //点击确定
    handleOk = () => {
        this.props.onOk([].concat(this.state.checkedArray));
    }
    //点击取消
    handleCancle = () => {
        this.props.onCancle();
    }
    //处理搜索框文字
    handleChange = (e) => {
        this.setState({
            searchValue: e.target.value
        });
    }
    //查找项目
    searchItems = () => {
        let value = this.state.searchValue;
        if (value != null && value != '' && value != undefined && value.trim().length > 0) {
            let result = this.state.serarchArray.filter((item) => { return item.name.indexOf(value) >= 0 || item.account.indexOf(value) >= 0 });
            this.state.resultArray.length = 0;
            this.state.isSearchShow = true;
            this.state.resultArray = result;
        } else {
            this.state.isSearchShow = false;
        }
    }
    //清空
    resetInput = () => {
        this.setState({
            searchValue: '',
        })
    }
    render() {
        let option;
        if (this.props.option) option = { ...defaultOption, ...this.props.option };
        else option = defaultOption;
        option.top = option.top === 0 ? 0 : Math.max(0, option.top + 10);
        option.left = option.left === 0 ? 0 : Math.max(0, option.left - 35);
        //if (this.state.arrayViews == undefined)
        this.state.serarchArray.length = 0;
        this.state.arrayViews = makeTree(this.props.data, this.state.serarchArray, this.state.checkedArray);
        this.searchItems();
        return (<div style={{ display: this.props.visible ? 'block' : 'none' }}>
            <div className="masker"></div>
            <div className="select-user" style={option}>
                <div className="left">
                    <p>请选择员工</p>
                    <span className="input-wrapper">
                        <Input className='search-input'
                            placeholder="请输入用户名或账号搜索"
                            onChange={this.handleChange}
                            value={this.state.searchValue}
                        />
                        <Icon type="search" className="search-icon" />
                    </span>
                    <div className="list" style={{ display: this.state.isSearchShow ? 'none' : 'block' }} >
                        {
                            this.state.arrayViews == undefined ? <Icon type="loading" /> :
                                <Tree onSelect={this.handleSelect}>
                                    {this.state.arrayViews}
                                </Tree>
                        }
                    </div>
                    <div className="list" style={{ display: this.state.isSearchShow ? 'block' : 'none' }}>
                        <Tree onSelect={this.handleSelect}>
                            {
                                this.state.resultArray.map(function (item) {
                                    return <TreeNode key={item.id} title={makeName(item.name)} />
                                })
                            }
                        </Tree>
                    </div>
                </div>
                <div className="right checked_list">
                    <p>已选择员工</p>
                    <div className="list" ref="selectedList">
                        <Tree onSelect={this.handleUnselect} >
                            {this.state.checkedArray.map(function (item) {
                                return <TreeNode key={item.id} title={makeName(item.name)} />;
                            })}
                        </Tree>
                    </div>
                </div>
                <Icon type="right" />
                <div className="footer">
                    <Button type="primary" onClick={this.handleOk}>确定</Button>
                    <Button onClick={this.handleCancle}>取消</Button>
                </div>
            </div>
        </div>);
    }
}

export default SelectUser;
/** 
 *  suffix={this.state.searchValue != null && this.state.searchValue.length > 0 ?
                                <Icon type="close" onClick={this.resetInput} style={{ cursor: 'pointer' }} /> : <Icon type="search" />}
*/