import * as DeviceStatsActionTypes from 'constants/DeviceStatsActionTypes';
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
        page: 1,
    },
};

const defaultSum = {
    f_visitor: 0,
    f_web_service: 0,
    f_web_save: 0,
};

function deviceStats(state = initialState, action) {
    switch (action.type) {
        case DeviceStatsActionTypes.GET_DEVICE_STATS_SUCCESS: {
            // @todo 处理数据
            const { sum = defaultSum, list = [] } = action.payload.data;

            return {
                ...state,
                tableData: list.slice(0, 10).reverse(),
                tableDataAll: list.concat([{
                    f_terminal: '总计',
                    f_visitor: sum.f_visitorSum,
                    f_web_service: sum.f_web_serviceSum,
                    f_web_save: sum.f_web_saveSum,
                }]),
                countSum: sum.f_visitorSum,
            };
        }
        case DeviceStatsActionTypes.UPDATE_DEVICE_STATS_PARAMS: {
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

export default deviceStats;
