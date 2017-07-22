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
    var data = fs.readFileSync(path.resolve(__dirname, '../../../../resources/static/my/ecapp/index.html'), "utf-8");
    var hash = /ecapp.(\w*).js/.exec(data)[1];
    return hash;
};

var replaceHash = function(newHash, libHash, filePath, callback) {
    var data = fs.readFileSync(filePath, "utf-8");

    data = data.replace(/ecapp(\..*)?\.js/, "ecapp." + newHash + ".js");
    data = data.replace(/ecapp(\..*)?\.css/, "ecapp." + newHash + ".css");
    data = data.replace(/lib(_.*)?\.js/, "lib_" + libHash + ".js");
    fs.writeFile(filePath, data);

    console.log(newHash + '  ' + libHash);
};

var newHash = getNewHash();
var libHash = tool.getLibHash();

// process.exit();

// tool.deleteFolderRecursive(path.resolve(__dirname, '../../../../resources/static/my/ecapp/css'));
// tool.deleteFolderRecursive(path.resolve(__dirname, '../../../../resources/static/my/ecapp/js'));

replaceHash(newHash, libHash, path.resolve(__dirname, '../../../../old/www/my.workec.com/templates/ecapp/crm_message.html'));
replaceHash(newHash, libHash, path.resolve(__dirname, '../../../../old/www/my.workec.com/templates/ecapp/ec_team.html'));
replaceHash(newHash, libHash, path.resolve(__dirname, '../../../../old/www/my.workec.com/templates/ecapp/enterprise_radio.html'));
replaceHash(newHash, libHash, path.resolve(__dirname, '../../../../old/www/my.workec.com/templates/ecapp/h5_marketing.html'));

//删除旧版本文件
var cssfiles = fs.readdirSync(path.resolve(__dirname, '../../../../resources/static/my/ecapp/css/'));
var jsfiles = fs.readdirSync(path.resolve(__dirname, '../../../../resources/static/my/ecapp/js/'));

for (var i = 0; i < cssfiles.length; i++) {
    var item = cssfiles[i];
    if (item.indexOf(newHash) == -1) {
        fs.unlinkSync(path.resolve(__dirname, '../../../../resources/static/my/ecapp/css/', item));
    }
}

for (var i = 0; i < jsfiles.length; i++) {
    var item = jsfiles[i];
    if (item.indexOf(newHash) == -1) {
        fs.unlinkSync(path.resolve(__dirname, '../../../../resources/static/my/ecapp/js/', item));
    }
}

// process.on('exit');