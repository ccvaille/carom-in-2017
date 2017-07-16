import React, { Component,PropTypes } from 'react';
import ReactDOM from 'react-dom';

class Tabs extends Component {
    constructor (props) {
        super(props)
    }

    // const currProps = this.props;
    // let activeIndex = 0;
    // if ('activeIndex' in currProps) {
    //     activeIndex = currProps.activeIndex;
    // } else if ('defaultActiveIndex' in currProps) {
    //     activeIndex = currProps.defaultActiveIndex;
    // }
    // this.state = {
    //     activeIndex,
    //     prevIndex: activeIndex,
    // };
    // render() {
    //     return (<div className="tabs"></div>)
    // }
}

// export default TodoApp;

class Couter extends Component {
    constructor(props) {
        super(props);
        this.Click = this.Click.bind(this);
        this.state = {
            num: 0,
        };  
    }
    Click(e) {
        e.preventDefault();
        this.setState({
            num : this.state.num + 1,
        });
    }
    render() {
        return (<div><button onClick = {this.Click}>click</button><span>{this.state.num}</span></div>)
    }
}


ReactDOM.render(<Couter/>,document.getElementById('app'));