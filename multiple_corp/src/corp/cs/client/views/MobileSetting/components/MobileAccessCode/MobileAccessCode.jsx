import React from 'react';
import { scriptContent } from 'constants/shared';
import CopyButton from 'components/CopyButton';
import './mobile-access-code.less';

const MobileAccessCode = () => (
    <div className="cs-access-code mobile-access-code">
        <p className="bold-text">将代码粘贴到目标网页的标签后面即可。</p>
        <div className="access-code-hint">
            <div className="code-content" style={{ color: '#555' }}>
                {scriptContent}
            </div>
        </div>

        <CopyButton
            copyText={scriptContent}
        />
    </div>
);

export default MobileAccessCode;
