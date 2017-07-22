import React from 'react';
import './index.less';

const HelpIntro = ({
    list
}) => {
    return (
        <div className="help-intro">
            <div className="intro-head"><i className="iconfont help">&#xe60b;</i><span style={{ fontSize: 12 }}>帮助说明</span></div>
            <div className="intro">
                {
                    list.map(function(item, index) {
                        return <div className="intro-item" key={ index }><span>{index + 1}、</span>{ item }</div>
                    })
                }
            </div>
        </div>
    )
}

export default HelpIntro