import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, Button, Input, DatePicker, Cascader, Menu, Dropdown, Icon, message, Table, Select, Modal} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const Option = Select.Option;
import addressJson from '../../common/address'


import {
    fetchSearch,
    fetchExport,
    addressChange,
    searchTextChange,
    keyWordsChange,
    dateChange,
    typeChange,
    agentTypeChange,
    ePackageTypeChange,
    yPackageTypeChange,
    zPackageTypeChange,
    pageChange,
    showConfirm,
} from '../../actions/orderDetailAction'


import './index.less';


const columns = [
  {
    title: '订单ID',
    key: 'f_id',
    dataIndex: 'f_id',
  },{
    title: '代理商名称/ID',
    dataIndex: 'f_agent_id',
    key: 'f_agent_id',
    render: (text, row, index) => {
        return <div><p>{row.f_agent_name}</p><p>({row.f_agent_id})</p></div>;
    },
}, {
    title: '企业名称/ID',
    dataIndex: 'f_name',
    key: 'f_name',
    render: (text, row, index) => {
        return <div><p>{row.f_name}</p><p>({row.f_corp_id})</p></div>;
    },
}, {
    title: '地区',
    key: 'cityName',
    dataIndex: 'cityName',
},{
    title: '套餐名称',
    key: 'f_package_name',
    dataIndex: 'f_package_name',
}, {
    title: '数量',
    key: 'num',
    dataIndex: 'num',
}, {
    title: '时间',
    key: 'f_time',
    dataIndex: 'f_time',
}, {
    title: '市场价格',
    key: 'f_money',
    dataIndex: 'f_money',
}, {
    title: '代理价格',
    key: 'f_cost',
    dataIndex: 'f_cost',
}];


const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
    }, {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
    }, {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
    }
];


class OrderDetail extends React.Component {
    state = {
        searchText: '',
        addressData: addressJson,
        isShowConfirm: false
    };

    componentWillMount() {
        const dispatch = this.props.dispatch;

        //获取全部并分页
        dispatch(fetchSearch({
            source: this.props.searchText,
            page: 1,
            limit:this.props.pagination.pageSize,
            start: this.props.startDate,
            end: this.props.endDate,
        }));
    }

    //点击了搜索按钮
    onSearch() {
        const dispatch = this.props.dispatch;
        dispatch(searchTextChange(this.props.searchText));
        dispatch(fetchSearch({
            limit:10,
            source: this.props.searchText,
            page: 1,
            start: moment().startOf('isoWeek').format('YYYY-MM-DD'),
            end: moment().format('YYYY-MM-DD'),
        }));
    }

    //搜索框改变
    searchTextChange(e) {
        const dispatch = this.props.dispatch;
        // this.setState({
        //     searchText: e.target.value
        // });
        dispatch(keyWordsChange(e.target.value));
    }

    //起始时间的屏蔽
    disabledStartDate(current) {
        let that = this;
        let result = false;
        if (current) {
            if (current.valueOf() > Date.now()) {
                result = true;
            }
            if (current.valueOf() > (new Date(that.props.endDate)).getTime()) {
                result = true;
            }
        }
        return result;
    }

    //结束时间的屏蔽
    disabledEndDate(current) {
        let that = this;
        let result = false;
        if (current) {
            if (current.valueOf() > Date.now()) {
                result = true;
            }
            if (current.valueOf() < (new Date(that.props.startDate)).getTime()) {
                result = true;
            }
        }
        return result;
    }


    onCasChange(value) {

        const dispatch = this.props.dispatch;
        //清除
        if(value.length==0){
            dispatch(addressChange({
                province: 0,
                city: 0
            }));
            dispatch(fetchSearch(
                {
                    source: this.props.searchText,
                    start: this.props.startDate,
                    end: this.props.endDate,
                    province: 0,
                    city: 0,
                    type: this.props.type,
                    epackagetype: this.props.ePackageType,
                    zpackagetype: this.props.zPackageType,
                    ypackagetype: this.props.yPackageType,
                    agenttype: this.props.agentType,
                    page: 1,
                    limit:this.props.pagination.pageSize
                }
            ));
        }
        //选择的是省份
        else if (value.length == 1) {
            dispatch(addressChange({
                province: value[0],
                city: 0
            }));
            dispatch(fetchSearch(
                {
                    source: this.props.searchText,
                    start: this.props.startDate,
                    end: this.props.endDate,
                    province: value[0],
                    city: 0,
                    type: this.props.type,
                    epackagetype: this.props.ePackageType,
                    zpackagetype: this.props.zPackageType,
                    ypackagetype: this.props.yPackageType,
                    agenttype: this.props.agentType,
                    page: 1,
                    limit:this.props.pagination.pageSize
                }
            ));
        }
        //选择的是市
        else if (value.length > 1) {
            dispatch(addressChange({
                province: value[0],
                city: value[1]
            }));
            dispatch(fetchSearch(
                {
                    source: this.props.searchText,
                    start: this.props.startDate,
                    end: this.props.endDate,
                    province: value[0],
                    city: value[1],
                    type: this.props.type,
                    epackagetype: this.props.ePackageType,
                    zpackagetype: this.props.zPackageType,
                    ypackagetype: this.props.yPackageType,
                    agenttype: this.props.agentType,
                    page:1,
                    limit:this.props.pagination.pageSize
                }
            ));
        }

    }

