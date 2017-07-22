import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import store from './store';

import 'antd/dist/antd.less';
import '~comm/ec-antd/dist/antd.less';
import '~static/public-icon/iconfont.css';

const history = syncHistoryWithStore(browserHistory, store);

const render = () => {
    const Routes = require('./routes').default;
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
