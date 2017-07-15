import React from 'react';
import ReactDOM from 'react-dom';

class Text extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props);
        this.onChange = this.onChange.bind(this);
        this.state = {
            text: 'this is a  input',
        }
    }
    onChange(e) {
        this.setState({
            text: e.target.value,
        });
    }
    render() {
        return (
            <div>
                <input type="text" value={this.state.text} onChange={this.onChange} /><br/>
                <span>文本框的长度为： {this.state.text.length ? this.state.text.length : ''}</span>
            </div>
        )
    }
}


class TextP extends React.Component {
    render() {
        return (
            <Text />
        );
    }
}
Text.defaultProps = {
        text: 'this is a  aaa',
};

ReactDOM.render(<TextP />, document.getElementById('app'));