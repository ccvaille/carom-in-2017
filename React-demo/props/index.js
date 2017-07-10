import React from 'react';
import ReactDOM from 'react-dom';

//class component
class HelloMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state={}
    }
    render(){
        return (<div>Hello {this.props.name}</div>)
    }
}

HelloMessage.propTypes = {
    name: React.PropTypes.string,
}

HelloMessage.defaultProps = {
    name: 'coolfe',
}

ReactDOM.render(<HelloMessage name='sandy'/>,document.getElementById('app'));



//functional component
// const HelloMessage = (props) => (
//     <div>Hello {props.name}</div>
// );

// HelloMessage.proptypes = {
//     name: React.PropTypes.string,
// }

// HelloMessage.defaultProps = {
//     name: 'coolfe',
// }

// ReactDOM.render(<HelloMessage name='lalala'/>,document.getElementById('app'));