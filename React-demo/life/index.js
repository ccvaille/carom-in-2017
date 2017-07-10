import React from 'react';
import ReactDOM from 'react-dom';

class MyComponent extends React.Component {
    constructor(props) {
        super(props);
        console.log('constructor');
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            name: 'coolfe',
        }
    }
    handleClick() {
        this.setState({'name': 'coolfe1'});
    }
    componentWillMount() {
        console.log('componentWillMount');
    }
    componentDidMount() {
        console.log('componentDidMount');
    }
    componentWillReceiveProps() {
        console.log('componentWillReceiveProps');
    }
    componentWillUpdate() {
        console.log('componentWillUpdate');
    }
    componentDidUpdate() {
        console.log('componentDidUpdate');
    }
    componentDidMount() {
        console.log('componentDidMount');
    }
    render() {
        return (
            <div onClick={this.handleClick}>HI, {this.state.name}</div>
        );
    }
}

ReactDOM.render(<MyComponent/>,document.getElementById('app'));