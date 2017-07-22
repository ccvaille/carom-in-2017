import React from 'react';
import './tree.less';

class Tree extends React.Component {
    handleSelct = (node) => {
        if(this.props.onSelect)
       this.props.onSelect(node);
    }
    render() {
        return (<ul className="ec-tree">
            {React.Children.map(this.props.children, child => {
                return React.cloneElement(child, { onSelect: this.handleSelct ,hideItems:this.props.hideItems})
            })}
        </ul>);
    }
}

export default Tree;