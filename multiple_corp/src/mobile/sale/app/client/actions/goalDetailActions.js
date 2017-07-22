import mobileError from '~comm/components/mobileError';
import * as goalDetailTypes from '../constants/goalDetailTypes';
import restHub from '../util/restHub';
import ApiUrls from '../constants/ApiUrls';
import { getSerializedObject } from '../util/utils';
import Cookie from 'react-cookie';


export function initState(payload) {
    return {
        type: goalDetailTypes.INIT_STATE,
        payload
    }
}


//查看目标
export const fetchGoalStat = (params = {}) => dispatch => {
    dispatch({
        type:goalDetailTypes.FETCHING
    });
    return restHub.postForm(ApiUrls.getGoalStat, {
        body: params
    }).then((res) => {
        if (res.code == 200) {
            dispatch({
                type:goalDetailTypes.FETCH_GOAL_SUCCESS,
                payload:res.data
            });
        }
        else {
            mobileError(res.msg);
        }
    })
}

//查看年完成率
export const fetchYearRate = (params = {}) => dispatch => {
    dispatch({
        type:goalDetailTypes.FETCHING
    });
    return restHub.postForm(ApiUrls.getYearRate, {
        body: params
    }).then((res) => {
        if (res.code == 200) {
            dispatch({
                type:goalDetailTypes.FETCH_YEAR_RATE_SUCCESS,
                payload:res.data
            });
        }
        else {
            mobileError(res.msg);
        }
    })
}
