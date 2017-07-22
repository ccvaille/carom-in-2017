const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const webpackConfig = require("../webpack.config.js");
const config = require("../../../../../config");

const ecformMobile = config.ecformMobile;

const compiler = webpack(webpackConfig);
const server = new WebpackDevServer(compiler, {
    // webpack-dev-server options
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    historyApiFallback: true,
    compress: true,
    stats: {
        colors: true
    },
    disableHostCheck:true,
    // webpack-dev-middleware options
    quiet: false,
    noInfo: true,
    lazy: false
});

server.listen(80, '0.0.0.0', () => {
    // eslint-disable-next-line no-console
    console.log(
        `dev server  # ${__dirname} # start on http://${config.host}:80`
    );
});
