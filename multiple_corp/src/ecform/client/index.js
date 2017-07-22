import ReactDOM from 'react-dom';
import React from 'react';
import {Provider} from 'react-redux';
import store from './store/configureStore';


import {Routers} from './routes'

ReactDOM.render(
    <Provider store={store}>
        <Routers/>
    </Provider>,
    document.getElementById('react-content')
);

if (module.hot) {
    module.hot.accept();
}
