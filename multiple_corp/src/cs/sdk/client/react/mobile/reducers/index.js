// Use require.context to require reducers automatically
// Ref: https://webpack.github.io/docs/context.html
var context = require.context('./', false, /\.js$/);
var keys = context.keys().filter(function (item) {
    return item !== './index.js';
});

var reducers = keys.reduce(function (memo, key) {
    // eslint-disable-next-line no-param-reassign, no-useless-escape
    memo[key.match(/([^\/]+)\.js$/)[1]] = context(key);
    return memo;
}, {});

module.exports = reducers;
