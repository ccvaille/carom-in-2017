import React, { PropTypes } from "react";

import './index.less';
const MenuUl = ({
    ulData,
    activeLi,
    changeMenuLi,
}) => {
    return (
        <div className="tab-menu">
            <ul>
            {
                ulData.map((item, index) => {
                    return (
                        item ?
                        <li
                            onClick={changeMenuLi.bind(this, index+1)}
                            key={index}>
                            <span>{item}</span>
                            {
                                activeLi-1 === index ?
                                    <i className="iconfont icon-xuanzhong"></i> :
                                        null

                            }

                        </li> : null
                    )
                })
            }
            </ul>
        </div>

    )
}

export default MenuUl;
