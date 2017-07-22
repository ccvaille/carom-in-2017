import restHub from '~comm/services/restHub';
import ApiUrls from 'constants/ApiUrls';
import { serializeObject, displayError } from '~comm/utils';
import { filterParams } from 'utils/chartsUtils';
import * as ConversionStatsActionTypes from 'constants/ConversionStatsActionTypes';

export function getConversionStatsSuccess(payload) {
    return {
        type: ConversionStatsActionTypes.GET_CONVERSION_STATS_SUCCESS,
        payload,
    };
}

export function getConversionStats(isExport = false) {
    return (dispatch, getState) => {
        const { params } = getState().conversionStats;
        const filteredParams = filterParams(params, isExport);
        const paramsStr = serializeObject(filteredParams);
        const url = `${ApiUrls.statsConversionRate}?${paramsStr}`;

        if (isExport) {
            window.location.href = url;
            return false;
        }

        return restHub.get(url)
                        .then(({ errorMsg, jsonResult }) => {
                            if (!errorMsg) {
                                dispatch(getConversionStatsSuccess(jsonResult));
                            } else {
                                displayError(errorMsg);
                            }
                        });
    };
}

export function updateConversionStatsParams(payload) {
    return {
        type: ConversionStatsActionTypes.UPDATE_CONVERSION_STATS_PARAMS,
        payload,
    };
}
