import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import FilterPanel from '../../components/FilterPanel'
import './index.less';
import { fetchMembers, fetchFunnelData, fetchBillData } from '../../actions/'
import { Popover, Table, Modal, Button, TreeSelect, Pagination, Message } from 'antd';
import classnames from 'classnames';
import totalRatePng from '../../images/total_rate.png';
import ratePng from '../../images/rate.png';
import Chart from '../../components/Chart'
import showDetail from '../../components/Bill/PersonalListDetailjQuery'
import _ from 'lodash'

let currentChartParams={};

const titlePopCon = (
    <div>
        <h3 className="tit-1">漏斗使用说明</h3>
        <p>为了保障漏斗发挥最大的作用，请务必保证录入的销售金额符合以下条件：</p>
        <ul>
            <li>1、数据是全部的：公司所有销售金额完整录入EC系统</li>
            <li>2、数据是真实的：认真填写单据，保证填写数据真实有效</li>
            <li>3、数据是持续的：及时准确的更新状态和单据，保证每个单据有始有终</li>
        </ul>
        <p>营销管理重在过程，控制了过程就控制了结果，进而通过漏斗对结果进行分析，发现问题并采取有效的措施进行控制。</p>
    </div>
);

function formatNumber(value) {
    value += '';
    const list = value.split('.');
    const prefix = list[0].charAt(0) === '-' ? '-' : '';
    let num = prefix ? list[0].slice(1) : list[0];
    let result = '';
    while (num.length > 3) {
        result = `,${num.slice(-3)}${result}`;
        num = num.slice(0, num.length - 3);
    }
    if (num) {
        result = num + result;
    }
    return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
}

function formatData(array) {
    let result = array.map((item, index) => {
        return {
            id: item.id,
            parent_id: item.pId,
            name: item.name,
            type: item.type
        }
    });
    return result;
}


let chart1Options = {
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
            gap: 2,
            label: {
                normal: {
                    show: true,
                    position: 'inside',
                    textStyle: {
                        color: '#303642',
                        fontSize: 12
                    }
                }
            },
            labelLine: {
                normal: {
                    length: 10,
                    lineStyle: {
                        width: 1,
                        type: 'solid'
                    }
                }
            },
            itemStyle: {
                normal: {
                    borderColor: '#fff',
                    borderWidth: 1
                },
                emphasis: {
                    borderColor: '#3180e6',
                    borderWidth: 2,
                    color: '#fff',
                    borderType: 'dashed'
                }
            },
            data: []
        }
    ]
};

