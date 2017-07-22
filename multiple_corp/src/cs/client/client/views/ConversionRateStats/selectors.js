// import { createSelector } from 'reselect';
// import { genChartTipHtml } from 'utils/chartsUtils';

// const firstTimeName = '00:00-01:59';
// const secondTimeName = '02:00-03:59';
// const thirdTimeName = '04:00-05:59';
// const fourthTimeName = '06:00-07:59';
// const fifthTimeName = '08:00-09:59';
// const sixthTimeName = '10:00-11:59';
// const seventhTimeName = '12:00-13:59';
// const eighthTimeName = '14:00-15:59';
// const ninthTimeName = '16:00-17:59';
// const tenthTimeName = '18:00-19:59';
// const eleventhTimeName = '20:00-21:59';
// const twelfthTimeName = '22:00-23:59';

// const getConsult = statsData => statsData[11] || {}; // 咨询量
// const getReceive = statsData => statsData[6] || {}; // 接待量
// const getStorage = statsData => statsData[7] || {}; // 入库量

// const receiveSelector = createSelector(
//     getReceive,
//     (data) => [{
//         name: firstTimeName,
//         value: data.f_00 + data.f_01 + 100,
//     }, {
//         name: secondTimeName,
//         value: data.f_02 + data.f_03,
//     }, {
//         name: thirdTimeName,
//         value: data.f_04 + data.f_05,
//     }, {
//         name: fourthTimeName,
//         value: data.f_06 + data.f_07,
//     }, {
//         name: fifthTimeName,
//         value: data.f_08 + data.f_09,
//     }, {
//         name: sixthTimeName,
//         value: data.f_10 + data.f_11,
//     }, {
//         name: seventhTimeName,
//         value: data.f_12 + data.f_13,
//     }, {
//         name: eighthTimeName,
//         value: data.f_14 + data.f_15,
//     }, {
//         name: ninthTimeName,
//         value: data.f_16 + data.f_17,
//     }, {
//         name: tenthTimeName,
//         value: data.f_18 + data.f_19,
//     }, {
//         name: eleventhTimeName,
//         value: data.f_20 + data.f_21,
//     }, {
//         name: twelfthTimeName,
//         value: data.f_22 + data.f_23,
//     }]
// );

// // 接待率 接待量 / 咨询量
// const receivePercentSelector = createSelector(
//     getReceive,
//     (data) => [{
//         name: firstTimeName,
//         value: 10,
//     }, {
//         name: secondTimeName,
//         value: 12,
//     }, {
//         name: thirdTimeName,
//         value: 23,
//     }, {
//         name: fourthTimeName,
//         value: 35,
//     }, {
//         name: fifthTimeName,
//         value: 2,
//     }, {
//         name: sixthTimeName,
//         value: 64,
//     }, {
//         name: seventhTimeName,
//         value: 34,
//     }, {
//         name: eighthTimeName,
//         value: 34,
//     }, {
//         name: ninthTimeName,
//         value: 66,
//     }, {
//         name: tenthTimeName,
//         value: 24,
//     }, {
//         name: eleventhTimeName,
//         value: 13,
//     }, {
//         name: twelfthTimeName,
//         value: 89,
//     }]
// );

// const inStorageSelector = createSelector(
//     getStorage,
//     (data) => [{
//         name: firstTimeName,
//         value: data.f_00 + data.f_01 + 100,
//     }, {
//         name: secondTimeName,
//         value: data.f_02 + data.f_03,
//     }, {
//         name: thirdTimeName,
//         value: data.f_04 + data.f_05,
//     }, {
//         name: fourthTimeName,
//         value: data.f_06 + data.f_07,
//     }, {
//         name: fifthTimeName,
//         value: data.f_08 + data.f_09,
//     }, {
//         name: sixthTimeName,
//         value: data.f_10 + data.f_11,
//     }, {
//         name: seventhTimeName,
//         value: data.f_12 + data.f_13,
//     }, {
//         name: eighthTimeName,
//         value: data.f_14 + data.f_15,
//     }, {
//         name: ninthTimeName,
//         value: data.f_16 + data.f_17,
//     }, {
//         name: tenthTimeName,
//         value: data.f_18 + data.f_19,
//     }, {
//         name: eleventhTimeName,
//         value: data.f_20 + data.f_21,
//     }, {
//         name: twelfthTimeName,
//         value: data.f_22 + data.f_23,
//     }]
// );

