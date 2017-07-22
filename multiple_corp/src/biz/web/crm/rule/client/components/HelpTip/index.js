import React from 'react';
import { Popover } from 'antd';
import './index.less';

const HelpTip = ({
    text,
    content
}) => {
    return (
        <div className="help-tips">
            { text }
            {
                content ? 
                <Popover placement="bottomLeft" content={ content }>
                    <span>
                        <i></i>
                        <a href="javascript:;" className="put-on">在哪里能看到</a>
                    </span>
                </Popover>
                :
                ''
            }
        </div>
    )
}

export default HelpTip