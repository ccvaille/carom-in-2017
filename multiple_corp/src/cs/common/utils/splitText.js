/*eslint-disable */
module.exports = function (text, perLength) {
    var result = [];
    do {
        result.push(text.slice(0, perLength));
        text = text.slice(perLength);
        if (!text.length) break;
    } while(1);
    return result;
};
/*
function (text, perLength) {
    var result = [];
    var pattern = new RegExp('.{' + perLength + '}');
    do {
        text = text.replace(pattern, function (str) {
            result.push(str);
            return '';
        });
        if (text.length < perLength) break;
    } while(1);
    if (text) {
        result.push(text);
    }
    return result;
};
*/
