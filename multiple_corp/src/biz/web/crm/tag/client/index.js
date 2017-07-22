import ReactDOM from 'react-dom';
import React from 'react';

import { Provider } from 'react-redux';

import { Router, Route, IndexRedirect, useRouterHistory, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { createHistory } from 'history';

import store from './store/configureStore';
import Routes from './routes';

import '../../../../../comm/antd/dist/antd.less';
import '../../../../../comm/ec-antd/dist/antd.less';
import '../../../../../comm/public/iconfont/iconfont.css';
// 打包成单独的css则失效
// if(!!window.ActiveXObject || "ActiveXObject" in window) {
//     require.ensure(['./fix.less'], (require) => {
//         require('./fix.less')
//     });
// }


// const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <Routes history={browserHistory} />
    </Provider>,
    document.getElementById('react-content')
);

if (module.hot) {
    module.hot.accept();
}
