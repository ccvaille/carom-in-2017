import ReactDOM from 'react-dom';
import React from 'react';
import {Provider} from 'react-redux';
import 'antd/dist/antd.less';
import '../ec-antd/dist/antd.less';
import 'animate.css'
import {Routers} from './routes'

import store from './store/configureStore';

ReactDOM.render(
    <Provider store={ store }>
        <Routers/>
    </Provider>,
    document.getElementById('root')
);

if (module.hot) {
    module.hot.accept();
}
