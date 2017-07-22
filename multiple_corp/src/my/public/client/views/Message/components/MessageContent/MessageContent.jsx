import React from 'react';
import { withRouter } from 'react-router';
import classNames from 'classnames';
import {
    Popover,
    Button,
    Modal,

} from 'antd';
import { addClass, removeClass } from '~comm/utils/index.js';
import './index.less';


import Tabpush from '../Tabpush';
import Uploadform from '../Uploadform';
import Fullcarousel from '../Fullcarousel';
import Tinycarousel from '../Tinycarousel';

const showRedBorder = () => {
    const target = document.querySelector('#selct-form');
    addClass(target, 'red-border');

    window.showRedBorder = setTimeout(() => {
        removeClass(target, 'red-border');
        clearTimeout(window.showRedBorder);
        window.showRedBorder = null;
    }, 3000);
};
const showDevlop = (index) => {
    const target = document.querySelector('.develop');
    const clear = () => {
        removeClass(target, 'show');
        clearTimeout(window.showDevlopTimer);
        window.showDevlopTimer = null;
    };
    clear();
    if (index === 1) {
        target.style.left = '70px';
        target.innerHTML = '请先保存第一条推送';
    } else if (index === 2) {
        target.innerHTML = '请先保存第二条推送';
        target.style.left = '175px';
    }
    addClass(target, 'show');
    window.showDevlopTimer = setTimeout(() => {
        clear();
    }, 3000);
};

class MessageContent extends React.Component {

