import React from 'react';
import { Link , IndexLink } from 'react-router';

const App = (props) => (
    <div>
        <h1>Router demo</h1>
        <ul>
            <li><IndexLink to='/'>Home</IndexLink></li>
            <li><Link to="/about">About</Link></li>
            
            <li></li>


            <li></li>
            <li></li>
             
        </ul>
    </div>
);

export default App;