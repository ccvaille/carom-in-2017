import restHub from '~comm/services/restHub';
import ApiUrls from 'constants/ApiUrls';
import { serializeObject, displayError } from '~comm/utils';
import { filterParams } from 'utils/chartsUtils';
import * as VisitLinkActionTypes from 'constants/VisitLinkStatsActionTypes';

export function getVisitLinkStatsSuccess(payload) {
    return {
        type: VisitLinkActionTypes.GET_VISIT_LINK_STATS_SUCCESS,
        payload,
    };
}

export function getVisitLinkStats(isExport = false) {
    return (dispatch, getState) => {
        const { params } = getState().visitLinkStats;
        const filteredParams = filterParams(params, isExport);
        const url = `${ApiUrls.statsVisitLink}?${serializeObject(filteredParams)}`;

        if (isExport) {
            window.location.href = url;
            return false;
        }

        return restHub.get(url).then(({ errorMsg, jsonResult }) => {
            if (!errorMsg) {
                dispatch(getVisitLinkStatsSuccess(jsonResult));
            } else {
                displayError(errorMsg);
            }
        });
    };
}

export function updateVisitStatsParams(payload) {
    return {
        type: VisitLinkActionTypes.UPDATE_VISIT_LINK_STATS_PARAMS,
        payload,
    };
}
