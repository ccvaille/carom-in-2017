import mobileError from '~comm/components/mobileError';
import * as goalDeptTypes from '../constants/goalDeptTypes';
import restHub from '../util/restHub';
import ApiUrls from '../constants/ApiUrls';
import { getSerializedObject } from '../util/utils';
import Cookie from 'react-cookie';


export function pageChange(payload) {
    return {
        type: goalDeptTypes.PAGE_CHANGE,
        payload
    }
}

export function initState(payload) {
    return {
        type: goalDeptTypes.INIT_STATE,
        payload
    }
}


//获取授权接口
export const getAuth = ()=> {
    return (dispatch, getState) => {
        dispatch({
            type:goalDeptTypes.FETCHING
        });
        return restHub.get(ApiUrls.getAuth)
            .then((res) => {
                if (res && res.code == 200) {
                    let state = getState().goalReducers;
                    dispatch(fetchGoalStat({
                        year:state.year,
                        m:state.month,
                        show:1,
                    }));
                    dispatch({
                        type: goalDeptTypes.FETCH_AUTH_SUCCESS,
                        payload: res.data
                    });
                    
                } else {
                    mobileError(res.msg);
            }
        })
    }
}

//查看目标
export const fetchGoalStat = (params = {}) => dispatch => {
    dispatch({
        type:goalDeptTypes.FETCHING
    });
    return restHub.postForm(ApiUrls.getGoalStat, {
        body: params
    }).then((res) => {
        if (res.code == 200) {
            dispatch({
                type:goalDeptTypes.FETCH_GOAL_SUCCESS,
                payload:res.data
            });
        }
        else {
            mobileError(res.msg);
        }
    })
}


