import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import FilterPanel from '../../components/FilterPanel'
import './index.less';
import classnames from 'classnames';
import { fetchMembers, fetchUserRankData, fetchDeptRankData, fetchDepts } from '../../actions/'
import { Popover, Table, Modal, Button, TreeSelect } from 'antd';
import { Message } from 'antd'
import firstImg from '../../images/first.png';
import secondImg from '../../images/second.png';
import thirdImg from '../../images/third.png';


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
        <h3>指标说明</h3>
        <ul>
            <li>1、金额：筛选时间内销售金额状态为“成交”时的金额总和</li>
            <li>2、单量：筛选时间内销售金额单据个数总和</li>
            <li>3、完成率：筛选时间内销售金额状态为“成交”时的金额总和除以“销售目标”</li>
        </ul>
    </div>
);


const columns1 = [
    {
        title: '排名',
        dataIndex: 'goal',
        key: 'goal',
        className:'align-center',
        width:'10%',
        render: (text, record, index) => {
            if (index == '0') {
                return <img src={firstImg} />
            }
            else if (index == '1') {
                return <img src={secondImg} />
            }
            else if (index == '2') {
                return <img src={thirdImg} />
            }
            else {
                return index + 1;
            }
        }
    },
    {
        title: '员工',
        dataIndex: 'name',
        key: 'name',
        width:'20%',
        render: (text, record, index) => {
            return (
                <span><img style={{ 'borderRadius': '50%', 'marginRight': '10px', 'width': '30px', 'height': '30px' }}
                    src={record.face} /><span title={text}>{text.length > 6 ? text.slice(0, 6) + '...' : text}</span></span>
            )
        }
    },
    {
        title: '部门',
        dataIndex: 'dept_name',
        key: 'dept_name',
        width:'20%',
        render: (text, record, index) => {
            return <span title={text}>{text.length > 8 ? text.slice(0, 8) + '...' : text}</span>;
        }
    },
    {
        title: '金额',
        dataIndex: 'money',
        key: 'money',
        // sortOrder:'descend',
        width:'20%',
        sorter: (a, b) => a.money - b.money,
        render: (text, record, index) => {
            return record.money ? formatNumber(record.money) : '--'
        }
    },
    {
        title: '单量',
        dataIndex: 'total',
        key: 'total',
        width:'20%',
        sorter: (a, b) => a.total - b.total,
        render: (text, record, index) => {
            return record.total ? record.total : '--'
        }
    },
    {
        title: '完成率',
        dataIndex: 'rate',
        key: 'rate',
        width:'10%',
        sorter: (a, b) => a.rate - b.rate,
        render: (text, record, index) => {
            return record.rate ? record.rate + '%' : '--'
        }
    }
];


const columns2 = [
    {
        title: '排名',
        dataIndex: 'goal',
        key: 'goal',
        className:'align-center',
        width:'10%',
        render: (text, record, index) => {
            if (index == '0') {
                return <img src={firstImg} />
            }
            else if (index == '1') {
                return <img src={secondImg} />
            }
            else if (index == '2') {
                return <img src={thirdImg} />
            }
            else {
                return index + 1;
            }
        }
    },
    {
        title: '部门',
        dataIndex: 'dept_name',
        key: 'dept_name',
        width:'25%',
        render: (text, record, index) => {
            return <span title={text}>{text.length > 8 ? text.slice(0, 8) + '...' : text}</span>;
        }
    },
    {
        title: '金额',
        dataIndex: 'money',
        key: 'money',
        width:'25%',
        sorter: (a, b) => a.money - b.money,
        render: (text, record, index) => {
            return record.money ? formatNumber(record.money) : '--'
        }
    },
    {
        title: '单量',
        dataIndex: 'total',
        key: 'total',
        width:'20%',
        sorter: (a, b) => a.total - b.total,
        render: (text, record, index) => {
            return record.total ? record.total : '--'
        }
    },
    {
        title: '完成率',
        dataIndex: 'rate',
        key: 'rate',
        width:'20%',
        sorter: (a, b) => a.rate - b.rate,
        render: (text, record, index) => {
            return record.rate ? record.rate + '%' : '--'
        }
    }
];


