import A from '../views/A'
import B from '../views/B'

const myAuth = ecbiz.modules.list;
const routeConfig = {
    childRoutes: [{
        path: '/',
        indexRoute: { 
            onEnter: (nextState, replace) => replace('/demo/path/a')
        }
    }, {
        path: '/demo',
        // getComponent: (nextState, cb) => {
        //     require.ensure([], require => {
        //         cb(null, require('../views/App').default)
        //     })
        // },
        component: A,
        indexRoute: { 
            onEnter: (nextState, replace) => replace('/web/path/a')
        },
        childRoutes: [{
            path: '/demo/path/a',
            // getComponent: (nextState, cb) => {
            //     require.ensure([], require => {
            //         cb(null, require('../views/CrmTag').default)
            //     })
            // },
            component: B,
        }]
    }]
};

export default routeConfig;