import React, { PropTypes } from "react";

import { Input, Icon } from 'antd';
import classNames from 'classnames';
import './label.less';

class Label extends React.Component {
    
    state = {
        isFocus: false
    }
    focusEdit = () => {
        // alert(1);
        this.props.setLabelEdit(true, this.props.index);
        this.setState({
            isFocus: true
        }, () => {
            this.myInput && this.myInput.focus();
        });        
    }
    blurEdit = () => {
        this.props.setLabelEdit(false, this.props.index);
        this.props.editModifyPhone(this.props.index, this.props.value);
    }
    changeValue = (e) => {
        this.props.editModifyPhone(this.props.index, e.target.value);
    }
    
    render() {
         console.log(this.props.editState);
        return (
            <div 
                onDoubleClick={this.focusEdit} 
                className={
                    classNames('label', {'error': this.props.isError})
                }>
                {
                    !this.props.editState ?
                    <p>
                        {this.props.value}
                        {
                            this.props.isDel ? 
                                <a className="del" 
                                    href="javascript:void 0"
                                    onClick={this.props.delLabel.bind(this, this.props.index)}>
                                        <Icon type="close"/>
                                </a> : null
                        }
                        
                    </p>:
                     <Input placeholder=""  
                           ref={wrap => this.myInput = wrap && wrap.refs.input || null}
                           type="text"
                           name="myInput" 
                           onBlur={this.blurEdit}
                           value={this.props.value}
                           onChange={this.changeValue}
                           onPressEnter={this.blurEdit}/>
                }
            </div>
        )
    }
}

export default Label;
