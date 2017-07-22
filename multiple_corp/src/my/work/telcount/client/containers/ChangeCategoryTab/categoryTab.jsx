import React, { Component, PropTypes } from "react";

import './index.less';

class CategoryTab extends Component {
    render() {
        const { tabIndex, onClick } = this.props;
        return (
            <ul className="ec_category_tab">
                <a className={tabIndex == 1 ? "active" : ""} onClick={() => {
                    onClick(1);
                }}>接通率
                </a>
                <a className={tabIndex == 2 ? "active" : ""} onClick={() => {
                    onClick(2);
                }}>通话时长
                </a>
                <a className={tabIndex == 3 ? "active" : ""} onClick={() => {
                    onClick(3);
                }}>拨打次数
                </a>
                <a className={tabIndex == 4 ? "active" : ""} onClick={() => {
                    onClick(4);
                }}>联系人数量
                </a>
                <a className={tabIndex == 5 ? "active" : ""} onClick={() => {
                    onClick(5);
                }}>平均通话时长
                </a>
            </ul>            
        )
    }
}

CategoryTab.PropTypes = {
    tabIndex: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired
}

export default CategoryTab;