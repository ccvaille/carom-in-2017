import restHub from '~comm/services/restHub';
import ApiUrls from 'constants/ApiUrls';
import { serializeObject, displayError } from '~comm/utils';
import { filterParams } from 'utils/chartsUtils';
import * as DistrictStatsActionTypes from 'constants/DistrictStatsActionTypes';

export function getDistrictStatsSuccess(payload) {
    return {
        type: DistrictStatsActionTypes.GET_DISTRICT_STATS_SUCCESS,
        payload,
    };
}

export function getDistrictStats() {
    return (dispatch, getState) => {
        const { params, pagination } = getState().districtStats;
        const filteredParams = filterParams(params);

        return restHub.post(ApiUrls.statsDistrict, {
            body: {
                ...filteredParams,
                // pageSize: pagination.pageSize,
            },
        }).then(({ errorMsg, jsonResult }) => {
            if (!errorMsg) {
                dispatch(getDistrictStatsSuccess(jsonResult));
            } else {
                dispatch(getDistrictStatsSuccess({
                    data: {},
                }));
                displayError(errorMsg);
            }
        });
    };
}

export function updateDistrictStatsParams(payload) {
    return {
        type: DistrictStatsActionTypes.UPDATE_DISTRICT_STATS_PARAMS,
        payload,
    };
}

export function exportDistrictStatsData() {
    return (dispatch, getState) => {
        const { params } = getState().districtStats;
        const paramsStr = serializeObject(params);
        const url = `${ApiUrls.statsDistrictExport}?${paramsStr}&out=1`;
        window.location = url;
    };
}
