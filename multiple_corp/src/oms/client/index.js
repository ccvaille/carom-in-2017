import ReactDOM from 'react-dom';
import React from 'react';

import {Provider} from 'react-redux';

import {Router, IndexRoute, Route, browserHistory, IndexRedirect, Redirect} from 'react-router';

import store from './store/configureStore';

// import '../../comm/antd/dist/antd.less';
import 'antd/dist/antd.less';

import {Routers} from './routes'


// 打包成单独的css则失效
// if (!!window.ActiveXObject || "ActiveXObject" in window) {
//     require.ensure(['./fix.less'], (require) => {
//         require('./fix.less')
//     });
// }

// import routes from './routes';

// const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <Routers/>
    </Provider>,

    // <Provider store={ store }>
    //     <Router history={ browserHistory } routes={ routes } />
    // </Provider>,
    document.getElementById('react-content')
);

if (module.hot) {
    module.hot.accept();
}
