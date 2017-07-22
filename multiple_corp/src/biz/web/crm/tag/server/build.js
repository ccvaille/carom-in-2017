/* eslint no-console: 0 */
/* eslint strict: 0 */

/**
 * 该JS主要解决的是生成一个符合发布标准的文件夹结构，以及将本地运行的首页替换为后端需要的PHP页面。
 */

var fs = require("fs");
var path = require("path");
var stat = fs.stat;
var copy = function (src, dst) {
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
                    exists(_src, _dst, copy);
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
//
function mkdirs(dirpath, mode, callback) {
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
function deleteFolderRecursive(distPath) {
    console.log(distPath + ':1');
    distPath = path.resolve(__dirname, distPath);
    var files = [];

    if (fs.existsSync(distPath)) {

        files = fs.readdirSync(distPath);
        console.log(files + ':2');
        files.forEach(function (file, index) {

            var curPath = distPath + "/" + file;

            if (fs.statSync(curPath).isDirectory()) { // recurse

                deleteFolderRecursive(curPath);

            } else { // delete file

                fs.unlinkSync(curPath);

            }

        });

        fs.rmdirSync(distPath);

    }

};
function ClearBr(key) {
    key = key.replace(/<\/?.+?>/g, "");
    key = key.replace(/[\r\n]/g, "");
    return key;
}

function deleteOldJSFile(newMd5Val) {
    var dir = path.resolve(__dirname, '../../../../../../public/cdn/biz/js/');
    var arr = fs.readdirSync(dir);
    console.log(arr);
    for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        if (item.indexOf(newMd5Val) == -1) {
            fs.unlinkSync(path.resolve(dir, item));
        }
    }
}

function deleteOldCSSFile(newMd5Val) {
    var dir = path.resolve(__dirname, '../../../../../../public/cdn/biz/css/');
    var arr = fs.readdirSync(dir);
    console.log(arr);
    for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        if (item.indexOf(newMd5Val) == -1) {
            fs.unlinkSync(path.resolve(dir, item));
        }
    }
}

deleteOldJSFile('xxx');


var begin = function () {
    var temp = __dirname;
    // temp = temp.substring(0, temp.length - 15);
    temp = temp.substring(0, temp.length - 27);

    /*
     //从index.blade.php取出后台的输出的变量，替换到HTML页面中重新生成一个新的PHP文件
     var data=fs.readFileSync(__dirname + '/index.blade.php',"utf-8");
     data =ClearBr(data);
     var data1 = fs.readFileSync(temp + '/src/dist/public/views/biz/index.html',"utf-8");
     data1 = data1.replace(/[\r\n]/g, "");
     data1 = data1.replace(/<script>(.*)<\/script>/g,"<script>" +data+ "</script>");
     fs.writeFile(temp + '/resources/views/index.blade.php',data1);
     */
//获取到生成的MD5串；
    var data1 = fs.readFileSync(temp + '/src/dist/public/biz/index.html', "utf-8");


    var md5Val = /bundle.(.*).js/.exec(data1)[1];
    console.log(md5Val);
//将MD5值替换过去
    var data = fs.readFileSync(__dirname + '/index.blade.php', "utf-8");
    data = data.replace("bundle.js", "bundle." + md5Val + ".js");
    data = data.replace("bundle.css", "bundle." + md5Val + ".css");

//写入到新的文件中；
    fs.writeFile(temp + '/resources/views/biz/index.blade.php', data);

//复制公共部分的图片
    exists(temp + '/src/comm', temp + '/public/cdn/comm', copy);

//复制业务逻辑代码
    exists(temp + '/src/dist/public/biz', temp + '/public/cdn/biz', copy);
//删除生成的临时文件
    setTimeout(function () {
        deleteFolderRecursive("../../../../../dist");
    }, 1000)
//删除生成的临时文件
    // deleteFolderRecursive("dist");
    deleteOldJSFile(md5Val);
    deleteOldCSSFile(md5Val);
};


fs.access(path.resolve(__dirname, './../../../../../dist/public/biz/index.html'), fs.R_OK | fs.W_OK, (err) => {
    if (err) {
        console.log(err);
        process.exit();
    } else {
        begin();
    }
});


