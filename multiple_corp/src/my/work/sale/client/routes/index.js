import Goal from '../views/Goal';
import Funnel from '../views/Funnel'
import Rank from '../views/Rank'
import React from 'react';

import {Router,Route, browserHistory, IndexRedirect} from 'react-router';



export const Routers = () => (
    <Router history={browserHistory}>
        <Route path="work/saletarget/index" component={Goal} />
        <Route path="work/salefunnel/index" component={Funnel} />
        <Route path="work/salerank/index" component={Rank} />
    </Router>
);


