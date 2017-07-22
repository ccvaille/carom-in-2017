import { today } from 'constants/shared';
import * as ConversionStatsActionTypes from 'constants/ConversionStatsActionTypes';

const initialState = {
    statsData: {},
    tableData: [],
    params: {
        date: 0,
        startDate: today,
        endDate: today,
    },
};

function conversionStats(state = initialState, action) {
    switch (action.type) {
        case ConversionStatsActionTypes.GET_CONVERSION_STATS_SUCCESS: {
            const { pageData: tableData = [], data: statsData = {} } = action.payload.data || {};
            return {
                ...state,
                tableData,
                statsData,
            };
        }
        case ConversionStatsActionTypes.UPDATE_CONVERSION_STATS_PARAMS: {
            const data = action.payload;
            delete data.page;
            delete data.pagination;
            return {
                ...state,
                params: {
                    ...state.params,
                    ...data,
                },
            };
        }
        default:
            return state;
    }
}

export default conversionStats;