// // 入库率 入库量 / 接待量
// const inStoragePercentSelector = createSelector(
//     receiveSelector,
//     inStorageSelector,
//     (receive, inStorage) => {
//         const data = [];
//         const timeKeys = Object.keys(timesNameMap);
//         for (let i = 0; i < receive.length; i++) {
//             const name = timeKeys[i];
//             const c = receive[i].value;
//             if (c) {
//                 const s = inStorage[i].value;
//                 data.push({
//                     name,
//                     value: Math.round(s / c * 100),
//                 });
//             } else {
//                 data.push({
//                     name,
//                     value: 0,
//                 });
//             }
//         }

//         return data;
//     }
// );

// const receiveCountSelector = createSelector(
//     receiveSelector,
//     (timePeriodData) => ({
//         name: '接待量',
//         type: 'bar',
//         barWidth: 30,
//         data: timePeriodData,
//     })
// );

// const receivePercentage = createSelector(
//     receivePercentSelector,
//     (percentage) => ({
//         name: '接待率',
//         type: 'line',
//         lineWidth: 10,
//         yAxisIndex: 1,
//         data: percentage,
//     }),
// );

// const inStoragePercentage = createSelector(
//     inStoragePercentSelector,
//     (percentage) => ({
//         name: '入库率',
//         type: 'line',
//         lineWidth: 10,
//         yAxisIndex: 1,
//         data: percentage,
//     }),
// );

// const conversionStatsSelector = createSelector(
//     receiveCountSelector,
//     receivePercentage,
//     inStoragePercentage,
//     (receive, receiveRate, inStorageRate) => ({
//         tooltip: {
//             trigger: 'axis',
//             axisPointer: {            // 坐标轴指示器，坐标轴触发有效
//                 type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
//             },
//             // formatter: (params) => {
//             //     const param = params[0];
//             //     const percent = Math.round(param.value / 700 * 100);
//             //     const html = genChartTipHtml({
//             //         ...param,
//             //         percent,
//             //     });
//             //     return html;
//             // },
//         },
//         legend: {
//             data: ['接待量', '接待率', '入库率'],
//         },
//         grid: {
//             left: '3%',
//             right: '4%',
//             bottom: '3%',
//             containLabel: true,
//         },
//         xAxis: [{
//             type: 'category',
//             axisLabel: {
//                 interval: 0,
//             },
//             data: [
//                 firstTimeName,
//                 secondTimeName,
//                 thirdTimeName,
//                 fourthTimeName,
//                 fifthTimeName,
//                 sixthTimeName,
//                 seventhTimeName,
//                 eighthTimeName,
//                 ninthTimeName,
//                 tenthTimeName,
//                 eleventhTimeName,
//                 twelfthTimeName,
//             ],
//         }],
//         yAxis: [{
//             name: '数量',
//             type: 'value',
//         }, {
//             name: '百分比',
//             type: 'value',
//             axisLabel: {
//                 formatter: '{value}%',
//             },
//         }],
//         series: [receive, receiveRate, inStorageRate],
//     })
// );

// export default conversionStatsSelector;

// const receiveSelector =

import { createSelector } from 'reselect';
import {
    mergeEveryTwoSplit,
    genTooltipLine,
} from 'utils/chartsUtils';
import {
    getTableData,
    dateTimeSelector,
    isOneDaySelector,
    receiveCountSelector,
} from 'utils/statsSelectors';
import * as ChartColorTypes from 'constants/ChartColorTypes';

const receiveRatioSelector = createSelector(
    getTableData,
    isOneDaySelector,
    (data, isOneDay) => {
        if (isOneDay) {
            return mergeEveryTwoSplit(data, 'talk_rate');
        }

        return data.map(d => d.talk_rate);
    }
);

