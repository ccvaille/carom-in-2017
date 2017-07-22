/*eslint-disable */
function tplParser(tpl, open, close) {
    var result = 'var r = [];';
    var arr1 = tpl.split(open);
    for (var i = 0; i < arr1.length; i++) {
        var arr2 = arr1[i].split(close);
        if (arr2[1] !== undefined) {
            if (!/(^( )?(var |if|for|else|switch|case|break|{|}))(.*)?/.test(arr2[0])) {
                arr2[0] = `r.push(${arr2[0]});`;
            }
            arr2[1] = `r.push(\'${arr2[1]}\');`;
        } else {
            arr2[0] = `r.push(\'${arr2[0]}\');`;
        }
        arr1[i] = arr2.join('');
    }
    result += `${arr1.join('').replace(/\n/g, '\\\n')}return r.join(\'\');`;
    return result;
}

function scriptFilter(html) {
    return html.replace(/<(\/?script.*?)>/ig, '&lt;$1&gt;');
}

function parseTpl(tpl, data, open = '{{', close = '}}') {
    var fn = new Function(tplParser(tpl.replace(/\n|\r|\t/g, ''), open, close));

    // data.addComma = addComma; // 传入方法

    return scriptFilter(fn.apply(data));
}

module.exports = parseTpl;
