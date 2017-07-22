import React from 'react';
import { Icon } from 'antd';

//截取节点名称
function makeName(text) {
    return text.length > 10 ? text.substr(0, 10) : text;
}
class TreeNode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isChildeShow: false,
        }
    }
    handleClick = () => {
        this.setState({
            isChildeShow: !this.state.isChildeShow,
        })
    }
    onselect = () => {
        this.props.onSelect(this);
    }
    isThisNodeHide = () => {
        let array = this.props.hideItems,
            id = this.props.id;
        if (!array) return false;
        for (let i = 0, len = array.length; i < len; i++) {
            if (array[i].id == id) return true;
        }
        return false;
    }
    render() {
        let view = null;
        let isHide = this.isThisNodeHide();
        if (Array.isArray(this.props.children)) {
            view = <li key={this.props.key} style={{ display: isHide ? 'none' : 'block' }}>
                <span className="ec-tree-title">
                    {
                        this.state.isChildeShow ? <Icon onClick={this.handleClick} type="caret-down" /> : <Icon onClick={this.handleClick} type="caret-right" />
                    }
                    <span className="ec-tree-expand" onClick={this.onselect}>{makeName(this.props.title)}</span>
                </span>
                <ul style={{ paddingLeft: 15, display: this.state.isChildeShow ? 'block' : 'none' }}>
                    {
                        React.Children.map(this.props.children, child => {
                            return React.cloneElement(child, { onSelect: this.props.onSelect, hideItems: this.props.hideItems })
                        })
                    }
                </ul>
            </li>;
        } else {
            view = <li   key={this.props.key} 
                         style={{ display: isHide ? 'none' : 'block' }}
                         onClick={this.onselect}>
                <span className="ec-tree-node">
                    {makeName(this.props.title)}
                </span>
            </li>
        }
        return view;
    }
}

export default TreeNode;