function renderChartOps(data, toggleView, update) {
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

        if (noMoney) {
            data.forEach((item, index, arr) => {
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
        else {
            data.forEach((item, index, arr) => {
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
            data.forEach((item, index, arr) => {
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

    if (toggleView) {
        chart1Options.series[0].data = data1;
    }
    else {
        chart1Options.series[0].data = data2;
    }
    chart1Options.update = update;
    return _.cloneDeep(chart1Options);
}

class Funnel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toggleView: true,
            filterParams: {
                users: [],
                year: (new Date()).getFullYear(),
                month: '000'
            },
            update: true,
            step: 1,
            stepData: {},
            activeChartData: {
                data: {
                    avg_arrivetime: 0,
                    avg_stoptime: 0,
                    name: '',
                    percent_change: 0,
                    value: 0,
                    total: 0,
                    money: 0,
                    id: null
                },
                dataIndex: 0,
                seriesIndex: 0
            },
            page: {
                curr: 1,
                per: 10
            },
            echartInstance: null,
            expandRowKeys: [0]
        }
    }

    componentWillMount() {
        let { fetchMembers, fetchFunnelData } = this.props;
        //如果是管理员视图，获取组织架构树
        if (window.person == '0') {
            fetchMembers();
        }
        fetchFunnelData({
            users: []
        })
    }
    componentWillReceiveProps(nextProps, nextState) {
        let data = nextProps.funnelData.pdata ? nextProps.funnelData.pdata[0] : {};

        let expandRowKeys = [];
        let tdata = nextProps.funnelData.tdata || [];
        if (tdata.length == 1) {
            expandRowKeys.push(tdata[0].id);
        }
        this.setState({
            activeChartData: {
                data: {
                    avg_arrivetime: data.avg_arrivetime,
                    avg_stoptime: data.avg_stoptime,
                    name: data.name,
                    percent_change: data.percent_change,
                    value: data.total,
                    total: data.total,
                    money: data.money,
                    id: data.id
                },
                dataIndex: 0,
                seriesIndex: 0
            },
            expandRowKeys: expandRowKeys
        });
    }

    componentDidMount() {
        let echartInstance = this.chartRef.getEchartsInstance();
        this.setState({
            echartInstance: echartInstance
        });
        //默认高亮第一个
        echartInstance.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: 0
        });
    }



    onSNameClick = (record) => {
        if (record.total == 0) {
            return;
        }
        this.setState({
            step: 2,
            stepData: record,
            stepName: record.sname,
            page: {
                curr: 1,
                per: 10
            }
        });
        let { fetchBillData } = this.props;
        if (record.users.id == 0) {
            fetchBillData({
                sid: record.sid,
                page: 1,
                total: record.total
            });
        }
        else {
            fetchBillData({
                users: [record.users],
                sid: record.sid,
                page: 1,
                total: record.total
            });
        }

    }


    handelToggleView = (value) => {
        this.setState({
            toggleView: value,
            update: !this.state.update
        });
    }

    handelFilterSubmit = (params) => {
        let { fetchFunnelData } = this.props;
        this.setState({
            filterParams: params,
            step: 1,
        });
        fetchFunnelData({
            users: formatData(params.users)
        });
    }

    handelShowDetail = (record) => {
        showDetail(record.f_id);
    }

    columns1 = [{
        title: '单据状态',
        dataIndex: 'sname',
        key: 'sname',
        className: 'status-col',
        width: 200,
        render: (text, record, index) => {
            if (text == '全部状态' || record.total == 0) {
                return text;
            }
            else {
                return (
                    <a onClick={this.onSNameClick.bind(this, record)}>{text}</a>
                )
            }
        }
    },
    {
        title: '员工/部门',
        dataIndex: 'name',
        key: 'name',
        width: 200,
        render: (text, record, index) => {
            return <span title={text}>{text && text.length > 6 ? text.slice(0, 6) + '...' : text}</span>;
        }
    },
    {
        title: '单量',
        dataIndex: 'total',
        key: 'total',
        width: 200,
        render: (text, record, index) => {
            return text ? text : '--'
        }
    },
    {
        title: '金额',
        dataIndex: 'money',
        key: 'money',
        width: 200,
        render: (text, record, index) => {
            return text ? formatNumber(text) : '--'
        }
    }
    ];

    columns2 = [{
        title: '主题',
        dataIndex: 'f_project_name',
        key: 'f_project_name',
        width: 165,
        render: (text, record, index) => {
            return (
                <a onClick={this.handelShowDetail.bind(this, record)} title={text}>{text.length > 6 ? text.slice(0, 6) + '...' : text}</a>
            )
        }
    },
    {
        title: '客户',
        dataIndex: 'f_name',
        key: 'f_name',
        width: 115,
        render: (text, record, index) => {
            return (
                <a href={'showec://13-' + window.userid + '-' + record.f_crm_id + '-9'}>{text.length > 6 ? text.slice(0, 6) + '...' : text}</a>
            )
        }
    },
    {
        title: '状态',
        dataIndex: 'step',
        key: 'step',
        width: 115
    },
    {
        title: '金额',
        dataIndex: 'f_money',
        key: 'f_money',
        width: 115,
        render: (text, record, index) => {
            return (!text || text == '0.00') ? '--' : formatNumber(text);
        }
    },
    {
        title: '建单人',
        dataIndex: 'f_user_name',
        key: 'f_user_name',
        width: 115,
        render: (text, record, index) => {
            return (
                <span title={text}>{text && text.length > 6 ? text.slice(0, 6) + '...' : text}</span>
            )
        }
    },
    {
        title: '部门',
        dataIndex: 'f_group_name',
        key: 'f_group_name',
        width: 115,
        render: (text, record, index) => {
            return (
                <span title={text}>{text && text.length > 6 ? text.slice(0, 6) + '...' : text}</span>
            )
        }
    },
    {
        title: '建单时间',
        dataIndex: 'f_create_time',
        key: 'f_create_time',
        width: 125,
        className: 'time-col'
    }
    ];


    showAll = () => {
        this.setState({
            step: 1,
            stepData: {},
            stepName: '',
            page: {
                curr: 1,
                per: 10
            }
        });
    }

    onChartHover = (params) => {
        console.log(params);
        if (currentChartParams.dataIndex !== params.dataIndex) {
            if (params.data.id !== 'last') {
                this.setState({
                    activeChartData: params,
                    animation: false
                });

                setTimeout(() => {
                    this.setState({
                        animation: true
                    });
                }, 50);

                this.state.echartInstance.dispatchAction({
                    type: 'downplay',
                    seriesIndex: 0,
                });

                this.state.echartInstance.dispatchAction({
                    type: 'highlight',
                    seriesIndex: params.seriesIndex,
                    dataIndex: params.dataIndex,
                });
            }
        }
        currentChartParams = params;


    }

    chartEvents = {
        'mouseover': this.onChartHover,
        // 'mouseout': this.onChartMouseout,
    };

    handelPagChange = (current, pageSize) => {
        let { fetchBillData } = this.props;

        if (this.state.stepData.users.id == 0) {
            fetchBillData({
                sid: this.state.stepData.sid,
                page: current,
                total: this.state.stepData.total
            });
        }
        else {
            fetchBillData({
                users: [this.state.stepData.users],
                sid: this.state.stepData.sid,
                page: current,
                total: this.state.stepData.total
            });
        }

        this.setState({
            page: {
                curr: current,
                per: 10
            }
        });
    }

    handleTableExpand = (expanded, record) => {
        let expandRowKeys = this.state.expandRowKeys;
        if (expanded) {
            expandRowKeys.push(record.key);
        }
        else {
            expandRowKeys = expandRowKeys.filter((item, index, arr) => {
                return item != record.key;
            });
        }
        this.setState({
            expandRowKeys: expandRowKeys
        });
    }

    setRowClass = (record, index) => {
        if (record.children) {
            return 'node-row'
        }
        else {
            return 'leaf-row'
        }
    }

    render() {
        let { membersData, funnelData, billData, loading } = this.props;
        let switch1Cls = classnames({
            'ctrl-btn': true,
            'active': !this.state.toggleView
        });
        let switch2Cls = classnames({
            'ctrl-btn': true,
            'active': this.state.toggleView
        });

        let step1Cls = classnames({
            'active': this.state.step == 2,
        });

        let stepIconCls = classnames({
            'hide': this.state.step == 1,
        });

        let step2Cls = classnames({
            'hide': this.state.step == 1,
        });

        let aniCls = classnames({
            'warn-wrapper': true,
            'dashed': true,
            'animated': true,
            'fadeIn': this.state.animation
        });

        let table1Data = funnelData.tdata || [];
        if (table1Data) {
            table1Data.forEach((item_1, index_1) => {
                item_1.key = item_1.id;
                if (item_1.children && item_1.children.length > 0) {
                    item_1.children.forEach((item_2, index_2) => {
                        item_2.key = item_1.id + '_' + item_2.sid;
                        item_2.users = {
                            id: item_1.id,
                            name: item_1.name,
                            type: item_1.type,
                            parent_id: item_1.parent_id
                        }
                    })
                }
            });
        }

        if (billData && billData.length > 0) {
            billData.forEach((item, index) => {
                item.key = item.f_id;
                item.step = this.state.stepName;
            });
        }


        let chartHeight = '0px';
        if (funnelData.pdata && funnelData.pdata.length > 0) {
            if (funnelData.pdata[funnelData.pdata.length - 1].total != 0) {
                chartHeight = (funnelData.pdata.length + 1) * 50 + 'px';
            }
            else {
                chartHeight = funnelData.pdata.length * 50 + 'px';
            }
        }

        return (
            <div className="funnel">
                {
                    window.person == '1' ? (<FilterPanel
                        membersData={membersData}
                        onSubmit={this.handelFilterSubmit}
                        isShowTimeRow={false}
                        defaultUser={{
                            id: window.userid,
                            name: window.username
                        }}
                        isShowMonth={this.state.isShowFilterMonth}
                    />) : (<FilterPanel
                        membersData={membersData}
                        onSubmit={this.handelFilterSubmit}
                        isShowTimeRow={false}
                        isShowMonth={this.state.isShowFilterMonth}
                        users={this.state.filterParams.users}
                    />)
                }

                <div className="t-area">
                    <div className="left-side" ref="leftSide">
                        <span className="title">销售漏斗</span>
                        <Popover placement="bottomLeft"
                            trigger="hover"
                            arrowPointAtCenter
                            content={titlePopCon}
                            style={{ 'width': '200px' }}
                            getPopupContainer={() => this.refs.leftSide}>
                            <i className="icon iconfont">&#xe600;</i>
                        </Popover>
                    </div>


                    <div className="right-side">
                        <span className={switch1Cls} onClick={this.handelToggleView.bind(this, true)}>
                            <i className="icon iconfont">&#xe675;</i>
                            按单量查看
                        </span>
                        <span className="split">|</span>
                        <span className={switch2Cls} onClick={this.handelToggleView.bind(this, false)}>
                            <i className="icon iconfont">&#xe676;</i>
                            按金额查看
                        </span>
                    </div>
                </div>

                <div className="container" ref="container">
                    <div className="chart-area">
                        <div className="cloud">
                            <p>
                                <span>客户总数</span>
                                <Popover
                                    placement="bottomLeft"
                                    trigger="hover"
                                    arrowPointAtCenter={true}
                                    content={<span>筛选条件下，员工客户库含有的客户总数。</span>}
                                    getPopupContainer={() => this.refs.container}>
                                    <i className="icon iconfont">&#xe600;</i>
                                </Popover>
                                : <span>{funnelData.crmnums}</span>
                            </p>


                        </div>
                        <div className="chart">
                            <Chart
                                option={renderChartOps(funnelData.pdata, this.state.toggleView, this.state.update)}
                                onEvents={this.chartEvents}
                                chartRef={el => this.chartRef = el}
                                style={{ 'width': '400px', 'height': chartHeight }} showLoading={false} />
                        </div>
                    </div>
                    <div className="warn-area">
                        <div className="warn-wrapper">
                            <span className="tip">
                                漏斗分析
                            </span>
                            <p>
                                <span className="title">整体转化率(百分比)</span>
                                <Popover placement="bottomLeft" trigger="hover"
                                    content={<img src={totalRatePng} />}
                                    arrowPointAtCenter={true}
                                    getPopupContainer={() => this.refs.container}>

                                    <i className="icon iconfont">&#xe600;</i>
                                </Popover>
                                <span className="result">{funnelData.percent_change ? funnelData.percent_change + '%' : '--'}</span>
                                <span className="clearfix"></span>
                            </p>
                            <p>
                                <span className="title">平均成交周期(天)</span>

                                <span className="result">{funnelData.avg_arrivetime || '--'}</span>
                                <span className="clearfix"></span>
                            </p>
                        </div>
                        <div className={aniCls}>
                            <span className="tip">
                                {this.state.activeChartData.data.name && this.state.activeChartData.data.name.split('：')[0]}
                            </span>
                            <p>
                                <span className="title">总单量(个)</span>
                                <span className="result">{this.state.activeChartData.data.total || '--'}</span>
                                <span className="clearfix"></span>
                            </p>
                            <p>
                                <span className="title">{this.state.activeChartData.data.id == '3' ? '' : '预计'}成交金额(元)</span>
                                <Popover placement="bottomLeft" trigger="hover"
                                    content={<span>单据状态非"成交"时，只能算为预计成交的金额</span>}
                                    getPopupContainer={() => this.refs.container}
                                    arrowPointAtCenter={true}>
                                    <i className="icon iconfont">&#xe600;</i>
                                </Popover>
                                <span className="result">{this.state.activeChartData.data.money ? formatNumber(this.state.activeChartData.data.money) : '--'}</span>
                                <span className="clearfix"></span>
                            </p>
                            <p>
                                <span className="title">转化率(百分比)</span>
                                <Popover placement="bottomLeft" trigger="hover"
                                    content={<img src={ratePng} />}
                                    arrowPointAtCenter={true}
                                    getPopupContainer={() => this.refs.container}>
                                    <i className="icon iconfont">&#xe600;</i>
                                </Popover>
                                <span className="result">{this.state.activeChartData.data.percent_change ? this.state.activeChartData.data.percent_change + '%' : '--'}</span>
                                <span className="clearfix"></span>
                            </p>
                            {this.state.activeChartData.data.id == '3' ? '' : (
                                <p>
                                    <span className="title">平均停留时间(天)</span>
                                    <span className="result">{this.state.activeChartData.data.avg_stoptime || '--'}</span>
                                    <span className="clearfix"></span>
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="clearfix"></div>
                </div>
                <div className="bread-crumb">
                    <span className={step1Cls} onClick={this.showAll}>全部</span>
                    <span className={stepIconCls}> > </span>
                    <span className={step2Cls}>{this.state.stepName}</span>
                </div>

                {
                    this.state.step == 1 ? (<div className="clear-fix table-wrapper-1">
                        <Table columns={this.columns1} indentSize={15}
                            dataSource={table1Data}
                            bordered={true}
                            rowClassName={this.setRowClass}
                            expandedRowKeys={this.state.expandRowKeys}
                            onExpand={this.handleTableExpand}
                            loading={loading}
                            pagination={false} />

                    </div>) : (<div className="clear-fix table-wrapper-2">
                        <Table columns={this.columns2}
                            defaultExpandAllRows={true}
                            dataSource={billData}
                            loading={loading}
                            pagination={false} />
                        <Pagination defaultCurrent={1} current={this.state.page.curr} onChange={this.handelPagChange} total={this.state.stepData.total} />
                    </div>)
                }
            </div>
        );
    }
}

const mapStateToProps = state => (
    state.funnelReducer
);

const mapDispatchToProps = (dispatch) => {
    return {
        fetchMembers: () => {
            dispatch(fetchMembers())
        },
        fetchFunnelData: (params) => {
            dispatch(fetchFunnelData(params))
        },
        fetchBillData: (params) => {
            dispatch(fetchBillData(params))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Funnel)
