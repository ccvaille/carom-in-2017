import message from '../components/Message';
const defaultError = '系统繁忙';

function isContinuaty(value) {
    let count = 1;
    for (let i = 0; i < value.length - 1; i++) {
        if (value.charCodeAt(i) + 1 === value.charCodeAt(i + 1)) {
            count += 1;
        }
    }

    if (count === value.length) {
        return true;
    }

    return false;
}

function isBackContiuaty(value) {
    // 比如 654321
    let count = 1;
    for (let i = value.length - 1; i > 0; i--) {
        if (value.charCodeAt(i) + 1 === value.charCodeAt(i - 1)) {
            count += 1;
        }
    }

    if (count === value.length) {
        return true;
    }

    return false;
}

export function transformPropsFitForm(obj) {
    const objCopy = {
        ...obj,
    };
    const keys = Object.keys(obj);

    keys.forEach((k) => {
        objCopy[k] = {
            value: obj[k],
        };
    });
    return objCopy;
}

export function isManagePasswordValid(value) {
    const isNum = /^\d{6}$/.test(value);
    // const isNotRepeat = !/^(\d)\1+$/.test(value);
    // const isNotContinue = !isContinuaty(value) && !isBackContiuaty(value);

    return isNum;
}
export function hasClass(elem, cls) {
    cls = cls || '';
    if (cls.replace(/\s/g, '').length == 0) return false; //当cls没有参数时，返回false
    return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
}

export function addClass(elem, cls) {
    if (!hasClass(elem, cls)) {
        elem.className = elem.className == '' ? cls : elem.className + ' ' + cls;
    }
}

export function removeClass(elem, cls) {
    if (hasClass(elem, cls)) {
        var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, '') + ' ';
        while (newClass.indexOf(' ' + cls + ' ') >= 0) {
            newClass = newClass.replace(' ' + cls + ' ', ' ');
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '');
    }
}

export function getWindowHeight() {
    let height = window.innerHeight;

    if (window.innerHeight) {
        height = window.innerHeight;
    } else if ((document.body) && (document.body.clientHeight)) {
        height = document.body.clientHeight;
    }

    // 通过深入 Document 内部对 body 进行检测，获取窗口大小
    if (
        document.documentElement &&
        document.documentElement.clientHeight &&
        document.documentElement.clientWidth
    ) {
        height = document.documentElement.clientHeight;
    }

    return height;
}

export function getWindowWidth() {
    let width = window.innerWidth;

    if (window.innerWidth) {
        width = window.innerWidth;
    } else if ((document.body) && (document.body.clientWidth)) {
        width = document.body.clientWidth;
    }

    // 通过深入 Document 内部对 body 进行检测，获取窗口大小
    if (
        document.documentElement &&
        document.documentElement.clientWidth &&
        document.documentElement.clientWidth
    ) {
        width = document.documentElement.clientWidth;
    }

    return width;
}

export function serializeObject(object) {
    let serializedString = '';
    Object.keys(object).forEach(key => {
        serializedString += serializedString ? `&${key}=${object[key]}` : `${key}=${object[key]}`;
    });
    return serializedString;
}

export function displayError(errorMsg) {
    message.error(errorMsg || defaultError);
}
