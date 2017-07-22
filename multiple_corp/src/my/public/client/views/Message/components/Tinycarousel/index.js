import React from 'react';

import classnames from 'classnames'
import {
    Carousel,
} from 'antd';

import './index.less';
const Tinycarousel = ({
    visible,
}) => {
    const image = {
        "srcImage1": require('../../../../styles/image/tiny-slide-1.png'),
        "srcImage2": require('../../../../styles/image/tiny-slide-2.png')
    };
    return (

        <div className={classnames("public-carousel-tiny", {"hide": !visible})}>
            <Carousel dots={true} autoplay={false} autoplaySpeed={500} initialSlide={0}>
                <div className="slide">
                    <div className="slide-head-img">
                        <img src={image.srcImage1} alt=""/>
                    </div>
                    <h2>48小时消息推送</h2>
                    <p>一键开启自动化营销，粉丝轻松流入客户库！</p>
                </div>
                <div className="slide">
                    <div className="slide-head-img">
                        <img src={image.srcImage2} alt=""/>
                    </div>
                    <h2>粉丝转化清晰可见</h2>
                    <p>特有粉丝转化漏斗模型，自动监测营销转化效果</p>
                </div>
            </Carousel>
        </div>
    )
}

export default Tinycarousel;
