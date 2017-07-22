import fetch from 'isomorphic-fetch';
import Cookie from 'react-cookie';

export const Switch_Category = 'Switch_Category';
export const Fetch_Lists = 'Fetch_Lists';
export const Fetch_Category = 'Fetch_Category';
export const Fetch_Help_Detail = 'Fetch_Help_Detail';
export const Search_Help = 'Search_Help';
export const Clear_Prev_State = 'Clear_Prev_State';
export const Post_Feedback = 'Post_Feedback';

function fetchOld(url, type, body) {
    var opts = {
        mode: 'cors',
        credentials: 'include',
        method: type,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }
    if (opts.method === "post") {
        // opts.headers['Content-Type'] = 'application/json';
        // opts.headers["X-XSRF-TOKEN"] = Cookie.load('XSRF-TOKEN'),
        body.ec_csrf_token = Cookie.load('ec_csrf_token');
        opts.body = stringParam(body);
    }
    return fetch(url, opts).then(res => {
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


function fetchNew(url, type, body) {

    var opts = {
        mode: 'cors',
        credentials: 'include',
        method: type,
        // headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded',
        // }
    }
    if (opts.method === "post") {
        // opts.headers['Content-Type'] = 'application/json';
        // opts.headers["X-XSRF-TOKEN"] = Cookie.load('XSRF-TOKEN'),
        body.ec_csrf_token = Cookie.load('ec_csrf_token');
        opts.body = JSON.stringify(body);
    }
    return fetch(url, opts).then(res => {
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


export function swithCategory(id) {
    return {
        type: Switch_Category,
        id
    }
}

export function fetchHelpDetail(id) {
    return dispatch => fetchNew(location.origin + '/techinfo/detail?kid=' + id, 'get')
        .then(jsonResult => {
            if (jsonResult.code === 0) {
                return dispatch({
                    type: Fetch_Help_Detail,
                    helpDetail: jsonResult.data,
                    flag: true,
                })
            }
        })
        .catch(error => console.info('request error: ', error))
}

export function postFeedback(object) {
    return dispatch => fetchOld(location.origin + '/techinfo/subquestion', 'post', object)
        .then(jsonResult => {
            if (jsonResult.code === 0) {
                return dispatch({
                    type: Post_Feedback,
                    submit: true,
                    flag: true,
                })
            }
        })
        .catch(error => console.info('request error: ', error))
}


export function fetchLists(object) {
    return dispatch => fetchNew(location.origin + '/techinfo?per=10&' + stringParam(object), 'get')
        .then(jsonResult => {
            if (jsonResult.code === 0) {
                return dispatch({
                    type: Fetch_Lists,
                    helpList: jsonResult.data,
                    flag: true,
                    page: jsonResult.page
                })
            }
        })
        .catch(error => console.info('request error: ', error))
}

export function clearPrevState() {
    return {
        type: Clear_Prev_State,
    }
}

export function fetchCategory(object) {
    return dispatch => fetchNew(location.origin + '/techinfo', 'get')
        .then(jsonResult => {
            if (jsonResult.code === 0) {
                return dispatch({
                    type: Fetch_Category,
                    categorys: jsonResult.data.cat
                })
            }
        })
        .catch(error => console.info('request error: ', error))
}

function stringParam(object) {
    if (object === undefined) return;
    let serializedString = '';
    Object.keys(object).forEach(key => {
        serializedString += serializedString ? `&${key}=${object[key]}` : `${key}=${object[key]}`;
    });
    return serializedString;
}
