import {Router,Route, browserHistory, IndexRedirect} from 'react-router';
import Index from '../views/Index/';
import RightSide from '../components/RightSide';
import React from 'react';


export const Routers = () => (
    <Router history={browserHistory}>
        <Route path="ecform" component={Index}>
            <IndexRedirect to="index/published"/>
            <Route path="index/unpublished" component={RightSide} />
            <Route path="index/published" component={RightSide} />
            <Route path="index/public" component={RightSide} />
            <Route path="index/team" component={RightSide} />
        </Route>
    </Router>
);
