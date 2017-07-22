import React, { PropTypes } from 'react';

class Button extends React.Component {
    render() {
        return (
            <button>
                {this.props.children} 
            </button>
        );
    }
}

module.exports= Button;