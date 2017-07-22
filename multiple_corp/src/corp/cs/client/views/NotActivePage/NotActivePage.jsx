import React, { PropTypes } from 'react';
import { Button, Modal } from 'antd';
import CenterModalFooter from 'components/CenterModalFooter';
import csIconImg from 'img/activation/cs-icon.png';
import dataImg from 'img/activation/data-analysis.png';
import visitorImg from 'img/activation/visitor.png';
import quickreplyImg from 'img/activation/quickreply.png';
import modalWarningImg from 'img/modal-warning.png';
import './not-active-page.less';

class NotActivePage extends React.Component {
    static propTypes = {
        activePackage: PropTypes.func.isRequired,
        promptModalVisible: PropTypes.bool.isRequired,
    }

    // eslint-disable-next-line consistent-return
    componentWillMount() {
        if (window.activateStatus === '1') {
            window.location.href = '/kf/index/float?type=pc';
            return false;
        }
    }

    onActivePackage = () => {
        this.props.activePackage();
    }

    onConfirmActive = () => {
        window.location.href = '/kf/index/float?type=pc';
    }

    render() {
        return (
            <div className="not-active-page">
                <div className="page-block notice-head clearfix">
                    <img className="icon-block" src={csIconImg} alt="" />
                    <div className="content">
                        <h2>倾力打造的新版在线客服上线啦！</h2>
                        <p>为了更好的满足市场需求，我们呕心沥血完成了新版在线客服的研发，感谢大家一直依赖对EC在线客服的支持与帮助，并请尽快升级体验！</p>
                    </div>
                </div>

                <div className="page-block pv-intro">
                    <h3 className="intro-title">在线客服客户端</h3>
                    <div className="intro-content data-content clearfix">
                        <div className="left-block">
                            <img src={dataImg} alt="" />
                        </div>
                        <div className="right-block">
                            <span className="news-tip">新增</span>
                            <span className="feature-name">数据监控</span>
                            <p className="feature-content">
                                综合数据可以实时监控访客流量和客服对话的数据，
                                数据统计新增咨询量、接待量、接待率、有效接待量、平均对话时长、平均首次响应时长等客服KPI指标。
                            </p>
                        </div>
                    </div>

                    <div className="intro-content visitor-content clearfix">
                        <div className="left-block">
                            <span className="news-tip">新增</span>
                            <span className="feature-name">访客接待与管理</span>
                            <p className="feature-content">
                                访客接待界面可以统一接待来自PC网站、移动网站、微信、QQ等渠道的访客，
                                并且支持导入CRM库，接待记录中留言板选项新增状态（已回复、未回复、待跟进）选择功能，通过状态的筛选来了解留言处理的进程。
                            </p>
                        </div>
                        <div className="right-block">
                            <img src={visitorImg} alt="" />
                        </div>
                    </div>

                    <div className="intro-content reply-content clearfix">
                        <div className="left-block">
                            <img src={quickreplyImg} alt="" />
                        </div>
                        <div className="right-block reply-block">
                            <span className="news-tip">新增</span>
                            <span className="feature-name">快捷回复</span>
                            <p className="feature-content">
                                快捷回复增加分组功能，添加分组和回复语不设上限。
                            </p>
                        </div>
                    </div>

                    <div className="feature-list optimize-points">
                        <h4>优化</h4>
                        <ul>
                            <li>
                                <p className="content-text">访客列表可以直观地查看访客访问网站时的时间、来源、着陆页、地区等信息；</p>
                                <p className="content-text">并且可以邀请访客会话以及邀请状态的筛选。</p>
                            </li>
                            <li className="content-text">
                                接待记录可以直观地查看访客聊天记录和访客历史轨迹。
                            </li>
                            <li className="content-text">
                                快捷回复页面更加便捷的编辑回复语。
                            </li>
                            <li className="content-text">
                                数据统计将流量和对话数据统一页面展示，更加直观了解网站流量和客服对话数据。
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="page-block corp-intro clearfix">
                    <h3 className="intro-title">在线客服后台</h3>
                    <div className="feature-list">
                        <h4>新增</h4>
                        <ul>
                            <li className="content-text">
                                权限设置分组列表和客服列表，并且可以对分组和客服进行增、删、改。
                            </li>
                            <li className="content-text">
                                接入设置将接入方式和样式设置整合在统一页面配置，可选择网站会话插件、手机会话插件、会话连接、微信接入等接入方式。
                            </li>
                            <li className="content-text">
                                客服分配网站客服分配规则（功能暂未开放，请耐心等待）和微信客服分配规则（可以指定客服人员接待微信访客）。
                            </li>
                            <li className="content-text">
                                手机会话插件访客入口样式选择、会话框颜色选择、邀请框样式选择以及邀请规则选择。
                            </li>
                        </ul>
                    </div>

                    <div className="feature-list optimize-list">
                        <h4>优化</h4>
                        <ul>
                            <li className="content-text">
                                网站会话插件访客入口列表样式和按钮样式，访客会话框小浮窗样式和标准窗样式，访客邀请框信封样式和便签样式以及邀请规则。
                            </li>
                            <li className="content-text">
                                会话连接和微信接入界面UI。
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="page-block not-active-tips clearfix">
                    <h3 className="intro-title">温馨提示</h3>
                    <div className="feature-list">
                        <ul>
                            <li className="content-text">
                                目前在线客服访客侧会话框兼容IE8以上版本（包括IE8）。
                            </li>
                            <li className="content-text">
                                升级后将启用新版在线客服设置页面，将不再返回旧版设置页面。
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="page-block active-wrapper">
                    <Button
                        type="primary"
                        className="active-btn"
                        onClick={this.onActivePackage}
                    >
                        立即激活
                    </Button>
                </div>

                <Modal
                    title="温馨提示"
                    visible={this.props.promptModalVisible}
                    wrapClassName="vertical-center-modal active-prompt"
                    width={390}
                    footer={
                        <CenterModalFooter
                            onOk={this.onConfirmActive}
                            okText="知道了"
                            onlyOk
                        />
                    }
                    onOk={this.onConfirmActive}
                >
                    <div className="clearfix">
                        <img className="modal-warning-icon" src={modalWarningImg} alt="" />
                        <p className="warning-content">
                            请您尽快去配置在线客服基本设置，保证功能正常使用。
                        </p>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default NotActivePage;
