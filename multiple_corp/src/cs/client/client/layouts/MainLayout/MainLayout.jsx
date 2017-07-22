import React, { PropTypes } from 'react';
import { withRouter } from 'react-router';
import { Modal, Icon } from 'antd';
import {
    OFFLINE_TYPE,
    CLICK_FLOAT_NATIVE_TYPE,
    ADD_CS_PERMISSION,
    ADD_CS_MANAGER_PERMISSION,
    REMOVE_CS_PERMISSION,
    REMOVE_CS_MANAGER_PERMISSION,
    COMMON_CS_TYPE,
    CS_MANAGER_TYPE,
    WECHAT_CS_TYPE,
    PERMISSION_TURN_OFF,
    PERMISSION_TURN_ON,
} from 'constants/shared';
import Headers from 'components/Headers';

class MainLayout extends React.Component {
    static propTypes = {
        router: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        guests: PropTypes.object.isRequired,
        getGuestDetail: PropTypes.func.isRequired,
        getCrmInfo: PropTypes.func.isRequired,
        handleCrmSaveSuccess: PropTypes.func.isRequired,
        txImLogin: PropTypes.func.isRequired,
        txImLogout: PropTypes.func.isRequired,
        goChatting: PropTypes.func.isRequired,
        handleOfflineMessageRedirect: PropTypes.func.isRequired,
        updateAppMenus: PropTypes.func.isRequired,
        updateUserInfo: PropTypes.func.isRequired,
        excludeWechatSessions: PropTypes.func.isRequired,
        csLogout: PropTypes.func.isRequired,
        showSessTip: PropTypes.func.isRequired,
        updateActiveMenu: PropTypes.func.isRequired,
        children: PropTypes.element.isRequired,
        app: PropTypes.object.isRequired,
        haveUnread: PropTypes.bool.isRequired,
        setAlreadyRead: PropTypes.func.isRequired,
    }

    componentDidMount() {
        window.addEventListener('dragover', this.dropPreventFn, false);
        window.addEventListener('drop', this.dropPreventFn, false);

        // 接待记录内备注成功，pv 回调
        window.ECBridge.registerPVCall(529, (command, json) => {
            const { guests, getGuestDetail, getCrmInfo, handleCrmSaveSuccess } = this.props;
            const guid = json.data && json.data.guid;
            // !!重要!! 暂时没有标记类型，需尝试所有可能的前缀，如有添加新访客类型，这里也要添加
            const cGuest = guests[`guest_${guid}`] || guests[`wx_${guid}`];
            if (cGuest) {
                getGuestDetail(guid, cGuest.visitortype);
                getCrmInfo(guid, cGuest.visitortype);
            }
            handleCrmSaveSuccess(json);
        });

        // 离线通知
        window.ECBridge.registerPVCall(532, (command, json) => {
            const {
                router,
                txImLogout,
                app,
            } = this.props;
            const { data } = json;
            if (data) {
                if (data.status === 0) {
                    if (app.userInfo.iscs === 1) {
                        txImLogout(OFFLINE_TYPE.EC_OFFLINE);
                        localStorage.setItem('offlineType', OFFLINE_TYPE.EC_OFFLINE);
                        router.replace('/kf/client/blank');
                    }
                }
            }
        });

        // 点击小弹窗回调
        window.ECBridge.registerPVCall(533, (command, json) => {
            const { goChatting, handleOfflineMessageRedirect } = this.props;
            const { data } = json;
            const { type, data: jsonData } = data;
            switch (type) {
                case CLICK_FLOAT_NATIVE_TYPE.NEW_SESSION_CLICKED:
                case CLICK_FLOAT_NATIVE_TYPE.NEW_MSG_CLICKED: {
                    const { guinfo, fromId, type: chatType } = jsonData.data;
                    goChatting(guinfo.guid, fromId, chatType);
                    break;
                }
                case CLICK_FLOAT_NATIVE_TYPE.LEAVE_MSG_CLICKED: {
                    const { dateType } = jsonData.data;
                    handleOfflineMessageRedirect({
                        dateType,
                    });
                    break;
                }
                default:
                    break;
            }
        });

        // 权限变更通知
        window.ECBridge.registerPVCall(536, (command, json = { data: {} }) => {
            const {
                updateAppMenus,
                updateUserInfo,
                excludeWechatSessions,
                location,
                router,
                app,
                csLogout,
                txImLogin,
            } = this.props;
            const { data } = json;
            const cPath = location.pathname;
            switch (data.type) {
                case COMMON_CS_TYPE: {
                    if (data.switch === PERMISSION_TURN_OFF) {
                        if (cPath.indexOf('chat') > -1 && app.userInfo.ismanager === 1) {
                            router.replace('/kf/client/dashboard');
                        }
                        if (app.userInfo.iscs === 1 && !app.offlineModalVisible) {
                            csLogout();
                        }
                        updateAppMenus(REMOVE_CS_PERMISSION);
                        updateUserInfo({
                            iscs: 0,
                        });
                    } else if (data.switch === PERMISSION_TURN_ON) {
                        updateAppMenus(ADD_CS_PERMISSION);
                        updateUserInfo({
                            iscs: 1,
                        });

                        // 如果没有离线或被踢，开启权限后登录
                        if (!app.offlineModalVisible) {
                            txImLogin();
                        }
                    }
                    break;
                }
                case CS_MANAGER_TYPE: {
                    if (data.switch === PERMISSION_TURN_OFF) {
                        if (
                            (cPath.indexOf('dashboard') > -1 || cPath.indexOf('statistics') > -1)
                            && app.userInfo.iscs === 1
                        ) {
                            router.replace('/kf/client/chat');
                        }
                        updateAppMenus(REMOVE_CS_MANAGER_PERMISSION);
                        updateUserInfo({
                            ismanager: 0,
                        });
                    } else if (data.switch === PERMISSION_TURN_ON) {
                        updateAppMenus(ADD_CS_MANAGER_PERMISSION);
                        updateUserInfo({
                            ismanager: 1,
                        });
                    }
                    break;
                }
                case WECHAT_CS_TYPE: {
                    if (data.switch === PERMISSION_TURN_OFF) {
                        updateUserInfo({
                            iswxcs: 0,
                        });
                        excludeWechatSessions();
                    } else if (data.switch === PERMISSION_TURN_ON) {
                        updateUserInfo({
                            iswxcs: 1,
                        });
                    }
                    break;
                }
                default:
                    break;
            }
        });
    }

