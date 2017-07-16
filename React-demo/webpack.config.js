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

const HTMLWebpackPluginConfig4 = new HTMLWebpackPlugin({
    chunks: ['event'],
    template:  `${__dirname}/eventHandle/index.html`,
    filename:  'event.html',
    inject: 'body',
});

const HTMLWebpackPluginConfig5 = new HTMLWebpackPlugin({
    chunks: ['refs'],
    template:  `${__dirname}/refs/index.html`,
    filename:  'refs.html',
    inject: 'body',
});

const HTMLWebpackPluginConfig6 = new HTMLWebpackPlugin({
    chunks: ['life'],
    template:  `${__dirname}/life/index.html`,
    filename:  'life.html',
    inject: 'body',
});

const HTMLWebpackPluginConfig7 = new HTMLWebpackPlugin({
    chunks: ['ajax'],
    template:  `${__dirname}/ajax/index.html`,
    filename:  'ajax.html',
    inject: 'body',
});
const HTMLWebpackPluginConfig8 = new HTMLWebpackPlugin({
    chunks: ['tab'],
    template:  `${__dirname}/tab/index.html`,
    filename:  'tab.html',
    inject: 'body',
});

module.exports = {
    entry: {
        app: './app/index.js',
        props: './props/index.js',
        state: './state/index.js',
        event: './eventHandle/index.js',   
        refs: './refs/index.js',
        life: './life/index.js',
        ajax: './ajax/index.js' ,
        tab: './tab/index.js'      
              
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
    plugins: [HTMLWebpackPluginConfig,HTMLWebpackPluginConfig2,HTMLWebpackPluginConfig3,HTMLWebpackPluginConfig4,HTMLWebpackPluginConfig5,HTMLWebpackPluginConfig6,HTMLWebpackPluginConfig7,HTMLWebpackPluginConfig8],
};