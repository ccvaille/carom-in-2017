import restHub from '~comm/services/restHub';
import ApiUrls from 'constants/ApiUrls';
import { serializeObject, displayError } from '~comm/utils';
import { filterParams } from 'utils/chartsUtils';
import * as EfficiencyStatsActionTypes from 'constants/EfficiencyStatsActionTypes';

export function filterCsData(csId) {
    return {
        type: EfficiencyStatsActionTypes.FILTER_CS_DATA,
        payload: Number(csId),
    };
}

export function getEfficiencyStatsSuccess(payload) {
    return {
        type: EfficiencyStatsActionTypes.GET_EFFICIENCY_STATS_SUCCESS,
        payload,
    };
}

export function getEfficiencyStats(isExport = false) {
    return (dispatch, getState) => {
        const { params } = getState().efficiencyStats;
        const filteredParams = filterParams(params, isExport);
        const url = `${ApiUrls.statsCsEfficiency}?${serializeObject(filteredParams)}`;

        if (isExport) {
            window.location.href = url;
            return false;
        }

        return restHub.get(url).then(({ errorMsg, jsonResult }) => {
            if (!errorMsg) {
                dispatch(getEfficiencyStatsSuccess(jsonResult));
            } else {
                displayError(errorMsg);
            }
        });
    };
}

export function updateEfficiencyStatsParams(payload) {
    return {
        type: EfficiencyStatsActionTypes.UPDATE_EFFICIENCY_STATS_PARAMS,
        payload,
    };
}