    componentWillUnmount() {
        window.removeEventListener('dragover', this.dropPreventFn);
        window.removeEventListener('drop', this.dropPreventFn);
    }

    dropPreventFn = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files || e.target.files;
        const { location, showSessTip } = this.props;

        if (files.length || files.length) {
            const mimeType = files[0].type;

            if (location.pathname === '/kf/client/chat') {
                if (mimeType.indexOf('image') === -1) {
                    showSessTip('暂不支持收发文件');
                } else {
                    showSessTip('暂不支持图片拖拽发送');
                }
            }
        }
    };
    // componentDidMount() {
    //     const { app, init, location, router } = this.props;
    //     const pathname = location.pathname;
    //     init().then(({ errorCode, errorMsg, jsonResult }) => {
    //         if (!errorMsg) {
    //             const { data = {} } = jsonResult;
    //             const { ismanager, iscs } = data;
    //             if (
    //                 iscs === 1 &&
    //                 ismanager === 0 &&
    //                 (pathname.indexOf('dashboard') > -1 || pathname.indexOf('statistics') > -1)
    //             ) {
    //                 router.replace('/kf/client/chat');
    //             }

    //             if (
    //                 iscs === 0 &&
    //                 ismanager === 1 &&
    //                 (pathname.indexOf('chat'))
    //             ) {
    //                 router.replace('/kf/client/dashboard');
    //             }
    //         } else {
    //             if (errorCode === 401) {
    //                 window.location.href = 'https://www.workec.com/login';
    //             } else {
    //                 displayError(errorMsg);
    //             }
    //         }

    //         this.setState({
    //             isLogined: true,
    //         });
    //     });
    // }

    render() {
        const {
            children,
            app,
            haveUnread,
            setAlreadyRead,
            updateActiveMenu,
            location,
        } = this.props;
        let offlineContent = null;
        switch (app.offlineType) {
            case OFFLINE_TYPE.TIM_KICKED:
                offlineContent = (
                    <p><Icon type="exclamation-circle" /> 在线客服已在其他地方登录。</p>
                );
                break;
            case OFFLINE_TYPE.EC_OFFLINE:
                offlineContent = (
                    <p><Icon type="exclamation-circle" /> 在线客服已经离线。</p>
                );
                break;
            default:
                break;
        }

        return (
            <div className="cs-client">
                <Headers
                    menus={app.menus}
                    haveUnread={haveUnread}
                    setAlreadyRead={setAlreadyRead}
                    updateActiveMenu={updateActiveMenu}
                    activeRoute={location.pathname}
                    activeMenu={app.activeMenu}
                />
                <div className="main-content">
                    {
                        app.initialized
                        ?
                        children
                        : null
                    }
                </div>

                <Modal
                    title="系统提醒"
                    className="offline-prompt"
                    wrapClassName="vertical-center-modal"
                    visible={app.offlineModalVisible}
                    maskClosable={false}
                    width={360}
                    footer={null}
                >
                    {offlineContent}
                </Modal>
            </div>
        );
    }
}

export default withRouter(MainLayout);
