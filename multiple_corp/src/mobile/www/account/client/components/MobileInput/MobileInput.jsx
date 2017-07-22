import React, { PropTypes } from 'react';
import './mobile-input.less';

class MobileInput extends React.Component {
    static propTypes = {
        type: PropTypes.string,
        clear: PropTypes.bool,
        suffix: PropTypes.node,
        editable: PropTypes.bool,
        disabled: PropTypes.bool,
        value: PropTypes.string,
        defaultValue: PropTypes.string,
    }

    static defaultProps = {
        type: 'text',
        clear: false,
        suffix: '',
        editable: true,
        disabled: false,
        value: '',
        defaultValue: '',
    }

    render() {
        const {
            type = 'text',
            value,
            clear, suffix,
            editable, disabled,
        } = this.props;
        return (
            <div className="ec-mobile-input-item">
                <div className="ec-input-preffix" />
                <div className="ec-input-control">
                    <input
                        type={type}
                        readOnly={!editable}
                    />
                </div>
                {
                    clear && editable && !disabled && (value && value.length > 0)
                    ?
                        <div className="ec-input-clear" />
                    : null
                }

                {
                    suffix
                    ?
                        <div className="ec-input-suffix">{suffix}</div>
                    : null
                }
            </div>
        );
    }
}

export default MobileInput;
