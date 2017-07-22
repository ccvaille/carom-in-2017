import React, { PropTypes } from 'react';
import { Table, Button, Input, Popconfirm, Modal } from 'antd';
import message from '~comm/components/Message';
import AddCorpModal from './components/AddCorpModal';
import './whitelist.less';

const columns = [{
  title: '公司名称（ID）',
  dataIndex: 'f_corp_name',
  key: 'corpName',
  render: (text, record) => (<span>{text}（{record.f_corp_id}）</span>),
}, {
  title: '所属代理商',
  dataIndex: 'f_agent_name',
  key: 'agentName',
  render: (text, record) => (<span>{text}（{record.f_agent_id}）</span>),
}, {
  title: '添加时间',
  dataIndex: 'f_create_time',
  key: 'createTime',
}, {
  title: '添加操作人',
  dataIndex: 'f_user_name',
  key: 'userName',
}];

class Whitelist extends React.Component {
  static propTypes = {
    whitelistActions: PropTypes.object.isRequired,
    whitelist: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const { whitelistActions } = this.props;
    whitelistActions.getWhitelist();
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    const { whitelistActions } = this.props;
    const ids = selectedRows.map(row => row.f_corp_id);
    whitelistActions.addCorpsToRemove(ids);
  }

  onRemoveCorps = () => {
    const { corpIdsToRemove } = this.props.whitelist;

    if (!corpIdsToRemove.length) {
      message.error('请选择要移出的企业');
    } else {
      this.props.whitelistActions.toggleRemoveVisible(true);
    }
  }

  onConfirmRemoveCorps = () => {
    this.props.whitelistActions.removeWhitelistCorps(this.props.whitelist.corpIdsToRemove);
  }

  onCancelRemoveCorps = () => {
    this.props.whitelistActions.toggleRemoveVisible(false);
  }

  onTableChange = (pagination) => {
    const { current } = pagination;

    if (current !== this.props.whitelist.whitelistsPage.curr) {
      const { whitelistActions } = this.props;
      whitelistActions.updateWhitelistParams({
        page: current,
      });
      whitelistActions.getWhitelist();
    }
  }

  onSearch = () => {
    const { whitelistActions } = this.props;
    const { searchKeyword } = this.props.whitelist;

    whitelistActions.updateWhitelistParams({
      page: 1,
      word: searchKeyword,
    });

    whitelistActions.getWhitelist();
  }

  onExport = () => {
    const { whitelistActions } = this.props;
    Modal.confirm({
      title: (<span>您需要前往我的<a href="/export">导出页面</a>查看导出进度和下载。确认继续导出吗？</span>),
      onOk(cb) {
        whitelistActions.asyncExport().then(({ errorMsg }) => {
          if (!errorMsg) {
            cb();
          }
        });
      },
    });
  }

  toggleAddModal = () => {
    const { whitelistActions } = this.props;
    whitelistActions.toggleAddModal(true);
  }

  render() {
    const { whitelistActions } = this.props;
    const {
      corpIdsToRemove,
      whitelists,
      whitelistsPage,
      searchKeyword,
      removeConfirmVisible,
    } = this.props.whitelist;

    const rowSelection = {
      selectedRowKeys: corpIdsToRemove,
      onChange: this.onSelectChange,
    };

    const tablePagination = {
      total: Number(whitelistsPage.totalcount),
      current: whitelistsPage.curr,
      pageSize: whitelistsPage.per,
    };

    return (
      <div className="whitelist">
        <p className="whitelist-text">
          手机未验证用户：指未使用下发的验证码且成功验证手机的帐号。此【白名单】对手机未验证的帐号的企业所有成员不需要进行安全验证提醒
        </p>
        <div className="whitelist-screen">
          <Input
            placeholder="输入企业ID/企业名称/代理商ID/代理商名称"
            value={searchKeyword}
            onChange={(event) => whitelistActions.updateSearchKeyword(event.target.value)}
          />
          <Button
            type="primary"
            className="whitelist-btn"
            onClick={this.onSearch}
          >
            搜索
          </Button>
          <Button
            type="ghost"
            className="whitelist-export"
            onClick={this.onExport}
          >
            导出
          </Button>
          <Button
            type="primary"
            className="whitelist-add"
            onClick={this.toggleAddModal}
          >
            添加白名单
          </Button>
          <Popconfirm
            title="确定将所勾选的企业移出白名单吗？"
            visible={removeConfirmVisible}
            onConfirm={this.onConfirmRemoveCorps}
            onCancel={this.onCancelRemoveCorps}
          >
            <Button
              type="ghost"
              className="whitelist-remover"
              onClick={this.onRemoveCorps}
            >
              移出白名单
            </Button>
          </Popconfirm>
        </div>
        <cite>总共<span>{whitelistsPage.totalcount}</span>个企业</cite>
        <Table
          rowKey={record => record.f_corp_id}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={whitelists}
          pagination={tablePagination}
          onChange={this.onTableChange}
        />

        <AddCorpModal />
      </div>
    );
  }
}

export default Whitelist;
