/**
 * 打包系统，使用方式：node app.js
 */
var fs = require('fs');
var path = require('path');

var pcObj = {
    box_touch_tellog: require(path.resolve(__dirname, './src/pc/box_touch_tellog')),
    crm_detail: require('./src/pc/crm_detail'),
    crm_corp: require('./src/pc/crm_corp'),
    crm: require('./src/pc/crm'),
    kf_client: require('./src/pc/kf_client'),
    my_public: require('./src/pc/my_public.js')
}
var mobileObj = {
    h5app: require('./src/mobile/h5app')
}

var analyse = function (obj, name) {

    var arr = [];
    var result = [];
    var common = {

    };
    var getString = function (obj) {
        let arr = [];
        let result = [];
        for (var o in obj) {
            arr.push(o);
        }
        arr = arr.sort();

        for (var i = 0; i < arr.length; i++) {
            result.push('    "' + arr[i] + '": 1');
        }
        if (arr.length == 0) {
            return [];
        }
        result[0] = '\r\n' + result[0];
        return result;
    }

    for (var o in obj) {
        arr.push(o);
    }

    arr = arr.sort();



    for (var i = 0; i < arr.length; i++) {
        var item = obj[arr[i]];
        for (var key in item) {
            for (var m = i + 1; m < arr.length; m++) {
                let innerItem = obj[arr[m]];
                if (innerItem[key]) {
                    common[key] = 1;
                    delete item[key];
                    delete innerItem[key];
                }
            }
        }
    }

    // result.push('    //common')//模块注释

    result = result.concat(getString(common));


    for (var i = 0; i < arr.length; i++) {
        // result.push('\r\n    //' + arr[i]);//模块注释
        result = result.concat(getString(obj[arr[i]]));
    }
    console.log("{\r\n" + result.join(',\r\n') + "\r\n}");

    fs.writeFileSync(name, "{\r\n" + result.join(',\r\n') + "\r\n}", {}, function (err) {
        if (err) {
            throw err;
        }
    });
}

analyse(pcObj, "./dist/pc.json");
analyse(mobileObj, "./dist/mobile.json");
