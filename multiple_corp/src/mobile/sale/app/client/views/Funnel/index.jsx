import React, { PropTypes } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    ActivityIndicator,
    Modal,
    Button,
    Accordion, 
    List 
} from 'antd-mobile';
import { Link, browserHistory } from 'react-router';
import './index.less';
import ReactEcharts from 'echarts-for-react';
import DepFilterPanel from '../../component/depFilterPanel'
import noFunnelPng from '../../images/no-funnel.png';
import funnelTipsPng from '../../images/funnel-tips.png';
import funnelGuidePng from '../../images/funnel-guide.png';
import { formatNumber,getDPR } from '../../util/utils.js'
import moment from 'moment';
import 'moment/locale/zh-cn';
import * as funnelActions from '../../actions/funnelActions'


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
            gap: 5,
            label: {
                normal: {
                    show: true,
                    position: 'inside',
                    textStyle: {
                        color: '#303642',
                        fontSize:(getDPR()/2*26).toFixed(0)
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

function renderChartOps(data, tabIndex) {
    let colorStart = [232, 250, 255];
    let colorEnd = [255, 106, 108];
    let colorDiff = [23, -144, -147];

    let data1 = [], data2 = [];
    if (data && data.length > 0) {

        let colorGap = colorDiff.map((item, index) => {
            return Math.floor(item / data.length);
        });


        let noTotal = data.every((item, index) => {
            return item.total == 0;
        })

        let noMoney = data.every((item, index) => {
            return item.money == 0;
        })

        if(noMoney){
            data.forEach((item, index,arr) => {
                data2.push({
                    view: 1,
                    id: item.id,
                    value: arr.length - index,
                    name: item.name + '：--',
                    total: item.total,
                    money: item.money,
                    percent_change: item.percent_change,
                    avg_stoptime: item.avg_stoptime,
                    avg_arrivetime: item.avg_arrivetime,
                    itemStyle: {
                        normal: {
                            color: '#DADDE4'
                        }
                    }
                });
            });
        }
        else{
            data.forEach((item, index,arr) => {
                data2.push({
                    view: 1,
                    id: item.id,
                    value: item.money,
                    name: item.name + '：' + (item.money ? formatNumber(item.money) : '--'),
                    total: item.total,
                    money: item.money,
                    percent_change: item.percent_change,
                    avg_stoptime: item.avg_stoptime,
                    avg_arrivetime: item.avg_arrivetime,
                    itemStyle: {
                        normal: {
                            color: 'rgba(' + [colorStart[0] + colorGap[0] * index, colorStart[1] + colorGap[1] * index, colorStart[2] + colorGap[2] * index, 1].join(',') + ')'
                        }
                    }
                });
            })
            if (data[data.length - 1].total != 0) {
                data2.push({
                    ...data2[data2.length - 1],
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
                        },
                        emphasis: {
                            opacity: 0
                        }
                    }
                });
            }
        }

        if (noTotal) {
            data.forEach((item, index,arr) => {
                data1.push({
                    view: 0,
                    id: item.id,
                    value: arr.length - index,
                    name: item.name + '：--',
                    total: item.total,
                    money: item.money,
                    percent_change: item.percent_change,
                    avg_stoptime: item.avg_stoptime,
                    avg_arrivetime: item.avg_arrivetime,
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
                    view: 0,
                    id: item.id,
                    value: item.total,
                    name: item.name + '：' + (item.total ? item.total : '--'),
                    total: item.total,
                    money: item.money,
                    percent_change: item.percent_change,
                    avg_stoptime: item.avg_stoptime,
                    avg_arrivetime: item.avg_arrivetime,
                    itemStyle: {
                        normal: {
                            color: 'rgba(' + [colorStart[0] + colorGap[0] * index, colorStart[1] + colorGap[1] * index, colorStart[2] + colorGap[2] * index, 1].join(',') + ')'
                        }
                    }
                });
            });

            if (data[data.length - 1].total != 0) {
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
                        },
                        emphasis: {
                            opacity: 0
                        }
                    }
                });
            }
        }
    }

    let _chartOptions = _.cloneDeep(chartOptions);
    if (tabIndex===0) {
        _chartOptions.series[0].data = data1;
    }
    else {
        _chartOptions.series[0].data = data2;
    }
    return _chartOptions;
}


let isMove=false;

function touchMoveHandler(e){
    isMove=true;
}

function touchEndHandler(e){
    if(isMove==true){
        isMove=false;
    }
}

