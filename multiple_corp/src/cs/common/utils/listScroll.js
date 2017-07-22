/*eslint-disable */
module.exports = {
    getPos: function (selector) {
        var list = document.querySelector(selector || '.msg-list');
        return list.scrollTop;
    },
    setPos: function (pos) {
        var list = document.querySelector(selector || '.msg-list');
        return list.scrollTop = pos;
    }
};
