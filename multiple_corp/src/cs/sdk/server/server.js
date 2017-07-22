/* eslint no-console: 0 */
/* eslint strict: 0 */

'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const webpack = require('webpack');
// const WebpackDevServer = require('webpack-dev-server');
const config = require('../webpack.config.js');

const host = '127.0.0.1';
const port = 8080;

// config.plugins = config.plugins.slice(3);
// config.module.loaders[0].loaders = ['style', 'css', 'less'];

const compiler = webpack(config);

const app = express();

const publicPath = path.resolve(__dirname);
app.use(bodyParser.json({ type: 'application/json' }));

app.use(require('webpack-dev-middleware')(compiler, {
    historyApiFallback: true,
    quiet: false,
    noInfo: false,
    publicPath: config.output.publicPath,
}));
app.use(require('webpack-hot-middleware')(compiler, {
    path: '/__webpack_hmr',
}));
app.use(express.static(publicPath));

app.use('/kf/sdk/:file', function (req, res, next) {
    const filename = req.params.file || 'index.html';
    const filepath = path.join(compiler.outputPath, `${filename}`);

    compiler.outputFileSystem.readFile(filepath, (err, result) => {
        if (err) {
            return next(err);
        }
        res.set('content-type', 'text/html');
        res.send(result);
        res.end();
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`dev server  # ${__dirname} # start on http://${host}:${port}`);
});
