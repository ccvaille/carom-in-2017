/* eslint no-console: 0 */
/* eslint strict: 0 */

'use strict';
const myWorkConfig = require('../../../config').myPublic;
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../webpack.config.js');

let host = myWorkConfig.host;
let port = myWorkConfig.port;
let compiler = webpack(webpackConfig);

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
