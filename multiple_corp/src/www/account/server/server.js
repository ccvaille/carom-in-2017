const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../webpack.config.js');

// const csClientConfig = config.csClient;

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
    disableHostCheck: true,
    // webpack-dev-middleware options
    quiet: false,
    noInfo: true,
    lazy: false,
});

exports.run = () => {
    server.listen(80, '127.0.0.1', () => {
        // eslint-disable-next-line no-console
        console.log('dev server start on http://static.workec.com');
    });
};
