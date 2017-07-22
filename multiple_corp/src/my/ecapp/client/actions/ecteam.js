import fetch from 'isomorphic-fetch';
import { message } from 'antd';
import { host, checkHttpStatus, Cookie } from './comm';

const actions = {
    'DATA_READY': Symbol(),
    'LOADING': Symbol(),
    'RESET': Symbol()
};

function _fetchData(pageIndex) {
    var url = host + '/ecapp/ec/get';
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

function setLoading(dispatch) {
    dispatch({
        type: actions['LOADING'],
        data: true
    });
}

export { actions, fetchData };