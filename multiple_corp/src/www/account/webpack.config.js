const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HashedModuleIdsPlugin = require('../../comm/utils/HashedModuleIdsPlugin');

const config = require('../../../config');

let buildRunning = false;
let startTime = 0;
const { __DEV__, __PROD__, __TEST__ } = config.globals;
const APP_ENTRY = path.resolve(__dirname, './client/index.js');

const webpackConfig = {
    entry: {
        polyfills: __DEV__ ? [] : ['console-polyfill', 'es6-promise/auto', 'fetch-ie8'],
        commons: [
            'react',
            'react-dom',
            'redux',
            'react-redux',
            // 'react-router',
            'redux-thunk',
            // 'react-router-redux',
            'isomorphic-fetch',
        ],
        account: __DEV__
        ? ['webpack-dev-server/client?http://127.0.0.1/', 'webpack/hot/only-dev-server', APP_ENTRY]
        : [APP_ENTRY]
    },
    resolve: {
        root: path.resolve(__dirname, './client'),
        alias: {
            '~static': path.resolve(__dirname, '../../comm/public'),
            '~comm': path.resolve(__dirname, '../../comm'),
            siteCommon: path.resolve(__dirname, '../common'),
        },
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js', '.jsx'],
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loaders: ['es3ify', 'babel'],
            // exclude: __DEV__ ? /node_modules\/(?!(react-router)\/).*/ : '',
        }, {
            test: /\.less$/,
            loaders: ['style', 'css', 'postcss', 'less'],
        }, {
            test: /\.css$/,
            loaders: ['style', 'css', 'postcss'],
        }, {
            test: /\.(jpg|png|gif)$/,
            loader: 'url?limit=10000&name=images/[name].[ext]'
            // exclude: /node_modules/,
        }, {
            test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
            loader: 'file?name=fonts/[hash].[ext]',
        }, {
            test: /\.html/,
            loader: 'html',
            query: {
                minimize: false,
            },
        }],
    },
    plugins: [
        new webpack.DefinePlugin(config.globals),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
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
};

if (!__TEST__) {
    if (__DEV__) {
        webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({
            names: ['commons', 'manifest'],
            filename: 'js/[name].js',
            minChunks: Infinity,
        }));
    } else {
        webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({
            names: ['commons', 'polyfills', 'manifest'],
            filename: 'js/[name]-[chunkhash].js',
            minChunks: Infinity,
        }));
    }
}

if (__DEV__) {
    webpackConfig.output = {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].js',
        publicPath: '/',
    };
    webpackConfig.devtool = '#eval';
    webpackConfig.plugins.push(
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'client', 'index.html'),
            hash: false,
            filename: 'index.html',
            inject: 'body',
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    );
} else if (__PROD__) {
    webpackConfig.output = {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name]-[chunkhash].js',
        chunkFilename: 'js/[name]-[chunkhash].js',
        publicPath: 'https://1.staticec.com/www/account',
    };
    // webpackConfig.devtool = '#source-map';
    webpackConfig.plugins.push(
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'client', 'index.prod.html'),
            hash: false,
            filename: 'index.html',
            inject: 'body',
            chunks: ['manifest', 'polyfills', 'commons', 'account'],
            chunksSortMode(chunk1, chunk2) {
                const orders = ['manifest', 'polyfills', 'commons', 'account'];
                const order1 = orders.indexOf(chunk1.names[0]);
                const order2 = orders.indexOf(chunk2.names[0]);

                return order1 - order2;
            }
        }),
        new webpack.optimize.OccurrenceOrderPlugin(true),
        new HashedModuleIdsPlugin(),
        new ParallelUglifyPlugin({
            uglifyJS: {
                sourceMap: false,
                compress: {
                    unused: true,
                    dead_code: true,
                    warnings: false,
                    pure_funcs: ['console.log'],
                    // drop_console: true,
                    drop_debugger: true,
                    screw_ie8: false,
                },
                mangle: {
                    screw_ie8: false,
                },
                output: {
                    screw_ie8: false,
                }
            },
        }),
        new OptimizeCssAssetsPlugin({
            cssProcessorOptions: {
                discardComents: {
                    removeAll: true,
                },
            },
        })
    );
}

if (!__DEV__) {
    webpackConfig.module.loaders.filter(loader =>
        loader.loaders && loader.loaders.find(name => /css/.test(name.split('?')[0]))
    ).forEach((loader) => {
        const first = loader.loaders[0];
        const rest = loader.loaders.slice(1);
        /* eslint-disable no-param-reassign */
        loader.loader = ExtractTextPlugin.extract(first, rest.join('!'));
        delete loader.loaders;
        /* eslint-enable no-param-reassign */
    });

    webpackConfig.plugins.push(
        new ExtractTextPlugin('css/[name].[contenthash].css', {
            allChunks: true,
        })
    );
}

module.exports = webpackConfig;
