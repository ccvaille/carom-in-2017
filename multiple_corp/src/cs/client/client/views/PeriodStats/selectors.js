import { createSelector } from 'reselect';
import { mergeEveryTwo } from 'utils/chartsUtils';
import {
    getTableData,
    isOneDaySelector,
    dateTimeSelector,
    receiveCountSelector,
} from 'utils/statsSelectors';
import * as ChartColorTypes from 'constants/ChartColorTypes';

const uvCountSelector = createSelector(
    getTableData,
    isOneDaySelector,
    (data, isOneDay) => {
        if (isOneDay) {
            return mergeEveryTwo(data, 'uv');
        }

        return data.map(d => d.uv);
    }
);

const storageCountSelector = createSelector(
    getTableData,
    isOneDaySelector,
    (data, isOneDay) => {
        if (isOneDay) {
            return mergeEveryTwo(data, 'storage');
        }

        return data.map(d => d.storage);
    }
);

// eslint-disable-next-line import/prefer-default-export
export const getChartOptions = createSelector(
    dateTimeSelector,
    uvCountSelector,
    receiveCountSelector,
    storageCountSelector,
    (date, uvCount, receiveCount, storageCount) => ({
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: '',
            },
            confine: true,
        },
        legend: {
            data: ['全部访客UV', '接待量', '入库量'],
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
            // name: '接待量',
            type: 'value',
        }],
        series: [{
            name: '全部访客UV',
            type: 'line',
            lineWidth: 10,
            data: uvCount,
            itemStyle: {
                normal: {
                    color: ChartColorTypes.CARROT_COLOR,
                },
            },
        }, {
            name: '接待量',
            type: 'line',
            lineWidth: 10,
            data: receiveCount,
            itemStyle: {
                normal: {
                    color: ChartColorTypes.MALIBU_COLOR,
                },
            },
        }, {
            name: '入库量',
            type: 'line',
            lineWidth: 10,
            data: storageCount,
            itemStyle: {
                normal: {
                    color: ChartColorTypes.EMERALD_COLOR,
                },
            },
        }],
    })
);
