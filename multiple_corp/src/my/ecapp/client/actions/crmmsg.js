import fetch from 'isomorphic-fetch';
import { message } from 'antd';
import { host, checkHttpStatus, Cookie } from './comm';

const actions = {
    'DATA_READY': Symbol(),
    'LOADING': Symbol(),
    'RESET': Symbol(),
    'SET_REQ_DATA': Symbol(),
    'OPERATE_REQUEST': Symbol()
};

function _fetchData(obj) {
    // var url = host + '/ecapp/share/get';
    var url = 'https://my.workec.com/crm/msg/msglist' + (obj ? '?' + stringParam(obj) : '');
    // var url = '/crm/msg/msglist' + (obj ? '?' + stringParam(obj) : '');
    var crmType = obj && obj.type ? obj.type : 0;
    return dispatch => {
        setLoading(dispatch, crmType);
        return fetch(url, {
            mode: 'cors',
            credentials: 'include',
            method: 'get',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            // body: "page=" + pageIndex + "&ec_csrf_token=" + Cookie.get("ec_csrf_token"),
        }).then(res => {
            checkHttpStatus(res);
            return res.json();
        }).then(json => {
            if (!json) {
                return;
            }
            dispatch({
                type: actions['DATA_READY'],
                json: json,
                isFirstPage: obj && obj.begin_id ? false : true,
                crmType: obj ? obj.type : 0
            });
        })
    }
}

function fetchData(obj) {
    return (dispatch, getState) => {
        return dispatch(_fetchData(obj));
    }
}


function setshareReqInfo(dispatch, info) {
    dispatch({
        type: actions["SET_REQ_DATA"],
        reqData: info
    });
}

function _req(data) {
    // var url = host + '/ecapp/share/doreq';
    var url = 'https://my.workec.com/crm/msg/isagreeshare';
    return dispatch => {

        setshareReqInfo(dispatch, data);
        var arr = [];
        for (var o in data) {
            arr.push(o + '=' + data[o]);
        }
        return fetch(url, {
            method: "POST",
            mode: 'cors',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                // 'x-requested-with': 'XMLHttpRequest'
            },
            body: arr.join('&'),
            credentials: 'include'
        }).then(res => {
            checkHttpStatus(res);

            return res.json();
        }).then(json => {
            if (!json) {
                return;
            }
            dispatch({
                type: actions["OPERATE_REQUEST"],
                json: json,
                doType: data.do_type
            });
        })
    }
}
function req(data) {
    return (dispatch, getState) => {
        return dispatch(_req(data))
    }
}

function setLoading(dispatch, crmType) {
    dispatch({
        type: actions['LOADING'],
        data: true,
        crmType: crmType
    });
}


function stringParam(object) {
    if (object === undefined) return;
    let serializedString = '';
    Object.keys(object).forEach(key => {
        serializedString += serializedString ? `&${key}=${object[key]}` : `${key}=${object[key]}`;
    });
    return serializedString;
}

export { actions, fetchData, req };