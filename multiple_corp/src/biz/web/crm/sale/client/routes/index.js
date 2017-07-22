import React from 'react';
import { Router } from 'react-router';

const routeConfig = {
    childRoutes: [{
        path: '/',
        indexRoute: {
            onEnter: (nextState, replace) => replace('biz/web/crm/sale')
        }
    },
    { path: '/web',
        getComponent: (nextState, cb) => {
            require.ensure([], require => {
                cb(null, require('../views/App').default)
            })
        },
        indexRoute: {
            onEnter: (nextState, replace) => replace('biz/web/crm/sale')
        },
        childRoutes: [{
            path: '/biz/web/crm/sale',
            getComponent: (nextState, cb) => {
                require.ensure([], require => {
                    cb(null, require('../views/SaleIndex').default)
                })
            }
        },
        {
            path: '/biz/web/crm/sale/index.html',
            getComponent: (nextState, cb) => {
                require.ensure([], require => {
                    cb(null, require('../views/SaleIndex').default)
                })
            }
        }]
    }]
}

const Routes = ({ history }) => (
    <Router history={history} routes={routeConfig} />
);

export default Routes;
