import React, { PropTypes } from 'react';
import { Table, Button, Input, Row, Col, Modal } from 'antd';
import message from '~comm/components/Message';
import ReleaseSuccessModal from './components/ReleaseSuccessModal';
import ReleaseFailModal from './components/ReleaseFailModal';
import WithdrawAppeal from './components/WithdrawAppeal';
import './appeal-manage.less';

const confirm = Modal.confirm;

class ApealManage extends React.Component {
  static propTypes = {
    appealActions: PropTypes.object.isRequired,
    appealManage: PropTypes.object.isRequired,
  }

  state = {
    currentHandleUid: '',
    currentId: '',
  }

  componentDidMount() {
    const { appealActions } = this.props;
    appealActions.getAppealList();
  }

  onTableChange = (pagination, filters) => {
    const { current } = pagination;
    const { appealActions } = this.props;

    if (current !== this.props.appealManage.appealListPage.curr) {
      appealActions.updateAppealParams({
        page: current,
      });
    }

    if (filters.status && filters.status.length > 0) {
      // 需要状态过滤
      appealActions.updateAppealParams({
        status: filters.status[0],
      });
    }

    appealActions.getAppealList();
  }

  onSearch = () => {
    const { appealActions, appealManage } = this.props;
    if (
      appealManage.searchPhone &&
      !(/^1[3|4|5|7|8][0-9]\d{8}$/.test(appealManage.searchPhone) ||
        /09\d{8}$/.test(appealManage.searchPhone)
      )
    ) {
      message.error('请填写正确的手机号');
      return false;
    }

    appealActions.updateAppealParams({
      page: 1,
      user_id_or_name: appealManage.searchUser,
      appealMobile: appealManage.searchPhone,
    });

    return appealActions.getAppealList();
  }

  onExport = () => {
    const { appealActions } = this.props;
    Modal.confirm({
      title: (<span>您需要前往我的<a href="">导出页面</a>查看导出进度和下载。确认继续导出吗？</span>),
      onOk(cb) {
        appealActions.asyncExport().then(({ errorMsg }) => {
          if (!errorMsg) {
            cb();
          }
        });
      },
    });
    // const { appealActions } = this.props;
    // appealActions.asyncExport();
  }

  onClickHandle = (id, uid) => {
    this.setState({
      currentHandleUid: uid,
      currentId: id,
    });

    this.props.appealActions.toggleHandleModal(true);
  }

  onHandleAppeal = (id) => {
    // confirm({
    //   title: '处理申诉',
    //   content: (
    //     <div>
    //       <p>是否开始处理此条申诉记录？</p>
    //       <p
    //         style={{ margin: '7px 0', fontSize: 12 }}
    //       >
    //         或者
    //         <a style={{ textDecoration: 'underline' }}>
    //           点此撤回用户申诉
    //         </a>
    //       </p>
    //     </div>
    //   ),
    //   iconType: 'none',
    //   onOk: () => this.props.appealActions.handleAppeal(id),
    // });
  }

  onCancelHandleAppeal = () => {
    this.props.appealActions.toggleHandleModal(false);
  }

  // cancelHandleAppeal = (id) => {
  //   this.props.appealActions.toggleAppealHandle(false, id);
  // }

