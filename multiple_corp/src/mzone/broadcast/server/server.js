/* eslint no-console: 0 */
/* eslint strict: 0 */

'use strict';
const mzoneBroadcastConfig = require('../../../config').mzoneBroadcast;
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../webpack.config.js');

let host = mzoneBroadcastConfig.host;
let port = mzoneBroadcastConfig.port;
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
