import React, { PropTypes } from 'react';
import { Button, Modal } from 'antd';
import './user-info.less';

const tips = [
    '一日之计在于寅，今日的努力成就明天的您！',
    '善于利用零星时间的人，更能做出成绩：）',
    '再多的金钱也难买健康，要按时吃饭喔^_^',
    '生命就是一个不断联系的过程，要与客户保持沟通哦',
    '勉之今,以成辉煌于翌日！晚上好好休息喔！',
];

class UserInfo extends React.Component {
    constructor(props) {
        super(props);
        this.navAuth = window.ecbiz.modules.list;
        this.userInfo = window.ecbiz.userinfo;
        this.state = {
            logoutPromptVisible: false,
        };
    }

    onClickLogout = () => {
        this.setState({
            logoutPromptVisible: true,
        });
    }

    onLogout = () => {
        location.href = 'https://biz.workec.com/logout';
    }

    onCancelLogout = () => {
        this.setState({
            logoutPromptVisible: false,
        });
    }

    render() {
        const h = new Date().getHours();
        let tipText = '';
        if (h < 3) {
            tipText = tips[4];
        } else if (h < 8) {
            tipText = tips[0];
        } else if (h < 11) {
            tipText = tips[1];
        } else if (h < 14) {
            tipText = tips[2];
        } else if (h < 20) {
            tipText = tips[3];
        } else {
            tipText = tips[4];
        }

        return (
            <div className="user-info">
                <img
                    src={this.userInfo.uface}
                    alt={this.userInfo.uname}
                    title={`${this.userInfo.uname}(${this.userInfo.uaccont})`}
                />
                <div className="user-text">
                    <p>
                        <i
                            alt={this.userInfo.uname}
                            title={ this.userInfo.uname}
                        >
                            {this.userInfo.uname}
                        </i>
                        <i>({this.userInfo.uaccont})</i>
                    </p>
                    <p>{tipText}</p>
                </div>
                <Button type="ghost" onClick={this.onClickLogout}>退出</Button>
                <Modal
                    width="440"
                    title="温馨提示"
                    visible={this.state.logoutPromptVisible}
                    wrapClassName="vertical-center-modal"
                    onOk={this.onLogout}
                    onCancel={this.onCancelLogout}
                >
                    <p>确定要退出当前帐号吗？</p>
                </Modal>
            </div>
        );
    }
}

export default UserInfo;
