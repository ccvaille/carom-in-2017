/* eslint no-console: 0 */
/* eslint strict: 0 */

'use strict';
const myWorkConfig = require('../../../../config').myWork;
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../webpack.config.js');

let host = myWorkConfig.host;
let port = myWorkConfig.port;
let compiler = webpack(webpackConfig);
let proxyTarget = 'http://' + myWorkConfig.proxyIP;

let getServer = function () {
    var server = new WebpackDevServer(compiler, {disableHostCheck: true,
        hot: true,
        historyApiFallback: true,
        quiet: false,
        noInfo: false,
        proxy: {
            // '/work/export/getnums': {
            //     target: proxyTarget,
            //     changeOrigin: true,
            //     secure: false,
            //     headers: {
            //         "host": 'my.workec.com'
            //     }
            // },
            // '/work/telcount/gettoday': {
            //     target: proxyTarget,
            //     changeOrigin: true,
            //     secure: false,
            //     headers: {
            //         "host": 'my.workec.com'
            //     }
            // },
            // '/work/telcount/gethistory': {
            //     target: proxyTarget,
            //     changeOrigin: true,
            //     secure: false,
            //     headers: {
            //         "host": 'my.workec.com'
            //     }
            // },
            // '/work/telcount/getrank': {
            //     target: proxyTarget,
            //     changeOrigin: true,
            //     secure: false,
            //     headers: {
            //         "host": 'my.workec.com'
            //     }
            // },
            // '/work/channel/view': {
            //     target: proxyTarget,
            //     changeOrigin: true,
            //     secure: false,
            //     headers: {
            //         "host": 'my.workec.com'
            //     }
            // }

        }
    });
    return server;
}

exports.run = function () {
    let server = getServer();
    server.listen(port, host, () => {
        console.log(`dev server  # ${__dirname} # start on http://${host}:${port}`);
    });
}
