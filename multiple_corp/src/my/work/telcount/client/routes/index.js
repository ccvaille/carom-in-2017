import App from '../views/telcount/Index'
import Work_Telcount_Today from '../views/telcount/Today'
import Work_Telcount_History from '../views/telcount/History'
import Work_Telcount_Rank from '../views/telcount/Rank'

const routeConfig = {
    childRoutes: [{
        path: '/',
        indexRoute: { 
            onEnter: (nextState, replace) => replace('/work/telcount/today')
        }
    }, {
        path: '/salemanage',
        // getComponent: (nextState, cb) => {
        //     require.ensure([], require => {
        //         cb(null, require('../views/App').default)
        //     })
        // },
        component: App,
        indexRoute: { 
            onEnter: (nextState, replace) => replace('/work/telcount/today')
        },
        childRoutes: [{
            path: '/work/telcount/today',
            // getComponent: (nextState, cb) => {
            //     require.ensure([], require => {
            //         cb(null, require('../views/CrmTag').default)
            //     })
            // },
            component: Work_Telcount_Today,
        },{
            path: '/work/telcount/history',
            // getComponent: (nextState, cb) => {
            //     require.ensure([], require => {
            //         cb(null, require('../views/CrmTag').default)
            //     })
            // },
            component: Work_Telcount_History,
        },{
            path: '/work/telcount/rank',
            // getComponent: (nextState, cb) => {
            //     require.ensure([], require => {
            //         cb(null, require('../views/CrmTag').default)
            //     })
            // },
            component: Work_Telcount_Rank,
        }]
    }]
};

export default routeConfig;