const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        vendor: [
            'react',
            'react-dom',
            'redux',
            'react-redux',
            'react-router',
            'redux-thunk',
            'react-router-redux',
            'isomorphic-fetch',
            'classnames',
            'moment',
            'echarts-for-react',
        ],
    },
    output: {
        path: path.join(__dirname, 'vendor'),
        filename: '[name].js',
        library: '[name]_library',
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        new webpack.DllPlugin({
            path: path.join(__dirname, 'vendor', 'manifest.json'),
            name: '[name]_library',
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            compress: {
                unused: true,
                dead_code: true,
                warnings: false,
                drop_console: true,
                drop_debugger: true,
            },
        }),
    ],
};
