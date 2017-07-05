import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        return (<div><h1>Hello,World!</h1></div>);
    }
}
ReactDOM.render(<App/>,document.getElementById('app'));


const MyComponent = () => (
    <div>My name is coolfe.</div>
);

ReactDOM.render(<MyComponent/>,document.getElementById('name'));



MyComponent.propTypes = {
    todo: React.PropTypes.object,
    name: React.PropTypes.string,
}

MyComponent.defaultProps = {
    todo: {},
    name: '',
}


