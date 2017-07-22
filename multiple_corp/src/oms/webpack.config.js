const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const env = process.env.NODE_ENV.trim() || 'dev';

console.log(env);

module.exports = {
    entry: {
        bundle: [path.resolve(__dirname, './client/index.js')]
        // polyfill: [path.resolve(__dirname, './oms/client/polyfill.js')]
    },
    output: {
        path: path.resolve(__dirname, '../dist/public/oms'),
        // chunkFilename: 'js/[name].[hash:5].js',
        filename: 'js/[name].[hash:5].js',
        publicPath: env === 'dev' ? '/' : 'https://oms.staticec.com/oms/'
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
    ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loaders: ['style', 'css'],
                // include: path.resolve(__dirname, '../')
            },
            {
                test: /\.less$/,
                loaders: ['style', 'css', 'less'],
                // include: path.resolve(__dirname, '../')
            }, {
                test: /\.jsx?$/,
                loader: 'babel',
                exclude: /node_modules/,
                include: path.resolve(__dirname, '../')
            }, {
                test: /\.(jpg|png|gif)$/,
                loaders: ['url?limit=8192&name=img/[name].[ext]'],
                exclude: /node_modules/
            }]
    }
};
