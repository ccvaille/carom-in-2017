import restHub from '~comm/services/restHub';
import ApiUrls from 'constants/ApiUrls';
import { serializeObject, displayError } from '~comm/utils';
import { filterParams } from 'utils/chartsUtils';
import * as UrlStatsActionTypes from 'constants/ExternalUrlStatsActionTypes';

export function getUrlStatsSuccess(payload) {
    return {
        type: UrlStatsActionTypes.GET_EXTERNAL_URL_STATS_SUCCESS,
        payload,
    };
}

export function getUrlStats() {
    return (dispatch, getState) => {
        const { params } = getState().externalUrlStats;
        const filteredParams = filterParams(params);

        return restHub.post(ApiUrls.statsExternalUrl, {
            body: {
                ...filteredParams,
                // pageSize: pagination.pageSize,
            }
        }).then(({ errorMsg, jsonResult }) => {
            if (!errorMsg) {
                dispatch(getUrlStatsSuccess(jsonResult));
            } else {
                displayError(errorMsg);
            }
        });
    };
}

export function updateUrlStatsParams(payload) {
    return {
        type: UrlStatsActionTypes.UPDATE_URL_STATS_PARAMS,
        payload,
    };
}

export function exportUrlStatsData() {
    return (dispatch, getState) => {
        const { params } = getState().externalUrlStats;
        const paramsStr = serializeObject(params);
        const url = `${ApiUrls.statsExternalUrlExport}?${paramsStr}`;
        window.location.href = url;
    };
}
