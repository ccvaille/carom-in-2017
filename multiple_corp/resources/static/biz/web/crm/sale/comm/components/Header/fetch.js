const ROOT_URL = 'https://biz.workec.com/'
import {message} from 'antd'

export default function getAuthFetch(url, type, body) {
  let _fetch_url = ROOT_URL + url;
  var reqHeader = {
    credentials: 'include',
    method: type,
    mode: 'cors',
    headers: {}
  };

  if (reqHeader.method === "post") {
    reqHeader.headers['Content-Type'] = 'application/json';
    reqHeader.headers["X-XSRF-TOKEN"] = Cookie.load('XSRF-TOKEN');
    if (body) {
      reqHeader.body = JSON.stringify(body);
    }
    else {
      return null
    }

  }
  return fetch(_fetch_url, reqHeader).then(res => {

    if (res.status === 401) {
      location.href = "//corp.workec.com";
    }
    else if (res.status === 403) {
      message.error('您没有权限！');
    }
    else if (res.status === 500) {
      message.error('服务器内部错误，请稍后再试！');
    }
    else if (res.status === 404) {
      message.error('接口返回错误！');
    }
    else if (res.status === 501) {
      location.href = '//corp.workec.com';
    }

    return res.json();
  })
  .then(data => {
    if (data.code == 4001) {
      message.error(data.msg)
    }
    return data
  })
  .catch(error => {
    throw new Error(error);
  })
}
