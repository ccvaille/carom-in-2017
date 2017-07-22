import React, { PropTypes } from 'react';
import { withRouter } from 'react-router';
import { Tabs } from 'antd';
import PcSetting from 'views/PcSetting';
import MobileSetting from 'views/MobileSetting';
import EmbedSetting from 'views/EmbedSetting';
import WechatSetting from 'views/WechatSetting';

const TabPane = Tabs.TabPane;

class AccessSetting extends React.Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        router: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);
        // const pathArray = this.props.location.pathname.split('/');
        // const childPath = pathArray[pathArray.length - 1];
        const { type } = this.props.location.query;
        this.state = {
            activeTab: type || 'pc',
        };
    }

    componentWillMount() {
        const { type } = this.props.location.query;
        if (!type) {
            this.props.router.push({
                pathname: '/kf/index/float',
                query: {
                    type: 'pc',
                },
            });
        }
    }

    onChangeTab = (key) => {
        this.setState({
            activeTab: key,
        });
        this.props.router.push({
            pathname: '/kf/index/float',
            query: {
                type: key,
            },
        });
    }

    onGoSetWXCsPage = () => {
        // this.props.router.push({
        //     pathname: '/kf/index/dis',
        //     query: {
        //         type: 'wechat',
        //     },
        // });
        window.location.href = '/kf/index/dis?type=wechat';
    }

    render() {
        return (
            <div className="cs-advance-setting" style={{ padding: 20 }}>
                <Tabs activeKey={this.state.activeTab} onChange={this.onChangeTab}>
                    <TabPane
                        tab="网站会话插件"
                        key="pc"
                    >
                        <PcSetting activeTab={this.state.activeTab} />
                    </TabPane>

                    <TabPane
                        tab="手机会话插件"
                        key="mobile"
                    >
                        <MobileSetting activeTab={this.state.activeTab} />
                    </TabPane>

                    <TabPane
                        tab="会话链接"
                        key="embed"
                    >
                        <EmbedSetting activeTab={this.state.activeTab} />
                    </TabPane>

                    <TabPane
                        tab="微信接入"
                        key="wechat"
                    >
                        <WechatSetting
                            activeTab={this.state.activeTab}
                            onGoSetWXCsPage={this.onGoSetWXCsPage}
                        />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default withRouter(AccessSetting);
