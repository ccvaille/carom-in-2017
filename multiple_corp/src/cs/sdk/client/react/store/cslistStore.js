var configureStore;
if (process.env.NODE_ENV === 'production') {
    configureStore = require('./store.cslist.pro');
} else {
    configureStore = require('./store.cslist.dev');
}
module.exports = configureStore;
