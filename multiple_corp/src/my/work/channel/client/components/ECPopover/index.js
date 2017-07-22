import React from 'react';
import './index.less'


class ECPopover extends React.Component {
    render() {
        return (
            <div className="ec_popover">
                {
                    this.props.content.map(function(item, index){
                        return <div key={index}>
                        <p className="title"><i></i><span>{item.title}</span></p>
                        {
                            item.desc.map(function(item2, index2){
                                return <p className="desc" key={"desc" + index2}>{item2}</p>
                            })
                        }
                        </div>
                    })
                }
            </div>
        )
    }
}

export default ECPopover;



