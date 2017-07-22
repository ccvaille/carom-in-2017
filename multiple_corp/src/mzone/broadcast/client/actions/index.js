import fetch from 'isomorphic-fetch';
import Cookie from 'react-cookie';
import { message } from 'antd';

export const Fetch_Members = 'Fetch_Members';
export const Fetch_Broadcast_List = 'Fetch_Broadcast_List';
export const Fetch_Broadcast_Detail = 'Fetch_Broadcast_Detail';
export const Scroll_Load_More = 'Scroll_Load_More';
export const Remove_Broadcast = 'Remove_Broadcast';
export const Clear_Editor_State = 'Clear_Editor_State';
export const Recall_Broadcast = 'Recall_Broadcast';
export const Search_Members = 'Search_Members';

function fetchOld(url, type, body) {
    var opts = {
        mode: 'cors',
        credentials: 'include',
        method: type,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    }
    if (opts.method === "post") {
        // opts.headers['Content-Type'] = 'application/json';
        // opts.headers["X-XSRF-TOKEN"] = Cookie.load('XSRF-TOKEN'),
        body.ec_csrf_token = Cookie.load('ec_csrf_token');
        opts.body = stringParam(body);
    }
    return fetch(url, opts).then(res => {
        return res.json();
    })
}

function checkLogin(jsonResult) {
    if (jsonResult.code === 401) {
        location.href = "//my.workec.com?fromurl=" + location.href;
        return false
    } else {
        return true;
    }
}

// fetch 组织架构成员
export function fetchMembers(id) {
    return dispatch => fetchOld('//my.workec.com/service/index/getcrop', 'get')
        .then(jsonResult => {
            return dispatch({
                type: Fetch_Members,
                membersData: jsonResult.item
            })
        })
        .catch(error => console.info('request error: ', error))
}


// 搜索员工账号
export function searchUsername(stxt) {
    return dispatch => fetchOld('//my.workec.com/crm/share/schuser/', 'post', {stxt: stxt})
        .then(jsonResult => {
            return dispatch({
                type: Search_Members,
                searchMembers: jsonResult.info,
                searchValue: stxt
            })
        })
        .catch(error => console.info('request error: ', error))
}

// fetch 广播列表
export function fetchBroadcastList(params) {
    return dispatch => fetchOld('https://mzone.workec.com/bdcast/index/list?' + stringParam(params), 'get')
        .then(jsonResult => {
            if(!checkLogin(jsonResult)) return;
            if (jsonResult.code == 200) {
                var curPage, filter;
                if (params) {
                    curPage = params.page;
                    filter = params.type;
                }
                curPage = curPage ? curPage : 1;
                filter = filter ? filter : 1;
                return dispatch({
                    type: Fetch_Broadcast_List,
                    broadcastList: jsonResult.data,
                    noMoreData: curPage == jsonResult.page.totalpage,
                    noData: jsonResult.totalcount == 0,
                    curPage: curPage,
                    filter: +filter
                })
            } else {
                message.warning(jsonResult.msg);
            }
        })
        .catch(error => console.info('request error: ', error))
}

// fetch 广播详情
export function fetchBroadcastDetail(id) {
    return dispatch => fetchOld('https://mzone.workec.com/bdcast/index/edit?bdid=' + id, 'get')
        .then(jsonResult => {
            if(!checkLogin(jsonResult)) return;
            if (jsonResult.code == 200) {
                return dispatch({
                    type: Fetch_Broadcast_Detail,
                    broadcastDetail: jsonResult.data
                })
            } else {
                message.warning(jsonResult.msg);
            }
        })
        .catch(error => console.info('request error: ', error))
}

// 发布广播
export function publishBroadcast(params, publishOnce) {
    return dispatch => fetchOld('https://mzone.workec.com/bdcast/index/publish', 'post', params)
        .then(jsonResult => {
            if(!checkLogin(jsonResult)) return;
            if (jsonResult.code == 200) {
                location.href = '/mzone/broadcast/list.html';
            } else {
                publishOnce = true;
                message.warning(jsonResult.msg);
            }
        })
        .catch(error => console.info('request error: ', error))
}

// 保存广播
export function saveToDraft(params, draftOnce) {
    return dispatch => fetchOld('https://mzone.workec.com/bdcast/index/postbd', 'post', params)
        .then(jsonResult => {
            if(!checkLogin(jsonResult)) return;
            if (jsonResult.code == 200) {
                location.href = '/mzone/broadcast/list.html';
            } else {
                draftOnce = true;
                message.warning(jsonResult.msg);
            }
        })
        .catch(error => console.info('request error: ', error))
}

// 改变广播状态
export function changeState(params, index) {
    return dispatch => fetchOld('https://mzone.workec.com/bdcast/index/set', 'post', params)
        .then(jsonResult => {
            if(!checkLogin(jsonResult)) return;
            if (jsonResult.code == 200) {
                if (params.status == 3) {
                    message.success('撤回成功');
                    // setTimeout(function() {
                    //     location.reload()
                    // }, 300)
                    return dispatch({
                        type: Recall_Broadcast,
                        recallTime: jsonResult.data,
                        id: params.bdid
                    })
                } else {
                    message.success('删除成功');
                    return dispatch({
                        type: Remove_Broadcast,
                        id: params.bdid
                    })
                }
            } else {
                message.warning(jsonResult.msg);
            }
        })
        .catch(error => console.info('request error: ', error))
}


export function clearEditorState() {
    return {
        type: Clear_Editor_State,
    }
}

function stringParam(object) {
    if (object === undefined) return;
    let serializedString = '';
    Object.keys(object).forEach(key => {
        serializedString += serializedString ? `&${key}=${object[key]}` : `${key}=${object[key]}`;
    });
    return serializedString;
}

var bindScrollGetMore = (function() {
    var scrollFn;

    var wrapScrollFn = function(fn, scrollDom) {
        let canRun = true;
        var _fn = function(e) {
            if (scrollDom.scrollHeight - scrollDom.scrollTop - scrollDom.clientHeight < 300) {
                if (!canRun) return;
                canRun = false;
                fn();
                setTimeout(() => {
                    canRun = true;
                }, 500);
            }
        }
        return _fn;
    }
    return function(fn, scrollDom) {
        if (!scrollDom) scrollDom = window;
        if (scrollFn) {
            scrollDom.removeEventListener('scroll', scrollFn);
        }
        if (fn) {
            fn = wrapScrollFn(fn, scrollDom);
            scrollDom.addEventListener('scroll', fn);
            scrollFn = fn;
        }
        return { type: Scroll_Load_More };
    }
})();

export { bindScrollGetMore }