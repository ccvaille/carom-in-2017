const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('../../../../config');
const baseConfig = require('../../../../webpack.base.config');

const { __DEV__, __PROD__, __TEST__ } = config.globals;
const APP_ENTRY = path.resolve(__dirname, './client/index.js');

baseConfig.entry.crmMessage = __DEV__
    ? [`webpack-dev-server/client?http://${config.host}:${config.crmMessage.port}/`, 'webpack/hot/only-dev-server', 'babel-polyfill', APP_ENTRY]
    : ['babel-polyfill', APP_ENTRY];


baseConfig.resolve.root = [
  // path.resolve(__dirname, '../comm/services'),
  path.resolve(__dirname, './client'),
];
// baseConfig.resolve.modulesDirectories.push('./src');

if (__DEV__) {
  baseConfig.plugins.push(
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'client', 'index.html'),
      hash: false,
      filename: 'index.html',
      inject: 'body',
    })
  );
} else if (__PROD__) {
  baseConfig.output.publicPath = 'https://1.staticec.com/my/crm/message/';
  baseConfig.plugins.push(
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'client', 'index.prod.html'),
      hash: false,
      filename: 'index.html',
      inject: 'body',
    })
  );
}

if (!__TEST__) {
  baseConfig.output.path = path.join(__dirname, '..', '..', 'dist', 'admin', 'admin');
}
baseConfig.devtool = '#source-map';

module.exports = baseConfig;
