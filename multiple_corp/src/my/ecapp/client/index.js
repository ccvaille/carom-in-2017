import ReactDOM from 'react-dom';
import React from 'react';

import { Provider } from 'react-redux';

import { Router, browserHistory } from 'react-router';

// import configureStore from './store/configureStore';

import 'antd/dist/antd.less';

import '../../../comm/ec-antd/dist/antd.less';

import { default as routes } from './routes/index';
import { Routers } from './routes/index';

import { default as store } from './store/index'

// ReactDOM.render(
//     <Provider store={ store }>
//         <Router history={ browserHistory } routes={ routes }/>
//     </Provider>,
//     document.getElementById('root')
// );

//客户端消息广播
if(window.ECBridge){
window.ECBridge.registerPVCall(503, function (command, json) {

});
}

ReactDOM.render(
    <Provider store={store}>
        <Routers />
    </Provider>,
    document.getElementById('root')
);

