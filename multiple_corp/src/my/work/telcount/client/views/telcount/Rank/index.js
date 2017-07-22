import React, { PropTypes } from 'react';
import { Router, browserEmployee, Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { fetchRankData, changeRankSort } from '../../../actions/index';

import ECPopover from '../../../components/ECPopover';
import Title from '../../../components/Title';

import TelSelectFilter from '../../../containers/TelSelectFilter';
import TimeTab from '../../../containers/TimeTab';
import TimeSelect from '../../../containers/TimeSelect';
import ChangeCategoryTab from '../../../containers/ChangeCategoryTab';
import RankSort from '../../../containers/RankSort';
import ShowRankList from '../../../containers/ShowRankList';
import DetailTable from '../../../containers/DetailTable';

import './index.less';

class Employee extends React.Component {

    componentWillMount() {
        
    }  

    render() {
        const content_wenan = [
            { title: '员工排行', desc: ['员工或部门按照联系人数量、通话时长、拨打次数、接通率、平均通话时长进行排名。', '排名变化是当前周期相对上一周期的排名比较。'] },
            { title: '接通率', desc: ['接通电话次数/拨打次数，EC云呼、EC电话会议、TCL无线话机能够准确计算接通率，TCL有线话机、TCL盒子开始拨打13秒开始算作接通。'] },
            { title: '通话时长', desc: ['通话总时长，包括给客户、EC好友、陌生人的电话时长。'] },
            { title: '拨打次数', desc: ['拨打客户、EC好友、陌生人电话总次数。'] },
            { title: '联系人数量（去重）', desc: ['通过电话联系过的客户、EC好友、陌生人，今日联系客户数会去重。'] },
            { title: '平均通话时长', desc: ['通话时长/拨打次数。'] }
        ];
        const content = <ECPopover content={content_wenan} />;
        const { table } = this.props;
        const timearr = [
            {
                type: 1,
                name: '日排行'
            },
            {
                type: 2,
                name: '周排行'
            },
            {
                type: 4,
                name: '月排行'
            }                                             
        ]        
        return (
            <div className="">
                <div>
                    <div className="ec_header">
                        <Title name={'员工排行'} content={content} />
                        <div className="time">
                            <TimeTab type={'employeeData'} timearr={timearr} />
                            <TimeSelect type={'employeeData'} />
                        </div>
                    </div>
                    <TelSelectFilter type={'employeeData'} />
                    <div className="statistics-table">
                        <ChangeCategoryTab type={'employeeData'} />
                        <RankSort />
                        <ShowRankList />
                    </div>
                    <div className="detail-table">
                        <DetailTable data={ table } type={1} fetchExportData={ this.props.fetchRankData }/>
                    </div>
                </div>
            </div>
        );
    }
}

Employee.Propstype = {
    table: PropTypes.object.isRequired,
    fetchRankData: PropTypes.func.isRequired,
}


const mapStateToProps = (state) => {
    const obj = Object.assign({}, state.employeeData);
    return obj;
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        fetchRankData
    }, dispatch);
};


Employee.contextTypes = {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


export default connect(mapStateToProps, mapDispatchToProps)(Employee);