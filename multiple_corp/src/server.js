/* eslint no-console: 0 */
/* eslint strict: 0 */

'use strict';

var servers = {
    myWorkTelCount: require('./my/work/telcount/server/server'),
    myWorkChannel: require('./my/work/channel/server/server'),
    // myWorkSale:require('./my/work/sale/server/server'),
    myECApp: require('./my/ecapp/server/server'),
    // bizTag: require('./biz/crm/tag/server/server'),
    // oms:require('./oms/server/server'),
    wwwHelp: require('./www/helpcenter/server/server'),
    //ECFormPC:require('./ecform/pc/server/server'),
    mzoneBroadcast: require('./mzone/broadcast/server/server'),
    // myPublic: require('./my/public/server/server')
};
var env = (process.env.BIZ_NAME || '').trim()

var server = servers[env];
console.log(env)
if (!server) {
    console.error("no " + process.env.BIZ_NAME + " server");
    return;
}

server.run();
