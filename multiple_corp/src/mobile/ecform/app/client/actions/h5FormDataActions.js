import mobileError from '~comm/components/mobileError';
import restHub from '~comm/services/restHub';
import ApiUrls from 'constants/ApiUrls';
import * as H5FormDataTypes from 'constants/H5FormDataTypes';

//获取数据列表
export function getDataList(payload) {
    let url = ApiUrls.getDataList +
        '?page=' + payload.page +'&per=' +  payload.per;
    return (dispatch, getState) => {
        const { formId } = getState().h5FormDataReducers;
        const { activeTabGroupMenu } = getState().h5FormReducers;

        url += '&formId=' + formId;
        if (activeTabGroupMenu == '4') {
            url += '&tome=1';
        }
        dispatch({
            type: H5FormDataTypes.IS_DATA_LOADING,
            payload: true
        })
        return restHub.get(url)
            .then(({ errorMsg, jsonResult }) => {

                if (!errorMsg) {
                    if (payload.isRefresh) {
                        dispatch({
                            type: H5FormDataTypes.INIT_DATA_LIST,
                            payload: {
                                totalpage: jsonResult.page.totalpage,
                                curr: jsonResult.page.curr,
                                data: jsonResult.data,
                                head: jsonResult.head
                            }
                        });
                        dispatch({
                            type: H5FormDataTypes.DATA_REFRESHING,
                            payload: false
                        })
                    } else {

                        dispatch({
                            type: H5FormDataTypes.ADD_DATA_LIST,
                            payload: {
                                totalpage: jsonResult.page.totalpage,
                                curr: jsonResult.page.curr,
                                data: jsonResult.data,
                                head: jsonResult.head
                            }
                        });
                    }

                } else {
                   mobileError('系统繁忙');
                }

                dispatch({
                    type: H5FormDataTypes.IS_DATA_LOADING,
                    payload: false
                })
            })
    }
}

export function setFormId(payload) {
    return {
        type: H5FormDataTypes.SET_FORM_ID,
        payload
    }
}

export function dataRefreshing(payload) {
    return {
        type: H5FormDataTypes.DATA_REFRESHING,
        payload
    }
}

export function clearDataList() {
    return {
        type: H5FormDataTypes.CLEAR_DATA_LIST
    }
}

