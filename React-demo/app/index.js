import React from 'react';
import ReactDOM from 'react-dom';

const divStyle = {
    color: 'red',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#000',
    borderRadius: '3px'
};

// create Component
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
ReactDOM.render(<App />, document.getElementById('app'));

const MyComponent = () => (
    <div>My name is coolfe.</div>
);

ReactDOM.render(<div style={divStyle}>< MyComponent /></div>, document.getElementById('name'));


// PropTypes
MyComponent.propTypes = {
    todo: React.PropTypes.object,
    name: React.PropTypes.string,
}

//defaultProps
MyComponent.defaultProps = {
    todo: {},
    name: '',
}

//Jsx
const lists = ['JavaScript', 'Java', 'Node', 'Python'];
var text = 'Hello React';


class HelloMessage extends React.Component {
    render() {
        return (
            <div>
                <ul>
                    {lists.map((result, index) => {
                        return (<li> key= {index}>{result}</li>);
                    })}
                </ul>
               {/*echo  Hello React*/}
                <h1>{text}</h1>
                {/* echo string*/}
                <h1>{'text'}</h1>
            </div>
        )
    }
}

ReactDOM.render(<HelloMessage />, document.getElementById('app'));