export const getSerializedObject = (object) => {
    let serializedString = '';
    Object.keys(object).forEach(key => {
        serializedString += serializedString ? `&${key}=${object[key]}` : `${key}=${object[key]}`;
    });
    return serializedString;
};

export const  formatNumber=(value)=> {
    value += '';
    const list = value.split('.');
    const prefix = list[0].charAt(0) === '-' ? '-' : '';
    let num = prefix ? list[0].slice(1) : list[0];
    let result = '';
    while (num.length > 3) {
        result = `,${num.slice(-3)}${result}`;
        num = num.slice(0, num.length - 3);
    }
    if (num) {
        result = num + result;
    }
    return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
}


export const getDPR=()=>{
    let isMobile = false;
    if ((/android/i).test(navigator.userAgent) || (/iphone|ipad/i).test(navigator.userAgent)) {
        const meta = document.querySelector('meta[name="viewport"]');
        const content = meta.content;
        if (!(/initial-scale=1,/g.test(content))) {
            isMobile = true;
        }
    }
    let DPR = isMobile ? (window.devicePixelRatio || 1) : 1;
    return DPR;
}
