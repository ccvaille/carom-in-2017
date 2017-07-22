import fetch from 'isomorphic-fetch';
import Cookie from 'react-cookie';
import {message} from 'antd';


const fetchNew = (url, type, body) => {
    var reqHeader = {
        credentials: 'include',
        method: type,
        // mode: 'no-cors',
        headers: {
            // "X-Requested-With": "XMLHttpRequest",
            // 'Content-Type':'text/plain'
        }
    };
    if (reqHeader.method === "post") {
        // reqHeader.headers['Content-Type'] = 'text/plain';
        reqHeader.headers['Content-Type'] = 'application/json';
        // reqHeader.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        // reqHeader.headers["X-XSRF-TOKEN"] = Cookie.load('XSRF-TOKEN');
        // reqHeader.body = new FormData(body);

        // reqHeader.body = body;
        reqHeader.body = JSON.stringify(body);
    }
    return fetch(url, reqHeader).then(res=>{
        if (res.status >= 200 && res.status < 300) {
            try{
                return res.json()
            }
            catch(err){
                console.log(err);
            }
        }else if (res.status === 401) {
            location.href = "//corp.workec.com";
        } else if (res.status === 403) {
            message.error('您没有权限！');
        } else if (res.status === 500) {
            message.error('服务器内部错误，请稍后再试！');
        } else if (res.status === 404) {
            message.error('接口返回错误！');
        } else if (res.status === 302) {
            location.href = "/login/guide";
        }
    });
};

export default fetchNew;
