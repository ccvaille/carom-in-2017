/**
 * come from jquery https://github.com/jquery/jquery/blob/master/src/core.js
 */

/* eslint-disable */
var toString = Object.prototype.toString;

var isObject = function(obj) {
    var type = typeof obj;
    return type === 'object' && !!obj;
};

var isArray = function(obj) {
    if (Array.isArray) {
        return Array.isArray(obj);
    }

    return toString.call(obj) === '[object Array]';
}

function merge() {
    var source;
    var clone;
    var target = arguments[0] || {};
    var i = 1;
    var length = arguments.length;

    if (typeof target !== 'object' && !typeof target === 'function') {
        target = {};
    }

    for (; i < length; i++) {
        if ((source = arguments[i]) != null) {
            for (name in source) {
                src = target[name];
                copy = source[name];

                if (target === copy) {
                    continue;
                }

                if (copy && isObject(copy) || isArray(copy)) {
                    if (isArray(copy)) {
                        clone = src && isArray(src) ? src : [];
                    } else {
                        clone = src && isObject(src) ? src : {};
                    }

                    target[name] = merge(clone, copy);
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }

    return target;
}

module.exports = merge;
