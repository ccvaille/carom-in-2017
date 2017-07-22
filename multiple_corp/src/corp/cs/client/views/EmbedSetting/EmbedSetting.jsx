import React from 'react';
import CopyButton from 'components/CopyButton';
import linkExample from 'img/link-example.png';
import './embed-setting.less';

const visitLink = `http://html.ecqun.com/kf/sdk/openwin.html?corpid=${window.csCorpId}&cstype=rand&mode=0&cskey=${window.csKey}`;

const EmbedSetting = () => (
    <div className="embed-setting">
        <div className="embed-link-wrapper">
            <p className="bold-text">请将以下代码添加至移动网页相关位置处</p>
            <div className="link">
                {visitLink}
            </div>
            <CopyButton
                copyText={visitLink}
            />
        </div>
        <div className="prompt">
            <p className="bold-text">提示：</p>
            <ul>
                <li>1.请将URL链接添加至移动应用的功能菜单里，添加成功后用户即可跟客服进行互动沟通；</li>
                <li>2.以微信服务号为例的示例图：</li>
            </ul>
            <img className="usage-image" src={linkExample} alt="" />
        </div>
    </div>
);

export default EmbedSetting;
