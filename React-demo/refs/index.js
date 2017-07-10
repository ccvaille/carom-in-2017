import React from 'react';
import ReactDOM from 'react-dom';

class MarkdownEditor extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.rawMarkup = this.rawMarkup.bind(this);
        this.state = {
            value: 'type some *markdown* here!',
        }
    }
    handleChange() {
        this.setState({ value: this.refs.textarea.value });
    }
    rawMarkup() {
        const md = new Remarkable();
        return { __html: mad.render(this.state.value) };
    }
    render() {
        return (
            <div>
                <h3>Input</h3>
                <textarea onChange={this.handleChange} ref="textarea" defaultValue={this.state.value} />
                <h2>Output</h2>
                <div className="content" dangerouslySetInnerHTML={this.rawMarkup()} >
                </div>
            </div>
        )
    }
}

ReactDOM.render(<MarkdownEditor/>,document.getElementById('app'));