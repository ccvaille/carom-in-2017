import * as OverviewStatsActionTypes from 'constants/OverviewStatsActionTypes';
import { getComparePercent } from 'utils/chartsUtils';

const initialState = {
    trafficData: [],
    conversationData: [],
    originalData: {},
    params: {
        date: 0,
        startDate: '',
        endDate: '',
    },
};

function overviewStats(state = initialState, action) {
    switch (action.type) {
        case OverviewStatsActionTypes.GET_OVERVIEW_STATS_SUCCESS: {
            const remoteData = action.payload;

            // 访客数
            const rVisitor = remoteData.visitor;
            const rVisitorLast = remoteData.visitorLast;
            let visitorLastPercent = 0;

            // 入库量
            const rInStorage = remoteData.save;
            const rInStorageLast = remoteData.saveLast;
            let inStorageLastPercent = 0;

            const traffic = [{
                visitor: rVisitor,
                inStorage: rInStorage,
            }];

            if (state.params.date !== 4) {
                visitorLastPercent = getComparePercent(rVisitor, rVisitorLast);
                inStorageLastPercent = getComparePercent(rInStorage, rInStorageLast);

                traffic.push({
                    visitor: visitorLastPercent,
                    inStorage: inStorageLastPercent,
                });
            }

            // 咨询量
            const rConsult = remoteData.consult;
            const rConsultLast = remoteData.consultLast;
            let consultLastPercent = Math.round((rConsult - rConsultLast) / rConsultLast) * 100;

            // 接待量
            const rReceive = remoteData.service;
            const rReceiveLast = remoteData.serviceLast;
            let receiveLastPercent = 0;

            // 接待率 接待 / 咨询
            let receiveRatio = 0;
            let receiveRatioLast = 0;
            let receiveRatioPercent = 0;

            if (rConsult !== 0) {
                receiveRatio = Math.round((rReceive / rConsult) * 100);
            }

            if (rConsultLast !== 0) {
                receiveRatioLast = Math.round((rReceiveLast / rConsultLast) * 100);
            }

            // 平均对话时长
            const rAverage = remoteData.sess;
            const rAverageLast = remoteData.sessLast;
            let averageLastPercent = 0;

            // 平均首次响应时间
            const rResponse = remoteData.reply;
            const rResponseLast = remoteData.replyLast;
            let responseLastPercent = 0;

            const conversation = [{
                consult: rConsult,
                receive: rReceive,
                receiveRatio,
                averageTime: rAverage,
                firstResponse: rResponse,
            }];

            if (state.params.date !== 4) {
                consultLastPercent = getComparePercent(rConsult, rConsultLast);
                receiveLastPercent = getComparePercent(rReceive, rReceiveLast);
                averageLastPercent = getComparePercent(rAverage, rAverageLast);
                responseLastPercent = getComparePercent(rResponse, rResponseLast);
                receiveRatioPercent = getComparePercent(receiveRatio, receiveRatioLast);

                conversation.push({
                    consult: consultLastPercent,
                    receive: receiveLastPercent,
                    receiveRatio: receiveRatioPercent,
                    averageTime: averageLastPercent,
                    firstResponse: responseLastPercent,
                });
            }

            return {
                ...state,
                trafficData: traffic,
                conversationData: conversation,
                originalData: {
                    ...remoteData,
                    receiveRatio,
                    receiveRatioLast,
                },
            };
        }
        case OverviewStatsActionTypes.UPDATE_OVERVIEW_PARAMS: {
            return {
                ...state,
                params: {
                    ...state.params,
                    ...action.payload,
                },
            };
        }
        default:
            return state;
    }
}

export default overviewStats;
