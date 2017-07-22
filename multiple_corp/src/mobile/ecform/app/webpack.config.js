const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');

const config = require('../../../../config');
const baseConfig = require('../../../../webpack.base.config');
const pxtorem = require('postcss-pxtorem');
const autoprefixer = require('autoprefixer');

const { __DEV__, __PROD__ } = config.globals;
const APP_ENTRY = path.resolve(__dirname, './client/index.js');
baseConfig.entry.ecformApp = __DEV__
    ? [
        `webpack-dev-server/client?http://${config.host}:80/`,
        'webpack/hot/only-dev-server',
        'babel-polyfill',
        APP_ENTRY
    ]
    : ['babel-polyfill', APP_ENTRY];

baseConfig.resolve.root = [
    // path.resolve(__dirname, '../comm/services'),
    path.resolve(__dirname, './client')
];
baseConfig.resolve.modulesDirectories = [
    'node_modules',
    path.join(__dirname, '../node_modules')
];
baseConfig.resolve.extensions.push('.less');
//移动端【高清】方案
baseConfig.postcss = [];
baseConfig.postcss.push(autoprefixer, pxtorem({
    rootValue: 100,
    propWhiteList: [],
}));
// baseConfig.module.loaders.splice(4, 1, {
//     test: /\.(svg)$/i,
//     loader: 'svg-sprite',
//     include: svgDirs, // 把 svgDirs 路径下的所有 svg 文件交给 svg-sprite-loader 插件处理
// });
// console.log(baseConfig.module.loaders);
// .push({
//     test: /\.(svg)$/i,
//     loader: 'svg-sprite',
//     include: svgDirs,  // 把 svgDirs 路径下的所有 svg 文件交给 svg-sprite-loader 插件处理
// });
baseConfig.resolve.extensions = ['', '.web.js', '.js', '.json', '.jsx'];
// baseConfig.resolve.modulesDirectories.push('./src');

if (__DEV__) {
    baseConfig.plugins.push(
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'client', 'index.html'),
            hash: false,
            filename: 'index.html',
            inject: 'body'
        })
    );
    baseConfig.output.path = path.resolve(__dirname, '/');
} else if (__PROD__) {
    baseConfig.output.publicPath = '//1.staticec.com/mobile/ecform/app/';
    baseConfig.output.path = path.join(__dirname, '../../../../resources/static/mobile/ecform/app');
    baseConfig.plugins.push(
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'client', 'index.html'),
            hash: false,
            filename: 'index.html',
            inject: 'body'
        })
    );
    baseConfig.plugins.push(
        new WebpackCleanupPlugin({
            exclude: ['mobile-mock-share.js']
        })
    );
}

// if (!__TEST__) {
//     baseConfig.output.path = path.join(
//         __dirname,
//         "..",
//         "..",
//         "dist",
//         "ecform",
//         "mobile"
//     );
// }

module.exports = baseConfig;
