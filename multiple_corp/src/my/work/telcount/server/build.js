/**
 * 将打包文件放到指定位置
 */

/* eslint no-console: 0 */
/* eslint strict: 0 */

var fs = require("fs");
var path = require("path");
var stat = fs.stat;
var tool = require('../../../../local_tools/tool');

var getNewHash = function() {
    var data = fs.readFileSync(path.resolve(__dirname, '../../../../dist/my/work/telcount/index.html'), "utf-8");

    var hash = /work.(.*).js/.exec(data)[1];
    return hash;
};

var newHash = getNewHash();
var libHash = tool.getLibHash();




tool.deleteFolderRecursive(path.resolve(__dirname, '../../../../../resources/static/my/work/telcount/css'));
tool.deleteFolderRecursive(path.resolve(__dirname, '../../../../../resources/static/my/work/telcount/js'));

tool.copyFolder(path.resolve(__dirname, '../../../../dist/my/work/telcount/'), path.resolve(__dirname, '../../../../../resources/static/my/work/telcount/'));
// tool.copyFolder(path.resolve(__dirname, '../../../../comm/dist/js/'), path.resolve(__dirname, '../../../../../resources/static/my/comm/js/'));

tool.replaceHash(newHash, libHash, path.resolve(__dirname, '../../../../../resources/static/my/work/telcount/telcount_history.html'));
tool.replaceHash(newHash, libHash, path.resolve(__dirname, '../../../../../resources/static/my/work/telcount/telcount_rank.html'));
tool.replaceHash(newHash, libHash, path.resolve(__dirname, '../../../../../resources/static/my/work/telcount/telcount_today.html'));

process.on('exit', tool.delDist);
