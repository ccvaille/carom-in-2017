import { createSelector } from 'reselect';
import { CARROT_COLOR } from 'constants/ChartColorTypes';

const getTableData = state => state.tableData;

const getCsData = createSelector(
    getTableData,
    (data) => {
        const csNames = [];
        const receiveCount = [];
        data.forEach(cs => {
            csNames.push(cs.f_cs_name);
            receiveCount.push(cs.f_web_service);
        });

        return {
            csNames,
            receiveCount,
        };
    }
);

export const getCsChartOptions = createSelector(
    getCsData,
    (result) => ({
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: '',        // 默认为直线，可选为：'line' | 'shadow'
            },
            confine: true,
        },
        legend: {
            data: ['接待量'],
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '20%',
            containLabel: true,
        },
        xAxis: [{
            type: 'category',
            data: result.csNames,
            axisLabel: {
                rotate: 35,
            },
        }],
        yAxis: [{
            type: 'value',
        }],
        series: [{
            name: '接待量',
            type: 'bar',
            barWidth: 30,
            data: result.receiveCount,
            itemStyle: {
                normal: {
                    color: CARROT_COLOR,
                },
            },
        }],
    })
);
