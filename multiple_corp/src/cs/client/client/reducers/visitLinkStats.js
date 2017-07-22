import { today } from 'constants/shared';
import * as VisitLinkActionTypes from 'constants/VisitLinkStatsActionTypes';
import { sortRemoteData } from 'utils/chartsUtils';

const initialState = {
    statsData: [],
    tableData: [],
    countSum: 1,
    params: {
        date: 0,
        startDate: today,
        endDate: today,
        page: 1,
    },
    pagination: {
        total: 0,
        pageSize: 10,
        current: 1,
    },
};

function visitLinkStats(state = initialState, action) {
    switch (action.type) {
        case VisitLinkActionTypes.GET_VISIT_LINK_STATS_SUCCESS: {
            // return state;
            const { data } = action.payload;
            const { pageInfo, totalPv } = data || {
                pageInfo: state.pagination,
                totalPv: 0,
            };
            const originalData = data && (data.list || []);
            const newState = {
                ...state,
                tableData: originalData,
                countSum: Number(totalPv),
                pagination: {
                    total: pageInfo.total,
                    pageSize: pageInfo.per_page,
                    current: pageInfo.current_page,
                },
            };

            if (state.params.page === 1) {
                const sortData = originalData.sort(sortRemoteData('f_count')).slice(0, 10);
                return {
                    ...newState,
                    statsData: sortData,
                };
            }

            return newState;
        }
        case VisitLinkActionTypes.UPDATE_VISIT_LINK_STATS_PARAMS: {
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

export default visitLinkStats;
