const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const env = (process.env.NODE_ENV || 'dev').trim();
const config = require('../../config').mzoneBroadcast;

var webpackConfig = {
    entry: {
        work: ['babel-polyfill',path.resolve(__dirname, './client/index.js')]
    },
    output: {
        path: path.resolve(__dirname, '../../dist/mzone/broadcast/'),
        chunkFilename: 'js/[name].[hash:5].js',
        filename: 'js/[name].[hash:5].js',
        publicPath: env === 'dev' ? '/' : '//1.staticec.com/mzone/broadcast/'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'ant-design-redux',
            template: path.resolve(__dirname, './server/index.html'),
            filename: "index.html"
        }),
        new HtmlWebpackPlugin({
            title: 'ant-design-redux',
            inject: false,
            template: path.resolve(__dirname, './server/list.html'),
            filename: "list.html"
        }),
        new HtmlWebpackPlugin({
            title: 'ant-design-redux',
            inject: false,
            template: path.resolve(__dirname, './server/editor.html'),
            filename: "editor.html"
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'dev')
        }), 
    ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [{
            test: /\.(less|css)?$/,
            loaders: ['style', 'css', 'less'],
            // include: path.resolve(__dirname, '../')
        },{
            test: /\.(jsx|js)?$/,
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


if (env == 'production') {
    webpackConfig.module.loaders[0].loaders = [ExtractTextPlugin.extract('style'), 'css', 'less'];
    
    webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }));

    webpackConfig.plugins.push(new ExtractTextPlugin('css/[name].[hash:5].css',{allChunks: true}));

} else {
    let host = config.host;
    let port = config.port;

    webpackConfig.entry.work.unshift('webpack/hot/dev-server', `webpack-dev-server/client?http://${host}:${port}/`);
    webpackConfig.devtool = ['source-map'];
    webpackConfig.module.loaders[0].loaders = ['style', 'css', 'less'];
    webpackConfig.plugins.push(new OpenBrowserPlugin({ url: 'http://static.workec.com' }));
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = webpackConfig;
