import restHub from '~comm/services/restHub';
import ApiUrls from 'constants/ApiUrls';
import { serializeObject, displayError } from '~comm/utils';
import { filterParams } from 'utils/chartsUtils';
import * as PeriodStatsActionTypes from 'constants/PeriodStatsActionTypes';

export function getPeriodStatsSuccess(payload) {
    return {
        type: PeriodStatsActionTypes.GET_PERIOD_STATS_SUCCESS,
        payload,
    };
}

export function getPeriodStats(isExport = false) {
    return (dispatch, getState) => {
        const { params } = getState().periodStats;
        const filteredParams = filterParams(params, isExport);
        const url = `${ApiUrls.statsTimePeriod}?${serializeObject(filteredParams)}`;

        if (isExport) {
            window.location.href = url;
            return false;
        }

        return restHub.get(url).then(({ errorMsg, jsonResult }) => {
            if (!errorMsg) {
                dispatch(getPeriodStatsSuccess(jsonResult));
            } else {
                displayError(errorMsg);
            }
        });
    };
}

export function updatePeriodStatsParams(payload) {
    return {
        type: PeriodStatsActionTypes.UPDATE_PERIOD_STATS_PARAMS,
        payload,
    };
}
