import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import FilterPanel from '../../components/FilterPanel'
import SetGoal from '../../components/SetGoal'
import './index.less';
import { fetchMembers, fetchAllGoal, setGoal, getGoal, fetchGoalStat, fetchYearRate } from '../../actions/'
import { Popover, Table, Modal, Button, TreeSelect } from 'antd';
const TreeNode = TreeSelect.TreeNode;
import { Message } from 'antd'
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import _ from 'lodash';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const monthMap={
    1:'1月',
    2:'2月',
    3:'3月',
    4:'4月',
    5:'5月',
    6:'6月',
    7:'7月',
    8:'8月',
    9:'9月',
    10:'10月',
    11:'11月',
    12:'12月',
    111:'第一季度',
    222:'第二季度',
    333:'第三季度',
    444:'第四季度',
    '000':'全年',
}


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


const titlePopCon = (
    <div>
        <h3 className="tit-1">表头说明</h3>
        <ul>
            <li>1、目标：管理员在“设定目标”中可为部门/员工设置销售目标</li>
            <li>2、已完成：销售金额状态为“成交”时的金额总和</li>
            <li>3、完成率：“已完成”除以“目标”（蓝色展示）</li>
            <li>4、缺口：在已经实现的基础上与原定目标的差距</li>
            <li>5、缺口率：“缺口”除以“目标”（红色展示）</li>
            <li>6、全年完成率：针对部门/个人，展示其全年12个月份的完成率趋势图</li>
        </ul>
        <h3 className="tit-2">特殊说明</h3>
        <ul>
            <li>"全年完成率"仅当筛选项“时间”按照以“全年”为单位查看时，才会展示</li>
        </ul>
    </div>
);



let chart1Options = {
    tooltip: {
        trigger: 'item',
        formatter: "{b} : {d}%"
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: ['占有率']
    },
    title: [{
        text: '80',
        left: '47%',
        top: '45%',
        textAlign: 'center',
        textBaseline: 'middle',
        textStyle: {
            color: '#303642',
            fontWeight: 'bold',
            fontSize: 24
        }
    },
    {
        text: '目标完成率',
        left: '47%',
        top: '60%',
        textAlign: 'center',
        textBaseline: 'middle',
        textStyle: {
            color: '#303642',
            fontWeight: 'normal',
            fontSize: 12
        }
    }],
    series: [{
        name: '饼图二',
        type: 'pie',
        radius: ['62%', '78%'],
        label: {
            normal: {
                show: false
            }
        },
        data: [{
            value: 20,
            name: '缺口率',
            label: {
                normal: {
                    textStyle: {
                        fontSize: 90
                    }
                }
            },
            itemStyle: {
                normal: {
                    color: '#F76F57'
                },
                emphasis: {
                    color: '#F76F57'
                }
            },
        }, {
            value: 80,
            name: '完成率',
            label: {
                normal: {
                    textStyle: {
                        color: '#555',
                        fontSize: 20
                    }
                }
            },

            itemStyle: {
                normal: {
                    color: '#60ABF8'
                },
                emphasis: {
                    color: '#60ABF8'
                }
            },
        }]
    }]
};

const columns = [{
    title: '部门/员工',
    dataIndex: 'name',
    key: 'name',
    className: 'dep-col',
    width: '180',
    render: (text, record, index) => {
        return <span title={text}>{text.length >6 ?text.slice(0,6)+'...':text}</span>;
    }
}, {
    title: '年度目标',
    width: '650',
    className: 'colspan-col',
    children: [
        {
            title: '目标',
            dataIndex: 'goal',
            key: 'goal',
            render: (text, record, index) => {
                return text ? formatNumber(text) : '--'
            }
        },
        {
            title: '已完成',
            dataIndex: 'finished',
            key: 'finished',
            render: (text, record, index) => {
                return text ? formatNumber(text) : '--'
            },
            sorter: (a, b) => a.finished - b.finished
        },
        {
            title: '缺口',
            dataIndex: 'unfinished',
            key: 'unfinished',
            render: (text, record, index) => {
                return text ? formatNumber(text) : '--'
            },
            sorter: (a, b) => a.unfinished - b.unfinished
        },
        {
            title: '完成率&缺口率',
            dataIndex: 'rate',
            key: 'rate',
            width:'165px',
            sorter: (a, b) => a.finishedRate - b.finishedRate,
            render: (text, record, index) => {
                if (record.goal == 0){
                    return (<div className="rate-line">
                        <span>--</span>
                    </div>)
                }
                else{
                    return (<div className="rate-line">
                        <div className="fin-rate" style={{ 'width': record.finishedRate > 100 ? '100%' : record.finishedRate + '%' }}></div>
                        <div className="unfin-rate" style={{ 'width': record.unfinishedRate < 0 ? '0%' : record.unfinishedRate + '%' }}></div>
                        <span className="fin-rate-text">{record.finishedRate ? record.finishedRate + '%' : '0%'}</span>
                        <span className="unfin-rate-text">{record.unfinishedRate ? record.unfinishedRate + '%' : '0%'}</span>
                    </div>)
                }

            }
        },

    ]
}];


