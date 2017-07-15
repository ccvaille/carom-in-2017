import React from 'react';
import ReactDOM from 'react-dom';

class Text extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = {
            text: 'this is a  input',
        }
    }
    onChange(e) {
        this.setState({
            text: e.target.value,
            length: e.target.value.length,
        });
        // if (this.state.text.length = 0) {
        //     this.state.text.length = ''
        // }
    }
    render() {
        return (
            <div>
                <input type="text" value={this.state.text} onChange={this.onChange} />
                <span>{this.state.text.length}</span>
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
// Text.defaultProps = {
//         text: 'this is a  input',
// };

ReactDOM.render(<TextP />, document.getElementById('app'));