import React, { PropTypes } from 'react';
import { Icon } from 'antd';
import classNames from 'classnames';
import inviteEnvelope from 'img/invite-envelope.png';
import inviteNote from 'img/invite-note.png';
import 'styles/mobile-common.less';
// import './mobile-invite-preview.less';

const MobileInvitePreview = ({ mobileInviteSetting }) => {
    const { content, theme } = mobileInviteSetting;
    let inviteImage = '';
    let contentStyle = null;
    const closeClasses = classNames({
        'close-invite': true,
        'close-envelope': theme === 0,
        'close-note': theme === 1,
    });

    const contentClasses = classNames({
        'content-text': true,
        white: theme === 0,
        yellow: theme === 1,
    });

    switch (theme) {
        case 0:
            inviteImage = inviteEnvelope;
            contentStyle = {
                top: 25,
                left: 65,
            };
            break;
        case 1:
            inviteImage = inviteNote;
            contentStyle = {
                top: 60,
                left: 35,
            };
            break;
        default:
            break;
    }

    const newContent = content.replace(/ /g, '&nbsp;');
    /* eslint-disable react/no-danger */
    return (
        <div className="preview invite-preview mobile-preview">
            <div className="head">
                <h4>效果预览</h4>
            </div>

            <div className="preview-result">
                <div>
                    <img src={inviteImage} alt="" />
                    <div
                        className={contentClasses}
                        style={contentStyle}
                        dangerouslySetInnerHTML={{ __html: newContent }}
                    />
                    <div className={closeClasses}>
                        <Icon type="close" />
                    </div>
                </div>
            </div>
        </div>
    );
};

MobileInvitePreview.propTypes = {
    mobileInviteSetting: PropTypes.object.isRequired,
};

export default MobileInvitePreview;
