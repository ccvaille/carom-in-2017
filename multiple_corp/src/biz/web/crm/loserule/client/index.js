import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import 'moment/locale/zh-cn';
import store from './store';
import 'antd/dist/antd.less';
import '~comm/ec-antd/dist/antd.less';
import '~comm/public/iconfont/iconfont.css';
//import './styles/main.less';

const render = () => {
    // eslint-disable-next-line global-require
    const Routes = require('./routes').default;
    ReactDOM.render(
        <Provider store={store}>
            <Routes history={browserHistory} />
        </Provider>
        , document.getElementById('root')
    );
};

if (module.hot) {
    module.hot.accept('./routes/index', () => {
        try {
            render();
        } catch (error) {
            console.log(error);
        }
    });
}

render();
