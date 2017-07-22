import React from 'react';
import { Icon } from 'antd';

function formatName(text,length){
    if(text.length<=length)return text;
    return text.substr(0,length)+'...';
}

class DetailByUserItem extends React.Component {
    handleSeeMore=()=>{
        if(this.props.data.crms.length>2){
            this.props.onLoadMore(-1,this.props.data.user_id);
        }else{
            this.props.onLoadMore(1,this.props.data.user_id);
        }
    }
    handleLoadMore=()=>{
        this.props.onLoadMore((this.props.data.crmIndex+1),this.props.data.user_id);
    }
    render() {
        let data = this.props.data;
        return (<li className="customer_detail_item">
            <div className="customer_detail_130">
                <img className="head_shot" src={data.user_avatar} />
                <div className="user_shot">
                    <p className="name">{formatName(data.user_name,4)}</p>
                    <p className="dep">{formatName(data.dept_name,5)}</p>
                </div>
            </div>
            <div className="content">
                <div className="customer_item_total">
                    待收回客户共<span style={{fontWeight:'bold',padding:'0 3px'}}>{data.lose_number}</span>个
                    {/*{
                        data.lose_number <= 2 ? null :
                            <span className="customer_item_more" onClick={this.handleSeeMore}>查看全部{data.lose_number}个
                                {
                                    (data.crms.length>2)?<Icon type="up" style={{ marginLeft: 5 }} />:
                                        <Icon type="down" style={{ marginLeft: 5 }} />
                                }
                            </span>
                    }*/}
                </div>
                <ul className="srm_list">
                    {
                        data.crms.map((item,index) => {
                            return <li className="customer_item_li" key={index}>
                                <div className="customer_detail_230">
                                    <p className="customer_name" style={item.company == '' ? { marginTop: 10 } : null}>
                                        {item.name}
                                        {
                                            item.title == '' ? null : <span className="job">（{item.title}）</span>
                                        }
                                    </p>
                                    {
                                        item.company == '' ? null : <p>{item.company}</p>
                                    }
                                </div>
                                <div className="customer_detail_150">{/*入库时间*/}
                                    {item.create_time}
                                </div>
                                <div className="customer_detail_150">{/*收回时间*/}
                                    {item.lose_time}
                                </div>
                            </li>
                        })
                    }
                    {
                        (data.isCrmOver||data.lose_number <= 2 )?null:<li className="loading_li" onClick={this.handleLoadMore}><span>查看更多</span></li>
                    }
                </ul>
            </div>
        </li>);
    }
}

export default DetailByUserItem;
