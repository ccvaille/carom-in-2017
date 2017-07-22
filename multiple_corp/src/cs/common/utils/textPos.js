/*eslint-disable */
function getTextPos(input) {
    var pos = -1;
    if (input.selectionStart !== undefined) {
        pos = input.selectionStart;
    } else { // IE8
        var range = document.selection.createRange();
        range.moveStart('character', -input.value.length);
        pos = range.text.length;
    }
    return pos;
}

function setTextPos(input, pos) {
    if (input.selectionStart !== undefined) {
        input.selectionStart = pos;
        input.selectionEnd = pos;
    } else { // IE8
        var range = document.selection.createRange();
        range.moveStart('character', -input.value.length);
        // moveEnd
        // collapse
    }
}

module.exports = {
    getTextPos: getTextPos,
    setTextPos: setTextPos,
};