class Funnel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tipsModalVisible: false,
            stageModalVisible: false,
            tabIndex: 0,
            activeChartData: {
                avg_arrivetime: 0,
                avg_stoptime: 0,
                name: '',
                percent_change: 0,
                value: 0,
                total: 0,
                money: 0,
                id: null
            },
            
        };
    }

    componentWillMount() {

    }
    componentDidMount() {
        document.addEventListener('touchmove',touchMoveHandler,false)
        document.addEventListener('touchend',touchEndHandler,false)
        let { funnelActions, funnelReducers } = this.props;
        let {dept} = this.props.location.state;
        funnelActions.getAuth();
        funnelActions.filterChange({
            dept: dept
        });
        funnelActions.fetchFunnelData({
            users:[{
                name:dept.name,
                parent_id:dept.parentId,
                type:dept.type,
                id:dept.id,
            }]
        });
    }
    componentWillUnmount() {
        document.removeEventListener('touchmove',touchMoveHandler);
        document.removeEventListener('touchend',touchEndHandler)
        let { funnelActions, funnelReducers } = this.props;
        funnelActions.initState();
    }
    componentWillReceiveProps(nextProps) {
        let { funnelActions, funnelReducers } = this.props;
    }

    handleFilterChange = (value) => {
        let { funnelActions, funnelReducers } = this.props;
        let { tabIndex } = funnelReducers;

        browserHistory.replace({
            pathname: '/mobile/sale/app/funnel/',
            state:{
                dept:value.dept
            }
        });

        funnelActions.filterChange({
            dept: value.dept
        });
        
        let users = value.dept.id ? [{
            name: value.dept.name,
            id: value.dept.id,
            type: value.dept.type,
            parent_id: value.dept.parentId
        }] : [];

        funnelActions.fetchFunnelData({
            users: users
        });
        
    }

    closeGuideModal= () => {
        let {funnelActions} = this.props;
        funnelActions.setTip();
    }

    openTipsModal = () => {
        this.setState({
            tipsModalVisible: true
        });
    }

    closeTipsModal = () => {
        this.setState({
            tipsModalVisible: false
        });
    }

    closeStateModal = () => {
        this.setState({
            stateModalVisible: false
        });
    }

    toggleView = (value) => {
        const { funnelActions, funnelReducers } = this.props;
        let { dept, tabIndex, month, year, ...others } = funnelReducers;
        funnelActions.switchTab(value);

        if (tabIndex === value) {
            return;
        }
    }

    onChartClick = (params) => {
        if(!isMove){
            if (params.data.id !== 'last') {
                setTimeout(()=>{
                    this.setState({
                        activeChartData: params.data,
                        stateModalVisible: true
                    });
                },500);
            }
        }
    }

    chartEvents = {
        'click': this.onChartClick,
    };

    linkToStage=(item)=>{
        console.log(item);
        browserHistory.push({
            pathname: '/mobile/sale/app/funnel/stage/'+item.sid,
            state: { 
                sname:item.sname,
                total:item.total,
                sid:item.sid
            }
        });
    }

    render = () => {
        let { auth,data, dept, tabIndex,showGuideModal,fetching,...others } = this.props.funnelReducers;

        let chartHeight = 0;
        if (data) {
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
            <div className="sale-funnel">
                <DepFilterPanel
                    dept={dept}
                    defaultUser = {auth.funnel===1?auth.name:null}
                    onFilterChange={(value) => this.handleFilterChange(value)}
                />
                <div className="wrapper">
                    <div className="tabs">
                        <div className={tabIndex === 0 ? "tab tab-left active" : "tab tab-left"} onClick={() => this.toggleView(0)}>单量</div>
                        <div className="split-line"></div>
                        <div className={tabIndex === 1 ? "tab tab-right active" : "tab tab-right"} onClick={() => this.toggleView(1)}>金额</div>
                    </div>
                    <div className="chart-panel">
                        <div className="tips"><span  onClick={() => this.openTipsModal()}><span>指标说明</span><i className="iconfont">&#xe602;</i></span></div>
                        {
                            Object.keys(data).length > 0 ? (
                                <div className="content">
                                    <div className="cloud">
                                        <p>
                                            <span className="title">客户总数(个)</span> : <span className="num">{data.crmnums}</span>
                                        </p>
                                    </div>
                                    <div className="chart">
                                        <ReactEcharts
                                            option={renderChartOps(data.pdata,tabIndex)}
                                            onEvents={this.chartEvents}
                                            style={{ 'width': '100%', 'height':  (getDPR()/2*chartHeight).toFixed(0)+'px', 'marginTop': '15px' }} showLoading={false} />
                                    </div>
                                    <div className="stat">
                                        <div className="left">
                                            <span className="title">整体转化率</span>
                                            <span className="num">{data.percent_change ? data.percent_change : '--'}</span>
                                            <span className="symbol">{data.percent_change ?'%':null}</span>
                                        </div>
                                        <div className="right">
                                            <span className="title">平均成交周期</span>
                                            <span className="num">{data.avg_arrivetime || '--'}</span>
                                            <span className="symbol">{data.avg_arrivetime?'天':null}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                    <div className="no-data-content">
                                        <img className="no-data-img" src={noFunnelPng} />
                                        <p>太低调了，还没有订单</p>
                                    </div>
                                )
                        }
                    </div>
                    <div className="list-panel">
                        <div className="tips"><span>销售单据</span></div>
                        {
                            data.tdata&&data.tdata[0]? (
                                <div className="content">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th colSpan="2" className="stage-title-cell">单据状态</th>
                                                <th>部门/员工</th>
                                                <th>总单量</th>
                                                <th>总金额</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                data.tdata[0].children.map((item, index) => {
                                                    return (
                                                        <tr key={index} onClick={()=>this.linkToStage(item)}>
                                                            <td className="empty-cell"></td>
                                                            <td><span className="stage">{item.sname}</span></td>
                                                            <td className="dept">{dept.name.length>5?dept.name.slice(0,5):dept.name}</td>
                                                            <td className="total">{item.total ? item.total : '--'}</td>
                                                            <td className="money">{item.money ? formatNumber(item.money) : '--'}</td>
                                                            <td className="icon"><i className="iconfont">&#xe67e;</i></td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                    <div className="no-data-content">
                                        <img className="no-data-img" src={noFunnelPng} />
                                        <p>太低调了，还没有订单</p>
                                    </div>
                                )
                        }
                    </div>
                </div>

                <Modal
                    className="funnel-tips-modal"
                    title="查看状态指标"
                    transparent
                    platform="ios"
                    maskClosable={false}
                    visible={this.state.tipsModalVisible}
                    onClose={() => this.closeTipsModal()}
                    style={{ width:(getDPR()/2* 645).toFixed(0)+'px', height: 'cross' }}
                    footer={[{ text: '我知道了', onPress: () => { this.closeTipsModal(); } }]}
                >
                    <div className="content">
                        <img src={funnelTipsPng}/>
                    </div>
                </Modal>

                <Modal
                    className="funnel-guide-modal"
                    title="查看状态指标"
                    transparent
                    platform="ios"
                    maskClosable={false}
                    visible={showGuideModal}
                    onClose={() => this.closeGuideModal()}
                    style={{ width:(getDPR()/2* 645).toFixed(0)+'px', height: 'cross' }}
                    footer={[{ text: '我知道了', onPress: () => { this.closeGuideModal(); } }]}
                >
                    <div className="content">
                        <img src={funnelGuidePng}/>
                        <p>点击每个状态，可以查看具体状态指标</p>
                    </div>
                </Modal>

                <Modal
                    className="funnel-stage-modal"
                    title={this.state.activeChartData.name && this.state.activeChartData.name.split('：')[0]}
                    transparent
                    platform="ios"
                    maskClosable={false}
                    visible={this.state.stateModalVisible}
                    onClose={() => this.closeStateModal()}
                    style={{ width:(getDPR()/2* 645).toFixed(0)+'px', height: 'cross' }}
                    footer={[{ text: '关闭', onPress: () => { this.closeStateModal(); } }]}
                >
                    <div className="content">
                        <p>
                            <span className="title">总单量(个)</span>
                            <span className="result">{this.state.activeChartData.total || '--'}</span>
                        </p>
                        <p>
                            <span className="title">{this.state.activeChartData.id == '3' ? '' : '预计'}成交金额(元)</span>
                            <span className="result">{this.state.activeChartData.money ? formatNumber(this.state.activeChartData.money) : '--'}</span>
                        </p>
                        <p>
                            <span className="title">转化率(百分比)</span>
                            <span className="result">{this.state.activeChartData.percent_change ? this.state.activeChartData.percent_change + '%' : '--'}</span>
                        </p>
                        {this.state.activeChartData.id == '3' ? '' : (
                            <p>
                                <span className="title">平均停留时间(天)</span>
                                <span className="result">{this.state.activeChartData.avg_stoptime || '--'}</span>
                            </p>
                        )}
                    </div>
                </Modal>
                <ActivityIndicator
                    toast
                    text="正在加载"
                    animating={fetching}
                />
            </div>
        )
    }
}


const mapStateToProps = ({ funnelReducers }) => ({
    funnelReducers,
});

const mapDispatchToProps = dispatch => ({
    funnelActions: bindActionCreators(funnelActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Funnel);
