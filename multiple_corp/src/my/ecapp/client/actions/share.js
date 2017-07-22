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

function _fetchData(pageIndex) {
    var url = host + '/ecapp/share/get';

    return dispatch => {
        setLoading(dispatch);
        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "page=" + pageIndex + "&ec_csrf_token=" + Cookie.get("ec_csrf_token"),
            credentials: 'include'
        }).then(res => {
            checkHttpStatus(res);
            return res.json();
        }).then(json => {
            if (!json) {
                return;
            }

            dispatch({
                type: actions['DATA_READY'],
                json: json
            });
        })
    }
}

function fetchData(pageIndex) {
    return (dispatch, getState) => {
        return dispatch(_fetchData(pageIndex));
    }
}


function setshareReqInfo(dispatch, info) {
    dispatch({
        type: actions["SET_REQ_DATA"],
        reqData: info
    });
}

function _req(data) {
    var url = host + '/ecapp/share/doreq';
    return dispatch => {

        setshareReqInfo(dispatch, data);
        var arr = [];
        for (var o in data) {
            arr.push(o + '=' + data[o]);
        }
        return fetch(url, {
            method: "POST",
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
                json: json
            });
        })
    }
}
function req(data) {
    return (dispatch, getState) => {
        return dispatch(_req(data))
    }
}

function setLoading(dispatch) {
    dispatch({
        type: actions['LOADING'],
        data: true
    });
}

export { actions, fetchData, req };