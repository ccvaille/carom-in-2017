import React from 'react';
import './index.less';
import { Icon } from 'antd';
import {hasClass, addClass, removeClass} from '~comm/utils/index.js';
import classNames from 'classnames';
const Tabpush = ({
    activeLi,
    onClick,
    formInfoSave,
    formInfo,

}) => {
    return (
        <div className="tab">
            <ul className="tab-ul" onClick={e => { onClick.call(this, e); } }>
                <li className={classNames({'active': activeLi === 1, 'dark': true})} >
                    第一条推送
                </li>
                <li  >
                    <Icon type="right" />
                </li>
                <li className={classNames({'active': activeLi === 2, 'dark': formInfo[1] && formInfo[1].f_url})} >
                    第二条推送
                </li>
                <li >
                    <Icon type="right" />
                </li>
                <li className={classNames({'active': activeLi === 3, 'dark': formInfo[2] && formInfo[2].f_url})} >
                    第三条推送
                </li>
            </ul>
            <div className="develop">
                全力开发中，敬请期待
            </div>
        </div>
    )
}


export default Tabpush
