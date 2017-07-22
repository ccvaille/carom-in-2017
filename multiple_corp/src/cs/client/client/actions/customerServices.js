import restHub from '~comm/services/restHub';
import ApiUrls from 'constants/ApiUrls';
import { displayError } from '~comm/utils';
import * as CustomerServiceActionTypes from 'constants/CustomerServicesActionTypes';

export function getServicesSuccess(payload) {
    return {
        type: CustomerServiceActionTypes.GET_SERVICES_SUCCESS,
        payload,
    };
}

export function getServices() {
    return (dispatch, getState) => {
        const state = getState();
        const { params } = state.customerServices;
        // const { userInfo } = getState().app;
        // const servicesUrl = userInfo.iswxcs ? ApiUrls.wxServices : ApiUrls.services;
        // 判断当前访客是否为微信访客
        const { txguid } = state.chat;
        const currentGuest = state.chat.guests[txguid];
        // eslint-disable-next-line max-len
        const servicesUrl = Number(currentGuest.visitortype) === 2 ? ApiUrls.wxServices : ApiUrls.services;
        return restHub.post(servicesUrl, {
            body: params,
        }).then(({ errorMsg, jsonResult }) => {
            if (!errorMsg) {
                dispatch(getServicesSuccess(jsonResult && jsonResult.data));
            } else {
                displayError(errorMsg);
            }
        });
    };
}

export function updateParams(payload) {
    return {
        type: CustomerServiceActionTypes.UPDATE_PARAMS,
        payload,
    };
}
