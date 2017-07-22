const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../webpack.config.js');
const config = require('../../../../config');

const adminConfig = config.adminSecurity;

const compiler = webpack(webpackConfig);
const server = new WebpackDevServer(compiler, {disableHostCheck: true,
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
    '/my': {
      target: {
        host: 'my.workec.com',
        protocol: 'https:',
        port: 443,
      },
      // ignorePath: true,
      changeOrigin: true,
      secure: true,
      pathRewrite: {
        '^/my': '',
      },
      // headers: {
      //   host: 'my.workec.com',
      // },
    },
    '/admin': {
      target: {
        host: 'admin.workec.com',
        protocol: 'https:',
        port: 443,
      },
      // ignorePath: true,
      changeOrigin: true,
      secure: true,
      pathRewrite: {
        '^/admin': '',
      },
      // headers: {
      //   host: 'my.workec.com',
      // },
    },
  },
});

server.listen(adminConfig.port, config.host, () => {
  // eslint-disable-next-line no-console
  console.log(`dev server  # ${__dirname} # start on http://${config.host}:${adminConfig.port}`);
});
