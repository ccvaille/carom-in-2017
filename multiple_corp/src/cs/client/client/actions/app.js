import restHub from '~comm/services/restHub';
import { init as initChat } from './chat';
import ApiUrls from '../constants/ApiUrls';
import * as AppActionTypes from '../constants/AppActionTypes';

export function setAppData(payload) {
    return {
        type: AppActionTypes.INIT_APP,
        payload,
    };
}

export function initRequest() {
    return restHub.get(`${ApiUrls.initApp}${window.location.search}`).then(res => res);
}

export function initSuccess(payload) {
    const { data = {} } = payload;
    return (dispatch) => {
        dispatch(setAppData(data));
        dispatch(initChat(data));
    };
}

export function init() {
    return dispatch => restHub.get(ApiUrls.initApp).then(({ errorCode, errorMsg, jsonResult }) => {
        if (!errorMsg) {
            const { data } = jsonResult;
            dispatch(setAppData(data));
            dispatch(initChat(data));
            return { errorCode, errorMsg, jsonResult };
        }

        return { errorCode, errorMsg, jsonResult };
    });
}

export function toggleOfflineModal(payload) {
    return {
        type: AppActionTypes.TOGGLE_OFFLINE_MODAL,
        payload,
    };
}

export function updateOfflineType(payload) {
    return {
        type: AppActionTypes.UPDATE_OFFLINE_TYPE,
        payload,
    };
}

export function updateActiveMenu(payload) {
    return {
        type: AppActionTypes.UPDATE_ACTIVE_MENU,
        payload,
    };
}

export function updateAppMenus(payload) {
    return {
        type: AppActionTypes.UPDATE_APP_MENUS,
        payload,
    };
}

export function updateUserInfo(payload) {
    return {
        type: AppActionTypes.UPDATE_USER_INFO,
        payload,
    };
}

// export function delay() {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve('success');
//         }, 500);
//     });
// }
