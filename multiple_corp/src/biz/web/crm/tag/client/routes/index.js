// import App from '../views/App'
// import CrmTag from '../views/CrmTag'
import React from 'react';
import { Router } from 'react-router';

const myAuth = ecbiz.modules.list;
const routeConfig = {
    childRoutes: [{
        path: '/',
        indexRoute: { 
            onEnter: (nextState, replace) => replace('/web/crm/tag')
        }
    }, {
        path: '/web',
        getComponent: (nextState, cb) => {
            require.ensure([], require => {
                cb(null, require('../views/App').default)
            })
        },
        // component: App,
        indexRoute: { 
            onEnter: (nextState, replace) => replace('/web/crm/tag')
        },
        childRoutes: [{
            path: '/web/crm/tag',
            getComponent: (nextState, cb) => {
                require.ensure([], require => {
                    cb(null, require('../views/CrmTag').default)
                })
            }
            // component: CrmTag,
        }]
    }]
}

const Routes = ({ history }) => (
    <Router history={history} routes={routeConfig} />
);

export default Routes;