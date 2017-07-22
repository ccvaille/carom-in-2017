import moment from 'moment';
import { createSelector } from 'reselect';
import { genChartTipHtml, timesNameMap, mergeEveryTwo } from 'utils/chartsUtils';

const countSum = state => state.countSum;
export const getTableData = state => state.tableData;
export const getStatsData = state => state.statsData;
export const getParams = state => state.params;
export const isOneDaySelector = createSelector(
    getParams,
    (params) => {
        const start = moment(params.startDate);
        const end = moment(params.endDate);
        const isOneDay = end.diff(start, 'days') <= 1;

        return isOneDay;
    }
);

// 获取字符串的长度
const getStrRealLength = (str) => {
    if (str == null) return 0;
    if (typeof str !== 'string') {
        // eslint-disable-next-line no-param-reassign
        str += '';
    }

    return str.replace(/[^\x00-\xff]/g, '01').length;
};

// 截取指定字符长度的字符串
const getFixLengthStr = (str, fixLen) => {
    let realLen = 0;

    for (let i = 0, len = str.length; i < len; i++) {
        const charCode = str.charCodeAt(i);

        if (charCode >= 0 && charCode <= 128) {
            realLen += 1;
        } else {
            realLen += 2;
        }

        if (realLen >= fixLen) {
            return str.slice(0, i + 1);
        }
    }
    return str;
};

export const dateTimeSelector = createSelector(
    getTableData,
    isOneDaySelector,
    (data, isOneDay) => {
        if (isOneDay) {
            const result = [];
            // eslint-disable-next-line no-restricted-syntax
            for (const timeKey of Object.keys(timesNameMap)) {
                result.push(timesNameMap[timeKey]);
            }

            return result;
        }

        return data.map(d => d.date);
    }
);

export const receiveCountSelector = createSelector(
    getTableData,
    isOneDaySelector,
    (data, isOneDay) => {
        if (isOneDay) {
            return mergeEveryTwo(data, 'web_talk');
        }

        return data.map(d => d.web_talk);
    }
);

const getCountSeriesData = (statsFnType = 0) => {
    let statsFn = getTableData;
    if (statsFnType === 1) {
        statsFn = getStatsData;
    }

    return createSelector(
        statsFn,
        // chartParams,
        (data) => {
            const reverseData = JSON.parse(JSON.stringify(data)).reverse();
            const counts = [];
            const keys = [];
            const names = [];
            const keysAll = [];
            const l = data.length;
            reverseData.forEach((el, index) => {
                const key = l - index;
                keys.push(key);
                counts.push(el.f_count);
                names.push(el.f_url || '直接访问');
                keysAll.push(getFixLengthStr(el.f_url.replace(/(^\w+:|^)\/\//, ''), 20) || '直接访问');
            });

            return {
                keys,
                keysAll,
                counts,
                names,
            };
        }
    );
};

export const getCountChartOptions = (chartParams = {
    statsFnType: 0,
}) => createSelector(
    getCountSeriesData(chartParams.statsFnType),
    countSum,
    (data, sum) => ({
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: '',        // 默认为直线，可选为：'line' | 'shadow'
            },
            confine: true,
            formatter: (params) => {
                const html = params.map((param) => {
                    const value = param.value || 0;
                    let percentage;
                    if (sum <= 0) {
                        percentage = 0;
                    } else {
                        percentage = Math.round((value / sum) * 100);
                    }

                    return genChartTipHtml({
                        ...param,
                        value,
                        // name: data.names[data.names.length - param.name] || '暂无数据',
                        name: data.names[param.dataIndex] || '暂无数据',
                        percentage,
                    });
                });

                return html.join('<br>');
            },
        },
        legend: {
            data: chartParams.legend,
            selectedMode: false,
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
        },
        xAxis: [{
            type: 'value',
            position: chartParams.xPosition || 'bottom',
        }],
        yAxis: [{
            type: 'category',
            data: data.keysAll,
        }],
        series: [{
            name: chartParams.series[0].name,
            type: 'bar',
            // barWidth: 30,
            barMaxWidth: 30,
            barGap: '120%',
            data: data.counts,
            itemStyle: {
                normal: {
                    color: chartParams.color,
                },
            },
        }],
    })
);

const getCountSeriesDataCommon = (chartParams = {}) => createSelector(
    getTableData,
    (data) => {
        const counts = [];
        const keys = [];
        const keysAll = [];
        data.forEach((el) => {
            const len = getStrRealLength(el[chartParams.keys]);
            let cKey = el[chartParams.keys];
            if (len >= 20) {
                cKey = `${getFixLengthStr(el[chartParams.keys], 20)}...`;
            }
            keys.push(cKey);
            keysAll.push(el[chartParams.keys]);
            // keysAll[keys[keys.length - 1] + el[chartParams.counts]] = el[chartParams.keys];
            counts.push(el[chartParams.counts]);
        });

        return {
            keysAll,
            keys,
            counts,
        };
    }
);

export const getCountChartOptionsCommon = (chartParams = {}) => createSelector(
    getCountSeriesDataCommon(chartParams),
    countSum,
    (data, sum) => ({
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: '',        // 默认为直线，可选为：'line' | 'shadow'
            },
            confine: true,
            formatter: (params) => {
                // console.log(params, 'params')

                const html = params.map((param) => {
                    const value = param.value || 0;
                    let percentage;
                    if (sum <= 0) {
                        percentage = 0;
                    } else {
                        percentage = Math.round((value / sum) * 100);
                    }

                    return genChartTipHtml({
                        ...param,
                        // name: data.keysAll[param.name + param.value] || '暂无数据',
                        name: data.keysAll[param.dataIndex] || '暂无数据',
                        value,
                        percentage,
                    });
                });

                return html.join('<br>');
            },
        },
        legend: {
            data: chartParams.legend,
            selectedMode: false,
        },
        grid: {
            x: 40,
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
        },
        xAxis: [{
            type: 'value',
            position: chartParams.xPosition || 'bottom',
        }],
        yAxis: [{
            type: 'category',
            data: data.keys,
        }],
        series: [{
            name: chartParams.series[0].name,
            type: 'bar',
            // barWidth: 30,
            barMaxWidth: 30,
            barGap: '120%',
            data: data.counts,
            itemStyle: {
                normal: {
                    color: chartParams.color,
                },
            },
        }],
    })
);


// export default getChartOptions;
