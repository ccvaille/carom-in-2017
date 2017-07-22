import React, { PropTypes } from 'react';
import classNames from 'classnames';
import locale from '../../locale';
import './button-entry-preview.less';

class ButtonEntryPreview extends React.Component {
    static propTypes = {
        backgroundColor: PropTypes.string.isRequired,
        buttonShape: PropTypes.number.isRequired,
        localeKey: PropTypes.string.isRequired,
        btnTheme: PropTypes.number.isRequired,
        buttonImage: PropTypes.string.isRequired,
    }

    static defaultProps = {
        localeKey: 'zh-cn',
    }

    render() {
        const { backgroundColor, buttonShape, btnTheme, buttonImage, localeKey } = this.props;

        const styles = {
            backgroundColor,
        };

        let textNode = null;
        const textClasses = classNames({
            text: true,
            zh: localeKey === 'zh-cn' || localeKey === 'zh-tw',
            en: localeKey === 'en-us',
            vertical: buttonShape === 1,
        });

        switch (buttonShape) {
            case 0:
                textNode = (
                    <span className={textClasses}>{locale[localeKey].listTitle}</span>
                );
                break;
            case 1: {
                // const titleArray = locale[localeKey].listTitle.split('');
                // const textNodes = titleArray.map((t, i) => (
                //     <div key={i} style={textStyles}>{t}</div>
                // ));
                textNode = (
                    <span className={textClasses}>
                        {locale[localeKey].listTitle}
                    </span>
                );
                break;
            }
            case 2:
            case 3:
                textNode = null;
                break;
            default:
                break;
        }

        const buttonClasses = classNames({
            'button-entry-preview': true,
            'circle-btn': buttonShape === 3,
            'square-btn': buttonShape === 2,
            'h-rectangle': buttonShape === 0,
            'v-rectangle': buttonShape === 1,
        });

        const iconClasses = classNames({
            'pure-color-btn': true,
            clearfix: true,
            'in-circle': buttonShape === 3,
            'in-square': buttonShape === 2,
            'in-h-rectangle': buttonShape === 0,
            'in-v-rectangle': buttonShape === 1,
        });

        const customButtonClasses = classNames({
            'custom-button': true,
            circle: buttonShape === 3,
        });

        let previewNode = null;

        switch (btnTheme) {
            case -1:
                previewNode = (
                    <div className={iconClasses} style={styles}>
                        <i className="icon icon-customer-service service-icon" />
                        {textNode}
                    </div>
                );
                break;
            case 0:
                previewNode = (
                    <div
                        className={customButtonClasses}
                        style={{
                            background: `url(${buttonImage}) 50% 50% / cover no-repeat`,
                        }}
                    />
                    // <img
                    //     className="custom-btn-image"
                    //     src={buttonImage}
                    //     // style={{
                    //     //     background: `url(${buttonImage}) 0% 0% / contain no-repeat`,
                    //     // }}
                    // />
                );
                break;
            default:
                break;
        }

        return (
            <div className={buttonClasses}>
                {previewNode}
            </div>
        );
    }
}

export default ButtonEntryPreview;
