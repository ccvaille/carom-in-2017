/* eslint no-console: 0 */
/* eslint strict: 0 */

'use strict';

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('../webpack.config.js');
const omsConfig = require('../../config').oms;


let host = omsConfig.host;
let port = omsConfig.port;
let proxyTarget = 'https://' + omsConfig.proxyIP;

console.log(proxyTarget);

// 使用 webpack dev server，实现热加载等开发功能

// 处理 webpack 生产配置
// 1.添加 webpack-dev-server 和 hot
config.entry.bundle.unshift('webpack/hot/dev-server', `webpack-dev-server/client?http://${host}:${port}/`);
config.plugins.push(new webpack.HotModuleReplacementPlugin());

// 2.修改输出的文件名称
// config.output.chunkFilename = 'js/[name].js';
//config.output.filename = 'js/[name].js';

// 3.移除__PRODUCTION__=true，移除单独提取样式文件，移除压缩代码
// config.plugins = config.plugins.slice(3);
// config.module.loaders[0].loaders = ['style', 'css', 'less'];

// 4.添加 source-map
config.devtool = ['source-map'];



let compiler = webpack(config);
let server = new WebpackDevServer(compiler, {disableHostCheck: true,
    hot: true,
    historyApiFallback: true,
    quiet: false,
    noInfo: false,
    disableHostCheck:true,
    // proxy: {
    //     '/order/index/showprovince': {
    //         target: proxyTarget,
    //         changeOrigin: true,
    //         secure: false,
    //         headers: {
    //             "host": 'oms.workec.com'
    //         }
    //     },
    //     '/order/index/orderdetail': {
    //         target: proxyTarget,
    //         changeOrigin: true,
    //         secure: false,
    //         headers: {
    //             "host": 'oms.workec.com'
    //         }
    //     },
    //     '/order/index/analysisdiagram': {
    //         target: proxyTarget,
    //         changeOrigin: true,
    //         secure: false,
    //         headers: {
    //             "host": 'oms.workec.com'
    //         }
    //     },
    //     '/buy/index/grtrend': {
    //         target: proxyTarget,
    //         changeOrigin: true,
    //         secure: false,
    //         headers: {
    //             "host": 'oms.workec.com'
    //         }
    //     },
    //     '/buy/index/acloss': {
    //         target: proxyTarget,
    //         changeOrigin: true,
    //         secure: false,
    //         headers: {
    //             "host": 'oms.workec.com'
    //         }
    //     },
    //     '/buy/index/purbusiness': {
    //         target: proxyTarget,
    //         changeOrigin: true,
    //         secure: false,
    //         headers: {
    //             "host": 'oms.workec.com'
    //         }
    //     },
    //     '/buy/index/corploss': {
    //         target: proxyTarget,
    //         changeOrigin: true,
    //         secure: false,
    //         headers: {
    //             "host": 'oms.workec.com'
    //         }
    //     },
    //     '/buy/index/retain': {
    //         target: proxyTarget,
    //         changeOrigin: true,
    //         secure: false,
    //         headers: {
    //             "host": 'oms.workec.com'
    //         }
    //     },
    //     'https://admin.workec.com/default/index/asyncexport': {
    //         target: proxyTarget,
    //         changeOrigin: true,
    //         secure: true,
    //         headers: {
    //             "host": 'admin.workec.com'
    //         }
    //     }
    // }
});
server.listen(port, host, () => {
    console.log(`dev server  # ${__dirname} # start on https://${host}:${port}`);
});
