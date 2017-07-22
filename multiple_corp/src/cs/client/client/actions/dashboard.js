import restHub from '~comm/services/restHub';
import ApiUrls from 'constants/ApiUrls';
import { displayError } from '~comm/utils';
import { filterParams } from 'utils/chartsUtils';
import * as DashboardActionTypes from 'constants/DashboardActionTypes';

export function updateParams(payload) {
    return {
        type: DashboardActionTypes.UPDATE_GET_PARAMS,
        payload,
    };
}

export function updateCsStatsParams(payload) {
    return {
        type: DashboardActionTypes.UPDATE_CS_STATS_PARAMS,
        payload,
    };
}

// export function getCsStatsSuccess(payload) {
//     return {
//         type: DashboardActionTypes.GET_CS_STATS_SUCCESS,
//         payload,
//     };
// }

// export function getCsStats() {
//     return (dispatch, getState) => {
//         const { params } = getState().dashboard;
//         // const params = serializeObject(dashboardState.params);
//         return restHub.post(ApiUrls.dashboardCsStats, {
//             body: params,
//         }).then(({ errorMsg, jsonResult }) => {
//             if (!errorMsg) {
//                 dispatch(getCsStatsSuccess(jsonResult));
//             } else {
//                 message.error(errorMsg || defaultMessage);
//             }
//         });
//     };
// }

export function getOverviewSuccess(payload) {
    return {
        type: DashboardActionTypes.GET_OVERVIEW_SUCCESS,
        payload,
    };
}

export function getOverview() {
    return (dispatch, getState) => {
        const { params } = getState().dashboard;
        const filterdParams = filterParams(params);
        // const params = serializeObject(dashboardState.params);
        return restHub.post(ApiUrls.dashboardOverview, {
            body: filterdParams,
        }).then(({ errorMsg, jsonResult }) => {
            if (!errorMsg) {
                dispatch(getOverviewSuccess(jsonResult));
            } else {
                displayError(errorMsg);
            }
        });
    };
}

export function fallbackAvatar(id) {
    return {
        type: DashboardActionTypes.FALLBACK_AVATAR,
        payload: id,
    };
}
