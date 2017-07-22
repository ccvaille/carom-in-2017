import React, { PropTypes } from 'react';
import classNames from 'classnames';
import './element-with-tip.less';

function elementWithTip(WrappedComponent) {
    return class ElementWithTip extends React.Component {
        static propTypes = {
            tipContent: PropTypes.string.isRequired,
            tipStyles: PropTypes.object,
            showTip: PropTypes.bool.isRequired,
        }

        static defaultProps = {
            tipContent: '',
            showTip: false,
            tipStyles: {
                width: 160,
                top: 33,
                marginBottom: 12,
            },
        }

        render() {
            const {
                tipContent,
                tipStyles,
                showTip,
            } = this.props;
            const tipClasses = classNames({
                'ec-tip': true,
                show: showTip,
            });
            return (
                <div className="element-with-tip">
                    <WrappedComponent
                        ref="wrappedElement"
                        {...this.props}
                    />
                    <div
                        className={tipClasses}
                        style={tipStyles}
                    >
                        {tipContent}
                    </div>

                </div>
            );
        }
    };
}

export default elementWithTip;
