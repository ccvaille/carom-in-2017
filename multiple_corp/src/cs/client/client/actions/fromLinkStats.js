import restHub from '~comm/services/restHub';
import ApiUrls from 'constants/ApiUrls';
import { serializeObject, displayError } from '~comm/utils';
import { filterParams } from 'utils/chartsUtils';
import * as FromLinkActionTypes from 'constants/FromLinkStatsActionTypes';

export function getFromLinkStatsSuccess(payload) {
    return {
        type: FromLinkActionTypes.GET_FROM_LINK_STATS_SUCCESS,
        payload,
    };
}

export function getFromLinkStats(isExport) {
    return (dispatch, getState) => {
        const { params } = getState().fromLinkStats;
        const filteredParams = filterParams(params);
        const url = `${ApiUrls.statsFromLink}?${serializeObject(filteredParams)}`;

        if (isExport) {
            window.location.href = url;
            return false;
        }

        return restHub.get(url).then(({ errorMsg, jsonResult }) => {
            if (!errorMsg) {
                dispatch(getFromLinkStatsSuccess(jsonResult));
            } else {
                displayError(errorMsg);
            }
        });
    };
}

export function updateFromLinkStatsParams(payload) {
    return {
        type: FromLinkActionTypes.UPDATE_FROM_LINK_STATS_PARAMS,
        payload,
    };
}
