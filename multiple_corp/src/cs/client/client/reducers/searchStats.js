import * as SearchStatsActionTypes from 'constants/SearchStatsActionTypes';
import moment from 'moment';

const today = moment();
const todayValue = today.format('YYYY-MM-DD');

const initialState = {
    statsData: {},
    tableData: [],
    tableDataAll: [],
    countSum: 0,
    params: {
        date: 0,
        startDate: todayValue,
        endDate: todayValue,
    },
};

const defaultSum = {
    keywords: 0,
    visitor: 0,
    visitorn: 0,
    service: 0,
    save: 0,
};

function searchStats(state = initialState, action) {
    switch (action.type) {
        case SearchStatsActionTypes.GET_SEARCH_STATS_SUCCESS: {
            const { list = [], sum = defaultSum } = action.payload.data || {};

            return {
                ...state,
                tableData: list.slice(0, 10).reverse(),
                tableDataAll: list.concat([{
                    SearchName: '总计',
                    keywords: sum.keywordsSum,
                    visitor: sum.visitorSum,
                    visitorn: sum.visitornSum,
                    service: sum.serviceSum,
                    save: sum.saveSum,
                }]),
                countSum: sum.keywordsSum,
            };
        }
        case SearchStatsActionTypes.UPDATE_SEARCH_STATS_PARAMS: {
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

export default searchStats;
