import * as EmployeeStatsActionTypes from 'constants/EmployeeStatsActionTypes';

const initialState = {
    // statsData: {},
    tableData: [],
    params: {
        page: 1,
    },
    pagination: {
        total: 0,
        pageSize: 50,
        current: 1,
    },
};

function employeeStats(state = initialState, action) {
    switch (action.type) {
        case EmployeeStatsActionTypes.GET_EMPLOYEE_STATS_SUCCESS: {
            const { data } = action.payload;
            if (data && Object.keys(data).length) {
                const { data: tableData, pager } = data;
                return {
                    ...state,
                    tableData,
                    pagination: {
                        total: pager.total,
                        pageSize: pager.per_page,
                        current: pager.current_page,
                    },
                };
            }
            return state;
        }
        case EmployeeStatsActionTypes.UPDATE_EMPLOYEE_STATS_PARAMS: {
            const data = action.payload;
            const newState = {
                ...state,
                params: {
                    ...state.params,
                    ...data,
                },
            };

            if (data.pagination) {
                delete newState.params.pagination;
                return {
                    ...newState,
                    pagination: {
                        ...state.pagination,
                        ...data.pagination,
                    },
                };
            }

            return newState;
        }
        default:
            return state;
    }
}

export default employeeStats;
