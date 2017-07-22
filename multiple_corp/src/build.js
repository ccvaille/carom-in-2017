var webpack = require('webpack');
var compliers = {
    myWork: require('./my/work/server/complier'),
};
var env = (process.env.BIZ_NAME || '').trim()


var arr = [];

console.log(env);

//打包指定的业务
if (env) {
    let obj = {};
    obj[env] = compliers[env];
    compliers = obj;
}

for (let o in compliers) {
    let item = compliers[o];
    arr.push(item);
}

var index = 0;
var complie = function(err, stats){
    if(stats){
        console.log(stats.toString({
            colors: true
        }));
    }
    let complier = arr[index++];
    if(complier){
        complier.complie(complie);
    }
};

complie();