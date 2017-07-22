const originfs = require('fs');
const path = require('path');
const fs = require('fs-extra');
const minimist = require('minimist');

const argv = minimist(process.argv.slice(2));
const basePath = argv.basepath;
const entryName = argv.entry || 'app';
const templateType = argv.type;

if (!basePath) {
    throw new Error('请传入 basepath 与 entry 参数');
}

function init(type = 'common') {
    const templatePath = path.join(__dirname, type);
    const dest = path.join(__dirname, '../src', basePath);
    const tempWebpackPath = path.join(templatePath, 'webpack.config.js');
    const destWebpackPath = path.join(dest, 'webpack.config.js');
    const relativePath = path.relative(dest, path.join(__dirname, '..'));
    const relativeDepth = relativePath.replace(/\\\\/g, '/').replace(/\\/g, '/');

    if (!originfs.existsSync(templatePath)) {
        throw new Error('模板目录不存在');
    }

    if (originfs.existsSync(dest)) {
        throw new Error('目标目录已存在');
    } else {
        fs.mkdirpSync(dest);
    }

    originfs.readFile(tempWebpackPath, 'utf-8', (err, data) => {
        if (err) {
            throw new Error('模板 webpack 配置不存在');
        }

        const result = data.replace(/{{basePath}}/g, basePath).replace(/{{entryName}}/g, entryName).replace(/{{relativeDepth}}/g, relativeDepth);
        fs.copySync(templatePath, dest);

        originfs.writeFile(destWebpackPath, result, 'utf-8', (error) => {
            if (error) {
                throw new Error('webpack 配置写入失败');
            }
            console.log('Generate Success!');
        });
    });
}

init(templateType);
