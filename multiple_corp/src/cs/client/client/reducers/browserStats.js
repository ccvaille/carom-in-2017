import * as BrowserStatsActionTypes from 'constants/BrowserStatsActionTypes';
import moment from 'moment';

const today = moment();
const todayValue = today.format('YYYY-MM-DD');

const initialState = {
    tableDataAll: [],
    tableData: [],
    statsData: {},
    countSum: 0,
    params: {
        date: 0,
        startDate: todayValue,
        endDate: todayValue,
        page: 1,
    },
};

const defaultSum = {
    visitor: 0,
    service: 0,
    save: 0,
};

function browserStats(state = initialState, action) {
    switch (action.type) {
        case BrowserStatsActionTypes.GET_BROWSER_STATS_SUCCESS: {
            // @todo 处理数据
            const { sum = defaultSum, list = [] } = action.payload.data;

            return {
                ...state,
                tableData: list.slice(0, 10).reverse(),
                tableDataAll: list.concat([{
                    browserName: '总计',
                    visitor: sum.visitorSum,
                    service: sum.serviceSum,
                    save: sum.saveSum,
                }]),
                countSum: sum.visitorSum,
            };
        }
        case BrowserStatsActionTypes.UPDATE_BROWSER_STATS_PARAMS: {
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

export default browserStats;
