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
    var data = fs.readFileSync(path.resolve(__dirname, '../../../dist/mzone/broadcast/index.html'), "utf-8");

    var hash = /work.(.*).js/.exec(data)[1];
    return hash;
};

var newHash = getNewHash();
var libHash = tool.getLibHash();




tool.deleteFolderRecursive(path.resolve(__dirname, '../../../../resources/static/mzone/broadcast/css'));
tool.deleteFolderRecursive(path.resolve(__dirname, '../../../../resources/static/mzone/broadcast/js'));

tool.copyFolder(path.resolve(__dirname, '../../../dist/mzone/broadcast/'), path.resolve(__dirname, '../../../../resources/static/mzone/broadcast/'));
// tool.copyFolder(path.resolve(__dirname, '../../../../comm/dist/js/'), path.resolve(__dirname, '../../../../../resources/static/mzone/broadcast/'));

tool.replaceHash(newHash, libHash, path.resolve(__dirname, '../../../../resources/static/mzone/broadcast/index.html'));

process.on('exit', tool.delDist);
