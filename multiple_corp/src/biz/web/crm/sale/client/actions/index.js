import fetch from 'isomorphic-fetch'
import Cookie from 'react-cookie'
import Message from '../components/Message'
import { message } from 'antd'

import {
    GET_SALEMONEY_INDEX,
    GET_SALEMONEY_INDEX_REQUEST,
    GET_SALEMONEY_INDEX_SUCCESS,
    GET_SALEMONEY_INDEX_FAILURE,

    SHOWPARAMS,
    SHOWPARAMS_REQUEST,
    SHOWPARAMS_SUCCESS,
    SHOWPARAMS_FAILURE,

    ADDGROUP,
    ADDGROUP_REQUEST,
    ADDGROUP_SUCCESS,
    ADDGROUP_FAILUER,

    EDITGROUP,
    EDITGROUP_REQUEST,
    EDITGROUP_SUCCESS,
    EDITGROUP_FAILURE,

    HANDLEFIELD,
    HANDLEFIELD_REQUEST,
    HANDLEFIELD_SUCCESS,
    HANDLEFIELD_FAILURE,

    DELGROUP,
    DELGROUP_REQUEST,
    DELGROUP_SUCCESS,
    DELGROUP_FAILURE,

    MOVEGROUP,
    MOVEGROUP_REQUEST,
    MOVEGROUP_SUCCESS,
    MOVEGROUP_FAILUER,

    DELFIELD,
    DELFIELD_REQUEST,
    DELFIELD_SUCCESS,
    DELFIELD_FAILURE,

    MOVEFIELD,
    MOVEFIELD_REQUEST,
    MOVEFIELD_SUCCESS,
    MOVEFIELD_FAILURE,

    UPDATE_FIELD,

    SELECT_TYPE,

    REPEATING_FIELD,
    MODAL_VISIBLE,

    POST_SUCCESS,

    NAME_VALID,
    NAME_UNVALID,
    SHOW_GUIDE_CHANGE

} from './types'


const ROOT_URL = 'https://biz.workec.com/crm/salemoney/'

