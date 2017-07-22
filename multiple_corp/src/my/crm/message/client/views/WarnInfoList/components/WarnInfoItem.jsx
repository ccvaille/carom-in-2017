import React from 'react';
import { Button } from 'antd';

export default function WarnInfoItem(props) {
  const actions = [], data = props.data;
  if (data.status === 0) {
    actions.push(<Button key={data.id + '01'} type="primary" size="small" onClick={props.agreeBack(data.id)}>确认收回</Button>);
    actions.push(<Button key={data.id + '02'} size="small" className="white_btn" style={{ marginLeft: 10 }} onClick={props.rejectBack(data.id)}>暂不收回</Button>);
  } else if (data.status === 1) {
    actions.push(<p key={data.id + '11'} className="warn_info_status">{data.confirm_name}<span className="warn_info_agree">确认收回</span></p>);
    actions.push(<p key={data.id + '12'} className="tips">{data.confirm_time}</p>);
  } else if (data.status === 2) {
    actions.push(<p key={data.id + '21'} className="warn_info_status">{data.confirm_name}<span className="warn_info_reject">暂不收回</span></p>);
    actions.push(<p key={data.id + '22'} className="tips">{data.confirm_time}</p>);
  } else if (data.status === -1) {
    actions.push(<p key={data.id + '-11'} className="warn_info_status"><span className="warn_info_overdue">已过期</span></p>);
    actions.push(<p key={data.id + '-12'} className="tips">{data.confirm_time}</p>);
  }
  return (
    <li className="warn_info_item">
      <div className="detail">
        <p className={data.status !== 0 ? 'tip_content' : 'content'}>您的团队明天有<span className="mess_bold_text">{data.lose_number}</span>个客户被收回至公共库，请处理！
          {data.status === 0 ? <button className="link_btn" onClick={props.goDetail(data.lose_number, data.id)}>查看客户>></button> : null}
        </p>
        <p className="tips" style={data.status == 0 ? { color: '#727c8f' } : null}>{data.create_time}&nbsp;</p>
        <div className="item_action">
          {actions}
        </div>
      </div>
    </li>
  );
}
