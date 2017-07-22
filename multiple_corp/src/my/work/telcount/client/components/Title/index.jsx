import React from 'react';

import { Popover } from 'antd';

import ECPopover from '../ECPopover';

import './index.less'

class Title extends React.Component {
    render() {
        return (
            <div className="ec_head_title">
                <p>{this.props.name}</p>
                <Popover content={this.props.content} placement="bottomLeft">
                    <i></i>
                </Popover>                            
            </div>
        )
    }
}

export default Title;