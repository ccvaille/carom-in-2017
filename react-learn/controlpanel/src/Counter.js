import React, { Component, PropTypes } from 'react';

const buttonStyle = {
  margin: '10px'
};

class Counter extends Component {

  constructor(props) {
    console.log('enter constructor: ' + props.caption);
    super(props);

    this.onClickIncrementButton = this.onClickIncrementButton.bind(this);
    this.onClickDecrementButton = this.onClickDecrementButton.bind(this);
    this.clickfun = this.clickfun.bind(this);

    this.state = {
      count: props.initValue,
      iclick: 'no'
    }
  }

  /*
  getInitialState() {
    console.log('enter getInitialState');
  }

  getDefaultProps() {
    console.log('enter getDefaultProps');
  }
  */

  componentWillReceiveProps(nextProps) {
    console.log('enter componentWillReceiveProps ' + this.props.caption)
  }

  componentWillMount() {
    console.log('enter componentWillMount ' + this.props.caption);
  }

  componentDidMount() {
    console.log('enter componentDidMount ' + this.props.caption);
  }

  onClickIncrementButton() {
    this.setState({count: this.state.count + 1});
  }

  onClickDecrementButton() {
    this.setState({count: this.state.count - 1});
  }

  // 值变化才重新 render
  shouldComponentUpdate(nextProps, nextState) {
    // nextProps 这次渲染传入的 props
    // this.props 上一次渲染的 props
    return (nextProps.caption !== this.props.caption) ||
           (nextState.count !== this.state.count) || 
           (nextState.iclick !== this.state.iclick) // yes
  }
  clickfun() {
    alert('this is click');
    this.setState({iclick: 'yes'});
    console.log(this.state.iclick) // no
  }

  render() {
    console.log('enter render ' + this.props.caption);
    const {caption} = this.props;
    <Counter caption={'add'} initValue={10}></Counter>
    return (
      <div>
        <button style={buttonStyle} onClick={this.onClickIncrementButton}>+</button>
        <button style={buttonStyle} onClick={this.onClickDecrementButton}>-</button>
        <span>{caption} count: {this.state.count}</span>
      </div>
    );
    
    return (
      <div>
        <button onClick={this.clickfun}>click: {this.state.iclick}</button>
      </div>
    )
  }
}

Counter.propTypes = {
  caption: PropTypes.string.isRequired,
  initValue: PropTypes.number
};

Counter.defaultProps = {
  initValue: 0
};

export default Counter;

