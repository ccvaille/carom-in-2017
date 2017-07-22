const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../webpack.config.js');
const config = require('..//../../../../../config');

const bizRule = config.bizRule;

const compiler = webpack(webpackConfig);
const server = new WebpackDevServer(compiler, {
    // webpack-dev-server options
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    historyApiFallback: true,
    compress: true,
    stats: {
        colors: true,
    },
    // webpack-dev-middleware options
    quiet: false,
    noInfo: true,
    lazy: false,
    disableHostCheck: true
});

server.listen(bizRule.port, '127.0.0.1', () => {
    // eslint-disable-next-line no-console
    console.log(`dev server start on http://${config.host}:${bizRule.port}`);
});
