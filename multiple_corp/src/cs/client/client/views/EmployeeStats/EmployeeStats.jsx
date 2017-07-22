import React, { PropTypes } from 'react';
import classNames from 'classnames';
import BaseResizableTable from 'components/BaseResizableTable';
import './employee-stats.less';
// import StatsDataOperation from 'components/StatsDataOperation';

class EmployeeStats extends React.Component {
    static propTypes = {
        getEmployeeStats: PropTypes.func.isRequired,
        updateEmployeeStatsParams: PropTypes.func.isRequired,
        employeeStats: PropTypes.object.isRequired,
    }

    componentDidMount() {
        const { getEmployeeStats } = this.props;
        getEmployeeStats();

        this.getInterval = setInterval(() => {
            getEmployeeStats();
        }, 30000);
    }

    componentWillUnmount() {
        if (this.getInterval) {
            clearInterval(this.getInterval);
        }

        this.props.updateEmployeeStatsParams({
            page: 1,
            pagination: {
                current: 1,
            },
        });
    }

    onTableChange = (pagination) => {
        const { updateEmployeeStatsParams, getEmployeeStats } = this.props;
        updateEmployeeStatsParams({
            page: pagination.current,
        });

        getEmployeeStats();
    }

    render() {
        // const { getEmployeeStats, updateEmployeeStatsParams } = this.props;
        const { tableData, pagination } = this.props.employeeStats;
        const columns = [{
            title: '客服',
            dataIndex: 'f_show_name',
            key: 'csName',
            width: '25%',
            render: (text, record) => {
                const imgClasses = classNames({
                    avatar: true,
                    offline: record.f_status === 0,
                });
                return (
                    <div className="cs-info">
                        <img className={imgClasses} src={record.f_face} alt="头像" />
                        <span>{text}</span>
                    </div>
                );
            },
        }, {
            title: '在线状态',
            dataIndex: 'f_status',
            key: 'isOnline',
            width: '25%',
            render: (text) => {
                if (text === 0) {
                    return (<span>离线</span>);
                }

                return (<span>在线</span>);
            },
        }, {
            title: '最近一次登录',
            dataIndex: 'last_login_time',
            key: 'lastLogin',
            width: '25%',
        }, {
            title: '工作情况',
            width: '25%',
            dataIndex: 'f_status',
            key: 'working',
            render: (text) => {
                if (text === 2) {
                    return (<span className="highlight">会话中</span>);
                } else if (text === 3) {
                    return (<span className="highlight">空闲</span>);
                }
                return null;
            },
        }];

        return (
            <div className="statistics-employee">
                <BaseResizableTable
                    columns={columns}
                    pagination={pagination.total <= pagination.pageSize ? false : pagination}
                    dataSource={tableData}
                    onChange={this.onTableChange}
                />
            </div>
        );
    }
}

export default EmployeeStats;
