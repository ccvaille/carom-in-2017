import fetch from 'isomorphic-fetch'
import Cookie from 'react-cookie';
import { message, Button } from 'antd';
import Message from '../components/Message'

//弹层显示还是隐藏
export const SWICH_VISIBLE = 'SWICH_VISIBLE';

//所有获取到数据后的错误信息处理函数
function analysis(json, sucCallback, errorCallback, completeCallback) {
    completeCallback && completeCallback();
    if (json.code == 200) {
        sucCallback();
    } else if (json.code !== 200 && json.code != 20600) {
        Message.error(json.msg);
        errorCallback && errorCallback();

    } else if (json.code !== 200 && json.code == 20600) {
        errorCallback && errorCallback();
    }
}

function fetchNew(url, type, body) {
    var reqHeader = {
        credentials: 'include',
        method: type,
        mode: 'cors',
        headers: {}
    };
    if (reqHeader.method === "post") {

        reqHeader.headers['Content-Type'] = 'application/json';
        reqHeader.headers["X-XSRF-TOKEN"] = Cookie.load('XSRF-TOKEN');
        reqHeader.body = JSON.stringify(body);
    }
    return fetch(url, reqHeader).then(res => {
        if (res.status === 401) {
            location.href = "//corp.workec.com";
        } else if (res.status === 403) {
            Message.error('您没有权限！');
        } else if (res.status === 500) {
            Message.error('服务器内部错误，请稍后再试！');
        } else if (res.status === 404) {
            Message.error('接口返回错误！');
        } else if (res.status === 501) {
            location.href = '//corp.workec.com';
        }
        return res.json();
    })
}

export function swichVisible(isVisibel, key) {
    return {
        type: SWICH_VISIBLE,
        isVisibel: isVisibel,
        key: key
    }
}