    //类型改变
    handleTypeChange(value) {
        const dispatch = this.props.dispatch;
        dispatch(typeChange({
            type: value
        }));
        dispatch(fetchSearch(
            {
                source: this.props.searchText,
                start: this.props.startDate,
                end: this.props.endDate,
                province: this.props.province,
                city: this.props.city,
                type: value,
                epackagetype: this.props.ePackageType,
                zpackagetype: this.props.zPackageType,
                ypackagetype: this.props.yPackageType,
                agenttype: this.props.agentType,
                page: 1,
                limit:this.props.pagination.pageSize
            }
        ));
    }

    //代理商类型改变
    handleAgentTypeChange(value) {
        const dispatch = this.props.dispatch;
        dispatch(agentTypeChange({
            type: value
        }));
        dispatch(fetchSearch(
            {
                source: this.props.searchText,
                start: this.props.startDate,
                end: this.props.endDate,
                province: this.props.province,
                city: this.props.city,
                type: this.props.type,
                epackagetype: this.props.ePackageType,
                zpackagetype: this.props.zPackageType,
                ypackagetype: this.props.yPackageType,
                agenttype: value,
                page: 1,
                limit:this.props.pagination.pageSize
            }
        ));
    }

    handleEPackageTypeChange(value) {
        const dispatch = this.props.dispatch;
        dispatch(ePackageTypeChange({
            type: value
        }));

        dispatch(fetchSearch(
            {
                source: this.props.searchText,
                start: this.props.startDate,
                end: this.props.endDate,
                province: this.props.province,
                city: this.props.city,
                type: this.props.type,
                epackagetype: value,
                zpackagetype: this.props.zPackageType,
                ypackagetype: this.props.yPackageType,
                agenttype: this.props.agentType,
                page: 1,
                limit:this.props.pagination.pageSize
            }
        ));
    }

    handleZPackageTypeChange(value) {
        const dispatch = this.props.dispatch;
        dispatch(zPackageTypeChange({
            type: value
        }));
        dispatch(fetchSearch(
            {
                source: this.props.searchText,
                start: this.props.startDate,
                end: this.props.endDate,
                province: this.props.province,
                city: this.props.city,
                type: this.props.type,
                epackagetype: this.props.ePackageType,
                zpackagetype: value,
                ypackagetype: this.props.yPackageType,
                agenttype: this.props.agentType,
                page: 1,
                limit:this.props.pagination.pageSize
            }
        ));
    }

    handleYPackageTypeChange(value) {
        const dispatch = this.props.dispatch;
        dispatch(yPackageTypeChange({
            type: value
        }));
        dispatch(fetchSearch(
            {
                source: this.props.searchText,
                start: this.props.startDate,
                end: this.props.endDate,
                province: this.props.province,
                city: this.props.city,
                type: this.props.type,
                epackagetype: this.props.ePackageType,
                zpackagetype: this.props.zPackageType,
                ypackagetype: value,
                agenttype: this.props.agentType,
                page: 1,
                limit:this.props.pagination.pageSize
            }
        ));
    }

    handleAllPackageClick() {
        const dispatch = this.props.dispatch;
        dispatch(ePackageTypeChange({
            type: '0'
        }));
        dispatch(zPackageTypeChange({
            type: '0'
        }));
        dispatch(yPackageTypeChange({
            type: '0'
        }));
        dispatch(fetchSearch(
            {
                source: this.props.searchText,
                start: this.props.startDate,
                end: this.props.endDate,
                province: this.props.province,
                city: this.props.city,
                type: this.props.type,
                epackagetype: 0,
                zpackagetype: 0,
                ypackagetype: 0,
                agenttype: this.props.agentType,
                page: 1,
                limit:this.props.pagination.pageSize
            }
        ));
    }

