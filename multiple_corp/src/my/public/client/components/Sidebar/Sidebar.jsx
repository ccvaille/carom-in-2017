import React from 'react';
import { Link, withRouter } from 'react-router';
import {
    Button,
    Modal,
} from 'antd';
import './index.less';


class Sidebar extends React.Component {
    static propTypes = {
        messageActions: React.PropTypes.object.isRequired,
        messageReducers: React.PropTypes.object.isRequired,
        router: React.PropTypes.object.isRequired,
        activeName: React.PropTypes.string.isRequired
    }
    goToNextliModalFoot = () => [
        <div key="goto-nextli">
            <Button onClick={this.noSaveMessageData} className="ant-btn ant-btn-ghost ant-btn-lg">
                    否
                </Button>
            <Button onClick={this.sureSaveData} className="ant-btn ant-btn-primary ant-btn-lg">
                    是
                </Button>
        </div>
    ]
    sureSaveData = () => {
        const { messageActions, messageReducers } = this.props;
        const {
            activeLi,
        } = messageReducers;
        if (!messageReducers.formInfo[activeLi].f_id) {
            //新增
            messageActions.addForm(activeLi, true);
        } else {
            //修改
            messageActions.editForm(activeLi, true);
        }
        messageActions.switchGoToTransform(false);
        messageActions.resetEditFormInfoSave();
    }

    noSaveMessageData = () => {
        const { messageActions } = this.props;
        messageActions.switchGoToTransform(false);
        this.props.router.push('/my/public/transform');
    }
    closeSwitchGoToTransform = () => {
        const { messageActions } = this.props;
        messageActions.switchGoToTransform(false);
    }
    isSaveMessageData = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const { messageActions, messageReducers } = this.props;
        const {
            editFormInfoSave,
            formInfo,
            activeLi,
        } = messageReducers;
        if (
            !editFormInfoSave &&
            formInfo[activeLi] &&
            formInfo[activeLi].f_url
        ) {
            messageActions.switchGoToTransform(true);
        } else {
            this.props.router.push('/my/public/transform');
        }
    }
    render = () => {
        const { activeName, messageReducers } = this.props;
        const { switchGoToTransform } = messageReducers;
        return (
            <div className="sidebar">
                <ul className="icon-panel">
                    <li className={activeName === 'message' ? 'active' : ''}>
                        <Link to="/my/public/message">
                            <span>消息推送</span>
                        </Link>
                    </li>
                    <li className={activeName === 'transform' ? 'active' : ''}>
                        <Link
                            to="/my/public/transform"
                            onClick={this.isSaveMessageData}
                        >
                            <span>转化分析</span>
                        </Link>
                    </li>
                </ul>
                {
                    /*Web调用客户端均为异步调用，PVFunction是window下的一个全局方法*/
                    !window.PVFunction ?
                        <a
                            href="https://my.workec.com/form"
                            className="my-public"
                        >
                            <Button>
                            微表单
                        </Button>
                        </a> : null
                }
                <Modal
                    width="320px"
                    maskClosable={false}
                    title="提示"
                    visible={switchGoToTransform}
                    wrapClassName="vertical-center-modal pv-modal"
                    footer={this.goToNextliModalFoot()}
                    onCancel={this.closeSwitchGoToTransform}
                >
                        是否需要保存当前设置？
                </Modal>
            </div>


        );
    }

}
export default withRouter(Sidebar);
