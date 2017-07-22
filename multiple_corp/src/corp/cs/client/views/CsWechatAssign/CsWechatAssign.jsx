import React, { PropTypes } from 'react';
import { Table, Icon, Modal } from 'antd';
import modalWarningImg from 'img/modal-warning.png';
import CenterModalFooter from 'components/CenterModalFooter';
import SelectCsModal from './components/SelectCsModal';
import './cs-assign.less';


class CsWechatAssign extends React.Component {
    static propTypes = {
        toggleSelectCsModal: PropTypes.func.isRequired,
        csWechatAssign: PropTypes.object.isRequired,
        getCsListData: PropTypes.func.isRequired,
        getSelectedCsList: PropTypes.func.isRequired,
        updateDelWXCsId: PropTypes.func.isRequired,
        delWeiChatCs: PropTypes.func.isRequired,
        toggleDelWXCsModal: PropTypes.func.isRequired,
        initWXSetting: PropTypes.func.isRequired,
        onGoWXSettingPage: PropTypes.func.isRequired,
    };

    state = {
        delCsModalVisibile: false,
    }

    componentDidMount() {
        const { getSelectedCsList, initWXSetting } = this.props;
        initWXSetting();
        getSelectedCsList();
    }

    onSelectCs = () => {
        const { toggleSelectCsModal, getCsListData } = this.props;
        toggleSelectCsModal(true);
        getCsListData();
    }

    /**
    * 删除已选择的客服
    */
    delWeiChatCs = () => {
        this.props.delWeiChatCs();
    }

    hideDelCsModal = () => {
        this.props.toggleDelWXCsModal(false);
    }

    showDelCsModal = (csId) => {
        const { updateDelWXCsId, toggleDelWXCsModal } = this.props;

        updateDelWXCsId(csId);
        toggleDelWXCsModal(true);
    }

    render() {
        const columns = [{
            title: '姓名',
            dataIndex: 'name',
            width: '25%',
        }, {
            title: '账号',
            dataIndex: 'account',
            width: '25%',
        }, {
            title: '操作',
            width: '25%',
            render: record => (
                <div>
                    <span
                        role="button"
                        tabIndex="-2"
                        className="icon icon-delete"
                        onClick={() => this.showDelCsModal(record.csid)}
                    />
                </div>
            ),
        }];

        const {
            cswechatList,
            isSetWXCs,
            isWXOpen,
            delWXCsMoadlVisible
        } = this.props.csWechatAssign;

        return (
            <div className="cs-assignment">
                {
                    isSetWXCs && isWXOpen ? (
                        <div>
                            <div
                                role="button"
                                tabIndex="-1"
                                className="add-operate head"
                                style={{ marginBottom: 15 }}
                                onClick={this.onSelectCs}
                            >
                                <span className="setting-icon add-icon" />
                                <span>选择客服</span>
                            </div>
                            <Table
                                className="corp-cs-table permission-table-list"
                                rowKey={(record, index) => index}
                                columns={columns}
                                dataSource={cswechatList}
                                pagination={false}
                                locale={{
                                    emptyText: (<span><Icon type="smile-o" />请选择客服</span>),
                                }}
                            />
                            <div className="prompt">温馨提示：所选择的客服将接待微信访客的咨询</div>

                        </div>
                        ) : (
                            <div className="not-allowed-wrapper">
                                <span className="not-allowed wechat" />
                                {
                                    !isSetWXCs ? (
                                        <span className="text">
                                            你还没有授权公众号，请前往
                                            <a href="/public/index" style={{ padding: '0 5px' }}>授权管理</a>
                                            中授权
                                        </span>
                                    ) : (
                                        <span className="text">
                                            你还没有开启微信客服，请前往
                                            <a
                                                href="/kf/index/float?type=wechat"
                                                style={{ padding: '0 5px' }}
                                                onClick={this.props.onGoWXSettingPage}
                                            >
                                                接入设置
                                            </a>
                                            中开启
                                        </span>
                                    )
                                }
                            </div>
                        )
                }

                <SelectCsModal />

                <Modal
                    className="warning-modal"
                    title="删除提醒"
                    visible={delWXCsMoadlVisible}
                    width={440}
                    onCancel={this.hideDelCsModal}
                    maskClosable={false}
                    footer={(
                        <CenterModalFooter
                            onOk={this.delWeiChatCs}
                            onCancel={this.hideDelCsModal}
                        />
                    )}
                >
                    <div className="clearfix">
                        <img className="modal-warning-icon" src={modalWarningImg} alt="" />
                        <div className="warning-content">
                            <h4>确定删除客服吗？</h4>
                            <p>删除后客服将不能接待微信访客。</p>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default CsWechatAssign;
