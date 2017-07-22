const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('../../../config');
const baseConfig = require('../../../webpack.base.config');

const { __DEV__, __PROD__, __TEST__ } = config.globals;
const APP_ENTRY = path.resolve(__dirname, './client/index.js');

baseConfig.entry.webview = __DEV__
    ? ['webpack-dev-server/client?http://127.0.0.1/', 'webpack/hot/only-dev-server', 'babel-polyfill', APP_ENTRY]
    : ['babel-polyfill', APP_ENTRY];

baseConfig.resolve.root = [
    path.resolve(__dirname, './client'),
];
baseConfig.resolve.alias['~siteCommon'] = path.resolve(__dirname, '../common');

if (__DEV__) {
    baseConfig.plugins.push(
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'client', 'index.html'),
            hash: false,
            filename: 'index.html',
            inject: 'body',
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'client', 'index.html'),
            hash: false,
            filename: 'kf/webview/visitor/info.html',
            inject: 'body',
        })
    );
} else if (__PROD__) {
    baseConfig.output.publicPath = 'https://1.staticec.com/cs/webview';
    baseConfig.plugins.push(
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'client', 'index.prod.html'),
            hash: false,
            filename: 'index.html',
            inject: 'body',
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'client', 'include.html'),
            hash: false,
            filename: 'visitor/info.html',
            inject: 'body',
        })
    );
}

if (!__TEST__) {
    baseConfig.output.path = path.resolve('../../../dist/cs/webview');
}

module.exports = baseConfig;
