import React, { PropTypes } from "react";
import classNames from "classnames";
import { Table, Modal } from "antd";
import ApplyTableOperation from "components/ApplyTableOperation";
import ApplyPassModal from "./components/ApplyPassModal";
import ApplyRefuseModal from "./components/ApplyRefuseModal";
import ModifyPhoneModal from "./components/ModifyPhoneModal";
import DownloadModal from "./components/DownloadModal";
import ViewPhoneModal from "./components/ViewPhoneModal";
import "./apply-list.less";

class ApplyList extends React.Component {
    static propTypes = {
        applyListActions: PropTypes.object.isRequired,
        applyList: PropTypes.object.isRequired
    };

    state = {
        searchCorp: "",
        searchAgent: "",
        downloadVisible: false,
        viewNumberVisible: false,
        expandedRowKeys: [],
        phoneId: ''//查看下发云呼总机的公司id
    };

    componentDidMount() {
        this.props.applyListActions.getApplyList();
    }

    onSearch = () => {
        const { applyListActions } = this.props;
        const { searchCorp, searchAgent } = this.state;

        applyListActions.updateListParams({
            curr: 1,
            corp: searchCorp,
            agent: searchAgent
        });

        applyListActions.getApplyList();
    };

    onExport = () => {
        const { applyListActions } = this.props;
        Modal.confirm({
            title: (
                <span>您需要前往我的<a href="/export">导出页面</a>查看导出进度和下载。确认继续导出吗？</span>
            ),
            onOk(cb) {
                applyListActions.asyncExport().then(({ errorMsg }) => {
                    if (!errorMsg) {
                        cb();
                    }
                });
            }
        });
    };

    onSearchCorpChange = e => {
        this.setState({
            searchCorp: e.target.value
        });
    };

    onSearchAgentChange = e => {
        this.setState({
            searchAgent: e.target.value
        });
    };

    onSearchKeyUp = e => {
        if (e.keyCode === 13) {
            this.onSearch();
        }
    };

    onTableChange = (pagination, filters) => {
        const { applyListActions } = this.props;
        const { current } = pagination;

        applyListActions.updateListParams({
            curr: current
        });

        if (filters.applyStatus && filters.applyStatus.length > 0) {
            // @todo 需要状态过滤
            applyListActions.updateListParams({
                status: filters.applyStatus[0]
            });
        }

        applyListActions.getApplyList();
    };

    onPassApplyOne = (id, num) => {
        const { applyListActions } = this.props;
        // applyListActions.getPhoneList({id});//获取所有号码
        applyListActions.setCurrentPassId(id);
        applyListActions.setCurrentPassType(1);
        applyListActions.setCurrentPassNum(num);    
        applyListActions.toggleApplyPass(true);
    };

    onPassApplyTwo = id => {
        const { applyListActions } = this.props;
        applyListActions.setCurrentPassId(id);
        applyListActions.setCurrentPassType(2);
        Modal.confirm({
            className: "apply-pass-two",
            title: "审核通过",
            content: <p>是否确定已经审核通过？如果通过，客户申请的号码生效可以正式使用！</p>,
            onOk: cb => {
                this.props.applyListActions.passApplyTwo().then(({
                    errorMsg
                }) => {
                    if (!errorMsg) {
                        cb();
                    }
                });
            }
        });
    };

    onRefuseApply = (id, type) => {
        const { applyListActions } = this.props;
        applyListActions.setCurrentRefuseId(id);
        applyListActions.setCurrentPassType(type);
        applyListActions.toggleApplyRefuse(true);
    };
    //查看下发云呼总机号码
    onViewNumber = (id, page=1, pageSize=10) => {
        this.props.applyListActions.getPhoneList({
            id: id,
            page: page,
            per: pageSize
        });
        this.setState({
            viewNumberVisible: true,
            phoneId: id
        });
    };