function _fetch(url, type, body) {
    // let _fetch_url = ROOT_URL + url;
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
    return fetch(url, reqHeader).then(res => {
        if (res.status === 401) {
            location.href = "//corp.workec.com";
        }
        else if (res.status === 403) {
            location.href = "//html.workec.com/error/403.html"
            //message.error('您没有权限！');
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
            console.log(error);
        })
}

// 1 get salemoney index
export const fetchSalemoneyIndex = () => {
    return dispatch => {
        return _fetch(ROOT_URL+'index', 'get')
            .then(json => {
                return dispatch({
                    type: GET_SALEMONEY_INDEX_SUCCESS,
                    data: json
                })
            })
    }
}


// 2 get showparams
export const fetchShowparams = (id) => {
    return dispatch => {
        return _fetch(ROOT_URL+'showparams', 'get', { id: id })
            .then(json => {
                return dispatch({
                    type: SHOWPARAMS_SUCCESS,
                    data: json
                })
            })
    }
}

// 3 post addgroup
export const fetchAddgroup = (data) => {
    return dispatch => {
        dispatch(updateUIField({ isUpdate: false }))
        return _fetch(ROOT_URL+'addgroup', 'post', data)
            .then(json => {

                if (json.code == 200) {
                    dispatch(successMessage({ success: true, msg: json.msg }))
                    dispatch(modalVisible({ visible: false }))
                }
                else {
                    dispatch(successMessage({ success: false, msg: json.msg }))
                }

                if (json.code == 40405 || json.code == 40402) { //|| json.code == 4001
                    dispatch(repeatingField({ data: json }))
                }
                else {
                    dispatch(modalVisible({ visible: false }))
                    return dispatch({
                        type: ADDGROUP_SUCCESS,
                        data: json
                    })
                }
            })
            .then(json => {
                dispatch(fetchSalemoneyIndex())
            })
    }
}

// 4 post editgroup
export const fetchEditgroup = (data) => {
    return dispatch => {
        dispatch(updateUIField({ isUpdate: false }))
        return _fetch(ROOT_URL+'editgroup', 'post', data)
            .then(json => {
                if (json.code == 40405 || json.code == 40402) { //|| json.code == 4001
                    dispatch(repeatingField({ data: json }))
                }
                else {
                    if (json.code == 200) {
                        dispatch(successMessage({ success: true, msg: json.msg }))
                    }
                    else {
                        dispatch(successMessage({ success: false, msg: json.msg }))
                    }

                    return dispatch({
                        type: EDITGROUP_SUCCESS,
                        data: json
                    })
                }
            })
            .then(json => {
                dispatch(fetchSalemoneyIndex())
            })
    }
}

// 5 post handlefield
export const fetchHandlefield = (data) => {

    return dispatch => {
        dispatch(updateUIField({ isUpdate: false }))
        return _fetch(ROOT_URL+'handlefield', 'post', data)
            .then(json => {
                if (json.code == 40405 || json.code == 40402) { //|| json.code == 4001
                    dispatch(repeatingField({ data: json }))
                }
                else {
                    dispatch(modalVisible({ visible: false }))
                    if (json.code == 200) {
                        dispatch(successMessage({ success: true, msg: json.msg }))
                    }
                    else {
                        dispatch(successMessage({ success: false, msg: json.msg }))
                    }

                    return dispatch({
                        type: HANDLEFIELD_SUCCESS,
                        data: json
                    })
                }
            })
            .then(json => {
                dispatch(fetchSalemoneyIndex())
            })
    }
}

// 6 post delgroup
export const fetchDelgroup = (id) => {
    return dispatch => {
        return _fetch(ROOT_URL+'delgroup', 'post', { id: id })
            .then(json => {

                if (json.code == 200) {
                    //if (json.code == 40405 || json.code == 40402 ) { }
                    dispatch(successMessage({ success: true, msg: json.msg }))
                }
                else {
                    dispatch(successMessage({ success: false, msg: json.msg }))
                    return dispatch({
                        type: DELGROUP_SUCCESS,
                        data: json
                    })
                }
            })
    }
}



// 7 post movegroup
export const fetchMovegroup = (ids) => {
    return dispatch => {
        return _fetch(ROOT_URL+'movegroup', 'post', { ids: ids })
            .then(json => {
                return dispatch({
                    type: MOVEGROUP_SUCCESS,
                    data: json
                })
            })
    }
}

// 8 post delfield
export const fetchDelfield = (group_id, id) => {
    return dispatch => {
        return _fetch(ROOT_URL+'delfield', 'post', { group_id: group_id, id: id })
            .then(json => {

                if (json.code == 200) {
                    dispatch(successMessage({ success: true, msg: json.msg }))
                }
                else {
                    dispatch(successMessage({ success: false, msg: json.msg }))
                }

                return dispatch({
                    type: DELFIELD_SUCCESS,
                    data: json
                })
            })

    }
}

// 9 post movefield
export const fetchMovefield = (group_id, ids) => {
    return dispatch => {
        return _fetch(ROOT_URL+'movefield', 'post', { group_id: group_id, ids: ids })
            .then(json => {
                return dispatch({
                    type: MOVEFIELD_SUCCESS,
                    data: json
                })
            })
    }
}

// 10 ui updateField
export const updateUIField = (data) => {
    return dispatch => {
        return dispatch({
            type: UPDATE_FIELD,
            data: data
        })
    }
}

// 11 select type
export const selectType = (data) => {
    return dispatch => {
        return dispatch({
            type: SELECT_TYPE,
            data: data
        })
    }
}

// 12  repeating field
export const repeatingField = (data) => {
    return dispatch => {
        return dispatch({
            type: REPEATING_FIELD,
            data: data
        })
    }
}


// 13 modal visible
export const modalVisible = (data) => {
    return dispatch => {
        return dispatch({
            type: MODAL_VISIBLE,
            data: data
        })
    }
}

// 15 post success
export const successMessage = (data) => {
    return dispatch => {
        return dispatch({
            type: POST_SUCCESS,
            data: data
        })
    }
}

export const nameVaild = (data) => {
    return dispatch => {
        return dispatch({
            type: NAME_VALID,
            data: true
        })
    }
}

export const nameUnVaild = (data) => {
    return dispatch => {
        return dispatch({
            type: NAME_UNVALID,
            data: false
        })
    }
}


export const fetchGetip = () => {
    return dispatch => {
        return _fetch('https://biz.workec.com/crm/tip/show?pagetype=23', 'get')
            .then(json => {
                if(json.code==200){
                    if(json.data.num=='0'){
                        return dispatch({
                            type: SHOW_GUIDE_CHANGE,
                            data: true
                        })
                    }
                }
            })
    }
}
export const setGuideOk = () => {
    return dispatch => {
        return _fetch('https://biz.workec.com/crm/tip/close?pagetype=23', 'get')
            .then(json => {
                if(json.code==200){
                    return dispatch({
                        type: SHOW_GUIDE_CHANGE,
                        data: false
                    })
                }
            })
    }
}
