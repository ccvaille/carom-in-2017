import React, { PropTypes } from "react";
import { Button } from "antd-mobile";
import './index.less';

const MenuFilter = ({
    menuFilterData,
    menuSelectedFilterData,
    toggleActiveFilter,
    activeTagIds,
}) => {
    return (
        <div className="menu-filter">
            <ul className="group-ul">
            {
                menuFilterData.map((item, index) => {
                    return (
                        <li 
                            key={'label-' + index}>
                            <h2>{item.name}</h2>
                            <div className="label-ul">
                                {
                                    item.tags.map((element, jndex) => {
                                        return (

                                            <a 
                                                key={'label-' + jndex}
                                                href="javascript: void(0)"
                                                onClick={ toggleActiveFilter.bind(this, [
                                                    item.groupId, element.tagId
                                                ])}
                                                className={
                                                    activeTagIds[item.groupId] === element.tagId ?
                                                        'blue' : ''
                                                }>
                                                    {element.name}
                                            </a>                                            
                                        )
                                    })
                                }      
                            </div>
                        </li>
                    )
                })                
            }
            </ul>
        </div>

    )
}

export default MenuFilter;