    onCloseViewNumber = () => {
        this.setState(
            {
                viewNumberVisible: false
            },
            () => {
                this.props.applyListActions.resetPhoneList();
            }
        );
    };
    //点击修改号码
    onModifyPhone = id => {
        const { applyListActions } = this.props;
        //获取所有的已下发的号码
        applyListActions.getPhoneList({
            id: id,
            page: 1,
            per: 100
        });
        applyListActions.toggleModifyPhone(true);
    };
    //检查修改过的号码
    getErrorModifyPhone = (type) => {
        const { phoneList, passPhoneList } = this.props.applyList;
        const { applyListActions } = this.props;
        let list = [];
        if (type === 'pass') {
            passPhoneList.forEach((item, index) => {
                if (!this.checkModifyPhone(item)) {
                    list.push(index);
                }
            });
            applyListActions.setErrorLabelsIndex(list, 'pass');
        } else {
            phoneList.forEach((item, index) => {
                if (!this.checkModifyPhone(item.f_number)) {
                    list.push(index);
                }
            });
            applyListActions.setErrorLabelsIndex(list);
        }
        return list;
        
    }
    //重置错误label
    cancelError = () => {
        const { applyListActions } = this.props;
        applyListActions.setErrorLabelsIndex([]);
    }
    checkModifyPhone = (phoneNumber) => {
        if (!phoneNumber) {
            return false;
        }
        
        if (
            phoneNumber.length < 10 ||
            phoneNumber.length > 12 ||
            !/^(((\d{3,4})|\d{3,4}-))?\d{7,8}$|(4|8)\d{9}$/.test(phoneNumber)
        ) {
            return false;
        }
        return true;
    }
    //修改
    editModifyPhone = (index, number) => {
        const { applyListActions } = this.props;
        //号码编辑
        applyListActions.editModifyPhone({
            index,
            number,
        })
    }
    //审核号码添加
    addLabel = () => {
        // let list = this.props.applyList.passPhoneList;
        const { applyListActions } = this.props;
        
        // list.push('测试');
        
        applyListActions.addPassPhoneList(['']);
        

    }
    //审核号码删除
    delLabel = (index) => {
        // let list = this.props.applyList.passPhoneList;
        // const { applyListActions } = this.props;
        const { applyListActions } = this.props;
        // list.splice(index, 1);
        // applyListActions.delPassPhoneList(['']);
        applyListActions.delPassPhoneList(index);          
    }
    //审核号码编辑
    editLabel = (index, number) => {
        const { applyListActions } = this.props;
        //号码编辑
        applyListActions.editNewLabel({
            index,
            number,
        })
    }
    
    onDownload = (id, type) => {
        const { applyListActions } = this.props;

        applyListActions.getFiles({
            id,
            fid: type
        });

        this.setState({
            downloadVisible: true
        });
    };

    onCloseDownload = () => {
        this.setState(
            {
                downloadVisible: false
            },
            () => {
                this.props.applyListActions.resetFileList();
            }
        );
    };

