import restHub from '~comm/services/restHub';
import ApiUrls from 'constants/ApiUrls';
import { serializeObject, displayError } from '~comm/utils';
import { filterParams } from 'utils/chartsUtils';
import * as SearchStatsActionTypes from 'constants/SearchStatsActionTypes';

export function getSearchStatsSuccess(payload) {
    return {
        type: SearchStatsActionTypes.GET_SEARCH_STATS_SUCCESS,
        payload,
    };
}

export function getSearchStats() {
    return (dispatch, getState) => {
        const { params } = getState().searchStats;
        const filteredParams = filterParams(params);

        return restHub.post(ApiUrls.statsSearch, {
            body: filteredParams,
        }).then(({ errorMsg, jsonResult }) => {
            if (!errorMsg) {
                dispatch(getSearchStatsSuccess(jsonResult));
            } else {
                displayError(errorMsg);
            }
        });
    };
}

export function updateSearchStatsParams(payload) {
    return {
        type: SearchStatsActionTypes.UPDATE_SEARCH_STATS_PARAMS,
        payload,
    };
}

export function exportSearchStatsData() {
    return (dispatch, getState) => {
        const { params } = getState().searchStats;
        const paramsStr = serializeObject(params);
        const url = `${ApiUrls.statsSearchExport}?${paramsStr}`;
        window.location.href = url;
        // return restHub.get(url).then(({ errorMsg, jsonResult }) => {
        //     if (!errorMsg) {
        //         // @todo 下载文件？
        //     } else {
        //         displayError(errorMsg);
        //     }
        // });
    };
}
