import React from 'react';
import './index.less';

const SwitchBtn = ({
    changeEvent,
    activeIndex
}) => {
    return (
        <div className="switch-box">
            <span className={ activeIndex == 1 ? 'active' : '' } onClick={()=> changeEvent(1)}>用户数</span>
            <span className={ activeIndex == 2 ? 'active' : '' } onClick={()=> changeEvent(2)}>转化率</span>
        </div>
    )
}
export default SwitchBtn
