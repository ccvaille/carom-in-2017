const jsonServer = require('json-server');
const fakeData = require('./mockData');
const data = fakeData(50);
const server = jsonServer.create();
const router = jsonServer.router(data);
const middlewares = jsonServer.defaults();

const pageLimit = 10;

function getParameterByName(name, url) {
    if (!url) {
        return '';
    }

    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

router.render = (req, res) => {
    const url = req._parsedOriginalUrl.query;
    const current = Number(getParameterByName('page', `?${url}`)) || 1;
    res.jsonp({
        code: 0,
        msg: 'success',
        data: res.locals.data.slice((current - 1) * pageLimit, current * pageLimit),
        page: {
            current,
            total: res.locals.data.length,
            pageSize: 10,
        },
    });
};

server.use(middlewares);
server.use(router);
server.listen(5000, () => {
    console.log('api mock server running on port 5000');
});
