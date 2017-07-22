import MobileError from './MobileError';
import React from 'react';
import ReactDOM from 'react-dom';

const mobileError = (msg, duration=1.5) => {
    let errorContainer = document.getElementById('error-container');
    if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.id = 'error-container';
        errorContainer.className = 'error-container';
        document.body.appendChild(errorContainer);
    }
    ReactDOM.render(
        <MobileError
            msg={msg}
            duration={duration} />,
        errorContainer
    );
}

export default mobileError;
