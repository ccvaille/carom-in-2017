import restHub from '~comm/services/restHub';
import ApiUrls from 'constants/ApiUrls';
import { serializeObject, displayError } from '~comm/utils';
import * as DeviceStatsActionTypes from 'constants/DeviceStatsActionTypes';
import { filterParams } from 'utils/chartsUtils';

export function getDeviceStatsSuccess(payload) {
    return {
        type: DeviceStatsActionTypes.GET_DEVICE_STATS_SUCCESS,
        payload,
    };
}

export function getDeviceStats(isExport = false) {
    return (dispatch, getState) => {
        const { params } = getState().deviceStats;
        const filteredParams = filterParams(params, isExport);
        const paramsDevice = serializeObject(filteredParams);
        const url = `${ApiUrls.statsDevice}?${paramsDevice}`;

        if (isExport) {
            window.location.href = url;
            return false;
        }

        return restHub.get(url)
            .then(({ errorMsg, jsonResult }) => {
                if (!errorMsg) {
                    dispatch(getDeviceStatsSuccess(jsonResult));
                } else {
                    displayError(errorMsg);
                }
            });
    };
}

export function updateDeviceStatsParams(payload) {
    return {
        type: DeviceStatsActionTypes.UPDATE_DEVICE_STATS_PARAMS,
        payload,
    };
}
