import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import './index.less';
import classNames from 'classnames';
import _ from 'lodash'
import ReactEcharts from 'echarts-for-react';
import {formatNumber,getDPR} from '../../util/utils.js'
import noRankPng from '../../images/no-rank.png';
import noFunnelPng from '../../images/no-funnel.png';
import cloudPng from '../../images/cloud.png';

let chartOptions = {
    animation: false,
    tooltip: {
        show: false
    },
    calculable: true,
    series: [
        {
            name: '漏斗图',
            type: 'funnel',
            left: '10',
            right: '10',
            top: '5',
            bottom: '5',
            minSize: '1%',
            maxSize: '100%',
            sort: 'none',
            gap:5,
            label: {
                normal: {
                    show: true,
                    position: 'inside',
                    textStyle: {
                        color: '#303642',
                        fontSize: (getDPR()/2*26).toFixed(0)
                    }
                }
            },
            itemStyle: {
                normal: {
                    borderColor: '#fff',
                    borderWidth: 1
                }
            },
            data: []
        }
    ]
};

function renderChartOps(data) {
    let colorStart = [232, 250, 255];
    let colorEnd = [255, 106, 108];
    let colorDiff = [23, -144, -147];

    let data1 = [];
    if (data && data.length > 0) {
        let colorGap = colorDiff.map((item, index) => {
            return Math.floor(item / data.length);
        });
        let noTotal = data.every((item, index) => {
            return item.total == 0;
        })

        if (noTotal) {
            data.forEach((item, index,arr) => {
                data1.push({
                    id: item.id,
                    value: arr.length - index,
                    name: item.name + '：--',
                    itemStyle: {
                        normal: {
                            color: '#DADDE4'
                        }
                    }
                });
            });
        }
        else {
            data.forEach((item, index) => {
                data1.push({
                    id: item.id,
                    value: item.total,
                    name: item.name + '：' + (item.total ? item.total : '--'),
                    itemStyle: {
                        normal: {
                            color: 'rgba(' + [colorStart[0] + colorGap[0] * index, colorStart[1] + colorGap[1] * index, colorStart[2] + colorGap[2] * index, 1].join(',') + ')'
                        }
                    }
                });
            });

            if (data[data.length - 1].total !== 0) {
                data1.push({
                    ...data1[data1.length - 1],
                    id: 'last',
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    label: {
                        normal: {
                            show: false,

                        }
                    },
                    itemStyle: {
                        normal: {
                            opacity: 0
                        }
                    }
                });
            }
        }
    }

    let _chartOptions = _.cloneDeep(chartOptions);

    _chartOptions.series[0].data = data1;
    return _chartOptions;
}


class FunnelCard extends React.Component {
    constructor(props) {
        super(props);

    }
    static propTypes = {
        data:PropTypes.object.isRequired,
    };

    static defaultProps = {
        data:{}
    };

    render = () => {
        let {className,style,data,...others} = this.props;
        let cls = classNames({
            'funnel-card':true,
            ...className
        });

        let chartHeight = 0;
        if(data){
            if (data.pdata && data.pdata.length > 0) {
                if (data.pdata[data.pdata.length - 1].total != 0) {
                    chartHeight = (data.pdata.length + 1) * 70 ;
                }
                else {
                    chartHeight = data.pdata.length * 70 ;
                }
            }
        }
        
        return (

            <div className={cls} style={style}>
                <div className="header">
                    <span className="title">销售漏斗(单量)</span>
                    <i className="iconfont">&#xe67e;</i>
                </div>
                    {
                        Object.keys(data).length>0?(
                    <div className="content">
                        <div className="cloud">
                            <p>
                                <span className="title">客户总数(个)</span> : <span className="num">{data.crmnums}</span>
                            </p>
                        </div>
                        <div className="chart">
                            <ReactEcharts
                                option={renderChartOps(data.pdata)}
                                onEvents={this.chartEvents}
                                style={{ 'width': '100%', 'height': (getDPR()/2*chartHeight).toFixed(0)+'px','marginTop':'15px' }} showLoading={false} />
                        </div>
                    </div>
                    ):(
                            <div className="no-data-content">
                                <img className="no-data-img" src={noFunnelPng} />
                                <p>太低调了，还没有订单</p>
                            </div>
                        )
                    }
            </div>

        )
    }
}

export default FunnelCard;
