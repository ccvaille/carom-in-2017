import { today } from 'constants/shared';
import * as PeriodStatsActionTypes from 'constants/PeriodStatsActionTypes';

const initialState = {
    statsData: {},
    tableData: [],
    params: {
        date: 0,
        startDate: today,
        endDate: today,
    },
};

function periodStats(state = initialState, action) {
    switch (action.type) {
        case PeriodStatsActionTypes.GET_PERIOD_STATS_SUCCESS: {
            const { data: statsData = {}, pageData: tableData = [] } = action.payload.data || {};

            return {
                ...state,
                statsData,
                tableData,
            };
        }
        case PeriodStatsActionTypes.UPDATE_PERIOD_STATS_PARAMS: {
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

export default periodStats;
