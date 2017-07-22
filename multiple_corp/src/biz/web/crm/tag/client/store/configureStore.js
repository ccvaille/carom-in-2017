let configureStore;
if (process.env.NODE_ENV === 'production') {
    configureStore = require('./store.pro')['default'];
} else {
    configureStore = require('./store.dev')['default'];
}
export default configureStore;
