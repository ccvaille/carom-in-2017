import mobileError from '~comm/components/mobileError';
import * as stageTypes from '../constants/stageTypes';
import restHub from '../util/restHub';
import ApiUrls from '../constants/ApiUrls';
import { getSerializedObject } from '../util/utils';
import Cookie from 'react-cookie';


export function pageChange(payload) {
    return {
        type: stageTypes.PAGE_CHANGE,
        payload
    }
}

export function initState(payload) {
    return {
        type: stageTypes.INIT_STATE,
        payload
    }
}


//单据列表数据
export const fetchBillList = (params = {}) => (dispatch,getState) => {
    let pageIndex = getState().stageReducers.pageIndex;
    if(pageIndex==1){
        dispatch({
            type:stageTypes.FETCHING
        });
    }
    return restHub.postForm(ApiUrls.getBillList, {
        body: params
    }).then((res) => {
        if (res.code == 200) {
            dispatch({
                type:stageTypes.FETCH_BILL_LIST_SUCCESS,
                payload:res
            });
        }
        else {
            mobileError(res.msg);
        }
    })
}
