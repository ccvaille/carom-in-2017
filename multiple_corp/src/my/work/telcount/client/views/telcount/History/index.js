import React, { PropTypes } from 'react';
import { Router, browserHistory, Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'

import { fetchHistoryData } from '../../../actions/index';

import Title from '../../../components/Title';
import ECPopover from '../../../components/ECPopover';

import TimeTab from '../../../containers/TimeTab';
import TimeSelect from '../../../containers/TimeSelect';
import TypeSelect from '../../../containers/TypeSelect';
import TelSelectFilter from '../../../containers/TelSelectFilter';
import ChangeCategoryTab from '../../../containers/ChangeCategoryTab';
import Echart from '../../../containers/Echart';
import DetailTable from '../../../containers/DetailTable';

import './index.less';


class History extends React.Component {

    componentWillMount() {

    }  

    onChartReadyCallback() {

    }

    EventsDict() {
        return {}
    }

    render() {
        const content_wenan = [
            { title: '接通率', desc: ['接通电话次数/拨打次数，EC云呼、EC电话会议、TCL无线话机能够准确计算接通率，TCL有线话机、TCL盒子开始拨打13秒开始算作接通。'] },
            { title: '通话时长', desc: ['通话总时长，包括给客户、EC好友、陌生人的电话时长。'] },
            { title: '拨打次数', desc: ['拨打客户、EC好友、陌生人电话总次数。'] },
            { title: '联系人数量（去重）', desc: ['通过电话联系过的客户、EC好友、陌生人，今日联系客户数会去重。'] },
            { title: '平均通话时长', desc: ['通话时长/拨打次数。'] },
            { title: '趋势图', desc: ['展示不同时间段内的趋势，其中当前时间点代表之前两小时内时间段，例如：10点代表8-10点区间段的数据。'] }
        ];
        const content = <ECPopover content={content_wenan} />;
        const { data } = this.props;
        const timearr = [
            {
                type: 0,
                name: '昨天'
            },
            {
                type: 2,
                name: '本周'
            },
            {
                type: 3,
                name: '上周'
            },
            {
                type: 4,
                name: '本月'
            },
            {
                type: 5,
                name: '上月'
            }                                               
        ]
        var that = this;
        return (
            <div>
                <div>
                    <div className="ec_header">
                        <Title name={'历史趋势'} content={content} />
                        <div className="time">
                            <TimeTab type={'historyData'} timearr={timearr} />
                            <TimeSelect type={'historyData'} />
                        </div>
                    </div>
                    <TelSelectFilter type={'historyData'} />
                    <TypeSelect type={'historyData'} />
                    <div className="statistics-table">
                        <ChangeCategoryTab type={'historyData'} />
                        <Echart type={'historyData'} />
                    </div>
                    <div className="detail-table">
                        <DetailTable data={ data.data } type={0} fetchExportData={ this.props.fetchHistoryData }/>
                    </div>
                </div>
            </div>
        );
    }
}

History.Propstype = {
    data: PropTypes.object.isRequired,
    fetchHistoryData: PropTypes.func.isRequired,
}


const mapStateToProps = (state) => {
    const obj = Object.assign({}, state.historyData);
    return obj;
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        fetchHistoryData
    }, dispatch);
};


History.contextTypes = {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};


export default connect(mapStateToProps, mapDispatchToProps)(History);
