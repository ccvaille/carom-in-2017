const HTMLWebpackPlugin =  require('html-webpack-plugin');

const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
    chunks:['app'],
    template:  `${__dirname}/app/index.html`,
    filename:  'index.html',
    inject: 'body',
});

const HTMLWebpackPluginConfig2 = new HTMLWebpackPlugin({
    chunks: ['props'],
    template:  `${__dirname}/props/index.html`,
    filename:  'props.html',
    inject: 'body',
});

const HTMLWebpackPluginConfig3 = new HTMLWebpackPlugin({
    chunks: ['state'],
    template:  `${__dirname}/props/index.html`,
    filename:  'state.html',
    inject: 'body',
});

module.exports = {
    entry: {
        app: './app/index.js',
        props: './props/index.js',
        state: './state/index.js',
    },
    output: {
        path: `${__dirname}/dist`,
        // filename: 'index_bundle.js',
        chunkFilename: 'js/[name].[hash:5].js',
        filename: 'js/[name].js',        
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015','react'],
                }
            },
        ],
    },
    devServer: {
        inline: true,
        port: 8008,
    },
    plugins: [HTMLWebpackPluginConfig,HTMLWebpackPluginConfig2,HTMLWebpackPluginConfig3],
};