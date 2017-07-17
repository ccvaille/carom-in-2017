import React from 'react';
import { render } from 'react-dom';
import { createStore, bindActionCreator } from 'redux';
import { Provider, connerct } from 'react-redux';


// ACTION
function changeText() {
    return {
        type: 'CHANGE_TEXT'
    }
}

function buttonClick() {
    return {
        type: 'BUTTON_CLICK'
    }
}

// REDUCER

const initialState = {
    text: 'Hello'
}

function myApp(state = initialState,action) {
    switch(action.type) {
        case 'CHANGE_TEXT':
            return {
                text: state.text == 'Hello' ? 'Stark':'Hello'
            }
        case 'BUTTON_CLICK':
            return {
                text: 'You just click button'
            }
        default:
            return {
                text: 'Hello'
            }
    }
}


// STORE 
let store = createStore(myApp);

//COMPONENT

class Hello extends React.component {
    constructor(props) {
        super(props);
        this.click = this.click.bind(this);
    }
    click(e) {
        e.preventDefault();
        this.props.actions.changeText();
    }
    render() {
        return (
            <h1 onClick ={this.click}>{this.props.text}</h1>
        );
    }
}

class Change extends React.component {
    construtor(props) {
        super(props);
        this.click = this.click.bind(this);
    }
    click(e) {
        e.preventDefault();
        this.props.actions.buttonClick();
    }
    render() {
        return (<button onClick={this.click}>change</button>);
    }
}

class App extends React.component {
    construtor(props) {
        super(props);
    }
    render() {
        const {actions, text} = this.props;
        return (<div><Hello actions ={actions} text={text}> </div>);
    }
}


function mapStateToProps(state) {
    return {
        text: state.text
    }
}

function mapDispatchToProps(dispatch){
    return{
        actions : bindActionCreators({changeText:changeText,buttonClick:buttonClick},dispatch)
    }
}

App = connect(mapStateToProps,mapDispatchToProps)(App)

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)