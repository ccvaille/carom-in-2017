import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import { Input, Icon, Modal } from 'antd';
import { serializeObject } from '~comm/utils';
import {
    getServices as getServicesAction,
    updateParams as updateParamsAction,
} from 'actions/customerServices';
import {
    toggleSwitchCsShow as toggleSwitchCsShowAction,
    updateSwitchCsError as updateSwitchCsErrorAction,
    closeSession as closeSessionAction,
    setGuestInfo as setGuestInfoAction
} from 'actions/chat';
import {
    selectSession as selectSessionAction,
} from 'actions/chatSessionList';
// import { switchCs as switchCsAction } from 'actions/chatEcim';
import {
    sendSwitchMsg as sendSwitchMsgAction,
    sendLastMsg as sendLastMsgAction
} from 'actions/chatInput';

import { TIP_MSG } from 'constants/MsgTypes';
// import { LOCAL } from 'constants/ChatCustomCmds';
import ModalFooter from '~comm/components/ModalFooter';
import selectedIcon from 'images/selected-icon.png';

class SwitchCs extends React.Component {
    static propTypes = {
        getServices: PropTypes.func.isRequired,
        services: PropTypes.array.isRequired,
        updateParams: PropTypes.func.isRequired,
        isShowSwitchCs: PropTypes.bool.isRequired,
        toggleSwitchCsShow: PropTypes.func.isRequired,
        searchKeyword: PropTypes.string.isRequired,
        switchCs: PropTypes.func.isRequired,
        csid: PropTypes.number.isRequired,
        updateSwitchCsError: PropTypes.func.isRequired,
        switchCsError: PropTypes.string.isRequired,
        sendSwitchMsg: PropTypes.func.isRequired,
        sendLastMsg: PropTypes.func.isRequired,
        setGuestInfo: PropTypes.func.isRequired,
        guid: PropTypes.number.isRequired,
        msgs: PropTypes.object.isRequired,
        txguid: PropTypes.string.isRequired,
    }

    state = {
        selectedService: {
            id: 0,
            name: '',
            showname: '',
        },
        note: '',
    }

    componentDidMount() {
        // this.props.getServices();
    }

    componentWillReceiveProps(nextProps) {
        const { getServices, updateParams, updateSwitchCsError } = this.props;
        if (nextProps.isShowSwitchCs !== this.props.isShowSwitchCs) {
            if (nextProps.isShowSwitchCs) {
                getServices();
            } else {
                this.setState({
                    selectedService: {
                        id: 0,
                        name: '',
                        showname: '',
                    },
                    note: '',
                });
                updateParams({
                    search: '',
                });
                updateSwitchCsError('');
            }
        }
    }

    onSearch = (e) => {
        const { updateParams, getServices } = this.props;
        const value = e.target.value;

        updateParams({
            search: value,
        });

        getServices();
    }

    onSelectService = (service) => {
        this.setState({
            selectedService: service,
        });
    }

    onNoteChange = (e) => {
        this.setState({
            note: e.target.value,
        });
    }

    onSwitchCs = () => {
        const { selectedService } = this.state;
        const {
            switchCs,
            updateSwitchCsError,
        } = this.props;
        if (!selectedService.id) {
            updateSwitchCsError('请选择被转接客服');
        } else {
            this.onSwitchDone();
        }
    }

    onCloseSwitchCs = () => {
        this.props.toggleSwitchCsShow(false);
    }

    onSwitchDone = () => {
        const { selectedService, note } = this.state;
        const {
            toggleSwitchCsShow,
            updateSwitchCsError,
            sendSwitchMsg,
            sendLastMsg,
            guid,
            msgs,
            txguid,
            csInfo,
            sessions,
            closeSession,
            selectSession,
            setGuestInfo,
        } = this.props;
        // if (msg.ErrorCode === 0) {

        toggleSwitchCsShow(false);

        const guidMsgs = msgs[txguid] || [];
        let lastMsgs = [];

        if (guidMsgs.length) {
            lastMsgs = guidMsgs.filter((message) => message.type !== TIP_MSG)
                               .slice(-5);
        }

        this.setState({
            selectedService: {
                id: 0,
                name: '',
                showname: '',
            },
            note: '',
        });
        // const vExt = {
        //     cmd: 10,
        //     csid: selectedService.id,
        //     csInfo: JSON.stringify({
        //         showname: selectedService.name,
        //         face: selectedService.face,
        //     }),
        // };
        // const vDesc = `访客已经转给${selectedService.name}`;

        // const cExt = {
        //     cmd: 11,
        //     guid: txguid,
        //     lastMsgs: JSON.stringify(lastMsgs),
        //     csInfo: JSON.stringify(csInfo),
        // };
        // let cDesc = `${csInfo.name}客服转接`;

        // if (note) {
        //     cDesc += `，备注内容：${note}`;
        // }

        // 发送给访客
        sendLastMsg({
            ToAccount: selectedService.id,
        });
        sendSwitchMsg({
            ToAccount: selectedService.id,
            ToName: selectedService.name,
            ShowName: selectedService.showname,
            Remark: note,
        });
        setGuestInfo(txguid, {
            csname: selectedService.name,
        });
        // 发送给客服 command 11
        // sendSwitchMsg({
        //     targetId: selectedService.id,
        //     txTargetId: selectedService.id,
        //     data: LOCAL,
        //     desc: cDesc,
        //     ext: serializeObject(cExt),
        // });

        closeSession(txguid);
        // const nextSess = sessions[0] || { guid: '' }; // 跳转到第一个访客
        // selectSession(nextSess.guid);

        // }
    }

