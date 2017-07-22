const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const env = (process.env.NODE_ENV || 'dev').trim();


var webpackConfig = {
    entry: {
        bundle: [path.resolve(__dirname, './client/index.js')]
    },
    output: {
        path: path.resolve(__dirname, '../../resources/static/ecform/'),
        filename: 'js/[name].[hash:5].js',
        publicPath: env === 'dev' ? '/' : '//1.staticec.com/ecform/'
    },
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            __PRODUCTION__: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"' + env + '"'/* JSON.stringify('production') */
            }
        }),
        new HtmlWebpackPlugin({
            title: 'ant-design-redux',
            template: path.resolve(__dirname, './server/index.html'),
            filename: "index.html"
        }),
        new WebpackCleanupPlugin()
    ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [{
            test: /(\.less|\.css)$/,
            loaders: ['style', 'css','less']
        },
            {
            test: /\.jsx?$/,
            loader: 'babel',
            exclude: /node_modules/
        }, {
            test: /\.(jpg|png|gif|woff|svg|eot|ttf)\??.*$/,
            loader: 'url?limit=10000&name=images/[name].[ext]',
            exclude: /node_modules/
        }]
    }
};

webpackConfig.plugins.push(new webpack.DllReferencePlugin({
    context: path.join(__dirname, '../../'),
    manifest: require('../comm/manifest.json'),
}));


module.exports = webpackConfig;