  render() {
    const { appealActions } = this.props;
    const {
      appealList,
      appealListPage,
      searchUser,
      searchPhone,
      appealParams,
      handleModalVisible,
    } = this.props.appealManage;

    const status = appealParams.status;
    let statusTitle = '全部状态';

    if (status === '0') {
      statusTitle = '待受理';
    } else if (status === '1') {
      statusTitle = '受理中';
    } else if (status === '2') {
      statusTitle = '已处理';
    } else if (status === '3') {
      statusTitle = '申诉驳回';
    } else {
      statusTitle = '全部状态';
    }

    const columns = [{
      title: '申诉用户',
      dataIndex: 'f_user_name',
      width: '8%',
      key: 'userName',
    }, {
      title: '申诉用户ID',
      dataIndex: 'f_user_id',
      width: '10%',
      key: 'userId',
    }, {
      title: '公司名称',
      dataIndex: 'f_corp_name',
      key: 'corpName',
      render: (text, record) => (<span>{text}（{record.f_corp_id}）</span>),
    }, {
      title: '现绑定手机号',
      dataIndex: 'f_old_mobile',
      width: '10%',
      key: 'oldMobile',
    }, {
      title: '申诉手机号',
      dataIndex: 'f_appeal_mobile',
      width: '10%',
      key: 'appealMobile',
    }, {
      title: '申诉手机号码对应用户',
      dataIndex: 'f_appeal_user_name',
      width: '10%',
      key: 'appealUserName',
      render: (text, record) => (<span>{text}（{record.f_appeal_user_id}）</span>),
    }, {
      title: '申诉号码对应用户联系方式',
      dataIndex: 'f_appeal_contact',
      width: '10%',
      key: 'appealContact',
    }, {
      title: '申诉时间',
      dataIndex: 'f_create_time',
      width: '10%',
      key: 'createTime',
    }, {
      title: (<span>{statusTitle}</span>),
      dataIndex: 'f_status_str',
      width: '10%',
      key: 'status',
      filters: [{
        text: '全部状态',
        value: '-1',
      }, {
        text: '待受理',
        value: '0',
      }, {
        text: '受理中',
        value: '1',
      }, {
        text: '已处理',
        value: '2',
      }, {
        text: '申诉驳回',
        value: '3',
      }, {
        text: '用户撤诉',
        value: '10',
      }],
      filterMultiple: false,
    }, {
      title: '操作',
      width: '10%',
      key: 'operates',
      render: (text, record) => {
        let operator = null;
        if (record.f_status === '0') {
          operator = (
            <Button
              type="primary"
              size="small"
              onClick={() => this.onClickHandle(record.f_id, record.f_user_id)}
            >
              处理申诉
            </Button>
          );
        } else if (record.f_status === '1') {
          operator = (
            <Button
              type="primary"
              size="small"
              onClick={
                () => {
                  // appealActions.toggleReleaseSuccessModal(true);
                  this.setState({
                    currentHandleUid: record.f_user_id,
                  });
                  appealActions.releaseCheck(record.f_id);
                  appealActions.setCurrentReleaseId(record.f_id);
                }
              }
            >
              放号检验
            </Button>
          );
        } else if (record.f_status === '2' || record.f_status === '11') {
          operator = (
            <Button type="primary" size="small" disabled>放号检验</Button>
          );
        } else {
          operator = (
            <Button type="primary" size="small" disabled>处理申诉</Button>
          );
        }
        return operator;
      },
    }];

    const tablePagination = {
      total: Number(appealListPage.totalcount),
      current: appealListPage.curr,
      pageSize: appealListPage.per,
    };

    return (
      <div className="appeal-manage">
        <p className="appeal-text">
          帐号申诉处理：
        </p>
        <div className="appeal-table-operation">
          <Row gutter={30}>
            <Col span={10}>
              <Input
                placeholder="输入用户名/ID查找"
                value={searchUser}
                onChange={(event) => appealActions.updateSearchUser(event.target.value)}
              />

              <Input
                placeholder="输入申诉手机号"
                type="number"
                value={searchPhone}
                onChange={(event) => appealActions.updateSearchPhone(event.target.value)}
              />
            </Col>
            <Col className="search-op" span={12}>
              <Button
                type="primary"
                className="appeal-search-btn"
                onClick={this.onSearch}
              >
                搜索
              </Button>
              <Button
                type="ghost"
                className="appeal-list-export"
                onClick={this.onExport}
              >
                导出
              </Button>
            </Col>
          </Row>
        </div>

        <div className="appeal-statistics"></div>

        <Table
          columns={columns}
          dataSource={appealList}
          pagination={tablePagination}
          onChange={this.onTableChange}
        />

        <Modal
          title="处理申诉"
          visible={handleModalVisible}
          onOk={() => this.props.appealActions.handleAppeal(this.state.currentId)}
          onCancel={this.onCancelHandleAppeal}
        >
          <p>是否开始处理此条申诉记录？</p>
          <WithdrawAppeal currentId={this.state.currentHandleUid} />
        </Modal>

        <ReleaseFailModal currentId={this.state.currentHandleUid} />
        <ReleaseSuccessModal />
      </div>
    );
  }
}

export default ApealManage;
