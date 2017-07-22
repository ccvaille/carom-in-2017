import React, { PropTypes } from 'react';
import './position-preview.less';

const PositionPreview = ({ previewSquareStyles }) => (
    <div className="position-preview">
        <div
            className="square"
            style={previewSquareStyles}
        />
    </div>
);

PositionPreview.propTypes = {
    previewSquareStyles: PropTypes.shape({
        top: PropTypes.string,
        left: PropTypes.string,
        right: PropTypes.string,
    }).isRequired,
};

export default PositionPreview;
