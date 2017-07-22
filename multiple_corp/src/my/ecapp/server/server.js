/* eslint no-console: 0 */
/* eslint strict: 0 */

'use strict';
const myAppConfig = require('../../../config').myECApp;
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../webpack.config.js');

let host = myAppConfig.host;
let port = myAppConfig.port;
let compiler = webpack(webpackConfig);
let proxyTarget = 'https://' + myAppConfig.proxyIP;

let getServer = function () {
    var server = new WebpackDevServer(compiler, {disableHostCheck: true,
        hot: true,
        historyApiFallback: true,
        quiet: false,
        noInfo: false
    });
    return server;
}



exports.run = function () {
    let server = getServer();
    server.listen(port, host, () => {
        console.log(`dev server  # ${__dirname} # start on http://${host}:${port}`);
    });
}

//exports.run();
