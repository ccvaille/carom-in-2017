export default function (search = window.location.search.replace(/^\?/, '')) {
    const searchArr = search.split('&');
    const params = {};

    let keyval = '';

    // eslint-disable-next-line no-restricted-syntax
    for (const i of searchArr) {
        keyval = i.split('=');
        if (keyval[0]) params[keyval[0]] = decodeURIComponent(keyval[1]) || '';
    }
    return params;
}
