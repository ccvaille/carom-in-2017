const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../webpack.config.js');
const config = require('../../../../config');

const securityConfig = config.wwwSecurity;

const compiler = webpack(webpackConfig);
const server = new WebpackDevServer(compiler, { disableHostCheck: true,
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

    proxy: {
        '/corp': {
            target: {
                host: 'corp.workec.com',
                protocol: 'https:',
                port: 443,
            },
      // ignorePath: true,
            changeOrigin: true,
            secure: true,
            pathRewrite: {
                '^/corp': '',
            },
      // headers: {
      //   host: 'my.workec.com',
      // },
        },
        '/www': {
            target: {
                host: 'www.workec.com',
                protocol: 'https:',
                port: 443,
            },
      // ignorePath: true,
            changeOrigin: true,
            secure: true,
            pathRewrite: {
                '^/www': '',
            },
        },
        '/api': {
            target: {
                host: 'api.workec.com',
                protocol: 'https:',
                port: 443,
            },
      // ignorePath: true,
            changeOrigin: true,
            secure: true,
            pathRewrite: {
                '^/api': '',
            },
        },
    },
});

server.listen(securityConfig.port, config.host, () => {
  // eslint-disable-next-line no-console
    console.log(`dev server  # ${__dirname} # start on http://${config.host}:${securityConfig.port}`);
});
