import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import { Icon, Tabs, Modal } from 'antd';
import * as VisitorDetailsActions from 'actions/visitorDetails';

// import ECBridge from 'utils/ECBridge';
import BasicInfo from './BasicInfo';
import VisitorInfo from './VisitorInfo';

const TabPane = Tabs.TabPane;

class VisitorDetails extends React.Component {
    static propTypes = {
        isShowDetail: PropTypes.bool.isRequired,
        toggleShowDetail: PropTypes.func.isRequired,
        currentGuid: PropTypes.number.isRequired,
        guests: PropTypes.object.isRequired,
        currentCrmInfo: PropTypes.object.isRequired,
        errorKeys: PropTypes.object.isRequired,
        originCrmInfo: PropTypes.object.isRequired,
        toggleDuplicateModal: PropTypes.func.isRequired,
        duplicateModalVisible: PropTypes.bool.isRequired,
        duplicateModalContent: PropTypes.string.isRequired,
        updateInfoActiveTab: PropTypes.func.isRequired,
        userId: PropTypes.number.isRequired,
        duplicateCrmId: PropTypes.number,
        activeInfoTab: PropTypes.string.isRequired,
        currentTxGuid: PropTypes.string.isRequired,
    }

    onTabChange = (key) => {
        this.props.updateInfoActiveTab(key);
        this.props.resetCrmInfoError();
    }

    onToggleDetail = () => {
        const { isShowDetail, toggleShowDetail } = this.props;
        toggleShowDetail(!isShowDetail);
    }

    onViewCrm = () => {
        const { userId, duplicateCrmId } = this.props;
        window.ECBridge.exec({
            command: 504,
            url: `https://my.workec.com/crm/detail?crmid=${duplicateCrmId}`,
            title: '客户资料',
            needLogin: '1', //0:不需要登录态，1：需要登录态，打开PV时直接写cookie pv_key,httponly格式 不要
            width: '1000', //宽度，单位像素
            height: '700', //高度 ，单位像素
            status: '', //状态，max：最大化，不填则为宽高的值，宽高不填，则用默认的宽高 不要
            minButton: '0', //0：需要，1：不需要；如果不传，默认是0
            maxButton: '0', //0：需要，1：不需要；如果不传，默认是0
            titleBar: '0', //0：native的，1：web控制的，如果是1，minButton和maxButton失效，如果不传，默认是0
            resizeAble: '0', //0：可以拖拉变更窗口大小，1：不可以拖拉变更窗口大小，默认0
            callback: (json) => {
                console.log(json);
            },
        });
        // window.location.href = `showec://13-${userId}-${duplicateCrmId}-9-`;
    }

    onCancelDupModal = () => {
        this.props.restoreFieldValue('mobile');
        this.props.restoreFieldValue('email');
        this.props.toggleDuplicateModal({
            visible: false,
            content: '',
        });
    }

    render() {
        const {
            isShowDetail,
            currentGuid,
            guests,
            currentCrmInfo,
            errorKeys,
            originCrmInfo,
            duplicateModalVisible,
            duplicateModalContent,
            activeInfoTab,
            currentTxGuid,
            csName,
            isInfoSaved,
        } = this.props;
        const currentGuest = guests[currentTxGuid];
        const visitorType = currentGuest.visitortype;
        const detailClasses = classNames({
            'visitor-details': true,
            show: isShowDetail,
        });
        return (
            <div className={detailClasses}>
                <div
                    className="toggle-details"
                    onClick={this.onToggleDetail}
                >
                    <Icon type="left" />
                </div>

                <Tabs
                    activeKey={activeInfoTab}
                    onChange={this.onTabChange}
                >
                    <TabPane
                        tab="访客资料"
                        key="0"
                    >
                        <div className="info-detail">
                            <VisitorInfo csName={csName} guid={currentGuid} info={guests[currentTxGuid] || {}} />
                        </div>
                    </TabPane>

                    <TabPane
                        tab="基本资料"
                        key="1"
                    >
                        <div className="info-detail">
                            <BasicInfo
                                txguid={currentTxGuid}
                                guid={currentGuid}
                                visitorType={visitorType}
                                errorKeys={errorKeys}
                                info={currentCrmInfo}
                                originInfo={originCrmInfo}
                                isInfoSaved={isInfoSaved}
                            />
                        </div>
                    </TabPane>
                </Tabs>

                <Modal
                    title="提醒"
                    visible={duplicateModalVisible}
                    width={420}
                    okText="查看"
                    onOk={this.onViewCrm}
                    onCancel={this.onCancelDupModal}
                    maskClosable={false}
                >
                    <p>{`${duplicateModalContent}，点击“查看”查看该客户的资料！`}</p>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = ({ app, chat, visitorDetails }) => ({
    userId: app.userInfo.userid,
    sessions: chat.sessions,
    guests: chat.guests,
    csName: chat.csInfo.name,
    ...visitorDetails,
});

const mapDispatchToProps = (dispatch) => bindActionCreators(VisitorDetailsActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(VisitorDetails);
