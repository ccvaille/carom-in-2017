import restHub from '~comm/services/restHub';
import { displayError, serializeObject } from '~comm/utils';
import ApiUrls from 'constants/ApiUrls';
import { filterParams } from 'utils/chartsUtils';
import * as OverviewStatsActionTypes from 'constants/OverviewStatsActionTypes';

export function getOverviewStatsSuccess(payload) {
    return {
        type: OverviewStatsActionTypes.GET_OVERVIEW_STATS_SUCCESS,
        payload,
    };
}

export function getOverviewStats() {
    return (dispatch, getState) => {
        const { params } = getState().overviewStats;
        const filteredParams = filterParams(params);
        const url = `${ApiUrls.statsOverview}?${serializeObject(filteredParams)}`;

        return restHub.get(url).then(({ errorMsg, jsonResult }) => {
            if (!errorMsg && jsonResult.data) {
                dispatch(getOverviewStatsSuccess(jsonResult.data));
            } else {
                displayError(errorMsg);
            }
        });
    };
}

export function updateOverviewParams(payload) {
    return {
        type: OverviewStatsActionTypes.UPDATE_OVERVIEW_PARAMS,
        payload,
    };
}
