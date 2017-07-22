import React, { PropTypes } from 'react';
import classNames from 'classnames';
import locale from '../../locale';
import './minimize-entry-preview.less';

const MinimizeEntryPreview = ({
    listTheme,
    systemThemeNumber,
    minimizeBackground,
    onSwitchListMode,
    localeKey,
}) => {
    const systemThemeClasses = classNames({
        'theme-wrapper': true,
        default: listTheme === -1 && systemThemeNumber === 1,
        'cyan-blue': listTheme === -1 && systemThemeNumber === 2,
        'dark-green': listTheme === -1 && systemThemeNumber === 3,
        orange: listTheme === -1 && systemThemeNumber === 4,
        'jade-green': listTheme === -1 && systemThemeNumber === 5,
    });

    const customDivClasses = classNames({
        'theme-custom': listTheme === 0,
    });

    // const titleArray = locale[localeKey].listTitle.split('');
    // const textNodes = titleArray.map((t, i) => (
    //     <div key={i}>{t}</div>
    // ));

    const textClasses = classNames({
        text: true,
        zh: localeKey === 'zh-cn' || localeKey === 'zh-tw',
        en: localeKey === 'en-us',
    });

    return (
        <div
            role="button"
            tabIndex="-1"
            className="pc-minimize-entry-preview"
            onClick={() => onSwitchListMode(0)}
        >
            {
                listTheme === -1
                ?
                    <div className={systemThemeClasses}>
                        <i className="icon icon-customer-service service-icon" />
                        <span className={textClasses}>
                            {locale[localeKey].listTitle}
                        </span>
                    </div>
                :
                    <div
                        className={customDivClasses}
                        style={{
                            background: `url(${minimizeBackground}) 50% 50% / cover no-repeat`,
                        }}
                    />
            }
        </div>
    );
};

MinimizeEntryPreview.propTypes = {
    listTheme: PropTypes.number.isRequired,
    systemThemeNumber: PropTypes.number.isRequired,
    minimizeBackground: PropTypes.string.isRequired,
    onSwitchListMode: PropTypes.func.isRequired,
    localeKey: PropTypes.string.isRequired,
};

export default MinimizeEntryPreview;
