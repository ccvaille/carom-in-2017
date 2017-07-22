import * as transformTypes from 'constants/transformTypes';

const initialState = {
    analysisData: {},
    keyData: {},
    option: getOption(),
    activeIndex: 1
};

function transformReducers(state = initialState, action) {
    switch(action.type) {
        case transformTypes.FETCH_ANALYSIS_DATA:
            return {
                ...state,
                analysisData: action.analysisData,
                option: getOption(state.activeIndex, action.analysisData)
            }
        case transformTypes.FETCH_KEY_DATA:
            return {
                ...state,
                keyData: action.keyData
            }
        case transformTypes.SWITCH_ACTIVE_INDEX:
            return {
                ...state,
                option: getOption(action.activeIndex, state.analysisData),
                activeIndex: action.activeIndex
            }
        default:
            return state
    }
}

function getOption(index, data) {
    const option = {
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                var result = '' + params[0].name + '<br />';
                var list = [];
                for(var i = 0; i < params.length; i++) {
                    list[i] = [];
                    list[i][0] = params[i].value;
                    list[i][1] = '<span class="dot" style="background:'+ params[i].color +'"></span>' + params[i].seriesName + ': ' + params[i].value + (index == 2 ? '%' : '') + '<br />';
                }
                list.sort(function(a, b) {
                    return b[0] - a[0]
                });
                list.forEach(function(item) {
                    result += item[1];
                })
                return result;
            },
        },
        legend: {
            data:['送达用户数','阅读用户数','登记用户数','入库用户数'],
            bottom: '10px',
        },
        grid: {
            top: '20px',
            left: '40px',
            right: '30px',
            bottom: '60px',
            containLabel: false
        },
        xAxis: {
            type: 'category',
            boundaryGap: true,
            splitLine:{
                show: false, //去除网格线
            },
            data: [],
            axisTick: {
                lineStyle: {
                    opacity: 0
                }
            }
        },
        yAxis: {
            type: 'value',
            splitLine:{
                show: false, //去除网格线
            },
            // show: false,
            // axisLine: {
            //     show: false
            // }
        },
        series: [
            {
                name:'送达用户数',
                type:'line',
                // stack: '总量',
                itemStyle : {
                    normal : {
                        color:'#F76F57',
                        lineStyle:{
                            color:"#F76F57"//折线颜色
                        }
                    }
                },
                smooth: true,
                data:[]
            },
            {
                name:'阅读用户数',
                type:'line',
                // stack: '总量',
                itemStyle : {
                    normal : {
                        color:'#37D067',
                        lineStyle:{
                            color:"#37D067"//折线颜色
                        }
                    }
                },
                smooth: true,
                data:[]
            },
            {
                name:'登记用户数',
                type:'line',
                // stack: '总量',
                itemStyle : {
                    normal : {
                        color:'#AF80F1',
                        lineStyle:{
                            color:"#AF80F1"//折线颜色
                        }
                    }
                },
                smooth: true,
                data:[]
            },
            {
                name:'入库用户数',
                type:'line',
                // stack: '总量',
                itemStyle : {
                    normal : {
                        color:'#60ABF8',
                        lineStyle:{
                            color:"#60ABF8"//折线颜色
                        }
                    }
                },
                smooth: true,
                data:[]
            }
        ]
    };
    if(index == 1) {
        option.xAxis.data = data.date;
        option.legend.data = ['送达用户数','阅读用户数','登记用户数','入库用户数']
        option.series[0].name = '送达用户数';
        option.series[1].name = '阅读用户数';
        option.series[2].name = '登记用户数';
        option.series[3].name = '入库用户数';
        option.series[0].data = data.summary.send;
        option.series[1].data = data.summary.view;
        option.series[2].data = data.summary.commit;
        option.series[3].data = data.summary.crm;
    } else if(index == 2) {
        option.xAxis.data = data.date;
        option.legend.data = ['阅读转化率','登记转化率','入库转化率','客户转化率']
        option.series[0].name = '阅读转化率';
        option.series[1].name = '登记转化率';
        option.series[2].name = '入库转化率';
        option.series[3].name = '客户转化率';
        option.series[0].data = data.summary.view_rate;
        option.series[1].data = data.summary.commit_rate;
        option.series[2].data = data.summary.crm_rate;
        option.series[3].data = data.summary.total_rate;
    }
    return option;
}

export default transformReducers;
