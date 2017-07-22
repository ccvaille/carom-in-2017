const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('../../../../config');
const baseConfig = require('../../../../webpack.base.config');
const pkg = require('./package.json');

const { __DEV__, __PROD__, __TEST__ } = config.globals;
const APP_ENTRY = path.resolve(__dirname, './client/index.js');

let theme = {};

if (pkg.theme && typeof pkg.theme === 'string') {
    let cfgPath = pkg.theme;
    // relative path
    if (cfgPath.charAt(0) === '.') {
        cfgPath = path.resolve(__dirname, cfgPath);
    }
    const getThemeConfig = require(cfgPath);
    theme = getThemeConfig();
} else if (pkg.theme && typeof pkg.theme === 'object') {
    theme = pkg.theme;
}

baseConfig.entry.app = __DEV__
    ? ['webpack-dev-server/client?http://127.0.0.1', 'webpack/hot/only-dev-server', 'babel-polyfill', APP_ENTRY]
    : ['babel-polyfill', APP_ENTRY];

baseConfig.resolve.root = [
    path.resolve(__dirname, './client'),
];
baseConfig.resolve.alias['~siteCommon'] = path.resolve(__dirname, '../common');

const svgDirs = [
    require.resolve('antd-mobile').replace(/warn\.js$/, ''),  // 1. 属于 antd-mobile 内置 svg 文件
    // path.resolve(__dirname, 'src/my-project-svg-foler'),  // 2. 自己私人的 svg 存放目录
];

baseConfig.module.loaders.filter(loader =>
    loader.loaders && loader.loaders.find(name => /less/.test(name.split('?')[0]))
).forEach((loader) => {
    const loadersLength = loader.loaders.length;
    loader.loaders[loadersLength - 1] = `less-loader?{"modifyVars":${JSON.stringify(theme)}}`;
    // const first = loader.loaders[0];
    // const rest = loader.loaders.slice(1);
    // /* eslint-disable no-param-reassign */
    // loader.loader = ExtractTextPlugin.extract(first, rest.join('!'));
    // delete loader.loaders;
    /* eslint-enable no-param-reassign */
});

baseConfig.module.loaders.unshift({
    test: /\.(svg)$/i,
    loader: 'svg-sprite',
    include: svgDirs,  // 把 svgDirs 路径下的所有 svg 文件交给 svg-sprite-loader 插件处理
});

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
    baseConfig.output.publicPath = 'https://1.staticec.com/mobile/www/account';
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
    baseConfig.output.path = path.resolve('../../dist/mobile/www/account');
}

module.exports = baseConfig;