    //时间选项改变了
    changeDate(type, dateString) {
        let dispatch = this.props.dispatch;
        let startDate, endDate;
        switch (type) {
            case 0://今天
                startDate = moment().format('YYYY-MM-DD');
                endDate = moment().format('YYYY-MM-DD');
                break;
            case 1://本周
                startDate = moment().startOf('isoWeek').format('YYYY-MM-DD');
                endDate = moment().format('YYYY-MM-DD');
                break;
            case 2://本月
                startDate = moment().startOf('month').format('YYYY-MM-DD');
                endDate = moment().format('YYYY-MM-DD');
                break;
            case 3://自定义开始时间
                startDate = dateString;
                endDate = this.props.endDate;
                break;
            case 4://自定义结束时间
                startDate = this.props.startDate;
                endDate = dateString;
                break;
        }

        dispatch(dateChange({
            startDate: startDate,
            endDate: endDate,
            dateType: type
        }));

        dispatch(fetchSearch({
            source: this.props.searchText,
            start: startDate,
            end: endDate,
            province: this.props.province,
            city: this.props.city,
            type: this.props.type,
            epackagetype: this.props.ePackageType,
            zpackagetype: this.props.zPackageType,
            ypackagetype: this.props.yPackageType,
            agenttype: this.props.agentType,
            page: 1,
            limit:this.props.pagination.pageSize
        }));
    }

    handleTableChange(pagination, filters, sorter) {
        let dispatch = this.props.dispatch;
        dispatch(pageChange({
            current: pagination.current,
            pageSize:pagination.pageSize
        }));

        dispatch(fetchSearch({
            source: this.props.searchText,
            start: this.props.startDate,
            end: this.props.endDate,
            province: this.props.province,
            city: this.props.city,
            type: this.props.type,
            epackagetype: this.props.ePackageType,
            zpackagetype: this.props.zPackageType,
            ypackagetype: this.props.yPackageType,
            agenttype: this.props.agentType,
            page: pagination.current,
            limit:pagination.pageSize
        }));

    };

    confirmExp() {
        let dispatch = this.props.dispatch;
        dispatch(showConfirm({
            isShowConfirm:true
        }));
    }

    okConfirm() {
        let dispatch = this.props.dispatch;
        dispatch(fetchExport({
            source: this.props.searchText,
            start: this.props.startDate,
            end: this.props.endDate,
            province: this.props.province,
            city: this.props.city,
            type: this.props.type,
            epackagetype: this.props.ePackageType,
            zpackagetype: this.props.zPackageType,
            ypackagetype: this.props.yPackageType,
            agenttype: this.props.agentType
        }));
    }
    closeConfirm() {
        let dispatch = this.props.dispatch;
        dispatch(showConfirm({
            isShowConfirm: false
        }));
    }