const columns2 = [{
    title: '部门/员工',
    dataIndex: 'name',
    key: 'name',
    className: 'dep-col',
    fixed: 'left',
    width: '180',
    render: (text, record, index) => {
        return <span title={text}>{text.length >6 ?text.slice(0,6)+'...':text}</span>;
    }
},
{
    title: '年度目标',
    dataIndex: 'f_y',
    key: 'year',
    width: 135,
    render: (text, record, index) => {
        return text ? formatNumber(text) : '--'
    }
},
{
    title: '第一季度',
    dataIndex: 'f_q1',
    key: 'q1',
    width: 135,
    render: (text, record, index) => {
        return text ? formatNumber(text) : '--'
    }
},
{
    title: '第二季度',
    dataIndex: 'f_q2',
    key: 'q2',
    width: 135,
    render: (text, record, index) => {
        return text ? formatNumber(text) : '--'
    }
},
{
    title: '第三季度',
    dataIndex: 'f_q3',
    key: 'q3',
    width: 135,
    render: (text, record, index) => {
        return text ? formatNumber(text) : '--'
    }
},
{
    title: '第四季度',
    dataIndex: 'f_q4',
    key: 'q4',
    width: 135,
    render: (text, record, index) => {
        return text ? formatNumber(text) : '--'
    }
},

{
    title: '1月',
    dataIndex: 'f_m1',
    key: 'm1',
    width: 135,
    render: (text, record, index) => {
        return text ? formatNumber(text) : '--'
    }
},
{
    title: '2月',
    dataIndex: 'f_m2',
    key: 'm2',
    width: 135,
    render: (text, record, index) => {
        return text ? formatNumber(text) : '--'
    }
},
{
    title: '3月',
    dataIndex: 'f_m3',
    key: 'm3',
    width: 135,
    render: (text, record, index) => {
        return text ? formatNumber(text) : '--'
    }
},
{
    title: '4月',
    dataIndex: 'f_m4',
    key: 'm4',
    width: 135,
    render: (text, record, index) => {
        return text ? formatNumber(text) : '--'
    }
},
{
    title: '5月',
    dataIndex: 'f_m5',
    key: 'm5',
    width: 135,
    render: (text, record, index) => {
        return text ? formatNumber(text) : '--'
    }
},
{
    title: '6月',
    dataIndex: 'f_m6',
    key: 'm6',
    width: 135,
    render: (text, record, index) => {
        return text ? formatNumber(text) : '--'
    }
},
{
    title: '7月',
    dataIndex: 'f_m7',
    key: 'm7',
    width: 135,
    render: (text, record, index) => {
        return text ? formatNumber(text) : '--'
    }
},
{
    title: '8月',
    dataIndex: 'f_m8',
    key: 'm8',
    width: 135,
    render: (text, record, index) => {
        return text ? formatNumber(text) : '--'
    }
},
{
    title: '9月',
    dataIndex: 'f_m9',
    key: 'm9',
    width: 135,
    render: (text, record, index) => {
        return text ? formatNumber(text) : '--'
    }
},
{
    title: '10月',
    dataIndex: 'f_m10',
    key: 'm10',
    width: 135,
    render: (text, record, index) => {
        return text ? formatNumber(text) : '--'
    }
},
{
    title: '11月',
    dataIndex: 'f_m11',
    key: 'm11',
    width: 135,
    render: (text, record, index) => {
        return text ? formatNumber(text) : '--'
    }
},
{
    title: '12月',
    dataIndex: 'f_m12',
    key: 'm12',
    width: 135,
    render: (text, record, index) => {
        return text ? formatNumber(text) : '--'
    }
}
];

