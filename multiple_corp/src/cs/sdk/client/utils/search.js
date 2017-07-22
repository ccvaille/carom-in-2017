/*eslint-disable */
module.exports = function (search) {
    search = search || window.location.search.replace(/^\?/, '');

    var searchArr = search.split('&'),
        params = {};

    var keyval = '';

    for (var i = 0; i < searchArr.length; i++) {
        keyval = searchArr[i].split('=');
        if (keyval[0]) params[keyval[0]] = decodeURIComponent(keyval[1]) || '';
    }
    return params;
};