class Rank extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toggleView: true,
            params: {
                users: [],
                year: (new Date()).getFullYear(),
                m: (new Date()).getMonth() + 1
            },
            pagination: {
                current: 1,
                pageSize: 10
            },
            order: 'descend'
        }
    }

    componentWillMount() {
        let { fetchMembers, fetchDepts, fetchUserRankData, fetchDeptRankData } = this.props;
        let params = this.state.params;
        fetchMembers();
        fetchDepts();
        fetchUserRankData({
            year: params.year,
            m: params.m
        });
    }

    componentDidMount(){
        $('.ant-table-thead tr th:nth-child(4) span')[2].click();
    }

    componentWillReceiveProps(nextProps, nextState) {

    }

    handelToggleView = (value) => {
        let toggleView = this.state.toggleView;
        if (toggleView == value) {
            return;
        }
        let params = this.state.params;
        let { fetchUserRankData, fetchDeptRankData } = this.props;
        if (value) {
            fetchUserRankData({
                year: params.year,
                m: params.m,
                users: []
            });
        }
        else {
            fetchDeptRankData({
                year: params.year,
                m: params.m,
                users: []
            });
        }
        this.setState({
            toggleView: value,
            params: {
                year: params.year,
                m: params.m,
                users: []
            }
        });
    }

    handelFilterSubmit = (params) => {
        let { fetchUserRankData, fetchDeptRankData } = this.props;
        let toggleView = this.state.toggleView;

        if (toggleView) {
            fetchUserRankData({
                year: params.year,
                m: params.month,
                users: formatData(params.users)
            });
        }
        else {
            fetchDeptRankData({
                year: params.year,
                m: params.month,
                users: formatData(params.users)
            });
        }

        let p = {
                m:params.month,
                year:params.year,
                users:params.users
            }
        this.setState({
            params: p
        });
    }

    renderColumns = () => {
        let { userRankData, deptRankData } = this.props;
        let columns = this.state.toggleView ? columns1 : columns2;
        let current = this.state.pagination.current;
        let pageSize = this.state.pagination.pageSize;
        let length;
        if (this.state.toggleView) {
            length = userRankData.rank ? userRankData.rank.length : []
        }
        else {
            length = deptRankData.rank ? deptRankData.rank.length : []
        }
        columns[0] = {
            title: '排名',
            dataIndex: 'goal',
            key: 'goal',
            className:'align-center',
            render: (text, record, index) => {
                let globalIndex = 1;
                if (this.state.order == 'descend') {
                    globalIndex = (current - 1) * pageSize + index + 1;
                }
                else {
                    globalIndex = length - ((current - 1) * pageSize + index);
                }
                if (globalIndex == '1') {
                    return <img src={firstImg} />
                }
                else if (globalIndex == '2') {
                    return <img src={secondImg} />
                }
                else if (globalIndex == '3') {
                    return <img src={thirdImg} />
                }
                else {
                    return globalIndex;
                }
            }
        }
        return columns;
    }

    renderPanel = () => {
        let { userRankData, deptRankData } = this.props;

        if (this.state.toggleView) {
            return (
                <div className="panel-wrapper">
                    <div className="panel panel-orange">
                        <h3><i className="icon iconfont">&#xe678;</i>金额</h3>
                        <p>
                            <span className="title">总共</span>
                            {userRankData.sumMoney ? formatNumber(userRankData.sumMoney) : '--'}
                        </p>
                        <p>
                            <span className="title">人均</span>
                            {userRankData.eachMoney ? formatNumber(userRankData.eachMoney) : '--'}
                        </p>
                    </div>
                    <div className="panel panel-blue">
                        <h3><i className="icon iconfont">&#xe677;</i>单量</h3>
                        <p>
                            <span className="title">总共</span>
                            {userRankData.sumTotal ? userRankData.sumTotal : '--'}
                        </p>
                        <p>
                            <span className="title">人均</span>
                            {userRankData.eachTotal ? userRankData.eachTotal : '--'}
                        </p>
                    </div>
                    <div className="panel panel-green">
                        <h3><i className="icon iconfont">&#xe679;</i>完成率</h3>
                        <p>
                            <span className="title">人均</span>
                            {userRankData.eachFinishedRate ? userRankData.eachFinishedRate + '%' : '--'}
                        </p>
                        <p>
                            <span className="title"></span>
                        </p>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div className="panel-wrapper">
                    <div className="panel panel-orange">
                        <h3><i className="icon iconfont">&#xe678;</i>金额</h3>
                        <p>
                            <span className="title">总共</span>
                            {deptRankData.sumMoney ? formatNumber(deptRankData.sumMoney) : '--'}
                        </p>
                        <p>
                            <span className="title">平均</span>
                            {deptRankData.eachMoney ? formatNumber(deptRankData.eachMoney) : '--'}
                        </p>
                    </div>
                    <div className="panel panel-blue">
                        <h3><i className="icon iconfont">&#xe677;</i>单量</h3>
                        <p>
                            <span className="title">总共</span>
                            {deptRankData.sumTotal ? deptRankData.sumTotal : '--'}
                        </p>
                        <p>
                            <span className="title">平均</span>
                            {deptRankData.eachTotal ? deptRankData.eachTotal : '--'}
                        </p>
                    </div>
                    <div className="panel panel-green">
                        <h3><i className="icon iconfont">&#xe679;</i>完成率</h3>
                        <p>
                            <span className="title">平均</span>
                            {deptRankData.eachFinishedRate ? deptRankData.eachFinishedRate + '%' : '--'}
                        </p>
                        <p>
                            <span className="title"></span>

                        </p>
                    </div>
                </div>
            );
        }
    }

    handelTableChange = (pagination, filters, sorter) => {
        if (sorter.order) {
            this.setState({
                pagination: pagination,
                order: sorter.order
            });
        }
        else {
            this.setState({
                pagination: pagination
            });
        }

    }

    render() {
        let { membersData, deptData, userRankData, deptRankData,loading } = this.props;

        let switch1Cls = classnames({
            'ctrl-btn': true,
            'hide': window.dept_num < 2,
            'active': !this.state.toggleView
        });
        let splitCls = classnames({
            'hide': window.dept_num < 2,
            'split': true
        });
        let switch2Cls = classnames({
            'hide': window.dept_num < 2,
            'ctrl-btn': true,
            'active': this.state.toggleView
        });

        let treeData = this.state.toggleView ? membersData : deptData;

        let tableData = this.state.toggleView ? userRankData.rank || [] : deptRankData.rank || [];

        tableData.sort((a, b) => {
            return b.money - a.money;
        });

        let columns = this.renderColumns();
        

        return (
            <div className="rank">
                <FilterPanel
                    membersData={treeData}
                    onSubmit={this.handelFilterSubmit}
                    isShowTimeRow={true}
                    isShowMonth={true}
                    month={this.state.params.m}
                    year={this.state.params.year}
                    users={this.state.params.users}
                />

                <div className="t-area">
                    <div className="left-side" ref="leftSide">
                        <span className="title">业绩贡献排行</span>
                        <Popover placement="bottomLeft" trigger="hover"
                            content={titlePopCon}
                            arrowPointAtCenter={true}
                            getPopupContainer={() => this.refs.leftSide}>
                            <i className="icon iconfont">&#xe600;</i>
                        </Popover>
                    </div>


                    <div className="right-side">
                        <span className={switch1Cls} onClick={this.handelToggleView.bind(this, true)}>
                            <i className="icon iconfont">&#xe658;</i>
                            按员工排行
                        </span>

                        <span className={splitCls}>|</span>
                        <span className={switch2Cls} onClick={this.handelToggleView.bind(this, false)}>
                            <i className="icon iconfont">&#xe66f;</i>
                            按部门排行
                        </span>
                    </div>
                    {
                        this.renderPanel()
                    }

                </div>
                <div>
                    <div className="clear-fix">
                        <Table columns={columns}
                            dataSource={tableData}
                            pagination={{}}
                            className="table"
                            loading={loading}
                            bordered
                            onChange={this.handelTableChange}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => (
    state.rankReducer
);

const mapDispatchToProps = (dispatch) => {
    return {
        fetchMembers: () => {
            dispatch(fetchMembers())
        },
        fetchDepts: () => {
            dispatch(fetchDepts())
        },
        fetchUserRankData: (params) => {
            dispatch(fetchUserRankData(params))
        },
        fetchDeptRankData: (params) => {
            dispatch(fetchDeptRankData(params))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Rank)
