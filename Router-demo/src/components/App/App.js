import React from 'react';
import { Link, IndexLink } from 'react-router';

const App = (props) => (
    <div>
        <h1>React-Router demo</h1>
        <ul>
            <li><IndexLink to ="/">Home</IndexLink></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contacts">Contacts</Link></li>
            <li><Link to="/user">User</Link></li>
            <li><Link to="/repos">Reposout</Link></li>
            
        </ul>
    </div>
)