const storageRatioSelector = createSelector(
    getTableData,
    isOneDaySelector,
    (data, isOneDay) => {
        if (isOneDay) {
            return mergeEveryTwoSplit(data, 'storage_rate');
        }

        return data.map(d => d.storage_rate);
    }
);

/* eslint-disable import/prefer-default-export, consistent-return, max-len */
export const getChartOptions = () => createSelector(
    dateTimeSelector,
    receiveCountSelector,
    receiveRatioSelector,
    storageRatioSelector,
    (date, receiveCount, receiveRatio, storageRatio) =>
        // const splitNumber = 5;
        // const receiveMin = Math.min.apply(null, receiveCount);
        // let receiveMax = Math.ceil(Math.max.apply(null, receiveCount));
        // receiveMax = parseInt(receiveMax / splitNumber, 10) * splitNumber + (receiveMax % splitNumber === 0 ? 0 : splitNumber);
        // const receiveInterval = receiveMax / splitNumber;

        // const ratioMin = Math.min(Math.min.apply(null, receiveRatio), Math.min.apply(null, storageRatio));
        // let ratioMax = Math.ceil(Math.max(Math.max.apply(null, receiveRatio), Math.max.apply(null, storageRatio)));
        // ratioMax = parseInt(ratioMax / splitNumber, 10) * splitNumber + (ratioMax % splitNumber === 0 ? 0 : splitNumber);
        // const ratioInterval = ratioMax / splitNumber;
        // console.log(receiveInterval, ratioInterval);
        // const ratioMin = 0;
        // let ratioMax = Math.ceil(Math.max.apply(null, receiveRatio));
        // ratioMax = parseInt(ratioMax / splitNumber, 10) * splitNumber + (ratioMax % splitNumber === 0 ? 0 : splitNumber);
        // const ratioInterval = ratioMax / splitNumber;
        ({
            tooltip: {
                trigger: 'axis',
                padding: 7,
                axisPointer: {
                    type: '',
                },
                confine: true,
                formatter: (params) => {
                    const lines = params.map((param, index) => {
                        if (index === 1 || index === 2) {
                            return genTooltipLine(param, true);
                        }

                        return genTooltipLine(param);
                    });

                    const dataHtml = lines.join('<br>');
                    if (params[0].name) {
                        return `${params[0].name}<br>${dataHtml}`;
                    }
                    return dataHtml;
                },
            },
            legend: {
                data: ['接待量', '接待率', '入库率'],
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '20%',
                containLabel: true,
            },
            xAxis: [{
                type: 'category',
                data: date,
                axisLabel: {
                    rotate: 35,
                },
            }],
            yAxis: [{
                name: '接待量',
                type: 'value',
                // max: receiveMax,
                // min: receiveMin,
                // interval: receiveInterval,
                // splitNumber: 5,
            }, {
                name: '比例',
                type: 'value',
                axisLabel: {
                    formatter: '{value}%',
                },
                splitLine: {
                    show: false,
                },
                // splitNumber: 5,
                // max: ratioMax,
                // min: ratioMin,
                // interval: ratioInterval,
            }],
            series: [{
                name: '接待量',
                type: 'bar',
                barWidth: 30,
                data: receiveCount,
                itemStyle: {
                    normal: {
                        color: ChartColorTypes.MALIBU_COLOR,
                    },
                },
            }, {
                name: '接待率',
                type: 'line',
                lineWidth: 10,
                yAxisIndex: 1,
                data: receiveRatio,
                itemStyle: {
                    normal: {
                        color: ChartColorTypes.CARROT_COLOR,
                    },
                },
            }, {
                name: '入库率',
                type: 'line',
                lineWidth: 10,
                yAxisIndex: 1,
                data: storageRatio,
                itemStyle: {
                    normal: {
                        color: ChartColorTypes.EMERALD_COLOR,
                    },
                },
            }],
        })
);
/* eslint-enable import/prefer-default-export, consistent-return, max-len */
