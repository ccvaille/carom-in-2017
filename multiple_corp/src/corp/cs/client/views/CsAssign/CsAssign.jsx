import React, { PropTypes } from 'react';
import { withRouter } from 'react-router';
import { Tabs } from 'antd';
import CsWechatAssign from 'views/CsWechatAssign';
import CsWebAssign from 'views/CsWebAssign';

const TabPane = Tabs.TabPane;

class CsAssign extends React.Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        router: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);

        const { type } = this.props.location.query;
        this.state = {
            activeTab: type || 'wechat',
        };
    }

    componentWillMount() {
        const { type } = this.props.location.query;

        if (!type) {
            this.props.router.push({
                pathname: '/kf/index/dis',
                query: {
                    type: 'wechat',
                },
            });
        }
    }

    onChangeTab = (key) => {
        this.setState({
            activeTab: key,
        });
        this.props.router.push({
            pathname: '/kf/index/dis',
            query: {
                type: key,
            },
        });
    }

    onGoWXSettingPage = () => {
        // this.props.router.push({
        //     pathname: '/kf/index/float',
        //     query: {
        //         type: 'wechat',
        //     },
        // });
        window.location.href = '/kf/index/float?type=wechat';
    }


    render() {
        return (
            <div className="cs-assign-wrapper">
                <Tabs activeKey={this.state.activeTab} onChange={this.onChangeTab}>
                    <TabPane
                        tab="网页客服分配"
                        key="web"
                    >
                        <CsWebAssign activeTab={this.state.activeTab} />
                    </TabPane>

                    <TabPane
                        tab="微信客服分配"
                        key="wechat"
                    >
                        <CsWechatAssign
                            activeTab={this.state.activeTab}
                            onGoWXSettingPage={this.onGoWXSettingPage}
                        />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default withRouter(CsAssign);
