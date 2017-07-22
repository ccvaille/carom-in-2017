const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const env = (process.env.NODE_ENV || 'dev').trim();
const config = require('../../../config').myWork;

var webpackConfig = {
    entry: {
        work: [path.resolve(__dirname, './client/index.js')]
    },
    output: {
        path: path.resolve(__dirname, '../../../dist/my/work/channel/'),
        chunkFilename: 'js/[name].[hash:5].js',
        filename: 'js/[name].[hash:5].js',
        publicPath: env === 'dev' ? '/' :  '//1.staticec.com/my/'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'ant-design-redux',
            template: path.resolve(__dirname, './server/index.html'),
            filename: "index.html"
        })
    ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [{
            test: /\.less?$/,
            loaders: [ExtractTextPlugin.extract('style'), 'css', 'less'],
            // include: path.resolve(__dirname, '../')
        }, {
            test: /\.jsx?$/,
            loader: 'babel',
            exclude: /node_modules/,
            // include: path.resolve(__dirname, '../../'),
            // query: {
            //     presets: ['react', 'stage-2', 'es2015']
            // }
        }, {
            test: /\.(jpg|png|gif)$/,
            loaders: ['url?limit=8192&name=img/[name].[ext]'],
            exclude: /node_modules/
        }]
    }
};

webpackConfig.plugins.push(new webpack.DllReferencePlugin({
    context: path.join(__dirname, '../../../../'),
    manifest: require('../../../comm/manifest.json'),
}));

if (env == 'production') {
    webpackConfig.module.loaders[0].loaders = [ExtractTextPlugin.extract('style'), 'css', 'less'];

    webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }));

    webpackConfig.plugins.push(new ExtractTextPlugin('css/[name].[hash:5].css'));

} else {
    let host = config.host;
    let port = config.port;

    webpackConfig.entry.work.unshift('webpack/hot/dev-server', `webpack-dev-server/client?http://${host}:${port}/`);
    // webpackConfig.devtool = ['source-map'];
    webpackConfig.module.loaders[0].loaders = ['style', 'css', 'less'];
    webpackConfig.plugins.push(new OpenBrowserPlugin({ url: 'http://local.my.workec.com:' + port }));
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = webpackConfig;
