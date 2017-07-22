const tool = require('../../../local_tools/tool');
const webpack = require('webpack');
const config = require('../webpack.config.js');



var complier = webpack(config);

var complie = function (callback) {
    return complier.run((err, stats) => {
        return callback(err, stats);
    });
}

exports.complie = complie;