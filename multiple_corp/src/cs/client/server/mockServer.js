const jsonServer = require('json-server');
const faker = require('faker');
const fakeData = require('./mockData');
const data = fakeData(50);
const server = jsonServer.create();
const router = jsonServer.router(data);
const middlewares = jsonServer.defaults();

function generateReplies(total) {
    const replies = [];

    for (let i = 0; i < total; i++) {
        const title = faker.lorem.word();
        const id = faker.random.number();

        replies.push({
            id,
            title,
        });
    }

    return replies;
}

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

server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.get('origin'));
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

server.get('/quickreply/:id', (req, res) => {
    const url = req.query;
    const replyData = generateReplies(30);
    const current = Number(getParameterByName('page', `?${url}`)) || 1;

    res.jsonp({
        code: 0,
        msg: 'success',
        data: replyData.slice((current - 1) * pageLimit, current * pageLimit),
        page: {
            current,
            total: replyData.length,
            pageSize: 10,
        },
    });
});

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

server.listen(3000, () => {
    console.log('api mock server running on port 3000');
});
