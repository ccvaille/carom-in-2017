/**
 * 新的 build 用文件
 * usage:
 * npm run build_new -- --site biz --project crm --subproject tag --last xxx
 *
 * --subproject --last 参数为可选
 *
 * 如果需要更深的层级，要改为传入 webpack.config.js 所在路径，然后获取打包后文件输出路径
 */
const fs = require('fs-extra');
const originfs = require('fs');
const path = require('path');
const webpack = require('webpack');

process.env.NODE_ENV = 'production';

const siteNameMap = {
    cs: 'kf',
};
const projectNameMap = {
    cs: 'kf',
};

function compile(config) {
    return new Promise((resolve, reject) => {
        const compiler = webpack(config);

        compiler.run((err, stats) => {
            if (err) {
                return reject(err);
            }

            const jsonStats = stats.toJson();

            if (jsonStats.errors.length > 0) {
                console.log(jsonStats.errors);
                return reject(new Error('Webpack compiler encounter error'));
            }

            return resolve(jsonStats);
        });
    });
}

const builder = () => {
    const argv = require('minimist')(process.argv.slice(2));
    const site = argv.site;
    const project = argv.project;
    const subproject = argv.subproject;
    const last = argv.last;
    let subPath = '';
    let lastPath = '';

    if (!site || !project) {
        throw new Error('请传入 --site, --project 参数，具体查看 README.md');
    }

    if (subproject) {
        subPath = `/${subproject}`;
    }
    
    if (last) {
        lastPath = `/${last}`;
    }

    const destSite = siteNameMap[site] || site;
    const destProject = projectNameMap[project] || project;

    const staticDest = path.resolve(__dirname, `../resources/static/${destSite}/${destProject}${subPath}${lastPath}`);
    const webpackConfig = require(`../src/${site}/${project}${subPath}${lastPath}/webpack.config`);

    compile(webpackConfig).then(() => {
        if (originfs.existsSync(staticDest)) {
            fs.removeSync(staticDest);
        }
        fs.mkdirpSync(staticDest);
        fs.copySync(webpackConfig.output.path, staticDest);
        fs.removeSync(webpackConfig.output.path);
    }).catch(err => {
        console.log(err);
        process.exit(1);
    });
};

builder();