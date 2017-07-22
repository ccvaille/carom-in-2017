// Use require.context to require reducers automatically
// Ref: https://webpack.github.io/docs/context.html
// var context = require.context('./', false, /\.js$/);
// var keys = context.keys().filter(function (item) {
//     return item !== './index.js';
// });

// var reducers = keys.reduce(function (memo, key) {
//     // eslint-disable-next-line no-param-reassign, no-useless-escape
//     memo[key.match(/([^\/]+)\.js$/)[1]] = context(key);
//     return memo;
// }, {});
var app = require('./app');
var csInfo = require('./csInfo');
var input = require('./input');
var msg = require('./msg');
var msgBoard = require('./msgBoard');
var notice = require('./notice');
var reducers = {
    app: app,
    csInfo: csInfo,
    input: input,
    msg: msg,
    msgBoard: msgBoard,
    notice: notice
};

module.exports = reducers;