    onRemoveApply = id => {
        Modal.confirm({
            title: "确认是否删除该客户申请记录，如果删除，则该客户提交的资料完全删除，并不可找回！",
            onOk: cb => {
                this.props.applyListActions.removeApply(id).then(({
                    errorMsg
                }) => {
                    if (!errorMsg) {
                        cb();
                    }
                });
            }
        });
    };
    viewPhoneChange = (pagination) => {
        let id = this.state.phoneId;
        this.onViewNumber(id, pagination.current, pagination.pageSize); 
    };
    render() {
        const {
            applyData,
            applyPassVisible,
            applyRefuseVisible,
            modifyPhoneVisible,
            applyListPage,
            extra,
            fileList,
            phoneList,
            totalPhoneList,
            errorLabelsIndex,
            passPhoneList,
            currentPassNum,
        } = this.props.applyList;
        const columns = [
            {
                title: "企业名称（ID）",
                dataIndex: "f_corp_name",
                key: "corpName",
                render: (text, record) => (
                    <span>{text}（{record.f_corp_id}）</span>
                )
            },
            {
                title: "代理商名称（ID）",
                dataIndex: "f_agent_name",
                key: "agentName",
                render: (text, record) => (
                    <span>{text}（{record.f_agent_id}）</span>
                )
            },
            {
                title: "申请云呼总机号码个数",
                dataIndex: "f_num",
                key: "applyCount"
            },
            {
                title: "首次申请时间",
                dataIndex: "f_ctime",
                width: "11%",
                key: "applyTime"
            },
            {
                // @todo 需改字段名，意义也改变，不是 f_is_pass 的意思
                title: "审核状态",
                dataIndex: "status",
                key: "applyStatus",
                render: text => {
                    let applyStatusTitle = "";
                    if (text === 1) {
                        applyStatusTitle = "待审核";
                    } else if (text === 2) {
                        applyStatusTitle = "首次通过";
                    } else if (text === 3) {
                        applyStatusTitle = "不通过";
                    } else if (text === 4) {
                        applyStatusTitle = "通过";
                    }

                    // 0 未审核，1 第一步通过， 2 第一步不通过，3第二步通过，4 第二步不通过
                    // if (Number(text) < 3) {
                    //   applyStatusTitle = '待审核';
                    // } else if (text === '4') {
                    //   applyStatusTitle = '不通过';
                    // } else if (text === '3') {
                    //   applyStatusTitle = '通过';
                    // }

                    return (
                        <span
                            style={
                                applyStatusTitle === "不通过"
                                    ? { color: "red" }
                                    : {}
                            }
                        >
                            {applyStatusTitle}
                        </span>
                    );
                },
                filters: [
                    {
                        text: "全部状态",
                        value: 0
                    },
                    {
                        text: "待审核",
                        value: 1
                    },
                    {
                        text: "首次通过",
                        value: 2
                    },
                    {
                        text: "不通过",
                        value: 3
                    },
                    {
                        text: "通过",
                        value: 4
                    }
                ],
                filterMultiple: false
            },
            {
                title: "操作",
                key: "operate",
                width: "17%",
                render: (text, record) => {
                    if (record.expire === 1) {
                        return (
                            <div className="operate">
                                <a className="disable">查看号码</a>
                                <a className="disable">修改</a>
                                <a className="disable">删除</a>
                            </div>
                        );
                    } else if (
                        Number(record.f_is_pass) === 1 ||
                        Number(record.f_is_pass) > 2
                    ) {
                        return (
                            <div className="operate">
                                <a
                                    onClick={e => {
                                        e.preventDefault();
                                        this.onViewNumber(record.f_id);
                                    }}
                                >
                                    查看号码
                                </a>
                                <a
                                    onClick={e => {
                                        e.preventDefault();
                                        this.onModifyPhone(record.f_id);
                                    }}
                                >
                                    修改
                                </a>
                                <a
                                    className="remove"
                                    onClick={e => {
                                        e.preventDefault();
                                        this.onRemoveApply(record.f_id);
                                    }}
                                >
                                    删除
                                </a>
                            </div>
                        );
                    }

                    return (
                        <div className="operate">
                            <span className="disable">查看号码</span>
                            <span className="disable">修改</span>
                            <a
                                className="remove"
                                onClick={e => {
                                    e.preventDefault();
                                    this.onRemoveApply(record.f_id);
                                }}
                            >
                                删除
                            </a>
                        </div>
                    );
                }
            }
        ];

        const tablePagination = {
            total: Number(applyListPage.totalcount),
            current: Number(applyListPage.curr),
            pageSize: Number(applyListPage.per)
        };

        return (
            <div className="switchboard-apply-list">
                <ApplyTableOperation
                    searchCorp={this.state.searchCorp}
                    searchAgent={this.state.searchAgent}
                    onSearchCorpChange={this.onSearchCorpChange}
                    onSearchAgentChange={this.onSearchAgentChange}
                    onSearchKeyUp={this.onSearchKeyUp}
                    onSearch={this.onSearch}
                    onExport={this.onExport} />

                <div className="statistics">
                    <p>
                        总共申请的客户数量：{applyListPage.totalcount}个，
                        申请总机号码数量：{extra.sum_num}个。
                        已经审核通过的客户数量：{extra.corpcount}个。
                    </p>
                </div>

                <Table
                    rowKey={record => record.f_id}
                    rowClassName={record =>
                        classNames({
                            disable: record.expire === 1
                        })}
                    columns={columns}
                    dataSource={applyData}
                    pagination={tablePagination}
                    onChange={this.onTableChange}
                    onExpand={(expanded, record) => {
                        if (record.expire === 0) {
                            if (expanded) {
                                this.setState({
                                    expandedRowKeys: this.state.expandedRowKeys.concat(
                                        [record.f_id]
                                    )
                                });
                            } else {
                                const index = this.state.expandedRowKeys.indexOf(
                                    record.f_id
                                );
                                const copyExpanded = this.state.expandedRowKeys.slice();
                                copyExpanded.splice(index, 1);
                                this.setState({
                                    expandedRowKeys: copyExpanded
                                });
                            }
                        }
                    }}
                    expandedRowKeys={this.state.expandedRowKeys}
                    expandedRowRender={record => {
                        const expandColumns = [
                            {
                                title: "",
                                dataIndex: "title",
                                key: "title"
                            },
                            {
                                title: "资料提交时间/修改时间",
                                dataIndex: "time"
                            },
                            {
                                title: "资料下载",
                                render: (text, mRecord) => {
                                    let download = null;
                                    if (mRecord.time) {
                                        download = (
                                            <a
                                                onClick={e => {
                                                    e.preventDefault();
                                                    this.onDownload(
                                                        record.f_id,
                                                        mRecord.type
                                                    );
                                                }}
                                            >
                                                资料下载
                                            </a>
                                        );
                                    }
                                    return download;
                                }
                            },
                            {
                                title: "审核结果",
                                dataIndex: "result",
                                key: "result",
                                render: text => {
                                    if (text === "不通过") {
                                        return (
                                            <span style={{ color: "red" }}>
                                                {text}
                                            </span>
                                        );
                                    }

                                    return <span>{text}</span>;
                                }
                            },
                            {
                                title: "审核意见",
                                dataIndex: "comment",
                                key: "comment",
                                render: text => (
                                    <span className="comment-content">
                                        {text}
                                    </span>
                                )
                            },
                            {
                                title: "操作",
                                key: "operate",
                                render: (text, mRecord) => {
                                    let operate = null;
                                    if (mRecord.canOperate) {
                                        let passElem = null;
                                        if (mRecord.type === 1) {
                                            if (mRecord.canPass) {
                                                passElem = (
                                                    <a
                                                        onClick={e => {
                                                            e.preventDefault();
                                                            this.onPassApplyOne(
                                                                record.f_id,
                                                                record.f_num
                                                            );
                                                        }}
                                                    >
                                                        通过
                                                    </a>
                                                );
                                            } else {
                                                passElem = (
                                                    <a className="disable">
                                                        通过
                                                    </a>
                                                );
                                            }
                                        } else if (mRecord.type === 2) {
                                            if (mRecord.canPass) {
                                                passElem = (
                                                    <a
                                                        onClick={e => {
                                                            e.preventDefault();
                                                            this.onPassApplyTwo(
                                                                record.f_id
                                                            );
                                                        }}
                                                    >
                                                        通过
                                                    </a>
                                                );
                                            } else {
                                                passElem = (
                                                    <a className="disable">
                                                        通过
                                                    </a>
                                                );
                                            }
                                        }
                                        operate = (
                                            <div className="operate">
                                                {passElem}
                                                {mRecord.canRefuse
                                                    ? <a
                                                          className="refuse"
                                                          onClick={e => {
                                                              e.preventDefault();
                                                              this.onRefuseApply(
                                                                  record.f_id,
                                                                  mRecord.type
                                                              );
                                                          }}
                                                      >
                                                          不通过
                                                      </a>
                                                    : <a className="disable">
                                                          不通过
                                                      </a>}
                                            </div>
                                        );
                                    }
                                    return operate;
                                }
                            }
                        ];

                        return (
                            <Table
                                columns={expandColumns}
                                dataSource={record.submitFiles}
                                pagination={false} />
                        );
                    }} />

                <ApplyPassModal 
                    visible={applyPassVisible}
                    labels={passPhoneList}
                    delLabel={this.delLabel}
                    addLabel={this.addLabel}
                    errorLabelsIndex={errorLabelsIndex}
                    getErrorEditPhone={this.getErrorModifyPhone.bind(this, 'pass')}
                    cancelError={this.cancelError}
                    editModifyPhone={this.editLabel}
                    currentPassNum={currentPassNum} />

                <ApplyRefuseModal visible={applyRefuseVisible} />

                <ModifyPhoneModal 
                    visible={modifyPhoneVisible} 
                    labels={phoneList}
                    errorLabelsIndex={errorLabelsIndex}
                    getErrorModifyPhone={this.getErrorModifyPhone}
                    cancelError={this.cancelError}
                    editModifyPhone={this.editModifyPhone}/>

                <DownloadModal
                    fileList={fileList}
                    visible={this.state.downloadVisible}
                    onCancel={this.onCloseDownload} />

                <ViewPhoneModal
                    phoneList={phoneList}
                    totalPhoneList={totalPhoneList}
                    viewPhoneChange={this.viewPhoneChange}
                    visible={this.state.viewNumberVisible}
                    onCancel={this.onCloseViewNumber} />
            </div>
        );
    }
}

export default ApplyList;
