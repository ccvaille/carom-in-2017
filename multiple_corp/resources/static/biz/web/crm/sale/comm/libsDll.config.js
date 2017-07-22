const path = require('path');
const webpack = require('webpack');
const config = require('../../config');

const vendors = config.vendors;

module.exports = {
  entry: {
    commonLibs: vendors,
  },
  output: {
    filename: '[name]_[hash].js',
    path: path.join(__dirname, 'libs'),
    library: '[name]_[hash]',
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false,
      },
    }),
    new webpack.DllPlugin({
      path: path.join(__dirname, 'libs', '[name]-manifest.json'),
      name: '[name]_[hash]',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
  ],
};
