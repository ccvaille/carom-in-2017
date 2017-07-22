import restHub from '~comm/services/restHub';
import ApiUrls from 'constants/ApiUrls';
import { serializeObject, displayError } from '~comm/utils';
import * as EmployeeStatsActionTypes from 'constants/EmployeeStatsActionTypes';

export function getEmployeeStatsSuccess(payload) {
    return {
        type: EmployeeStatsActionTypes.GET_EMPLOYEE_STATS_SUCCESS,
        payload,
    };
}

export function getEmployeeStats() {
    return (dispatch, getState) => {
        const { params } = getState().employeeStats;
        const paramsStr = serializeObject(params);
        const url = `${ApiUrls.statsEmployee}?${paramsStr}`;

        return restHub.get(url).then(({ errorMsg, jsonResult }) => {
            if (!errorMsg) {
                dispatch(getEmployeeStatsSuccess(jsonResult));
            } else {
                displayError(errorMsg);
            }
        });
    };
}

export function updateEmployeeStatsParams(payload) {
    return {
        type: EmployeeStatsActionTypes.UPDATE_EMPLOYEE_STATS_PARAMS,
        payload,
    };
}
