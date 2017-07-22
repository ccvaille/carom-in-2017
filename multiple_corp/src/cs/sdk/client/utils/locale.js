/**
 * Created by ecuser on 2017/3/24.
 */
function getLanguagePackage(languageType) {
    // "language": 0,                    //语言：0,简体中文；1，英文；2，繁体中文；
    switch (languageType * 1) {
        case 0:
            return require('../locale/zh-cn');
        case 1:
            return require('../locale/en-us');
        case 2:
            return require('../locale/zh-tw');
        default:
            return require('../locale/zh-cn');
    }
}

module.exports = getLanguagePackage;