class Goal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowSettingModal: false,
            value: undefined,
            toggleView: true,
            isSelectUserShow:false,
            isShowFilterMonth: true,
            filterParams: {
                users: [],
                year: (new Date()).getFullYear(),
                month: '000'
            },
            goalExpandRowKeys:[],
            completeExpandRowKeys:[]
        }
    }

    onChange = (value) => {
        this.setState({ value });
    }


    componentWillReceiveProps(nextProps,nextState){
        if(nextProps.goalStatData!=this.props.goalStatData){
            let completeExpandRowKeys = (nextProps.goalStatData && nextProps.goalStatData.tree && nextProps.goalStatData.tree.length == 1&&nextProps.goalStatData.tree[0].children&&nextProps.goalStatData.tree[0].children.length>0) ? [nextProps.goalStatData.tree[0].key] : [];
            
            let goalExpandRowKeys = (nextProps.allGoalData && nextProps.allGoalData.length == 1) ? [nextProps.allGoalData[0].key] : [];
            this.setState({
                completeExpandRowKeys:completeExpandRowKeys,
                goalExpandRowKeys:goalExpandRowKeys
            });
        }
        
    }

    componentWillMount() {
        let { fetchMembers, fetchGoalStat } = this.props;
        if(window.person == '0'){
            fetchMembers();
        }
        //首次进来的时候获取全部
        fetchGoalStat({
            year: this.state.filterParams.year,
            m: this.state.filterParams.month,
        })
    }

    showSettingModal = () => {
        this.setState({
            isShowSettingModal: true,
            isSelectUserShow:false
        });
    }

    handleCancel = () => {
        this.setState({
            isShowSettingModal: false
        });
    }

    handleOk = (params) => {
        let toggleView = this.state.toggleView;
        let filterParams = this.state.filterParams;
        let { fetchAllGoal, fetchGoalStat, setGoal } = this.props;
        setGoal(params);
        if (toggleView) {
            fetchGoalStat({
                year: filterParams.year,
                m: filterParams.month,
                users: formatData(filterParams.users)
            })
        }
        else {
            fetchAllGoal({
                year: filterParams.year,
                users: formatData(filterParams.users)
            });

        }
        this.setState({
            isShowSettingModal: false
        });
    }

    handelToggleView = () => {
        let toggleView = this.state.toggleView;
        let isShowFilterMonth = this.state.isShowFilterMonth;
        let filterParams = this.state.filterParams;
        let { fetchAllGoal, fetchGoalStat } = this.props;
        this.setState({
            toggleView: !toggleView,
            isShowFilterMonth: !isShowFilterMonth
        });

        if (isShowFilterMonth) {
            fetchAllGoal({
                year: filterParams.year,
                users: formatData(filterParams.users)
            });
        }
        else {
            fetchGoalStat({
                year: filterParams.year,
                m: filterParams.month,
                users: formatData(filterParams.users)
            })
        }
    }

    handelFilterSubmit = (params) => {
        let { fetchAllGoal, fetchGoalStat } = this.props;
        this.setState({
            filterParams: params
        });
        if (this.state.isShowFilterMonth) {
            fetchGoalStat({
                year: params.year,
                m: params.month,
                users: formatData(params.users)
            })
        }
        else {
            fetchAllGoal({
                year: params.year,
                users: formatData(params.users)
            });
        }
    }

    renderWarnText = (data) => {
        if (data && data.sumGoal) {
            let rate = (data.sumFinished / data.sumGoal * 100).toFixed(0);
            let date = new Date();
            let currentYear = date.getFullYear();
            let currentMonth = date.getMonth() + 1;


            let month = this.state.filterParams.month;
            let year = this.state.filterParams.year;
            let isShowWarn = false;
            let monthStr = (moment().quarter().toString() + moment().quarter().toString() + moment().quarter().toString());
            if (currentYear == year && month == '000') {
                isShowWarn = true;
            }
            if (currentYear == year && month == monthStr) {
                isShowWarn = true;
            }
            if (currentYear == year && month == currentMonth) {
                isShowWarn = true;
            }


            let timeName = '';
            let daysDiff = 1;
            if (month == '000') {
                timeName = '本年';
                daysDiff = moment().endOf('year').diff(moment(), 'days');
            }
            else if (month == '111' || month == '222' || month == '333' || month == '444') {
                timeName = '本季度';
                daysDiff = moment().endOf('quarter').diff(moment(), 'days');
            }
            else {
                timeName = '本月';
                daysDiff = moment().endOf('month').diff(moment(), 'days');
            }

            if (isShowWarn) {
                if (rate < 100) {
                    return (
                        <div className="warn-wrapper">
                            <span className="tip">
                                <i className="icon iconfont">&#xe670;</i>
                                温馨提示
                        </span>
                            <p>离目标金额完成还差<span className="money">{formatNumber((data.sumGoal - data.sumFinished).toFixed(2))}</span></p>
                            <p>{timeName}接下来平均每天只需</p>
                            <p>成交<span className="money">{formatNumber(((data.sumGoal - data.sumFinished) / daysDiff).toFixed(2))}</span>的金额即可达标</p>
                        </div>
                    );
                }
                else if (rate > 100 && rate < 105) {
                    return (
                        <div className="warn-wrapper">
                            <span className="tip">
                                <i className="icon iconfont">&#xe670;</i>
                                温馨提示
                            </span>
                            <p>太棒了！{timeName}已完成目标！</p>
                        </div>)
                }
                else {
                    return (<div className="warn-wrapper">
                        <span className="tip">
                            <i className="icon iconfont">&#xe670;</i>
                            温馨提示
                            </span>
                        <p>简直小宇宙爆发！{timeName}已完成目标！</p>
                    </div>)
                }
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }

    handelYearRate = (user) => {
        let params = this.state.filterParams;
        this.props.fetchYearRate({
            users: [user],
            year: params.year,
        });
    }


    handleCompleteTableExpand = (expanded,record)=>{
        let completeExpandRowKeys = this.state.completeExpandRowKeys;
        if(expanded){
            completeExpandRowKeys.push(record.key);
        }
        else{
            completeExpandRowKeys = completeExpandRowKeys.filter((item,index,arr)=>{
                return item!=record.key;
            });
        }
        this.setState({
            completeExpandRowKeys:completeExpandRowKeys
        });

    }

    handleGoalTableExpand= (expanded,record)=>{
        let goalExpandRowKeys = this.state.goalExpandRowKeys;
        if(expanded){
            goalExpandRowKeys.push(record.key);
        }
        else{
            goalExpandRowKeys = goalExpandRowKeys.filter((item,index,arr)=>{
                return item!=record.key;
            });
        }
        this.setState({
            goalExpandRowKeys:goalExpandRowKeys
        });
    }

    setRowClass = (record,index)=>{
        if(record.children){
            return 'node-row';
        }
        else{
            return 'leaf-row';
        }
    }

    render() {
        let { membersData, getGoal, setGoal, goalData, allGoalData, goalStatData, yearRateData,loading } = this.props;

        if (goalStatData.sumGoal) {
            let goalRate = (goalStatData.sumFinished / goalStatData.sumGoal * 100).toFixed(2);
            chart1Options.title[0].text = goalRate+'%';
            chart1Options.title[1].text = '目标完成率';

            if(goalRate  > 1000 ){
                chart1Options.title[0].textStyle.fontSize = 22 ;
            }
            chart1Options.series[0].data[0].value =goalRate > 100 ? 0 : 100 -goalRate;
            chart1Options.series[0].data[1].value = goalRate > 100 ? 100 : goalRate;

            chart1Options.series[0].data[1].itemStyle={
                    normal: {
                        color: '#60ABF8'
                    },
                    emphasis: {
                        color: '#60ABF8'
                    }
            }
        }
        else {
            chart1Options.title[0].text = '--';
            chart1Options.series[0].data[0].value = 0;
            chart1Options.series[0].data[1].value = 100;
            chart1Options.tooltip.show=false;

            chart1Options.series[0].data[1].itemStyle={
                    normal: {
                        color: '#DADDE3'
                    },
                    emphasis: {
                        color: '#DADDE3'
                    }
            }

        }

        columns[1].title=monthMap[this.state.filterParams.month]+'目标';
        if (this.state.filterParams.month == '000') {
            columns[1].children[4] = {
                title: '全年完成率',
                dataIndex: 'yearRate',
                key: 'yearRate',
                className: 'year-rate-col align-center',
                render: (text, record, index) => {
                    if (record.goal){
                        let chart2Options = {
                            animation:false,
                            title: {
                                text: record.name + ' -- ' + this.state.filterParams.year + '年全年完成率',
                                left: 'center',
                                textStyle: {
                                    fontSize: 12
                                }
                            },
                            grid: {
                                left: 'left',
                                right: '3%',
                                bottom: '3%',
                                top: '20%',
                                containLabel: true
                            },

                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                                axisTick: {
                                    show: false
                                },
                            },
                            yAxis: {
                                type: 'value',
                                axisLine: {
                                    show: false
                                },
                                axisTick: {
                                    show: false
                                },
                                // min:0,
                                // max:'dataMax',

                                splitNumber: 5,
                                axisLabel: {
                                    show: false,
                                }
                            },
                            series: [
                                {
                                    name: '完成率',
                                    type: 'line',
                                    data: yearRateData,
                                    lineStyle: {
                                        normal: {
                                            color: '#60ABF8',
                                            width: '3'
                                        }
                                    },

                                    itemStyle: {
                                        normal: {
                                            color: "#60ABF8",
                                            "label": {
                                                "show": true,
                                                "position": "top"
                                            }
                                        }
                                    },
                                    label: {
                                        normal: {
                                            textStyle: {
                                                color: '#303642'
                                            },
                                            formatter: '{c}%'
                                        }
                                    }
                                }
                            ]
                        };

                        let colPopCon = (
                            <ReactEcharts
                                option={chart2Options}
                                notMerge={true}
                                lazyUpdate={true}
                                style={{ 'width': '450px', 'height': '250px' }} showLoading={false} />
                        );

                        return (
                            <div>
                                <Popover
                                    placement="right"
                                    trigger="click"
                                    overlayClassName="chart-pop"
                                    arrowPointAtCenter={true}
                                    // arrowPointAtCenter={()=>document.getElementsByClassName('row-'+record.key)[0]}
                                    content={colPopCon}>
                                <span
                                     className="check" onMouseOver={this.handelYearRate.bind(this, {
                                    id: record.key,
                                    parent_id: record.parent_id,
                                    type: record.type,
                                    name: record.name
                                })}>查看</span>
                                </Popover>
                            </div>
                        )
                    }
                    else{
                        return '--';
                    }

                }
            };
        }
        else {
            delete columns[1].children[4]
        }


        return (
            <div className="goal">
                {
                    window.person == '1' ? (<FilterPanel
                        membersData={membersData}
                        onSubmit={this.handelFilterSubmit}
                        isSelectUserShow={this.state.isSelectUserShow}
                        isShowTimeRow={true}
                        defaultUser={{
                            id: window.userid,
                            name: window.username
                        }}
                        isShowMonth={this.state.isShowFilterMonth}
                        month={this.state.filterParams.month}
                        year={this.state.filterParams.year}
                        users={this.state.filterParams.users}

                    />) : (<FilterPanel
                        membersData={membersData}
                        onSubmit={this.handelFilterSubmit}
                        isSelectUserShow={this.state.isSelectUserShow}
                        isShowTimeRow={true}
                        isShowMonth={this.state.isShowFilterMonth}
                        month={this.state.filterParams.month}
                        year={this.state.filterParams.year}
                        users={this.state.filterParams.users}
                    />)
                }

                <div className="t-area">
                    <div className="left-side" ref="leftSide">
                        <span className="title">销售目标</span>
                        {
                            this.state.toggleView?(<Popover placement="bottomLeft"
                            trigger="hover"
                            content={titlePopCon}
                            arrowPointAtCenter={true}
                            getPopupContainer={() => this.refs.leftSide}>
                            <i className="icon iconfont">&#xe600;</i>
                        </Popover>):null
                        }
                        
                    </div>

                    <div className="right-side">
                        {
                            this.state.toggleView ? (<span className="ctrl-btn" onClick={this.handelToggleView}>
                                <i className="icon iconfont">&#xe645;</i>
                                查看目标
                        </span>) : (
                                    <span className="ctrl-btn" onClick={this.handelToggleView}>
                                        <i className="icon iconfont">&#xe645;</i>
                                        查看完成情况
                        </span>
                                )
                        }
                        {
                            window.setting ? (<span>
                                <span className="split">|</span>
                                <span className="ctrl-btn" onClick={this.showSettingModal}>
                                    <i className="icon iconfont">&#xe66a;</i>
                                    设定目标
                                </span>
                            </span>) : null
                        }

                    </div>
                </div>
                {
                    this.state.toggleView ? (
                        <div>
                            <div className="chart-area">
                                <div className="chart">
                                    <ReactEcharts
                                        option={chart1Options}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        showLoading={loading}
                                        loadingOption={'default',{
                                            text:''
                                        }}
                                        style={{ 'width': '180px', 'height': '180px' }} />
                                </div>

                                <div className="stat-wrapper">
                                    <div className="goal">
                                        <i className="icon iconfont">&#xe66c;</i>
                                        <span className="t1">销售目标</span>
                                        <span className="t2">{goalStatData.sumGoal ? formatNumber(goalStatData.sumGoal) : '--'}</span>
                                    </div>
                                    <div className="finished">
                                        <i className="icon"></i>
                                        <span className="t1">已完成</span>
                                        <span className="t2">{goalStatData.sumFinished ? formatNumber(goalStatData.sumFinished) : '--'}</span>
                                    </div>
                                    <div className="unfinished">
                                        <i className="icon"></i>
                                        <span className="t1">缺口</span>
                                        <span className="t2">{goalStatData.sumUnFinished ? formatNumber(goalStatData.sumUnFinished) : '--'}</span>
                                    </div>
                                </div>
                                {
                                    this.renderWarnText(goalStatData)
                                }
                                <div className="clearfix"></div>
                            </div>
                            <div className="clear-fix">
                                <Table className="table completeTable"
                                       columns={columns}
                                       indentSize={10}
                                        dataSource={goalStatData.tree}
                                        rowClassName={this.setRowClass}
                                        onExpand={this.handleCompleteTableExpand}
                                        expandedRowKeys={this.state.completeExpandRowKeys}
                                        loading={loading}
                                        // bordered
                                        pagination={false} />
                            </div>
                        </div>
                    ) : (
                        <Table className="table goalTable"
                               style={{ marginTop: '25' }}
                               columns={columns2}
                                scroll={{ x: 2450,y:500}} indentSize={10}
                                dataSource={allGoalData}
                                // bordered
                                rowClassName={this.setRowClass}
                                expandedRowKeys={this.state.goalExpandRowKeys}
                                onExpand={this.handleGoalTableExpand}
                                loading={loading}
                                pagination={false} />
                        )
                }
                <SetGoal
                    visible={this.state.isShowSettingModal}
                    membersData={membersData}
                    setGoal={setGoal}
                    getGoal={getGoal}
                    goalData={goalData}
                    onCancel={this.handleCancel}
                    onOk={this.handleOk}
                >
                </SetGoal>
            </div>
        );
    }
}

const mapStateToProps = state => (
    state.goalReducer
);

const mapDispatchToProps = (dispatch) => {
    return {
        fetchMembers: () => {
            dispatch(fetchMembers())
        },
        fetchAllGoal: (params) => {
            dispatch(fetchAllGoal(params))
        },
        setGoal: (params) => {
            dispatch(setGoal(params))
        },
        getGoal: (params) => {
            dispatch(getGoal(params))
        },
        fetchGoalStat: (params) => {
            dispatch(fetchGoalStat(params))
        },
        fetchYearRate: (params) => {
            dispatch(fetchYearRate(params))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Goal)
