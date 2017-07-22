import { today } from 'constants/shared';
import * as EfficiencyStatsActionTypes from 'constants/EfficiencyStatsActionTypes';

const initialState = {
    csList: [],
    tableData: [],
    freezedTableData: [],
    filterCsId: '0',
    params: {
        date: 0,
        startDate: today,
        endDate: today,
    },
};

function conversionStats(state = initialState, action) {
    switch (action.type) {
        case EfficiencyStatsActionTypes.GET_EFFICIENCY_STATS_SUCCESS: {
            const result = action.payload.data || {};
            const { csList = [], list = [] } = result;
            if (state.filterCsId && state.filterCsId != 0) {
                const filteredData = list.filter(cs => cs.f_cs_id === Number(state.filterCsId));
                return {
                    ...state,
                    csList,
                    tableData: filteredData || [],
                    freezedTableData: list || [],
                };
            }

            return {
                ...state,
                csList,
                tableData: list || [],
                freezedTableData: list || [],
            };
        }
        case EfficiencyStatsActionTypes.UPDATE_EFFICIENCY_STATS_PARAMS: {
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
        case EfficiencyStatsActionTypes.FILTER_CS_DATA: {
            const csId = action.payload;
            const filteredData = state.freezedTableData.filter(cs => cs.f_cs_id === csId);

            if (csId === 0) {
                return {
                    ...state,
                    tableData: state.freezedTableData,
                    filterCsId: `${csId}`,
                };
            }

            return {
                ...state,
                tableData: filteredData,
                filterCsId: `${csId}`,
            };
        }
        default:
            return state;
    }
}

export default conversionStats;
