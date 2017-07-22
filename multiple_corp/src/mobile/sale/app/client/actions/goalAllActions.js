import mobileError from '~comm/components/mobileError';
import * as goalAllTypes from '../constants/goalAllTypes';
import restHub from '../util/restHub';
import ApiUrls from '../constants/ApiUrls';
import { getSerializedObject } from '../util/utils';
import Cookie from 'react-cookie';


export function filterChange(payload) {
    return {
        type: goalAllTypes.FILTER_CHANGE,
        payload
    }
}

export function pageChange(payload) {
    return {
        type: goalAllTypes.PAGE_CHANGE,
        payload
    }
}

export function initState(payload) {
    return {
        type: goalAllTypes.INIT_STATE,
        payload
    }
}

//获取授权接口
export const getAuth = ()=> {
    return (dispatch, getState) => {
        dispatch({
            type:goalAllTypes.FETCHING
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
                        type: goalAllTypes.FETCH_AUTH_SUCCESS,
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
        type:goalAllTypes.FETCHING
    });
    return restHub.postForm(ApiUrls.getGoalStat, {
        body: params
    }).then((res) => {
        if (res.code == 200) {
            dispatch({
                type:goalAllTypes.FETCH_GOAL_SUCCESS,
                payload:res.data
            });
        }
        else {
            mobileError(res.msg);
        }
    })
}


