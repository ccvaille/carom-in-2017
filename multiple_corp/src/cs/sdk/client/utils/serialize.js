/*eslint-disable */
module.exports = function serialize(json) {
    var result = '';
    for (var i in json) {
        result += '&' + encodeURIComponent(i) + '=' + encodeURIComponent(json[i]);
    }
    return result.replace('&', '');
};