    static propTypes = {
        messageActions: React.PropTypes.object.isRequired,
        messageReducers: React.PropTypes.object.isRequired,
    }
    /**
     * 更新推送设置与增加推送设置
     */
    // addForm = () => {
    //     active
    // }
    componentDidMount = () => {
        // if (window.PVFunction) {
        //     // window.onbeforeunload = () => {
        //     //     if (!this.beforeunloadCb()) {
        //     //         return true;
        //     //     }
        //     // }
        //     // ECBridge.exec({
        //     //     command:534,
        //     //     "type": "1",//1：新增客户页面，其他type未定
        //     //     callback: (json) =>  {
        //     //         // if (!this.beforeunloadCb()) {
        //     //         //     return true;
        //     //         // }
        //     //     }
        //     // });

        // } else {
        //     // window.onbeforeunload = () => {

        //     //     if (!this.beforeunloadCb()) {
        //     //         return false;
        //     //     }
        //     // }
        // }
    }
    beforeunloadCb = () => {
        const { messageReducers } = this.props;
        const {
            editFormInfoSave
        } = messageReducers;
        if (!editFormInfoSave) {
            return false;
        }
        return true;
    }
    addOrEditForm = (e, index, isAutoSave) => {
        e.preventDefault();
        const { messageActions, messageReducers } = this.props;
        if (!messageReducers.formInfo[index] ||
            (messageReducers.formInfo[index] && !messageReducers.formInfo[index].f_url)
        ) {
            showRedBorder();
            return true;
        }
        if (!messageReducers.formInfo[index].f_id) {
            //新增
            messageActions.addForm(index, isAutoSave);
        } else {
            //修改
            messageActions.editForm(index, isAutoSave);
        }
        return false;
    }
    addOrEditFormToNext = (e, index) => {
        e.preventDefault();
        const { messageActions } = this.props;

        if (this.addOrEditForm(e, index)) { return; }
        messageActions.setTabpushLi(index + 1);
        // this.isImageLoading(index + 1);
    }
    //未绑定公众号绑定公众号
    bindPublic = () => {
        const { messageActions } = this.props;
        // var str = 'uid=' + Cookie.load('uid') + '&key=' + Cookie.load('key');
        // window.open('https://corp.workec.com/public/index?' + str);
        messageActions.switchModalVisible({
            modal: ['isAuthVisible', 'hasAuthVisible'],
            visible: [false, false]
        });
    }
    //非管理员
    showIsAuthVisible = () => {
        const { messageActions, messageReducers } = this.props;
        if (messageReducers.isAuth && messageReducers.isVerify) {
            messageActions.switchModalVisible({
                modal: ['isAuthVisible', 'hasAuthVisible'],
                visible: [false, true]
            });
        } else {
            messageActions.switchModalVisible({
                modal: ['isAuthVisible', 'hasAuthVisible'],
                visible: [false, true]
            });
        }
    }
    //第一次进入公众号助手,
    cancelFirstLoginPublic = () => {
        const { messageActions } = this.props;
        messageActions.switchModalVisible({
            modal: 'isFirstVisible',
            visible: true
        });
        messageActions.cancelRemind();
    }
    NoManagerModal = () => [
        <div className="foot" key="no-manage">
            <Button onClick={this.showIsAuthVisible}>
                    确定
                </Button>
        </div>
    ]
    FirstLoginPublic = () => [
        <div className="foot" key="no-manage" >
            <Button onClick={this.cancelFirstLoginPublic}>
                    立即体验
                </Button>
        </div>
    ]
    //Tabpush 点击callback
    tabPushClickCb = (e) => {
        const { messageActions, messageReducers } = this.props;
        const {
            formInfo,
            activeLi,
            editFormInfoSave,
        } = messageReducers;
        let index;//点击的li
        Array.prototype.slice.call(e.currentTarget.children, 0).forEach((item, i) => {
            if (item === e.target) {
                index = Math.ceil((i + 1) / 2);
            }
        });
        if (typeof index === 'undefined') {
            return;
        } else if (index > 1 && (!formInfo[index - 1] || !formInfo[index - 1].f_url)) {
            showDevlop(index - 1);
            return;
        }
        if (
            index !== activeLi &&
            !editFormInfoSave &&
            formInfo[activeLi] &&
            formInfo[activeLi].f_url
        ) {
            messageActions.setNextActiveLi(index);
            messageActions.switchGoToNextliModal(true);
        } else {
            // this.isImageLoading(index);
            messageActions.setTabpushLi(index);
        }
        // messageActions.setTabpushLi(index);
    }
    isImageLoading = () => {
        // const { messageActions, messageReducers } = this.props;
        // const {
        //     formInfo
        // } = messageReducers;
        // if (!formInfo[index] || !formInfo[index].f_url) { return; }
        // if (
        //     !imageLoad(
        //         formInfo[index].f_url,
        //         () => { messageActions.imageLoading(false); }
        //     )
        // ) {
        //     messageActions.imageLoading(true);
        // }
    }
    goToNextliModalOk = (e) => {
        const { messageActions, messageReducers } = this.props;
        const {
            nextActiveLi,
            activeLi,
        } = messageReducers;

        this.addOrEditForm(e, activeLi, true);
        // this.isImageLoading(nextActiveLi);
        messageActions.setTabpushLi(nextActiveLi);
        messageActions.switchGoToNextliModal(false);
        messageActions.resetEditFormInfoSave();
    }
    goToNextliModalCancel = () => {
        const { messageActions, messageReducers } = this.props;
        const {
            formInfo,
            nextActiveLi,

        } = messageReducers;
        messageActions.getSetting();
        // this.isImageLoading(nextActiveLi);
        if (formInfo[nextActiveLi] && formInfo[nextActiveLi].f_url) {
            messageActions.setTabpushLi(nextActiveLi);
        }

        messageActions.switchGoToNextliModal(false);
    }
    closeGoToNextliModal = () => {
        const { messageActions } = this.props;
        messageActions.switchGoToNextliModal(false);
    }
    goToNextliModalFoot = () => [
        <div key="goto-nextli">
            <Button onClick={this.goToNextliModalCancel} className="ant-btn ant-btn-ghost ant-btn-lg">
                    否
                </Button>
            <Button onClick={(e) => { this.goToNextliModalOk(e); }} className="ant-btn ant-btn-primary ant-btn-lg">
                    是
                </Button>
        </div>
    ]
    render = () => {
        const {
            settingInfo,
            modalVisible,
            formInfo,
            isAuth,
            isVerify,
            activeLi,
            formInfoSave,
            goToNextliModal,

        } = this.props.messageReducers;

        const info = '您可联系管理员在【企业管理—公众号授权管理】' +
            '更改或解除公众号授权';
        /* eslint-disable global-require */
        const image = {
            gotoAuthSrc: require('../../../../styles/image/goto-auth.png')
        };
        /* eslint-enable global-require */

        return (

            <div className="message-content">
                <div className="head-info">
                    <span className="">48小时消息推送</span>
                    <div className="head-right-info">

                        <img src={settingInfo.f_wx_logo || '//www.staticec.com/corp/images/corp/default_logo.png'} alt="公众号" className="public-img" />

                        <div className="info-p">
                            <p>{settingInfo.f_wx_name}</p>
                            <div className="gz">{
                                settingInfo.f_server_type === 2 ? '服务号' : '订阅号'
                            }</div>
                        </div>
                        <Popover
                            content={info}
                            arrowPointAtCenter
                            placement="bottomRight"
                            overlayClassName="circle-popover"
                            trigger="hover"
                        >
                            <i className="iconfont icon-wenhao1" />
                        </Popover>
                    </div>
                    <div className="head-ct">
                        <p>1、在48小时内，向新关注用户自动推送1-3条微表单作品，引导其登记个人信息，成为销售线索。点击
                            <a
                                href="http://www.workec.com/tech/helpinfo?cat=21&kid=417"
                                target="_blank"
                                rel="noopener noreferrer"
                            >了解更多</a>
                        </p>
                        <p>2、此推送不占用公众号规定的群发次数</p>
                    </div>

                </div>
                <Tabpush
                    activeLi={activeLi}
                    onClick={this.tabPushClickCb}
                    formInfoSave={formInfoSave}
                    formInfo={formInfo}
                />
                <Uploadform />
                <div className="foot">
                    {
                        activeLi !== 3 ?
                            <a
                                href=""
                                onClick={e => this.addOrEditFormToNext(e, activeLi)}
                                className="save-data"
                            >
                            保存并设置下一条
                        </a> : null
                    }
                    <a
                        href=""
                        onClick={e => this.addOrEditForm(e, activeLi, false)}
                        className={classNames('save-data', { white: activeLi !== 3 })}
                    >
                        保 存
                    </a>
                </div>
                <Fullcarousel
                    visible={!modalVisible.isAuthVisible}
                    btnCallback={this.bindPublic}
                />
                <Modal
                    width="678px"
                    maskClosable={false}
                    title="公众号授权"
                    visible={!modalVisible.hasAuthVisible}
                    wrapClassName="vertical-center-modal no-manager-modal"
                    onCancel={this.showIsAuthVisible}
                    footer={this.NoManagerModal()}
                >
                    <div className="corp-set-img">
                        <img src={image.gotoAuthSrc} alt="" />
                    </div>
                    <p>
                            请联系企业管理员，前往【企业管理 - 功能设置 - 公众号授权管理】进行公众号授权，点击
                            <a
                                href="http://www.workec.com/tech/helpinfo?cat=21&kid=419"
                                target="_blank"
                                rel="noopener noreferrer"
                            >查看操作说明</a>。
                        </p>
                </Modal>

                <Modal
                    width="590px"
                    maskClosable={false}
                    visible={!modalVisible.isFirstVisible && isAuth && isVerify}
                    wrapClassName="vertical-center-modal no-manager-modal fist-public-modal"
                    onCancel={this.cancelFirstLoginPublic}
                    footer={this.FirstLoginPublic()}
                >
                    <Tinycarousel
                        visible
                    />
                </Modal>

                <Modal
                    width="320px"
                    maskClosable={false}
                    title="提示"
                    visible={goToNextliModal}
                    wrapClassName="vertical-center-modal pv-modal"
                    footer={this.goToNextliModalFoot()}
                    onCancel={this.closeGoToNextliModal}
                >
                        是否需要保存当前设置？
                </Modal>
            </div>

        );
    }

}

export default withRouter(MessageContent);
