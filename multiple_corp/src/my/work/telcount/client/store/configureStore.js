let configureStore;
if (process.env.NODE_ENV === 'dev') {
    configureStore = require('./store.dev')['default'];
} else {
    configureStore = require('./store.pro')['default'];
}
export default configureStore;
