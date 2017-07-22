import React from 'react';
let PropTypes = React.PropTypes;
import './index.less';
import {Button, Select,Icon} from 'antd';
const Option = Select.Option;
import SelectUser from '../SelectUser'

function passThreeYear() {
    let cYear = (new Date()).getFullYear();
    return [cYear, cYear - 1, cYear - 2].map((item)=>{
        return item.toString();
    });
}

function formatData(array){
    let result = array.map((item,index)=>{
        return {
            id:item.id,
            parent_id:item.pId,
            name:item.name,
            type:item.type
        }
    });
    return result;
}


class FilterPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSelectUserShow: false,
            users: [],
            passThreeYears: passThreeYear(),
            year:passThreeYear()[0],
            month:'000'
        }
    }

    static propTypes = {
        membersData: PropTypes.array.isRequired,
        year:PropTypes.any,
        month:PropTypes.any,
        isSelectUserShow:PropTypes.bool,
        isShowTimeRow:PropTypes.bool,
        isShowMonth:PropTypes.bool,
        onSubmit:PropTypes.func.isRequired,
        users:PropTypes.array,
        defaultUser:PropTypes.any,
    };

    static defaultProps = {
        membersData: [],
        year:passThreeYear()[0],
        month:'000',
        isSelectUserShow:false,
        isShowTimeRow:true,
        isShowMonth:true,
        users:[],
        defaultUser:null
    };

    componentWillMount(){
        this.setState({
            isSelectUserShow:this.props.isSelectUserShow,
            month:this.props.month.toString(),
            year:this.props.year.toString(),
            users:this.props.users
        });
    }

    componentWillReceiveProps(nextProps,nextState){
        this.setState({
            isSelectUserShow:nextProps.isSelectUserShow,
            month:nextProps.month.toString(),
            year:nextProps.year.toString(),
            users:nextProps.users
        });
    }

    handleYearChange = (e)=> {
        this.setState({
            year:e.toString()
        });
        this.props.onSubmit({
            users:this.state.users,
            year:e.toString(),
            month:this.state.month
        });
    }

    handleMonthChange = (e)=> {
        this.setState({
            month:e.toString()
        });
        this.props.onSubmit({
            users:this.state.users,
            year:this.state.year,
            month:e.toString()
        });
    }

    selectUserOk = (users) => {
        this.setState({isSelectUserShow: false, users: users});
        this.props.onSubmit({
            users:users,
            year:this.state.year,
            month:this.state.month
        });
    }

    selectUserCancel = () => {
        this.setState({isSelectUserShow: false})
    }


    toggleSelectUser = () => {
        this.setState({
            isSelectUserShow: !this.state.isSelectUserShow
        });
    }

    removeUser = (id) => {
        let users = this.state.users;
        users = users.filter(function (item) {
            return item.id != id;
        });

        this.setState({users: users});

        this.props.onSubmit({
            users:users,
            year:this.state.year,
            month:this.state.month
        });
    }

    handleAllUsers=()=>{
        this.setState({users: []});

        this.props.onSubmit({
            users:[],
            year:this.state.year,
            month:this.state.month
        });
    }

    render() {
        let {membersData,isShowMonth,isShowTimeRow,defaultUser} = this.props;
        return (
            <div className="Filter-Panel" ref = 'filterPanel'>
                <table>
                    <tbody>

                    <tr>
                        <td className="title">
                            部门/员工
                        </td>
                        {
                            defaultUser?(
                                <td className="ctrl-area"><a>{defaultUser.name}</a></td>
                            ):(
                                <td className="ctrl-area">
                                <Button className="filter-btn" onClick={this.toggleSelectUser} type="dashed">筛选</Button>

                                {
                                    this.state.users.length > 0?(this.state.users.map(function (item, index) {
                                        return (
                                            <a className = 'checked-btn' key={index}  size="small"><span title={item.name}>{item.name.length>11?item.name.slice(0,11)+'...':item.name}</span><Icon type="close" onClick={() => this.removeUser(item.id)}/></a>
                                        )
                                    }.bind(this))):(<a className="all-btn">全部</a>)
                                }

                                
                                <SelectUser
                                    visible={this.state.isSelectUserShow}
                                    option={{
                                        left: 320,
                                        top: 52
                                    }}
                                    data={membersData}
                                    onOk={this.selectUserOk}
                                    onCancel={this.selectUserCancel}
                                    rule={{
                                        id: 'id',
                                        name: 'text',
                                        sublist: 'item'
                                    }}
                                    checkedArray={this.state.users}
                                />
                            </td>
                            )
                        }

                    </tr>
                    {
                        isShowTimeRow?(<tr>
                            <td className="title">
                                时间
                            </td>
                            <td className="ctrl-area">
                                <Select value={this.state.year} getPopupContainer={()=>this.refs.filterPanel} style={{width: 68}}
                                        onChange={this.handleYearChange}>
                                    {
                                        this.state.passThreeYears.map((item, index, value)=> {
                                            return (<Option key={item} value={item}>{item}</Option>)
                                        })
                                    }
                                </Select>

                                {
                                    isShowMonth?(<Select value={this.state.month} getPopupContainer={()=>this.refs.filterPanel} style={{width: 90, marginLeft: 10}}
                                                         onChange={this.handleMonthChange}>
                                        <Option value="000">全年</Option>
                                        <Option value="111">第一季度</Option>
                                        <Option value="222">第二季度</Option>
                                        <Option value="333">第三季度</Option>
                                        <Option value="444">第四季度</Option>
                                        <Option value="1">1月</Option>
                                        <Option value="2">2月</Option>
                                        <Option value="3">3月</Option>
                                        <Option value="4">4月</Option>
                                        <Option value="5">5月</Option>
                                        <Option value="6">6月</Option>
                                        <Option value="7">7月</Option>
                                        <Option value="8">8月</Option>
                                        <Option value="9">9月</Option>
                                        <Option value="10">10月</Option>
                                        <Option value="11">11月</Option>
                                        <Option value="12">12月</Option>
                                    </Select>):null
                                }
                            </td>
                        </tr>):null
                    }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default FilterPanel