    render() {
        const { csid, services, searchKeyword, isShowSwitchCs, switchCsError } = this.props;
        const { selectedService } = this.state;
        // todo :: 当前访客是微信访客时过滤非微信客服
        const servicesExcludeMe = (services && services.filter((service) => service.id !== csid)) || [];
        let serviceNodes = null;

        if (services.length) {
            serviceNodes = servicesExcludeMe.map((service, index) => {
                let activeIconNode = null;
                const liClasses = classNames({
                    clearfix: true,
                    active: service.id === selectedService.id,
                });

                if (service.id === selectedService.id) {
                    activeIconNode = (
                        <img className="active-icon" src={selectedIcon} alt="" />
                    );
                }

                return (
                    <li
                        key={index}
                        className={liClasses}
                        onClick={() => this.onSelectService(service)}
                    >
                        <img className="avatar" src={service.face} alt="头像" />
                        <span className="service-name">{service.name}</span>
                        {activeIconNode}
                    </li>
                );
            });
        } else {
            if (searchKeyword) {
                serviceNodes = (
                    <li>暂无搜索结果</li>
                );
            } else {
                serviceNodes = (
                    <li style={{ textAlign: 'center' }}>
                        <Icon type="loading" />
                    </li>
                );
            }
        }

        const avatarClasses = classNames({
            avatar: true,
            show: this.state.selectedService.face,
        });

        return (
            <Modal
                title="选择客服"
                visible={isShowSwitchCs}
                width={460}
                className="switch-cs-modal"
                wrapClassName="vertical-center-modal"
                maskClosable={false}
                footer={
                    <ModalFooter
                        onOk={this.onSwitchCs}
                        onCancel={() => this.onCloseSwitchCs()}
                        errorText={switchCsError}
                    />
                }
                onOk={this.onSwitchCs}
                onCancel={() => this.onCloseSwitchCs()}
            >
                <div className="switch-cs clearfix">
                    <div className="left-box">
                        <div className="search">
                            <span className="search-icon">
                                <Icon type="search" />
                            </span>
                            <Input
                                type="text"
                                className="search-btn"
                                placeholder="请输入客服名称"
                                prefix={<Icon type="search" />}
                                onChange={this.onSearch}
                            />
                        </div>
                        <ul className="service-list-box">
                            {serviceNodes}
                        </ul>
                    </div>

                    <div className="right-box">
                        <div className="choice">
                            <span>已选择：</span>
                            <img src={selectedService.face} alt="" className={avatarClasses} />
                            <span className="name">{selectedService.name}</span>
                        </div>
                        <Input
                            className="remark"
                            type="textarea"
                            rows={5}
                            maxLength={200}
                            placeholder="请输入备注信息..."
                            value={this.state.note}
                            onChange={this.onNoteChange}
                        />
                    </div>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = ({ customerServices, chat }) => ({
    services: customerServices.services,
    searchKeyword: customerServices.params.search,
    isShowSwitchCs: chat.isShowSwitchCs,
    switchCsError: chat.switchCsError,
    guid: chat.guid,
    txguid: chat.txguid,
    msgs: chat.msgs,
    csInfo: chat.csInfo,
    sessions: chat.sessions,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    getServices: getServicesAction,
    updateParams: updateParamsAction,
    toggleSwitchCsShow: toggleSwitchCsShowAction,
    // switchCs: switchCsAction,
    updateSwitchCsError: updateSwitchCsErrorAction,
    sendSwitchMsg: sendSwitchMsgAction,
    sendLastMsg: sendLastMsgAction,
    closeSession: closeSessionAction,
    selectSession: selectSessionAction,
    setGuestInfo: setGuestInfoAction,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SwitchCs);
