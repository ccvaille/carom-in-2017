/**
 * 将打包文件放到指定位置
 */

/* eslint no-console: 0 */
/* eslint strict: 0 */

var fs = require("fs");
var path = require("path");
var stat = fs.stat;
var tool = require('../../../local_tools/tool');

var getNewHash = function() {
    var data = fs.readFileSync(path.resolve(__dirname, '../../../dist/www/help/index.html'), "utf-8");
    var hash = /work.(.*).js/.exec(data)[1];
    return hash;
};

var newHash = getNewHash();
var libHash = tool.getLibHash();




tool.deleteFolderRecursive(path.resolve(__dirname, '../../../../old/www/www.staticec.com/www/help/css'));
tool.deleteFolderRecursive(path.resolve(__dirname, '../../../../old/www/www.staticec.com/www/help/js'));

tool.copyFolder(path.resolve(__dirname, '../../../dist/www/help/'), path.resolve(__dirname, '../../../../old/www/www.staticec.com/www/help/'));
tool.copyFolder(path.resolve(__dirname, '../../../comm/dist/js/'), path.resolve(__dirname, '../../../../old/www/www.staticec.com/www/comm/js/'));

tool.replaceHash(newHash, libHash, path.resolve(__dirname, '../../../../old/www/www.workec.com/templates/support/telcount_history.html'));
tool.replaceHash(newHash, libHash, path.resolve(__dirname, '../../../../old/www/www.workec.com/templates/support/telcount_rank.html'));
tool.replaceHash(newHash, libHash, path.resolve(__dirname, '../../../../old/www/www.workec.com/templates/support/telcount_today.html'));

process.on('exit', tool.delDist);