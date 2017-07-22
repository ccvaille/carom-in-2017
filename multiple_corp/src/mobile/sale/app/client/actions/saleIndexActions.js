import mobileError from '~comm/components/mobileError';
import * as saleIndexTypes from '../constants/saleIndexTypes';
import restHub from '../util/restHub';
import ApiUrls from '../constants/ApiUrls';
import { getSerializedObject } from '../util/utils';
import Cookie from 'react-cookie';


export function switchTab(payload) {
    return {
        type: saleIndexTypes.SWITCH_TAB,
        payload
    }
}

export function initState(payload) {
    return {
        type: saleIndexTypes.INIT_STATE,
        payload
    }
}

//获取授权接口
export const getAuth = ()=> {
    return (dispatch, getState) => {
        dispatch({
            type:saleIndexTypes.FETCHING
        });
        return restHub.get(ApiUrls.getAuth)
            .then((res) => {
                if (res && res.code == 200) {
                    dispatch({
                        type: saleIndexTypes.FETCH_AUTH_SUCCESS,
                        payload: res.data
                    });
                    let state = getState().saleIndexReducers;
                    if(res.data.funnel!==0){
                        dispatch(fetchFunnelData());
                    }
                    if(res.data.rank===2){
                        dispatch(fetchUserRankData({
                            year:state.year,
                            m:state.month
                        }));
                    }
                    if(res.data.target!==0){
                        dispatch(fetchGoalStat({
                            year:state.year,
                            m:state.month
                        }));
                    }
                } else {
                    mobileError(res.msg);
            }
        })
    }
}


//查看目标
export const fetchGoalStat = (params = {}) => dispatch => {
    dispatch({
        type:saleIndexTypes.FETCHING
    });
    return restHub.postForm(ApiUrls.getGoalStat, {
        body: params
    }).then((res) => {
        if (res.code == 200) {
            dispatch({
                type:saleIndexTypes.FETCH_GOAL_SUCCESS,
                payload:res.data
            });
        }
        else {
            mobileError(res.msg);
        }
    })
}

//销售漏斗首页数据
export const fetchFunnelData = (params = {}) => dispatch => {
    dispatch({
        type:saleIndexTypes.FETCHING
    });
    return restHub.postForm(ApiUrls.getFunnelData, {
        body: params
    }).then((res) => {
        if (res.code == 200) {
            dispatch({
                type:saleIndexTypes.FETCH_FUNNEL_SUCCESS,
                payload:res.data
            });
        }
        else {
            mobileError(res.msg);
        }
    })
}



//查看员工贡献排行
export const fetchUserRankData = (params = {}) => dispatch => {
    dispatch({
        type:saleIndexTypes.FETCHING
    });
    return restHub.postForm(ApiUrls.getUserRank, {
        body: params
    }).then((res) => {
        if (res.code == 200) {
            dispatch({
                type:saleIndexTypes.FETCH_RANK_SUCCESS,
                payload:res.data
            });
        }
        else {
            mobileError(res.msg);
        }
    })
}
