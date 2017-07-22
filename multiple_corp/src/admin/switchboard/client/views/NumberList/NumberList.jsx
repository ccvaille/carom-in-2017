import React, { PropTypes } from 'react';
import { Table, Modal } from 'antd';
import ApplyTableOperation from 'components/ApplyTableOperation';
import './number-list.less';

class NumberList extends React.Component {
  static propTypes = {
    numberList: PropTypes.object.isRequired,
    numberListActions: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.mockData = [];
  }

  state = {
    searchCorp: '',
    searchAgent: '',
  }

  componentDidMount() {
    this.props.numberListActions.getNumberList();
  }

  onSearch = () => {
    const { numberListActions } = this.props;
    const { searchCorp, searchAgent } = this.state;

    numberListActions.updateListParams({
      curr: 1,
      corp: searchCorp,
      agent: searchAgent,
    });

    numberListActions.getNumberList();
  }

  onExport = () => {
    const { numberListActions } = this.props;
    Modal.confirm({
      title: (<span>您需要前往我的<a href="/export">导出页面</a>查看导出进度和下载。确认继续导出吗？</span>),
      onOk(cb) {
        numberListActions.asyncExport().then(({ errorMsg }) => {
          if (!errorMsg) {
            cb();
          }
        });
      },
    });
  }

  onSearchCorpChange = (e) => {
    this.setState({
      searchCorp: e.target.value,
    });
  }

  onSearchAgentChange = (e) => {
    this.setState({
      searchAgent: e.target.value,
    });
  }

  onSearchKeyUp = (e) => {
    if (e.keyCode === 13) {
      this.onSearch();
    }
  }

  onTableChange = (pagination, filters) => {
    const { current } = pagination;
    const { numberListActions } = this.props;

    numberListActions.updateListParams({
      curr: current,
    });

    if (filters.status && filters.status.length > 0) {
      // 需要状态过滤
      numberListActions.updateListParams({
        status: filters.status[0],
      });
    }

    numberListActions.getNumberList();
  }

  render() {
    const { numbers, numberListPage, numberListParams, extra } = this.props.numberList;

    const status = numberListParams.status;
    let statusTitle = '全部状态';

    if (status === 1) {
      statusTitle = '生效';
    } else if (status === 2) {
      statusTitle = '审核中';
    } else if (status === 3) {
      statusTitle = '过期';
    } else if (status === 4) {
      statusTitle = '已退订';
    } else {
      statusTitle = '全部状态';
    }

    const columns = [{
      title: '企业名称（ID）',
      dataIndex: 'f_corp_name',
      key: 'corpName',
      render: (text, record) => (
        <span>{text}（{record.f_corp_id}）</span>
      ),
    }, {
      title: '代理商名称（ID）',
      dataIndex: 'f_agent_name',
      key: 'agentName',
      render: (text, record) => (
        <span>{text}（{record.agent_id}）</span>
      ),
    }, {
      title: '云呼总机号码',
      dataIndex: 'f_number',
      key: 'phoneNumber',
    }, {
      title: '生效时间',
      dataIndex: 'f_effect_time',
      key: 'startTime',
      render: (text) => {
        if (!text) {
          return (<span>--</span>);
        }

        return (<span>{text}</span>);
      },
    }, {
      title: '到期时间',
      dataIndex: 'f_expire_time',
      key: 'endTime',
      render: (text) => {
        if (!text) {
          return (<span>--</span>);
        }

        return (<span>{text}</span>);
      },
    }, {
      title: statusTitle,
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        if (text === 4) {
          return (<span style={{ color: 'red' }}>已退订</span>);
        }

        if (text === 3) {
          return (<span style={{ color: 'red' }}>过期</span>);
        }

        if (text === 2) {
          return (<span>审核中</span>);
        }

        if (text === 1) {
          return (<span style={{ color: '#2580e6' }}>生效</span>);
        }

        return (<span></span>);
      },
      filters: [{
        text: '全部状态',
        value: 0,
      }, {
        text: '生效',
        value: 1,
      }, {
        text: '审核中',
        value: 2,
      }, {
        text: '过期',
        value: 3,
      }, {
        text: '已退订',
        value: 4,
      }],
      filterMultiple: false,
    }];

    const tablePagination = {
      total: Number(numberListPage.totalcount),
      current: Number(numberListPage.curr),
      pageSize: Number(numberListPage.per),
    };

    return (
      <div className="switchboard-number-list">
        <ApplyTableOperation
          searchCorp={this.state.searchCorp}
          searchAgent={this.state.searchAgent}
          onSearchCorpChange={this.onSearchCorpChange}
          onSearchAgentChange={this.onSearchAgentChange}
          onSearchKeyUp={this.onSearchKeyUp}
          onSearch={this.onSearch}
          onExport={this.onExport}
        />

        <div className="statistics">
          <p>
            企业客户数量：{extra.corpcount}个，
            申请总机号码数量：{numberListPage.totalcount}个，
            其中生效号码数量为：{extra.numbernum}个
          </p>
        </div>

        <Table
          rowKey={record => record.f_id}
          columns={columns}
          dataSource={numbers}
          pagination={tablePagination}
          onChange={this.onTableChange}
        />
      </div>
    );
  }
}

export default NumberList;
