import mobileError from '~comm/components/mobileError';
import restHub from '~comm/services/restHub';
import ApiUrls from 'constants/ApiUrls';
import * as H5FormTypes from 'constants/H5FormTypes';

const getSerializedObject = (object) => {
  let serializedString = '';
  Object.keys(object).filter((item) => {
    return item !== 'isRefresh';
  }).forEach(key => {
    serializedString += serializedString ? `&${key}=${object[key]}` : `${key}=${object[key]}`;
  });
  return '?' + serializedString;
};

export function example(payload) {
    return {
        type: H5FormTypes.EXAMPLE,
        payload
    }
}

export function switchTab(payload) {
    return {
        type: H5FormTypes.ACTIVE_TAB,
        payload
    }
}

export function changeTabGroupMenu(payload) {
    return {
        type: H5FormTypes.ACTIVE_TAB_GROUP_MENU,
        payload
    }
}
export function changeTabTimeMenu(payload) {
    return {
        type: H5FormTypes.ACTIVE_TAB_TIME_MENU,
        payload
    }
}
export function getClassList(payload) {
    return (dispatch, getState) => {

        return restHub.get(ApiUrls.getClass)
            .then(({ errorMsg, jsonResult }) => {
                if (!errorMsg) {
                    dispatch({
                        type: H5FormTypes.CLASS_LIST,
                        payload: jsonResult.data
                    });
                } else {
                    mobileError('系统繁忙');
                }
            })
    }
}
//获取首页列表
export function getFormListMe(payload) {

    let url = ApiUrls.getFormListMe;
    return (dispatch, getState) => {
        fetchFormList(url, dispatch, getState, payload, 'me');
    }
}
export function getFormListNoMe(payload) {
    let url = ApiUrls.getFormListNoMe;
    return (dispatch, getState) => {
        fetchFormList(url, dispatch, getState, payload);
    }
}

function fetchFormList(url, dispatch, getState, payload, type) {
    const {
        activeTabGroupMenu,
        activeTabTimeMenu,
        sureActiveTagIds,
    } = getState().h5FormReducers;
    const classIds = Object.keys(sureActiveTagIds).filter((item) => {
        return sureActiveTagIds[item]
    }).map((element) => {
        return sureActiveTagIds[element]
    }).join(',');
    let state;
    let order = activeTabTimeMenu;

    switch (activeTabGroupMenu) {
        case 1:
            state = 3;
            break;
        case 2:
            state = 4;
            break;
        case 3:
            state = 2;
            break;
    }
    if (type) {
        payload.classIds = classIds;
    } else {
        payload.state = state;
        payload.order = order;
        payload.classIds = classIds;
    }
    return restHub.get(url + getSerializedObject(payload))
        .then(({ errorMsg, jsonResult }) => {
            if (!errorMsg) {
                if (payload.isRefresh) {
                    dispatch({
                        type: H5FormTypes.INIT_FORM_LIST,
                        payload: {
                            totalpage: jsonResult.page.totalpage,
                            curr: 1,
                            data: jsonResult.data
                        }
                    });
                    dispatch({
                        type: H5FormTypes.IS_REFRESHING,
                        payload: false
                    })
                } else {
                    dispatch({
                        type: H5FormTypes.ADD_FORM_LIST,
                        payload: {
                            totalpage: jsonResult.page.totalpage,
                            curr: jsonResult.page.curr,
                            data: jsonResult.data
                        }
                    });
                }

            } else {
                mobileError('系统繁忙');
            }
            dispatch({
                type: H5FormTypes.IS_FORM_LOADING,
                payload: false
            })
        })
}

export function loadSearchData(payload) {
    return (dispatch, getState) => {
        dispatch({
            type: H5FormTypes.IS_FORM_LOADING,
            payload: true
        })
        const { h5FormReducers } = getState();
        if (h5FormReducers.activeTabGroupMenu === 4) {
            dispatch(getFormListMe(payload));
        } else {
            dispatch(getFormListNoMe(payload));
        }
        dispatch(switchTab("4"));
    }
}
export function isRefreshing(payload) {
    return {
        type: H5FormTypes.IS_REFRESHING,
        payload
    }
}



export function resetActiveTabIds() {
    return {
        type: H5FormTypes.RESET_ACTIVE_TABIDS
    }
}

export function clearFormList() {
    return {
        type: H5FormTypes.CLEAR_FORM_LIST
    }
}

export function getRole() {
    let url = ApiUrls.getRole;
    return (dispatch, getState) => {
        return restHub.get(url)
            .then(({ errorMsg, jsonResult }) => {
                localStorage && localStorage.setItem('isDeptRead',
                    jsonResult.data.deptRead ? 1 : 0);
                if (!errorMsg) {
                    if (
                        !jsonResult.data.deptRead &&
                        getState().h5FormReducers.activeTabGroupMenu == 2
                    ) {

                        localStorage && localStorage.setItem('activeTabGroupMenu', 1);
                        dispatch({
                            type: H5FormTypes.ACTIVE_TAB_GROUP_MENU,
                            payload: 1
                        });
                    }
                    dispatch({
                        type: H5FormTypes.GET_ROLE,
                        payload: jsonResult.data.deptRead
                    });
                } else {
                    mobileError('系统繁忙');
                }
            })
    }
}
export function saveActiveTagIds(payload) {
    return {
        type: H5FormTypes.SAVE_ACTIVE_TAGID,
        payload
    }
}
export function cancelActiveTagIds() {
    return {
        type: H5FormTypes.CANCEL_ACTIVE_TAGID
    }
}
export function sureSetActiveTagIds() {
    return {
        type: H5FormTypes.SURE_SET_ACTIVE
    }
}

export function resetActiveTagIds() {
    return {
        type: H5FormTypes.RESET_ACTIVE_TAGID
    }
}

