import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { fetchTodayData } from '../../../actions/index';

import Title from '../../../components/Title';
import TodayNum from '../../../components/TodayNum';
import ECPopover from '../../../components/ECPopover';

import ChangeCategoryTab from '../../../containers/ChangeCategoryTab';
import TelSelectFilter from '../../../containers/TelSelectFilter';
import RefreshTime from '../../../containers/RefreshTime';
import Echart from '../../../containers/Echart';
import DetailTable from '../../../containers/DetailTable';

import './index.less';


class Today extends React.Component {
    static propTypes = {
        fetchTodayData: PropTypes.func.isRequired,
        data: PropTypes.object.isRequired,
    }
    componentWillMount() {

    }

    componentDidMount() {
        this.props.fetchTodayData();
    }

    onChartReadyCallback = () => {

    }

    EventsDict = () => {};

    render() {
        const contentWenan = [
            { title: '接通率', desc: ['接通电话次数/拨打次数，EC云呼、EC电话会议、TCL无线话机能够准确计算接通率，TCL有线话机、TCL盒子开始拨打13秒开始算作接通。'] },
            { title: '通话时长', desc: ['通话总时长包括客户与陌生人的电话时长。'] },
            { title: '拨打次数', desc: ['拨打客户和陌生人电话总次数。'] },
            { title: '联系人数量', desc: ['通过电话联系过的客户和陌生人，不会重复计数，如果客户被删除、转让等操作，不会影响联系客户数的减少，陌生人备注为客户后，不影响联系客户数变更。', '拨打EC好友的号码，默认为陌生人，也会记录联系客户数。', '联系客户数量，只做当天内的去重，跨天或跨员工的而联系客户数量累加。'] },
            { title: '平均通话时长', desc: ['通话时长/拨打次数。'] }
        ];
        const content = <ECPopover content={contentWenan} />;
        const { data } = this.props;
        return (
            <div>
                <div>
                    <div className="ec_header">
                        <Title name={'今日统计'} content={content} />
                        <RefreshTime />
                        <TelSelectFilter type={'dailyData'} />
                    </div>
                    <TodayNum />
                    <div className="statistics-table">
                        <ChangeCategoryTab type={'dailyData'} />
                        <Echart type={'dailyData'} />
                    </div>
                    <div className="detail-table">
                        <DetailTable
                            data={data.data}
                            type={0}
                            fetchExportData={this.props.fetchTodayData}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchTodayData
}, dispatch);


Today.contextTypes = {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    const obj = Object.assign({}, state.dailyData);
    return obj;
};

export default connect(mapStateToProps, mapDispatchToProps)(Today);
