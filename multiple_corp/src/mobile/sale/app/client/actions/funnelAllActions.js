import mobileError from '~comm/components/mobileError';
import * as funnelAllTypes from '../constants/funnelAllTypes';
import restHub from '../util/restHub';
import ApiUrls from '../constants/ApiUrls';
import { getSerializedObject } from '../util/utils';
import Cookie from 'react-cookie';


export function filterChange(payload) {
    return {
        type: funnelAllTypes.FILTER_CHANGE,
        payload
    }
}

export function switchTab(payload) {
    return {
        type: funnelAllTypes.SWITCH_TAB,
        payload
    }
}


export function initState(payload) {
    return {
        type: funnelAllTypes.INIT_STATE,
        payload
    }
}

//获取授权接口
export const getAuth = ()=> {
    return (dispatch, getState) => {
        dispatch({
            type:funnelAllTypes.FETCHING
        });
        return restHub.get(ApiUrls.getAuth)
            .then((res) => {
                if (res && res.code == 200) {
                    dispatch({
                        type: funnelAllTypes.FETCH_AUTH_SUCCESS,
                        payload: res.data
                    });
                } else {
                    mobileError(res.msg);
            }
        })
    }
}


//销售漏斗首页数据
export const fetchFunnelData = (params = {}) => dispatch => {
    dispatch({
        type:funnelAllTypes.FETCHING
    });
    return restHub.postForm(ApiUrls.getFunnelData, {
        body: params
    }).then((res) => {
        if (res.code == 200) {
            dispatch({
                type:funnelAllTypes.FETCH_FUNNEL_SUCCESS,
                payload:res.data
            });
        }
        else {
            mobileError(res.msg);
        }
    })
}

//显示首次进来的提示浮层
export const getTip = () => dispatch => {
    return restHub.get(ApiUrls.getTip, {
        params:{
            pagetype:27
        }
    }).then((res) => {
        if (res.ret === '0') {
            if(res.num=='0'){
                dispatch({
                    type: funnelAllTypes.FETCH_GET_TIP_SUCCESS,
                    payload: true
                })
            }
            else{
                dispatch({
                    type: funnelAllTypes.FETCH_GET_TIP_SUCCESS,
                    payload: false
                })
            }
        }
        else {
            mobileError(res.msg);
        }
    })
}

//取消首次进来的提示浮层
export const setTip = () => dispatch => {
    return restHub.get(ApiUrls.setTip, {
        params:{
            pagetype:27
        }
    }).then((res) => {
        if (res.ret === '0') {
            dispatch({
                type: funnelAllTypes.FETCH_SET_TIP_SUCCESS,
                payload: false
            })
        }
        else {
            mobileError(res.msg);
        }
    })
}