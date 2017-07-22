import mobileError from '~comm/components/mobileError';
import * as rankAllTypes from '../constants/rankAllTypes';
import restHub from '../util/restHub';
import ApiUrls from '../constants/ApiUrls';
import { getSerializedObject } from '../util/utils';
import Cookie from 'react-cookie';


export function filterChange(payload) {
    return {
        type: rankAllTypes.FILTER_CHANGE,
        payload
    }
}

export function switchTab(payload) {
    return {
        type: rankAllTypes.SWITCH_TAB,
        payload
    }
}

export function initState(payload) {
    return {
        type: rankAllTypes.INIT_STATE,
        payload
    }
}

export function pageChange(payload) {
    return {
        type: rankAllTypes.PAGE_CHANGE,
        payload
    }
}


//获取授权接口
export const getAuth = ()=> {
    return (dispatch, getState) => {
        dispatch({
            type:rankAllTypes.FETCHING
        });
        return restHub.get(ApiUrls.getAuth)
            .then((res) => {
                if (res && res.code == 200) {
                    dispatch({
                        type: rankAllTypes.FETCH_AUTH_SUCCESS,
                        payload: res.data
                    });
                } else {
                    mobileError(res.msg);
            }
        })
    }
}



//查看员工贡献排行
export const fetchUserRankData = (params = {}) => dispatch => {
    dispatch({
        type:rankAllTypes.FETCHING
    });
    return restHub.postForm(ApiUrls.getUserRank, {
        body: params
    }).then((res) => {
        if (res.code == 200) {
            dispatch({
                type:rankAllTypes.FETCH_USER_RANK_SUCCESS,
                payload:res.data
            });
        }
        else {
            mobileError(res.msg);
        }
    })
}


//查看部门贡献排行
export const fetchDeptRankData = (params = {}) => dispatch => {
    dispatch({
        type:rankAllTypes.FETCHING
    });
    return restHub.postForm(ApiUrls.getDeptRank, {
        body: params
    }).then((res) => {
        if (res.code == 200) {
            dispatch({
                type:rankAllTypes.FETCH_DEPT_RANK_SUCCESS,
                payload:res.data
            });
        }
        else {
            mobileError(res.msg);
        }
    })
}


