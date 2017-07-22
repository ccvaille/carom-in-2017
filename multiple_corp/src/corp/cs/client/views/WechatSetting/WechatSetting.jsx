import React, { PropTypes } from 'react';
import { Modal, Radio } from 'antd';
import CenterModalFooter from 'components/CenterModalFooter';
import modalWarningImg from 'img/modal-warning.png';
import ApiUrls from 'constants/ApiUrls';
import classNames from 'classnames';

const RadioGroup = Radio.Group;

class WechatSetting extends React.Component {
    static propTypes = {
        wechatSetting: PropTypes.object.isRequired,
        openWXCs: PropTypes.func.isRequired,
        closeWXCs: PropTypes.func.isRequired,
        toggleOpenWXCsModal: PropTypes.func.isRequired,
        toggleCloseWXCsModal: PropTypes.func.isRequired,
        // toggleWXCsStatus: PropTypes.func.isRequired,
        goWXAssign: PropTypes.func.isRequired,
        getWechatSetting: PropTypes.func.isRequired,
        onGoSetWXCsPage: PropTypes.func.isRequired,
    }

    componentDidMount() {
        this.props.getWechatSetting();
    }

    // 开启微信客服
    isOpenWXCs = () => {
        // this.props.onGoSetWXCsPage();

        this.props.goWXAssign(this.props.onGoSetWXCsPage);
    }

    // 选择客服分配，直接跳转微信客服分配页面
    goWXAssignImmediately = () => {
        this.props.onGoSetWXCsPage();
    }

    isOpenWXCsCancel = () => {
        this.props.toggleOpenWXCsModal(false);
    }

    isCloseWX = () => {
        this.props.closeWXCs(0);
    }

    isCloseWXCancel = () => {
        this.props.toggleCloseWXCsModal(false);
    }

    updateOAStatus = (e) => {
        const value = e.target.value * 1;
        const { isHadCustomerService } = this.props.wechatSetting;
        const {
            toggleOpenWXCsModal,
            toggleCloseWXCsModal,
            openWXCs,
        } = this.props;
        // 开启
        if (value === 1) {
            // 判断是否制定了接待人, 如果已经接入，直接开启
            if (isHadCustomerService) {
                openWXCs(e.target.value);
            } else {
                // 显示提示modal
                toggleOpenWXCsModal(true);
            }
        } else {
            toggleCloseWXCsModal(true);
        }
    }

    render() {
        const {
            officialAccount,
            openWXCsModalVisible,
            closeWXCsModalVisible,
            isOpen,
            isOpenCsLoading,
            isCloseCsLoading
        } = this.props.wechatSetting;

        const closeWXCsModalOKName = classNames({
            'ant-btn-loading': isCloseCsLoading,
        });

        const openWXCsModalOKName = classNames({
            'ant-btn-loading': isOpenCsLoading,
        });
        // console.log(this.props, 'props')

        const { authid } = officialAccount;

        const unbindWxOAHtml = (
            <div className="wechat-item">
                <span className="wechat-logo icon icon-weixin" />
                <div className="title-wrapper">
                    <span className="text c-bold">绑定微信公众号</span>
                    <p className="subtitle">
                        你还没有授权公众号，请前往
                        <a
                            style={{ paddingLeft: 5, paddingRight: 5 }}
                            href={ApiUrls.goWXAuthorize}
                        >
                            授权管理
                        </a>
                        中授权
                    </p>
                </div>
            </div>
        );

        const hasWXOAHtml = (
            <div>
                <div className="wechat-item" style={{ paddingTop: 0 }}>
                    <h2 className="title c-bold">接入的公众号</h2>
                    <img className="wechat-logo" src={officialAccount.wxlogo} alt="" />
                    <div className="title-wrapper" style={{ verticalAlign: 'middle' }}>
                        <span className="text">{officialAccount.wxname}</span>
                        <div className="oa-status-wrapper" >
                            <span
                                style={{ paddingLeft: 90, paddingRight: 46, color: '#d9d9d9' }}
                            >
                                ------------------------
                            </span>
                            <RadioGroup onChange={this.updateOAStatus} value={isOpen}>
                                <Radio value={1}>开启</Radio>
                                <Radio value={0}>关闭</Radio>
                            </RadioGroup>
                        </div>
                    </div>
                </div>

                <div className="wechat-item">
                    <div className="item-content">
                        <p className="border-t" style={{ paddingTop: 10 }}>
                            <span className="c-bold" style={{ paddingRight: 15 }}>温馨提示：</span>
                            <p>
                                1. 如果需要更改或者解绑公众号，请前往
                                <a
                                    href={ApiUrls.goWXAuthorize}
                                    style={{ paddingLeft: 5, paddingRight: 5 }}
                                >
                                    授权管理
                                </a>
                                中解绑。
                            </p>
                            <p style={{ marginTop: 5 }}>
                                2. 如果您没有收到来自微信公众号粉丝的消息，请前往
                                <span
                                    className="link"
                                    role="button"
                                    onClick={this.goWXAssignImmediately}
                                    style={{ paddingLeft: 5, paddingRight: 5 }}
                                    tabIndex="0"
                                >
                                    微信客服分配
                                </span>
                                中配置客服接待。
                            </p>
                        </p>
                    </div>
                </div>
            </div>
        );

        // console.log(this.props, 'props', authid, 'authid', authid === '')
        return (
            <div className="cs-wechat-setting">
                {
                    !authid ? unbindWxOAHtml : hasWXOAHtml
                }

                <Modal
                    title="温馨提示"
                    visible={openWXCsModalVisible}
                    onCancel={this.isOpenWXCsCancel}
                    maskClosable={false}
                    width="400"
                    footer={(
                        <CenterModalFooter
                            okClassName={openWXCsModalOKName}
                            onOk={this.isOpenWXCs}
                            onCancel={this.isOpenWXCsCancel}
                        />
                    )}
                >
                    <div className="clearfix">
                        <img className="modal-warning-icon" src={modalWarningImg} alt="" />
                        <div className="warning-content" style={{ paddingLeft: 55, marginTop: 10 }}>
                            <p >您还没有设置微信客服，是否前去设置。</p>
                        </div>
                    </div>
                </Modal>

                <Modal
                    title="温馨提示"
                    width="440"
                    visible={closeWXCsModalVisible}
                    onCancel={this.isCloseWXCancel}
                    maskClosable={false}
                    footer={(
                        <CenterModalFooter
                            onOk={this.isCloseWX}
                            okClassName={closeWXCsModalOKName}
                            onCancel={this.isCloseWXCancel}
                        />
                    )}
                >
                    <div className="clearfix">
                        <img className="modal-warning-icon" src={modalWarningImg} alt="" />
                        <div className="warning-content" style={{ paddingLeft: 55 }}>
                            <h4 style={{ fontWeight: 'bold' }} >确定关闭微信客服吗？</h4>
                            <p style={{ marginTop: 10 }}>关闭微信客服后，将不能接收公众号消息。</p>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default WechatSetting;
