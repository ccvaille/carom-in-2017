/*eslint-disable */
module.exports = function(ancestor, child) {
    var c = child;
    var parent = c.parentNode;
    while (parent !== null) {
        if (parent === ancestor) {
            return true;
        }
        parent = parent.parentNode;
    }
    return false;
};
