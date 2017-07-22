import React from 'react';
import { scriptContent } from 'constants/shared';
import CopyButton from 'components/CopyButton';
import './pc-access-code.less';

const PcAccessCode = () => (
    <div className="cs-access-code pc-access-code">
        <p className="bold-text">将代码粘贴到目标网页的标签后面即可。</p>
        <div className="access-code-hint">
            <div>{'<html>'}</div>
            <div style={{ marginLeft: 20 }}>{'<body>'}</div>
            <div style={{ marginLeft: 40 }}>{'您的网站内容'}</div>
            <div className="hint">请将下方代码粘贴在此处</div>
            <div style={{ marginLeft: 20 }}>{'</body>'}</div>
            <div>{'</html>'}</div>
        </div>
        <div className="code-content">
            {scriptContent}
        </div>

        <CopyButton
            copyText={scriptContent}
        />

        <div className="prompt">
            <p className="bold-text">提示：</p>
            <ul>
                <li>1.如果您有技术上的疑问，可咨询您的网站管理员、建站公司，或者EC网站客服。</li>
            </ul>
        </div>
    </div>
);

export default PcAccessCode;
