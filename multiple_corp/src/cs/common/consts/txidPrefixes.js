/*eslint-disable */
var guestTypes = require('./guestTypes');
var prefixes = {};

prefixes[guestTypes.CS] = '';
prefixes[guestTypes.WEB] = 'guest_';
prefixes[guestTypes.WX] = 'wx_';
prefixes[guestTypes.QQ] = 'qq_';

module.exports = prefixes;
