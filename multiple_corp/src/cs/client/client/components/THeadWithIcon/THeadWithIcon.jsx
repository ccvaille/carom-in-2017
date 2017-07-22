import React, { PropTypes } from 'react';
import { Popover, Icon } from 'antd';

const THeadWithIcon = ({
    popPlacement,
    popContent,
    theadContent,
    trigger,
}) => (
    <div>
        <span style={{ paddingRight: 3 }}>
            {theadContent}
        </span>
        <Popover
            placement={popPlacement}
            content={popContent}
            trigger={trigger}
        >
            <Icon
                type="question-circle-o"
                style={{
                    cursor: 'pointer',
                    color: '#c3ccd9',
                }}
            />
        </Popover>
    </div>
);

THeadWithIcon.defaultProps = {
    popPlacement: 'bottom',
    popContent: '',
    trigger: 'hover',
    theadContent: '',
};

THeadWithIcon.propTypes = {
    popPlacement: PropTypes.string,
    popContent: PropTypes.string,
    theadContent: PropTypes.string,
    trigger: PropTypes.string,
};

export default THeadWithIcon;
