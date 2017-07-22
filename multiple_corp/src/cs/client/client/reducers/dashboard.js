// import moment from 'moment';
import * as DashboardActionTypes from 'constants/DashboardActionTypes';
import csDefaultAvatar from 'images/cs-default.png';

// const today = moment().format('YYYY-MM-DD');
const initialState = {
    params: {
        date: 0,
        startDate: '',
        endDate: '',
    },
    overview: [],
    csStats: [],
    csList: [],
    averageMsgs: 0, // 平均消息数
    averageFirstResponse: 0, // 平均首次响应时长
    averageService: 0, // 平均接待量
    averageTime: 0, // 平均会话时长
    // csStatsPagination: {
    //     total: 0,
    //     current: 1,
    //     pageSize: 10,
    // },
    csParams: {
        csid: 0,
    },
};

function dashboard(state = initialState, action) {
    switch (action.type) {
        case DashboardActionTypes.GET_OVERVIEW_SUCCESS: {
            const { data } = action.payload || {};
            if (data && Object.keys(data).length) {
                const {
                    list = [],
                    cslist: csList,
                    visitor,
                    save,
                    consult,
                    service,
                    avgMsgs: averageMsgs,
                    avgSess: averageTime,
                    avgReply: averageFirstResponse,
                    avgService: averageService,
                } = data;

                let serviceRatio = 0;

                if (consult !== 0) {
                    serviceRatio = Math.round((service / consult) * 100);
                }

                let csStats = list.map((cs, index) => {
                    // eslint-disable-next-line no-param-reassign
                    cs.index = index + 1;
                    return cs;
                });

                if (state.csParams.csid !== 0) {
                    csStats = csStats.filter(cs => cs.csid === state.csParams.csid);
                }

                return {
                    ...state,
                    csStats,
                    csList,
                    overview: [{
                        visitor,
                        save,
                        consult,
                        service,
                        serviceRatio,
                    }],
                    averageMsgs,
                    averageTime,
                    averageFirstResponse,
                    averageService,
                };
            }

            return state;
        }
        case DashboardActionTypes.UPDATE_GET_PARAMS:
            return {
                ...state,
                params: {
                    ...state.params,
                    ...action.payload,
                },
            };
        case DashboardActionTypes.GET_CS_STATS_SUCCESS:
            return {
                ...state,
                csStats: action.payload.data || [],
                csStatsPagination: action.payload.page || initialState.csStatsPagination,
            };
        case DashboardActionTypes.UPDATE_CS_STATS_PARAMS:
            return {
                ...state,
                csParams: {
                    ...state.csParams,
                    ...action.payload,
                },
            };
        case DashboardActionTypes.FALLBACK_AVATAR:
            return {
                ...state,
                csStats: state.csStats.map((cs) => {
                    if (cs.csid === action.payload.id) {
                        return {
                            ...cs,
                            face: csDefaultAvatar,
                        };
                    }
                    return cs;
                }),
            };
        default:
            return state;
    }
}

export default dashboard;