    render() {
        let {startDate, endDate, province, city, dateType, type, agentType, ePackageType, zPackageType, yPackageType, pageData,totalOrderNum, shopOrderNum, upgradeOrderNum, renewOrderNum, pagination, isFetching,isShowConfirm,totalPrice,...others}=this.props;

        return (
            <div className="order-detail">
                <div className="search-panel">
                    <Row>
                        <span className="title">搜索：</span>
                        <Input placeholder="输入客户、代理商名称或ID/订单编号/业务员" value={this.props.searchText} onChange={this.searchTextChange.bind(this)}
                               onPressEnter={this.onSearch.bind(this)} style={{width: "200px"}}/>
                        <Button type="primary" onClick={this.onSearch.bind(this)}
                                style={{marginLeft: '20px'}}>搜索</Button>
                        <Button className="export-btn" onClick={this.confirmExp.bind(this)}>导出</Button>
                    </Row>
                </div>
                <div className="filter-panel">
                    <div className="left-part">
                        <div className="row">
                            <span className="title">时间：</span>
                            <DatePicker allowClear={false} value={moment(startDate)} onChange={(date, dateString) => {
                                this.changeDate(3, dateString)
                            } } disabledDate={this.disabledStartDate.bind(this)} className="datePicker"/>

                            &#12288;—&#12288;

                            <DatePicker allowClear={false} value={moment(endDate)} onChange={(date, dateString) => {
                                this.changeDate(4, dateString)
                            } } disabledDate={this.disabledEndDate.bind(this)} className="datePicker"/>

                            <span>&#12288;|&#12288;</span>

                            {/*<span onClick={() => this.changeDate(0)}*/}
                                  {/*className={dateType === 0 ? "date-text on" : "date-text"}>今天</span>*/}
                            <span onClick={() => this.changeDate(1)}
                                  className={dateType === 1 ? "date-text on" : "date-text"}>本周</span>
                            <span onClick={() => this.changeDate(2)}
                                  className={dateType === 2 ? "date-text on" : "date-text"}>本月</span>

                        </div>
                        <div className="row">
                            <span className="title">地区：</span>
                            <Cascader placeholder="请选择地区" options={this.state.addressData} allowClear={true} value={[province, city]}
                                      onChange={this.onCasChange.bind(this)}
                                      changeOnSelect style={{width: '250px'}}/>
                        </div>

                        <div className="row">
                            <span className="title">类型：</span>
                            <Select defaultValue="-999" value={type} style={{width: 120}}
                                    onChange={this.handleTypeChange.bind(this)}>
                                <Option value="-999">全部</Option>
                                <Option value="-1">退订</Option>
                                <Option value="0">购买</Option>
                                <Option value="1">升级</Option>
                                <Option value="2">降级</Option>
                                <Option value="3">续费</Option>
                            </Select>
                            {/*<span className="title" style={{'marginLeft': '10px'}}>代理商类型：</span>*/}
                            {/*<Select defaultValue="0" value={agentType} style={{width: 120}}*/}
                                    {/*onChange={this.handleAgentTypeChange.bind(this)}>*/}
                                {/*<Option value="0">全部</Option>*/}
                                {/*<Option value="3">核心代理商</Option>*/}
                                {/*<Option value="4">失效代理商</Option>*/}
                                {/*<Option value="6">特殊代理商</Option>*/}
                                {/*<Option value="7">区域代理商</Option>*/}
                                {/*<Option value="8">总代理商</Option>*/}
                                {/*<Option value="99">测试代理商</Option>*/}
                            {/*</Select>*/}
                        </div>
                    </div>
                    <div className="right-part">
                        <div className="r1">
                            <span className="title">套餐类型：</span>
                            <Button onClick={this.handleAllPackageClick.bind(this)}>全部</Button>
                        </div>
                        <img className="r2" src={ecoms.cdn + 'comm/public/images/dashes.png'}/>
                        <div className="r3">
                            <div className="row">
                                <span className="title">E C 套餐 ：</span>
                                <Select value={ePackageType} defaultValue="0" style={{width: 200}}
                                        onChange={this.handleEPackageTypeChange.bind(this)}>
                                    <Option value="0">全部</Option>
                                    <Option value="84">EC营客通</Option>
                                    <Option value="22">营客通（网销版）</Option>
                                </Select>
                            </div>
                            <div className="row">
                                <span className="title">增值服务：</span>
                                <Select defaultValue="0" value={zPackageType} style={{width: 200}}
                                        onChange={this.handleZPackageTypeChange.bind(this)}>
                                    <Option value="0">全部</Option>
                                    <Option value="72">微表单</Option>
                                    <Option value="60">微销售</Option>
                                    <Option value="40">微站</Option>
                                    <Option value="81">场景展示</Option>
                                    <Option value="82">全民营销</Option>
                                    <Option value="75">金伦通讯服务</Option>
                                    <Option value="23">QQ客服</Option>
                                    <Option value="61">微客服</Option>
                                    <Option value="48">企呼云</Option>
                                    <Option value="7">400电话</Option>
                                    <Option value="41">总机</Option>
                                    <Option value="9">其他</Option>
                                </Select>
                            </div>
                            <div className="row">
                                <span className="title">硬件设备：</span>
                                <Select defaultValue="0" value={yPackageType} style={{width: 200}}
                                        onChange={this.handleYPackageTypeChange.bind(this)}>
                                    <Option value="0">全部</Option>
                                    <Option value="26">电话宝</Option>
                                    <Option value="76">TCL电话（有线）</Option>
                                    <Option value="77">TCL电话（无线）</Option>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="summary">
                    <p className="row">
                        合计：共累计有效订单 {totalOrderNum} 条，总计 {totalPrice} 元；
                        {type==-999?'| 其中：购买订单 '+shopOrderNum+' 条；升级订单 '+upgradeOrderNum+ '条；续费订单 '+renewOrderNum+' 条。':''}

                    </p>
                </div>
                <div className="table-wrapper">
                    <Table columns={columns} dataSource={pageData} pagination={pagination}
                           loading={isFetching} onChange={this.handleTableChange.bind(this)}/>
                </div>
                <Modal title="温馨提示" visible={isShowConfirm}
                       onOk={this.okConfirm.bind(this)} onCancel={this.closeConfirm.bind(this)}
                >
                    <p>您需要前往<a style={{'fontWeight': 'bold'}}>我的导出</a>页面查看导出进度和下载>我的导出页面查看导出进度和下载，确认继续导出吗？</p>

                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => (
    state.orderDetail
);

export default connect(mapStateToProps)(OrderDetail)
