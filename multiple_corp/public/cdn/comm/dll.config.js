const path = require('path');
const webpack = require('webpack');

const vendors = [
    'react', 'react-dom', 'redux', 'react-redux', 'redux-thunk',
    'react-router',
    'isomorphic-fetch', 'react-cookie', 'echarts-for-react', 'echarts'
];

module.exports = {
    entry: {
        "lib": vendors,
    },
    output: {
        path: path.resolve(__dirname, 'dist/js/'),
        filename: '[name]_[hash:5].js',
        library: '[name]_[hash:5]',
    },
    module: {
        loaders: [{
            test: /\.less?$/,
            loaders: ['css', 'less'],
            // include: path.resolve(__dirname, '../')
        }, {
            test: /\.jsx?$/,
            loader: 'babel',
            exclude: /node_modules/,
        }, {
            test: /\.(jpg|png|gif)$/,
            loaders: ['url?limit=8192&name=img/[name].[ext]'],
            exclude: /node_modules/
        }]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                keep_fnames: true
            },
            // beautify :{
            //     beautify :false,
            //     "max-line-len":200
            // }
        }),
        new webpack.DllPlugin({
            path: path.resolve(__dirname, './manifest.json'),
            name: '[name]_[hash:5]',
            context: path.join(__dirname, '../../'),
        }),
        //react压缩，如果没有此插件，运行会有警告 It looks like you're using a minified copy of the development build of React
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        })
    ],
};
