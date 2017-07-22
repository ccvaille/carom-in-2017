/* eslint no-console: 0 */
/* eslint strict: 0 */

'use strict';

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('../webpack.config.js');
const ECFormPCConfig = require('../../config').ECFormPC;


let host = ECFormPCConfig.host;
let port = ECFormPCConfig.port;


// 使用 webpack dev server，实现热加载等开发功能

// 处理 webpack 生产配置
// 1.添加 webpack-dev-server 和 hot
config.entry.bundle.unshift('webpack/hot/dev-server', `webpack-dev-server/client?http://${host}:${port}/`);
config.plugins.push(new webpack.HotModuleReplacementPlugin());

// 3.移除__PRODUCTION__=true，移除单独提取样式文件，移除压缩代码
config.plugins = config.plugins.slice(3);
config.module.loaders[0].loaders = ['style', 'css', 'less'];

// 4.添加 source-map
config.devtool = ['source-map'];

let compiler = webpack(config);
let server = new WebpackDevServer(compiler, {disableHostCheck: true,
    hot: true,
    historyApiFallback: true,
    disableHostCheck: true,
    compress: true,
    stats: {
        colors: true
    },
    quiet: false,
    noInfo: true,
    lazy: false
});
server.listen(port, host, () => {
    console.log(`dev server  # ${__dirname} # start on https://${host}:${port}`);
});
