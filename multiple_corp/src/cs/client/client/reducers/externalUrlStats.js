import * as ExternalUrlStatsActionTypes from 'constants/ExternalUrlStatsActionTypes';
import moment from 'moment';

const today = moment();
const todayValue = today.format('YYYY-MM-DD');

const initialState = {
    tableDataAll: [],
    tableData: [],
    pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
    },
    countSum: 0,
    params: {
        page: 1,
        date: 0,
        startDate: todayValue,
        endDate: todayValue,
    },
};

const defaultSum = {
    count: 0,
    visitor: 0,
    visitorn: 0,
    service: 0,
    save: 0,
};

function urlStats(state = initialState, action) {
    switch (action.type) {
        case ExternalUrlStatsActionTypes.GET_EXTERNAL_URL_STATS_SUCCESS: {
            const { data } = action.payload;
            const { sum = defaultSum, list = [] } = action.payload.data || {};

            const page = {
                total: data.total + 1,
                current: data.page,
                pageSize: data.pageSize,
            };

            let tableDataTopTen = state.tableData;

            if (data.page * 1 === 1) {
                tableDataTopTen = list.slice(0, 10).reverse();
            } else if (!data.page) {
                tableDataTopTen = initialState.tableData;
            }

            return {
                ...state,
                tableData: tableDataTopTen,
                tableDataAll: data.page * data.pageSize < data.total ? list
                : list.concat([{
                    domain: '总计',
                    count: sum.countSum,
                    visitor: sum.visitorSum,
                    visitorn: sum.visitornSum,
                    service: sum.serviceSum,
                    save: sum.saveSum,
                }]),
                pagination: page || initialState.pagination,
                countSum: sum.countSum,
            };
        }
        case ExternalUrlStatsActionTypes.UPDATE_URL_STATS_PARAMS: {
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

export default urlStats;
