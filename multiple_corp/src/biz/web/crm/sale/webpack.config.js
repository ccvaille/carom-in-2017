const chalk = require('chalk');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const env = process.env.NODE_ENV.trim() || 'dev';
var nodemodulesPath = path.resolve(__dirname,'node_modules');

console.log('"' + env + '"', typeof env, env === 'dev');
var  buildRunning = false;
var  startTime = 0;

module.exports = {
    entry: {
        bundle: [path.resolve(__dirname, './client/index.js')],
        polyfill: [path.resolve(__dirname, './client/polyfill.js')]
    },
    output: {
        path: path.resolve(__dirname, '../../../../dist/public/biz/'),
        chunkFilename: 'js/[name].[hash:5].js',
        filename: 'js/[name].[hash:5].js',

        //publicPath: env === 'dev' ? '/' :  '/'
        publicPath: env === 'dev' ? '/' :  '//html.workec.com/biz/web/crm/sale/'
    },
    plugins: [
        new webpack.DefinePlugin({
            __PRODUCTION__: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: true
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')  // '"' + env + '"'
            }
        }),
        new HtmlWebpackPlugin({
            title: 'ant-design-redux',
            template: path.resolve(__dirname, './server/index.html'),
            filename: "index.html"
        }),
        new webpack.ProgressPlugin((percentage, msg) => {
            const stream = process.stderr;

            if (!buildRunning) {
                buildRunning = true;
                startTime = new Date();
            } else if (stream.isTTY && percentage < 0.71) {
                stream.cursorTo(0);
                stream.write(`📦  ${chalk.magenta(msg)}`);
                stream.clearLine(1);
            } else if (percentage === 1) {
                const now = new Date();
                const buildTime = `${(now - startTime) / 1000}s`;
                console.log(chalk.green(`\nwebpack: bundle build completed in ${buildTime}.`));

                buildRunning = false;
            }
        }),
    ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [{
            test: /\.less$/,
            loaders: ['style', 'css','less' ],
        }, {
            test: /\.css$/,
            loaders: ['style', 'css'],
        }, {
            test: /\.jsx?$/,
            loader: 'babel',
            exclude: [/node_modules/, './www/comm/public']
        }, {
            test: /\.(jpg|png|gif|woff|svg|eot|ttf)\??.*$/,
            loaders: ['url?&name=../../../../comm/public/images/[name].[ext]'],
            exclude: /node_modules/
        }]
    }
};
