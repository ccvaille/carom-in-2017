const webpack = require("webpack");
var config = require('./dll.config.js');

var complier = webpack(config);

complier.run(function (err, stats) {
    var str = stats.toString({
        reasons: true
    });
    console.log(str);
    process.exit();
})