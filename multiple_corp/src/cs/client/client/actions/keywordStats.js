import restHub from '~comm/services/restHub';
import ApiUrls from 'constants/ApiUrls';
import { serializeObject, displayError } from '~comm/utils';
import { filterParams } from 'utils/chartsUtils';
import * as KeywordStatsActionTypes from 'constants/KeywordStatsActionTypes';

export function getKeywordStatsSuccess(payload) {
    return {
        type: KeywordStatsActionTypes.GET_KEYWORD_STATS_SUCCESS,
        payload,
    };
}

export function getKeywordStats() {
    return (dispatch, getState) => {
        const { params } = getState().keywordStats;
        const filteredParams = filterParams(params);

        return restHub.post(ApiUrls.statsKeyword, {
            body: {
                ...filteredParams,
                // pageSize: pagination.pageSize,
            },
        }).then(({ errorMsg, jsonResult }) => {
            if (!errorMsg) {
                dispatch(getKeywordStatsSuccess(jsonResult));
            } else {
                displayError(errorMsg);
            }
        });
    };
}

export function updateKeywordStatsParams(payload) {
    return {
        type: KeywordStatsActionTypes.UPDATE_KEYWORD_STATS_PARAMS,
        payload,
    };
}

export function exportKeywordStatsData() {
    return (dispatch, getState) => {
        const { params } = getState().keywordStats;
        const paramsStr = serializeObject(params);
        const url = `${ApiUrls.statsKeywordExport}?${paramsStr}`;
        window.location.href = url;
    };
}
