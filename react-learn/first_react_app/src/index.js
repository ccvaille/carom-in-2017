import React from 'react';
import ReactDOM from 'react-dom';
// import App from './App';
import ClickCounter from './ClickCounter';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(<ClickCounter />, document.getElementById('root'));
registerServiceWorker();
