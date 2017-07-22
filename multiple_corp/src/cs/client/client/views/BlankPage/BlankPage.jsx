import React, { PropTypes } from 'react';
import { Modal } from 'antd';
import {
    OFFLINE_TYPE,
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
import ecFailImg from 'images/ec-fail.png';
import './blank-page.less';

class BlankPage extends React.Component {
    static propTypes = {
        updateAppMenus: PropTypes.func.isRequired,
        updateUserInfo: PropTypes.func.isRequired,
        excludeWechatSessions: PropTypes.func.isRequired,
    }

    componentDidMount() {
        // 离线通知
        window.ECBridge.registerPVCall(532, (command, json) => {
            const { data } = json;
            if (data) {
                if (data.status === 1) {
                    window.location.href = 'https://html.workec.com/kf/client/';
                }
            }
        });

        // 权限变更通知
        window.ECBridge.registerPVCall(536, (command, json = { data: {} }) => {
            const {
                updateAppMenus,
                updateUserInfo,
                excludeWechatSessions,
            } = this.props;
            const { data } = json;
            switch (data.type) {
                case COMMON_CS_TYPE: {
                    if (data.switch === PERMISSION_TURN_OFF) {
                        updateAppMenus(REMOVE_CS_PERMISSION);
                        updateUserInfo({
                            iscs: 0,
                        });
                    } else if (data.switch === PERMISSION_TURN_ON) {
                        updateAppMenus(ADD_CS_PERMISSION);
                        updateUserInfo({
                            iscs: 1,
                        });
                    }
                    break;
                }
                case CS_MANAGER_TYPE: {
                    if (data.switch === PERMISSION_TURN_OFF) {
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
    render() {
        // const { offlineType } = this.props;
        const offlineType = localStorage.getItem('offlineType') || OFFLINE_TYPE.EC_OFFLINE;
        let offlineContent = null;
        switch (offlineType) {
            case OFFLINE_TYPE.TIM_KICKED:
                offlineContent = (
                    <p>在线客服已在其它地方登录</p>
                );
                break;
            case OFFLINE_TYPE.EC_OFFLINE:
                offlineContent = (
                    <p>在线客服已经离线</p>
                );
                break;
            default:
                break;
        }

        return (
            <div className="cs-blank-page">
                <Modal
                    className="offline-prompt"
                    wrapClassName="vertical-center-modal"
                    visible
                    maskClosable={false}
                    width={340}
                    footer={null}
                >
                    <img src={ecFailImg} alt="" />
                    {offlineContent}
                </Modal>
            </div>
        );
    }
}

export default BlankPage;
