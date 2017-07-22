/* eslint-disable */
const fs = require('fs-extra');
const originfs = require('fs');
const path = require('path');
const webpack = require('webpack');

process.env.NODE_ENV = 'production';

function compile(config) {
    return new Promise((resolve, reject) => {
        const compiler = webpack(config);

        compiler.run((err, stats) => {
            if (err) {
                return reject(err);
            }

            const jsonStats = stats.toJson();

            if (jsonStats.errors.length > 0) {
                console.log(jsonStats.errors);
                return reject(new Error('Webpack compiler encounter error'));
            }

            return resolve(jsonStats);
        });
    });
}

const builder = () => {
    const staticDest = path.resolve(__dirname, '../../../resources/static/www/account');
    const webpackConfig = require('./webpack.config');

    compile(webpackConfig).then(() => {
        if (originfs.existsSync(staticDest)) {
            fs.removeSync(staticDest);
        }
        fs.mkdirpSync(staticDest);
        fs.copySync(webpackConfig.output.path, staticDest);
        fs.removeSync(webpackConfig.output.path);
    }).catch(err => {
        console.log(err);
        process.exit(1);
    });
};

builder();
