import {Router, IndexRoute, Route, browserHistory, IndexRedirect, Redirect} from 'react-router';
import App from '../views/App/';
import OrderDetail from '../views/OrderDetail/'
import OrderChart from '../views/OrderChart/'
import AccountNum from '../views/AccountNum/'
import CompanyNum from '../views/CompanyNum/'
import React from 'react';


export const Routers = () => (
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRedirect to="web/orderManage/orderDetail"/>
            <Route path="web/orderManage/orderDetail" component={OrderDetail}/>
            <Route path="web/orderManage/orderChart" component={OrderChart}/>
            <Route path="web/shopData/accountNum" component={AccountNum}/>
            <Route path="web/shopData/companyNum" component={CompanyNum}/>
            <Redirect from="web/orderManage" to="web/orderManage/orderDetail"/>
            <Redirect from="web/shopData" to="web/shopData/accountNum"/>
        </Route>
    </Router>
);
