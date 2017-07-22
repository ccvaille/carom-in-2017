import fetch from 'isomorphic-fetch';
import Cookie from 'react-cookie';

const fetchNew = (url, type, body, notFrom) => {
    var reqHeader = {
        credentials: 'include',
        method: type,
        // mode: 'no-cors',  //有参数Content-Type设置不上
        headers: {
            // "X-Requested-With": "XMLHttpRequest"
        }
    }
    body = formatDate(body);
    if (reqHeader.method === "post") {
        if(notFrom){
            reqHeader.headers['Content-Type'] = 'application/json';
            reqHeader.body = JSON.stringify(body);
            reqHeader.headers['X-Requested-With'] = 'XMLHttpRequest';
        }else{
            // reqHeader.headers['Accept'] = 'application/json, application/xml, text/plain, text/html, *.*';
            reqHeader.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            reqHeader.body = getFormData(body);
        }
        // reqHeader.headers["X-XSRF-TOKEN"] = Cookie.load('XSRF-TOKEN');
    }
    return fetch(url, reqHeader).then(res => {
        return res.text();
    }).then(text => {
        let json;
        try{
            json = JSON.parse(text);
        }catch(e){
            window.location = 'http://my.workec.com/work/telcount/today';
            return {};            
        }
        return json;
    });
}  

const getFormData = (obj) => {
    const formData = [];
    for(const key in obj){
        if(key == "users"){
            obj[key].map((item, index) => {
                formData.push(key + '[' + index + '][id]' + '=' + item.id);
                formData.push(key + '[' + index + '][name]' + '=' + item.name);
                formData.push(key + '[' + index + '][type]' + '=' + item.type);
            })
        }else{
            formData.push(key + '=' + obj[key]);
        }
    }
    return formData.join("&");
}

const formatDate = (obj) => {
    if(obj.startdate){
        const start = obj.startdate.split("-");
        const end = obj.enddate.split("-");
        if(start[1].length == 1){
            start[1] = "0" + start[1];
        }
        if(start[2].length == 1){
            start[2] = "0" + start[2];
        }   
        if(end[1].length == 1){
            end[1] = "0" + end[1];
        }
        if(end[2].length == 1){
            end[2] = "0" + end[2];
        } 
        obj.startdate = start.join("-");             
        obj.enddate = end.join("-");             
    }
    return obj;
}

export default fetchNew;