var createStore = require('redux').createStore,
    applyMiddleware = require('redux').applyMiddleware,
    compose = require('redux').compose,
    combineReducers = require('redux').combineReducers;

var thunkMiddleware = require('redux-thunk')['default'],
    rootReducer = {
        csList: require('../reducers/csList')
    };

var enhancer = compose(
    applyMiddleware(thunkMiddleware)
);

var store = createStore(combineReducers(rootReducer), {}, enhancer);

module.exports = function configureStore() {
    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', function () {
            var nextRootReducer = combineReducers(rootReducer);
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
};
