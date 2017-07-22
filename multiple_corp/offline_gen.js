const fs = require('fs');
const path = require('path');
const minimist = require('minimist');

const argv = minimist(process.argv.slice(2));
const folder = argv.f;
const offlineType = argv.t;
const offlineName = argv.n;

if (!folder || !offlineType || !offlineName) {
    throw new Error('参数错误');
}

const acceptType = ['.js', '.css', '.png', '.jpg', '.jpeg', '.eot', '.svg', '.ttf', '.woff', '.woff2'];

function walk(dir) {
    if (fs.statSync(dir).isDirectory()) {
        return [].concat(...fs.readdirSync(dir).map(f => walk(path.join(dir, f).replace(/\\/g, '/'))));
    }

    return dir;
}

const r = walk(folder).filter(p => acceptType.indexOf(path.extname(p)) > -1);

function transformToUrl(result) {
    return result.map(re => re.replace('resources/static', 'https://1.staticec.com'));
}

const paths = {};

const urls = transformToUrl(r);

urls.forEach(url => {
    paths[url] = 1;
});

const fileContent = `var json = ${JSON.stringify(paths, null, 4)}
module.exports = json;
`;

const offlinePath = path.resolve(`./resources/offline_package/src/${offlineType}/${offlineName}`);
fs.writeFile(offlinePath, fileContent, 'utf-8', (err) => {
    if (err) {
        throw new Error('生成离线包 js 文件失败');
    }

    console.log('生成成功');
});
