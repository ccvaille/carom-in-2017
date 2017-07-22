import React, { PropTypes } from 'react';
import ButtonEntryPreview from 'components/ButtonEntryPreview';
import 'styles/mobile-common.less';
import './mobile-entry-preview.less';

const MobileEntryPreview = ({
    mobileEntrySetting,
    localeKey,
}) => (
    <div className="preview entry-preview mobile-preview">
        <div className="head">
            <h4>效果预览</h4>
        </div>

        <div className="preview-result">
            <ButtonEntryPreview
                btnTheme={mobileEntrySetting.btnTheme}
                buttonShape={mobileEntrySetting.buttonStyle}
                backgroundColor={mobileEntrySetting.buttonStyleBackgroundColor}
                buttonImage={mobileEntrySetting.btnBackground}
                localeKey={localeKey}
            />
        </div>
    </div>
);

MobileEntryPreview.propTypes = {
    mobileEntrySetting: PropTypes.object.isRequired,
    localeKey: PropTypes.string.isRequired,
};

export default MobileEntryPreview;
