import mobileError from '~comm/components/mobileError';
import * as billDetailTypes from '../constants/billDetailTypes';
import restHub from '../util/restHub';
import ApiUrls from '../constants/ApiUrls';
import { getSerializedObject } from '../util/utils';
import Cookie from 'react-cookie';


export function initState(payload) {
    return {
        type: billDetailTypes.INIT_STATE,
        payload
    }
}

//单据列表数据
export const fetchBillDetail = (params = {}) => dispatch => {
    dispatch({
        type: billDetailTypes.FETCHING,
    });
    return restHub.postForm(ApiUrls.getBillDetail, {
        body: params
    }).then((res) => {
        // console.warn(res); 
        if (res.code == 200) {
            dispatch({
                type:billDetailTypes.FETCH_BILL_DETAIL_SUCCESS,
                payload:res.data
            });
        }
        else {
            mobileError(res.msg);
        }
    })
}