import React from 'react';
import { Modal, Icon } from 'antd';
import './index.less';


import Time from '../Time';

const imageLoad = (url, cb) => {
    const img = new Image();
    img.src = url;
    if (img.complete) {
        return true;
    }
    img.onload = cb;
    img.onerror = cb;
    return true;
};
class Uploadform extends React.Component {

    static propTypes = {
        messageActions: React.PropTypes.object.isRequired,
        messageReducers: React.PropTypes.object.isRequired
    }
    state = {
        iframeSrc: 'https://my.workec.com/remind/form?type=1&ordertype=1&from=public',
        switchIframeVisible: false
    }
    componentDidMount = () => {
        const { messageActions } = this.props;
        window.addEventListener('message', this.messageCb);
        //获取设置信息
        messageActions.getSetting();
    }
    componentwillUnmount = () => {
        window.removeEventListener('message', this.messageCb);
    }
    messageCb = (e) => {
        const { messageActions, messageReducers } = this.props;

        // if (e.source != window.parent) return;

        if (e.data.event === 'insert') {
            messageActions.setFormInfo({
                index: messageReducers.activeLi,
                data: {
                    f_desc: e.data.data.desc,
                    f_pic_url: e.data.data.picUrl,
                    f_title: e.data.data.title,
                    f_url: e.data.data.url
                }
            });
            if (
                !imageLoad(
                    e.data.data.picUrl,
                    () => { messageActions.imageLoading(false); }
                )
            ) {
                messageActions.imageLoading(true);
            }
            messageActions.switchEditFormInfoSave(false);
            this.closeIframe();
        } else if (e.data.event === 'close') {
            this.closeIframe();
        }
    }
    closeIframe = (e) => {
        if (e) {
            e.preventDefault();
        }
        // const { messageActions } = this.props;
        this.setState({
            iframeSrc: `https://my.workec.com/remind/form?type=1&ordertype=1&from=public&_src=${parseInt(Math.random() * 100000, 10)}`,
            switchIframeVisible: false
        });
        // messageActions.switchIframeVisible(false);
    }
    openIframe = (e) => {
        e.preventDefault();
        // const { messageActions } = this.props;
        // messageActions.switchIframeVisible(true);
        this.setState({
            switchIframeVisible: true
        });
    }
    /**
     * 预览
     */
    previewForm = (e, url) => {
        e.preventDefault();
        window.open(url);
    }
    /**
     * 删除推送设置设置
     */
    sureDeleteForm = (index) => {
        const { messageActions } = this.props;
        messageActions.deleteForm(index);
        messageActions.switchDeleteVisible(false);
    }
    isDeleteForm = (e) => {
        e.preventDefault();
        const { messageActions } = this.props;
        messageActions.switchDeleteVisible(true);
    }
    cancelDeleteForm = () => {
        const { messageActions } = this.props;
        messageActions.switchDeleteVisible(false);
    }
    /**
     * 更新推送设置与增加推送设置
     */
    // addForm = () => {
    //     active
    // }
    addOrEditForm = (index) => {
        const { messageActions, messageReducers } = this.props;
        if (messageReducers[index].f_id) {
            //更改
            messageActions.addForm(index);
        } else {
            //新增
            messageActions.editForm(index);
        }
    }
    renderHasForm = (data, imageLoading) => {
        const { activeLi } = this.props.messageReducers;
        return (
            <div className="push-form-hasupload">
                <div className="img-content">
                    {
                        imageLoading ?
                            <img src="//1.staticec.com/my/public/images/ec-loading.gif" alt="" className="loading-pic" /> :
                            <img src={data[activeLi].f_pic_url} alt="" className="share-pic" />
                    }
                </div>

                <div className="foot">
                    {data[activeLi].f_title}
                </div>
                <ul className="operate">
                    <li>
                        <a
                            href=""
                            onClick={e => this.previewForm(e, data[activeLi].f_url)}
                        >
                            <i className="iconfont icon-chakan-copy" />
                            <p>预览</p>
                        </a>
                    </li>
                    <li>
                        <a href="" onClick={e => this.openIframe(e)}>
                            <i className="iconfont icon-bianji" />
                            <p>更改</p>
                        </a>
                    </li>
                    <li>
                        <a
                            href=""
                            onClick={e => this.isDeleteForm(e)}
                        >
                            <i className="iconfont icon-shanchu1" />
                            <p>删除</p>
                        </a>
                    </li>
                </ul>

            </div>
        );
    }
    renderNoForm() {
        return (
            <a
                href=""
                className="push-form-upload"
                onClick={e => this.openIframe(e)}
            >
                <Icon type="plus" className="plus" />
                <p>从微表单作品中选择</p>
            </a>
        );
    }
    renderPushObj = (activeLi) => {
        if (activeLi === 1) {
            return '新关注用户';
        } else if (activeLi === 2) {
            return '未在“第一条推送”中登记信息的用户';
        } else if (activeLi === 3) {
            return '未在“第二条推送”中登记信息的用户';
        }
        return '';
    }
    render = () => {
        const {
            formInfo,
            deleteFormVisible,
            activeLi,
            imageLoading,

        } = this.props.messageReducers;


        return (

            <div className="push-form">
                <div className="label">
                    <span>推送对象</span>
                    <div className="right">
                        {
                             this.renderPushObj(activeLi)
                        }
                    </div>
                </div>
                <div className="label upload">
                    <span>推送内容</span>
                    <div className="right" id="selct-form">
                        {
                            formInfo[activeLi] && formInfo[activeLi].f_url ?
                                this.renderHasForm(formInfo, imageLoading) :
                                    this.renderNoForm()
                        }

                    </div>
                </div>
                <div className="label">
                    <span>推送时间</span>
                    <div className="right">
                        <Time activeLi={activeLi} formInfo={formInfo} />
                    </div>
                </div>


                <Modal
                    width="820px"
                    title="微表单作品"
                    wrapClassName="vertical-center-modal h5-form"
                    maskClosable
                    visible={this.state.switchIframeVisible}
                    footer={null}
                    onCancel={e => this.closeIframe(e)}
                >

                    <iframe
                        title="插入微表单"
                        src={this.state.iframeSrc}
                    />
                </Modal>

                <Modal
                    width="320px"
                    maskClosable={false}
                    title="提示"
                    visible={deleteFormVisible}
                    wrapClassName="vertical-center-modal pv-modal"
                    onOk={() => this.sureDeleteForm(activeLi)}
                    onCancel={this.cancelDeleteForm}
                >

                    <div>
                            删除后用户将无法收到此条推送
                            {
                                activeLi !== 3 ?
                                    <span>，同时后续推送将一并删除</span> : null
                            }
                            。
                        </div>
                </Modal>

            </div>
        );
    }

}
export default Uploadform;
