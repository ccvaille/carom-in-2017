const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const config = require('../../../config');
const baseConfig = require('../../../webpack.base.config');

const { __DEV__, __PROD__, __TEST__ } = config.globals;
const APP_ENTRY = path.resolve(__dirname, './client/index.js');

delete baseConfig.entry.commons;

baseConfig.entry.client = __DEV__
    ? [`webpack-dev-server/client?http://${config.host}:${config.csClient.port}/`, 'webpack/hot/only-dev-server', 'babel-polyfill', APP_ENTRY]
    : ['babel-polyfill', APP_ENTRY];

baseConfig.resolve.root = [
    // path.resolve(__dirname, '../comm/services'),
    path.resolve(__dirname, './client'),
];
// baseConfig.resolve.modulesDirectories.push('./src');
baseConfig.resolve.alias['~cscommon'] = path.resolve(__dirname, '../common');

baseConfig.plugins.push(
    new webpack.DllReferencePlugin({
        context: path.join(__dirname, '../../../'),
        // eslint-disable-next-line global-require
        manifest: require('./vendor/manifest.json'),
    })
);

if (__DEV__) {
    baseConfig.plugins.push(
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'client', 'index.html'),
            hash: false,
            filename: 'index.html',
            inject: 'body',
        })
    );
    baseConfig.plugins.push(
        new AddAssetHtmlPlugin({
            filepath: require.resolve('./vendor/vendor.js'),
        })
    );
} else if (__PROD__) {
    baseConfig.output.publicPath = 'https://1.staticec.com/kf/client/';
    baseConfig.plugins.push(
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'client', 'index.prod.html'),
            hash: false,
            filename: 'index.html',
            inject: 'body',
        })
    );
    baseConfig.plugins.push(
        new AddAssetHtmlPlugin({
            filepath: require.resolve('./vendor/vendor.js'),
            outputPath: '/js',
            publicPath: 'https://1.staticec.com/kf/client/js',
        })
    );
}

if (!__TEST__) {
    baseConfig.output.path = path.join(__dirname, '..', '..', 'dist', 'cs', 'client');
}

module.exports = baseConfig;
