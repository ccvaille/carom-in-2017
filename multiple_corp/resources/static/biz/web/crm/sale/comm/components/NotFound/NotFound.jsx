import React from 'react';
import './not-found.less';
import notFoundImage from '~comm/public/images/404.png';

const NotFound = () => {
  let backUrl = `${location.protocol}//${location.host}`;

  if (document.referer) {
    backUrl = document.referer;
  }

  return (
    <div className="not-found">
      <div className="container">
        <img src={notFoundImage} alt="" />
        <div className="content">
            <h3>这个页面一边凉快去了</h3>
            <p>抱歉，您请求的页面不存在</p>
            <p>您可以 <a href={backUrl}>点击返回</a></p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
