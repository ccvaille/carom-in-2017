import React from 'react';
import { Button } from 'antd';


export default function ShareRequestItem(props) {
  let data=props.data,actionViews=[];
  if (data.status == 0) {
    actionViews.push(<Button key={data.id+'01'} type="primary" size="small" onClick={props.onAgree(data.crm_id,data.id,data.req_user_id)}>同意</Button>);
    actionViews.push(<Button 
                        key={data.id+'02'} 
                        size="small" 
                        style={{ marginLeft: '10px' }} 
                        className="white_btn" 
                        onClick={props.onReject(data.crm_id,data.id,data.req_user_id)}>拒绝</Button>);
  } else if (data.status == 1) {
    actionViews.push(<span key={data.id+'11'} className="share_agree">已同意</span>);
  } else if (data.status == 2) {
    actionViews.push(<span key={data.id+'21'} className="share_reject">已拒绝</span>);
  }
  return (
    <li className="share_request_item">
      <div className="detail">
        <img className="head_shot" src={data.req_user_avatar} />
        <div className="content">
          <p>
            <span className="user">{data.req_user_name}</span>
            &nbsp;&nbsp;请求您共享客户&nbsp;&nbsp;
          <a href={'showec://13-'+data.user_id+'-'+data.crm_id+'-9-/'} className="customer">{data.crm_name}</a>
          </p>
          <p className="tips">{data.create_time}&nbsp;&nbsp;&nbsp;&nbsp;附加信息：{data.memo}</p>
        </div>
        <div className="item_action">
          {actionViews}
        </div>
      </div>
    </li>
  );
}
