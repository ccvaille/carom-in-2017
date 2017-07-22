import restHub from '~comm/services/restHub';
import ApiUrls from 'constants/ApiUrls';
import { serializeObject, displayError } from '~comm/utils';
import * as BrowserStatsActionTypes from 'constants/BrowserStatsActionTypes';
import { filterParams } from 'utils/chartsUtils';

export function getBrowserStatsSuccess(payload) {
    return {
        type: BrowserStatsActionTypes.GET_BROWSER_STATS_SUCCESS,
        payload,
    };
}

export function getBrowserStats() {
    return (dispatch, getState) => {
        const { params } = getState().browserStats;
        const filteredParams = filterParams(params);
        return restHub.post(ApiUrls.statsBrowser, {
            body: filteredParams,
        }).then(({ errorMsg, jsonResult }) => {
            if (!errorMsg) {
                dispatch(getBrowserStatsSuccess(jsonResult));
            } else {
                displayError(errorMsg);
            }
        });
    };
}

export function updateBrowserStatsParams(payload) {
    return {
        type: BrowserStatsActionTypes.UPDATE_BROWSER_STATS_PARAMS,
        payload,
    };
}

export function exportBrowserStatsData() {
    return (dispatch, getState) => {
        const { params } = getState().browserStats;
        const paramsStr = serializeObject(params);
        const url = `${ApiUrls.statsBrowserExport}?${paramsStr}`;
        window.location = url;
    };
}
