import React from 'react';
import './index.less';
import {Button, Select, Icon, Modal, TreeSelect, Input, Tooltip,Message} from 'antd';
const Option = Select.Option;
import NumericInput from '../NumericInput';

function passThreeYear() {
    let cYear = (new Date()).getFullYear();
    return [cYear, cYear - 1, cYear - 2].map((item)=>{
        return item.toString();
    });
}

function formatData(data){
    return data.map((item,index)=>{
        return {
            id:item.id,
            label:item.name.length>10?item.name.slice(0,10)+'...':item.name,
            key:item.id,
            value:JSON.stringify({
                name:item.name,
                id:item.id,
                pId:item.pId,
                type:item.type
            }),
            pid:item.pId
        }
    });
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

function calcYear(data){
    let sum=0;
    // for(var [k,v] of Object.entries(data)){
    //     if(k.indexOf('f_m')>-1){
    //         sum+=parseFloat(v||0);
    //     }
    // }
    for(let key in data){
        if(key.indexOf('f_m')>-1){
            sum+=parseFloat(data[key]||0);
        }
    }
    return sum=='0'?'--':formatNumber(sum.toFixed(2));
}

function calcQuarter(v1,v2,v3){
    let sum = parseFloat(v1||0) + parseFloat(v2||0) +parseFloat(v3||0);
    return formatNumber(sum.toFixed(2));
}

function jsonTree(data) {
    let id = 'id',
        pid = 'pid',
        children ='children';

    let idMap = [],
        jsonTree = [];

    data.forEach(v => {
        idMap[v[id]] = v;
    });

    data.forEach(v => {
        let parent = idMap[v[pid]];
        if(parent) {
            !parent[children] && (parent[children] = []);
            parent[children].push(v);
        } else {
            jsonTree.push(v);
        }
    });
    return jsonTree;
};


class SetGoal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedMem:null,
            passThreeYeas: passThreeYear(),
            selectedYear: passThreeYear()[0],
            treeData: {},
            goalData:{},
            groupId:null,
            userId:null,
            type:null,
            isShowWarn:false
        }
    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps, nextState) {
        if(nextProps.visible==this.props.visible){
            this.setState({
                goalData:nextProps.goalData||{}
            });
        }
        else{
            this.setState({
                goalData:{}
            });
        }

        if(nextProps.membersData!=this.props.membersData){
            let treeData = jsonTree(formatData(nextProps.membersData));
            this.setState({
                treeData:treeData
            });
        }

    }

    handleYearChange = (e)=> {
        this.setState({
            selectedYear: e.toString()
        });
        this.props.getGoal({
            group_id:this.state.groupId,
            user_id:this.state.userId,
            year:e.toString()
        });
    }


    handleTreeChange = (value,node,extra) => {
        if(value){
            value = JSON.parse(value);
            //1为部门
            if(value.type==1){
                this.props.getGoal({
                    group_id:value.id,
                    user_id:0,
                    year:this.state.selectedYear
                });
            }
            else{
                this.props.getGoal({
                    group_id:value.pId,
                    user_id:value.id,
                    year:this.state.selectedYear
                });
            }
            this.setState({
                selectedMem:node[0],
                groupId:value.pId,
                userId:value.id,
                type:value.type,
                isShowWarn:false
            });
        }
        else{
            this.setState({
                selectedMem:null,
                groupId:null,
                userId:null,
                goalData:{},
            });
        }
    }

    handleCancel = ()=> {
        this.props.onCancel();
    }

    handleOk = ()=> {
        let goalData = this.state.goalData;
        if(this.state.userId===null){
            this.setState({
                isShowWarn:true
            });
            return;
        }
        if(goalData.f_corp_id){
            delete goalData.f_corp_id
        }
        if(goalData.f_id){
            this.props.onOk(goalData);
        }
        else{
            if(this.state.type==1){
                goalData.f_group_id = this.state.userId;
                goalData.f_user_id = 0;
                goalData.f_year = this.state.selectedYear;
            }
            else{
                goalData.f_group_id = this.state.groupId;
                goalData.f_user_id = this.state.userId;
                goalData.f_year = this.state.selectedYear;
            }
            this.props.onOk(goalData);

        }
        this.setState({
            selectedMem:null,
            passThreeYeas: passThreeYear(),
            selectedYear: passThreeYear()[0],
            goalData:{},
            groupId:null,
            userId:null,
            type:null,
            isShowWarn:false
        });
    }

    onNumChange=(m,e)=>{
        let goalData = this.state.goalData;
        goalData['f_m'+m]=e;
        this.setState({
            goalData:goalData
        });
    }

    render() {
        let {visible} = this.props;
        return (
            <div className="set-goal">
                <Modal
                    maskClosable={false}
                    style={{'width':"760",'height':"350"}}
                    visible={visible}
                    title="设定销售目标"
                    onCancel={this.handleCancel}
                    wrapClassName="set-goal-modal"
                    footer={[
                        <Button key="back" size="small" onClick={this.handleCancel}>取消</Button>,
                        <Button key="submit" type="primary" size="small" onClick={this.handleOk}>
                            确定
                        </Button>,
                    ]}
                >
                    <div className="row-1">
                        <i className="icon">*</i>
                        <span className="title">请先选择部门/员工：</span>
                        <TreeSelect
                            showSearch
                            style={{width: 200, height: 25}}
                            value={this.state.selectedMem}
                            dropdownStyle={{maxHeight: 400, 'overflow-y': 'auto', width: 200}}
                            placeholder="请选择"
                            allowClear
                            dropdownMatchSelectWidth={false}
                            treeData={this.state.treeData}
                            treeDefaultExpandAll
                            showCheckedStrategy={TreeSelect.SHOW_PARENT}
                            onChange={this.handleTreeChange}
                        >
                        </TreeSelect>
                        {
                            this.state.isShowWarn?(<span className="warn">请先选择部门/员工</span>):null
                        }


                    </div>
                    <div className="row-2">
                        <i className="iconfont icon">&#xe66c;</i>
                        <Select value={this.state.selectedYear} style={{width: 68}}
                                onChange={this.handleYearChange}>
                            {
                                this.state.passThreeYeas.map((item, index, value)=> {
                                    return (<Option key={item} value={item}>{item}</Option>)
                                })
                            }
                        </Select>
                        <span className="num">年度目标&nbsp;&nbsp;
                            {
                                calcYear(this.state.goalData)
                            }
                        </span>
                        <span className="unit">单位：元</span>
                    </div>
                    <div className="row-3">
                        <div className="q">
                            <div className="title">第一季度 {calcQuarter(this.state.goalData.f_m1,this.state.goalData.f_m2,this.state.goalData.f_m3)}</div>
                            <ul className="month-wrapper">
                                <li>
                                    <span className="t">1月</span>
                                    <NumericInput  style={{ width: 90,height:25 }} value={this.state.goalData.f_m1||''} onChange={this.onNumChange.bind(this,1)} />
                                </li>
                                <li>
                                    <span className="t">2月</span>
                                    <NumericInput  style={{ width: 90,height:25 }} value={this.state.goalData.f_m2||''} onChange={this.onNumChange.bind(this,2)} />
                                </li>
                                <li>
                                    <span className="t">3月</span>
                                    <NumericInput  style={{ width: 90,height:25 }} value={this.state.goalData.f_m3||''} onChange={this.onNumChange.bind(this,3)} />
                                </li>
                            </ul>
                        </div>
                        <div className="q">
                            <div className="title">第二季度 {calcQuarter(this.state.goalData.f_m4,this.state.goalData.f_m5,this.state.goalData.f_m6)}</div>
                            <ul className="month-wrapper">
                                <li>
                                    <span className="t">4月</span>
                                    <NumericInput  style={{ width: 90,height:25 }} value={this.state.goalData.f_m4||''} onChange={this.onNumChange.bind(this,4)} />
                                </li>
                                <li>
                                    <span className="t">5月</span>
                                    <NumericInput  style={{ width: 90,height:25 }} value={this.state.goalData.f_m5||''} onChange={this.onNumChange.bind(this,5)} />
                                </li>
                                <li>
                                    <span className="t">6月</span>
                                    <NumericInput  style={{ width: 90,height:25 }} value={this.state.goalData.f_m6||''} onChange={this.onNumChange.bind(this,6)}/>
                                </li>
                            </ul>
                        </div>
                        <div className="q">
                            <div className="title">第三季度 {calcQuarter(this.state.goalData.f_m7,this.state.goalData.f_m8,this.state.goalData.f_m9)}</div>
                            <ul className="month-wrapper">
                                <li>
                                    <span className="t">7月</span>
                                    <NumericInput  style={{ width: 90,height:25 }} value={this.state.goalData.f_m7||''} onChange={this.onNumChange.bind(this,7)}/>
                                </li>
                                <li>
                                    <span className="t">8月</span>
                                    <NumericInput  style={{ width: 90,height:25 }} value={this.state.goalData.f_m8||''} onChange={this.onNumChange.bind(this,8)} />
                                </li>
                                <li>
                                    <span className="t">9月</span>
                                    <NumericInput  style={{ width: 90,height:25 }} value={this.state.goalData.f_m9||''} onChange={this.onNumChange.bind(this,9)}/>
                                </li>
                            </ul>
                        </div>
                        <div className="q">
                            <div className="title">第四季度 {calcQuarter(this.state.goalData.f_m10,this.state.goalData.f_m11,this.state.goalData.f_m12)}</div>
                            <ul className="month-wrapper">
                                <li>
                                    <span className="t">10月</span>
                                    <NumericInput  style={{ width: 90,height:25 }} value={this.state.goalData.f_m10||''} onChange={this.onNumChange.bind(this,10)} />
                                </li>
                                <li>
                                    <span className="t">11月</span>
                                    <NumericInput  style={{ width: 90,height:25 }} value={this.state.goalData.f_m11||''} onChange={this.onNumChange.bind(this,11)}/>
                                </li>
                                <li>
                                    <span className="t">12月</span>
                                    <NumericInput  style={{ width: 90,height:25 }} value={this.state.goalData.f_m12||''} onChange={this.onNumChange.bind(this,12)} />
                                </li>
                            </ul>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default SetGoal
