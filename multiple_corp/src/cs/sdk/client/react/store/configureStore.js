var configureStore;
if (process.env.NODE_ENV === 'production') {
    configureStore = require('./store.pro');
} else {
    configureStore = require('./store.dev');
}
module.exports = configureStore;
