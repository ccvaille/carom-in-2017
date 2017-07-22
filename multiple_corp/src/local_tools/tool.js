/* eslint no-console: 0 */
/* eslint strict: 0 */

/**
 * 该JS主要解决的是生成一个符合发布标准的文件夹结构，以及将本地运行的首页替换为后端需要的PHP页面。
 */

var fs = require("fs");
var path = require("path");
var stat = fs.stat;
var copyFolder = function (src, dst) {
    // 读取目录中的所有文件/目录
    fs.readdir(src, function (err, paths) {
        if (err) {
            throw err;
        }
        paths.forEach(function (path) {
            var _src = src + '/' + path,
                _dst = dst + '/' + path,
                readable, writable;
            stat(_src, function (err, st) {
                if (err) {
                    throw err;
                }
                // 判断是否为文件
                if (st.isFile()) {
                    // 创建读取流
                    readable = fs.createReadStream(_src);
                    // 创建写入流
                    writable = fs.createWriteStream(_dst);
                    // 通过管道来传输流
                    readable.pipe(writable);
                }
                // 如果是目录则递归调用自身
                else if (st.isDirectory()) {
                    exists(_src, _dst, copyFolder);
                }
            });
        });
    });
};

// 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
var exists = function (src, dst, callback) {
    fs.exists(dst, function (exists) {
        // 已存在
        if (exists) {
            callback(src, dst);
        }
        // 不存在
        else {
            fs.mkdir(dst, function () {
                callback(src, dst);
            });
        }
    });
};

// 创建目录
var mkdirs = function (dirpath, mode, callback) {
    fs.exists(dirpath, function (exists) {
        if (exists) {
            callback(dirpath);
        } else {
            //尝试创建父目录，然后再创建当前目录
            mkdirs(path.dirname(dirpath), mode, function () {
                fs.mkdir(dirpath, mode, callback);
            });
        }
    });
};

//删除文件夹
var deleteFolderRecursive = function (path) {
    var files = [];

    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);

        files.forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });

        fs.rmdirSync(path);
    }
};

var ClearBr = function (key) {
    key = key.replace(/<\/?.+?>/g, "");
    key = key.replace(/[\r\n]/g, "");
    return key;
};

var deleteOldJSFile = function (newMd5Val) {
    var dir = path.resolve(__dirname, './../../../public/cdn/my/js/');
    var arr = fs.readdirSync(dir);
    console.log(arr);
    for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        if (item.indexOf(newMd5Val) == -1) {
            fs.unlinkSync(path.resolve(dir, item));
        }
    }
};

var deleteOldCSSFile = function (newMd5Val) {
    var dir = path.resolve(__dirname, './../../../public/cdn/my/css/');
    var arr = fs.readdirSync(dir);
    console.log(arr);
    for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        if (item.indexOf(newMd5Val) == -1) {
            fs.unlinkSync(path.resolve(dir, item));
        }
    }
};

var replaceHash = function (newHash, libHash, filePath, callback) {
    var data = fs.readFileSync(filePath, "utf-8");

    data = data.replace(/work(\..*)?\.js/, "work." + newHash + ".js");
    data = data.replace(/work(\..*)?\.css/, "work." + newHash + ".css");
    data = data.replace(/lib(_.*)?\.js/, "lib_" + libHash + ".js");
    fs.writeFile(filePath, data);

    console.log(newHash + '  ' + libHash);
};

var getLibHash = function () {
    var data = fs.readFileSync(path.resolve(__dirname, '../comm/manifest.json'), "utf-8");
    var json = JSON.parse(data);
    var name = json.name;
    var hash = name.replace('lib_', '');
    return hash;
};

var delDist = function () {
    deleteFolderRecursive(path.resolve(__dirname, '../dist'));
};

exports.delDist = delDist;
exports.getLibHash = getLibHash;
exports.copyFolder = copyFolder;
exports.replaceHash = replaceHash;
exports.exists = exists;
exports.mkdirs = mkdirs;
exports.deleteFolderRecursive = deleteFolderRecursive;
