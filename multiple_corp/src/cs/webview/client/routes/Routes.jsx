import React, { PropTypes } from 'react';
import { Router } from 'react-router';
import MainLayout from 'layouts/MainLayout';

const getRoutes = (store) => ({
    path: '/kf/webview',
    component: MainLayout,
    childRoutes: [{
        path: 'visitor/info(\.html)',
        getComponent: (nextState, cb) => {
            require.ensure([], require => {
                cb(null, require('views/VisitorInfo').default);
            }, 'visitor-info');
        },
    }],
});

const Routes = ({ history, store }) => (
    <Router history={history} routes={getRoutes(store)} />
);

Routes.propTypes = {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
};

export default Routes;
