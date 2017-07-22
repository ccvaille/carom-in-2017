// require('es5-shim');
// require('es5-shim/sham');
// require('console-polyfill');
// require('es6-promise/auto');
// require('fetch-ie8');

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory } from 'mods/react-router';
import { syncHistoryWithStore } from 'mods/react-router-redux';
import 'normalize.css';
import 'styles/index.less';

import store from './store';


const history = syncHistoryWithStore(browserHistory, store);

const render = () => {
    // eslint-disable-next-line global-require
    const Routes = require('./routes');
    ReactDOM.render(
        <Provider store={store}>
            <Routes history={history} store={store} />
        </Provider>, document.getElementById('root')
    );
};

if (module.hot) {
    module.hot.accept('./routes', () => {
        render();
    });
}

render();
