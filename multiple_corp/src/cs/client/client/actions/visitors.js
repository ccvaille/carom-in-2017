import restHub from '~comm/services/restHub';
import ApiUrls from 'constants/ApiUrls';
import * as VisitorsActionTypes from 'constants/VisitorsActionTypes';

export function updateGetParams(payload) {
    return {
        type: VisitorsActionTypes.UPDATE_GET_PARAMS,
        payload,
    };
}

export function getVisitorsSuccess(payload) {
    return {
        type: VisitorsActionTypes.GET_VISITORS_SUCCESS,
        payload,
    };
}

export function getVisitors() {
    return (dispatch, getState) => {
        const corpId = getState().app.corpid;
        const visitorParams = getState().visitors.params;
        return restHub.post(`${ApiUrls.visitors}?CorpId=${corpId}`, {
            body: visitorParams,
        }).then(({ errorMsg, jsonResult }) => {
            if (!errorMsg) {
                dispatch(getVisitorsSuccess(jsonResult.data));
            }
        });
    };
}

// payload 需带上 guid 和 status 新值
export function updateVisitorStatus(payload) {
    return {
        type: VisitorsActionTypes.UPDATE_VISITOR_STATUS,
        payload,
    };
}

export function unshiftNewVisitor(payload) {
    return {
        type: VisitorsActionTypes,
        payload,
    };
}
