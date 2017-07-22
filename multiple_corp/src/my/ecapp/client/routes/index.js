import {Router, IndexRoute, Route, browserHistory, IndexRedirect, Redirect} from 'react-router';
import React from 'react';
import Message from '../views/message/index';
import EnterpriseRadio from '../views/message/EnterpriseRadio/index';
import ECTeam from '../views/message/ECTeam/index';
import H5marketing from '../views/message/H5marketing/index';
import CrmMessage from '../views/message/CrmMessage/index';
import CustomerSharing from '../views/message/CustomerSharing/index';


const routeConfig = {
    childRoutes: [{
        path: '/',
        indexRoute: { 
            onEnter: (nextState, replace) => replace('/ecapp/ec/index')
        }
    }, {
        path: '/ecapp',
        // getComponent: (nextState, cb) => {
        //     require.ensure([], require => {
        //         cb(null, require('../views/App').default)
        //     })
        // },
        indexRoute: { 
            onEnter: (nextState, replace) => replace('/ecapp/ec/index')
        },
        component: Message,
        childRoutes: [{
            path: '/ecapp/broadcast/index',
            // getComponent: (nextState, cb) => {
            //     require.ensure([], require => {
            //         cb(null, require('../views/CrmTag').default)
            //     })
            // },
            component: EnterpriseRadio,
        },{
            path: '/ecapp/ec/index',
            // getComponent: (nextState, cb) => {
            //     require.ensure([], require => {
            //         cb(null, require('../views/CrmTag').default)
            //     })
            // },
            component: ECTeam,
        },{
            path: '/ecapp/h5mk/index',
            // getComponent: (nextState, cb) => {
            //     require.ensure([], require => {
            //         cb(null, require('../views/CrmTag').default)
            //     })
            // },
            component: H5marketing,
        },{
            path: '/ecapp/crmmsg/index',
            // getComponent: (nextState, cb) => {
            //     require.ensure([], require => {
            //         cb(null, require('../views/CrmTag').default)
            //     })
            // },
            component: CrmMessage,
        },{
            path: '/ecapp/share/index',
            // getComponent: (nextState, cb) => {
            //     require.ensure([], require => {
            //         cb(null, require('../views/CrmTag').default)
            //     })
            // },
            component: CustomerSharing,
        }]
    }]
};

export default routeConfig;



export const Routers = () => (
    <Router history={browserHistory}>
        <Route path="/" component={Message}>
            <IndexRedirect to="/ecapp/ec/index"/>
            <Route path="/my/ecapp/index.html" component={ECTeam}/>
            <Route path="/my/ecapp/ec_team.html" component={ECTeam}/>
            <Route path="/ecapp/ec/index" component={ECTeam}/>
            <Route path="/ecapp/broadcast/index" component={EnterpriseRadio}/>
            <Route path="/my/ecapp/enterprise_radio.html" component={EnterpriseRadio}/>
            <Route path="/ecapp/h5mk/index" component={H5marketing}/>
            <Route path="/my/ecapp/h5_marketing.html" component={H5marketing}/>
            <Route path="/ecapp/crmmsg/index" component={CrmMessage}/>
            <Route path="/my/ecapp/crm_message.html" component={CrmMessage}/>
            <Route path="/ecapp/share/index" component={CustomerSharing}/>
            <Route path="/my/ecapp/customer_sharing.html" component={CustomerSharing}/>
        </Route>
    </Router>
);
