import React, { PropTypes } from 'react';
import { Button, Toast } from 'antd-mobile';
import MobileInput from 'components/MobileInput';
import 'styles/am-reset.less';
import './phone-verify.less';

let getIframeInterval;

class PhoneVerify extends React.Component {
    onNext = () => {
        // @todo 初始化验证码服务
        const capOption = {
            callback: this.capCb,
            showHeader: false,
            type: 'popup',
            firstvrytype: 2,
        };
        capInit(document.getElementById('capcha-wrapper'), capOption);

        // Toast.info('号码格式不对，请重新输入', 1000000);
        // if (!getIframeInterval) {
        //     getIframeInterval = setInterval(() => {
        //         const iframe = document.getElementsByTagName('iframe')[0];
        //         if (iframe) {
        //             clearInterval(getIframeInterval);
        //             getIframeInterval = undefined;
        //             const width = iframe.offsetWidth * 2;
        //             const height = iframe.offsetHeight * 2;
        //             // const width = iframe.style.width;
        //             // const height = iframe.style.height;
        //             // const top = iframe.style.top;
        //             // const left = iframe.style.left;

        //             setTimeout(() => {
        //                 iframe.style.width = `${width}px`;
        //                 iframe.style.height = `${height}px`;
        //                 console.log(iframe);
        //             }, 5000);
        //             // iframe.style.top = top / 2;
        //             // iframe.style.left = left / 2;
        //         }
        //     }, 100);
        // }
    }

    capCb = (resp) => {
        console.log(resp);
        // 票据凭证 resp.ticket
    }

    render() {
        return (
            <div className="mobile-phone-verify">
                <h2 className="page-title">手机获取验证码</h2>

                <p className="gray-text">手机号码</p>
                <div className="phone-input">
                    <MobileInput
                        type="tel"
                        placeholder="手机号码"
                        value="111"
                        clear
                    />
                </div>

                <Button
                    type="primary"
                    className="next-step-btn"
                    onClick={this.onNext}
                >
                    下一步
                </Button>

                <div
                    id="capcha-wrapper"
                    style={{
                        width: '100%',
                        height: 350,
                    }}
                />

                <div className="ec-mask" />
            </div>
        );
    }
}

export default PhoneVerify;
