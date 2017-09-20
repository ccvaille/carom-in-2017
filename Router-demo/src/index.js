import React from 'react';
import ReactDOm from 'react-dom';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import App from './components/App';
import Home from './components/Home';
import Contacts from './components/Contacts';
import Repos from './components/Repos';
import About from './components/About';
import User from './components/User';

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component = {App} >
            <IndexRoute component = {Home}/>
            <Route path ="/about" component ={About}></Route>
        </Route>
    </Router>
)


