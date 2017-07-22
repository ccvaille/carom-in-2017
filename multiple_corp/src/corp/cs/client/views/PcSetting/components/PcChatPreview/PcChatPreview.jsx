import React, { PropTypes } from 'react';
import classNames from 'classnames';
import StandardChatBoxPreview from 'components/StandardChatBoxPreview';
import FloatChatBoxPreview from 'components/FloatChatBoxPreview';
import './pc-chat-preview.less';

const PcChatPreview = ({ pcChatSetting, localeKey }) => {
    let previewNode = null;

    switch (pcChatSetting.mode) {
        case 0:
            previewNode = (
                <StandardChatBoxPreview
                    themeColor={pcChatSetting.themeColor}
                    chatTitle={pcChatSetting.title}
                    chatNotice={pcChatSetting.notice}
                    localeKey={localeKey}
                />
            );
            break;
        case 2:
            previewNode = (
                <FloatChatBoxPreview
                    themeColor={pcChatSetting.themeColor}
                    chatTitle={pcChatSetting.title}
                    localeKey={localeKey}
                />
            );
            break;
        default:
            break;
    }

    const wrapperClasses = classNames({
        'chat-wrapper': pcChatSetting.mode === 0,
    });

    const previewClasses = classNames({
        preview: true,
        'pc-chat-preview': true,
        'without-border': pcChatSetting.mode === 2,
    });

    const resultClasses = classNames({
        'preview-result': true,
        'standard-mode': pcChatSetting.mode === 0,
    });

    return (
        <div>
            <div className={previewClasses}>
                <div className="head">
                    <h4>效果预览</h4>
                </div>

                <div className={wrapperClasses}>
                    <div className={resultClasses}>
                        {previewNode}
                    </div>
                </div>
            </div>
            {
                pcChatSetting.mode === 0
                ?
                    <p
                        style={{
                            textAlign: 'center',
                            marginTop: 7,
                        }}
                    >
                        左右拖动可查看完整效果
                    </p>
                : null
            }
        </div>
    );
};

PcChatPreview.propTypes = {
    pcChatSetting: PropTypes.object.isRequired,
    localeKey: PropTypes.string.isRequired,
};

export default PcChatPreview;
