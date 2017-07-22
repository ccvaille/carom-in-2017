import React, { PropTypes } from 'react';
import './input.less';

class Input extends React.Component {
    static propTypes = {
        label: PropTypes.string.isRequired,
        type: PropTypes.string,
        placeholder: PropTypes.string,
        isrequired: PropTypes.bool,
    }
    static defaultProps = {
        type: 'text',
        placeholder: '',
        isrequired: true,
    }
    state = {
        value: '',
    }
    onChange = (e) => {
        this.setState(
            {
                value: e.target.value,
            }
        );
    }
    render() {
        return (
            this.props.isrequired ? (
                <div className="input-item" >
                    <span className="input-item-name"><i>*</i>{this.props.label}</span>
                    <input
                        type={this.props.type}
                        placeholder={this.props.placeholder}
                        value={this.state.value}
                        onChange={this.onChange}
                    />
                </div>
            ) :
            (
                <div className="input-item" >
                    <span className="input-item-name">{this.props.label}</span>
                    <input
                        type={this.props.type}
                        placeholder={this.props.placeholder}
                        value={this.state.value}
                        onChange={this.onChange}
                    />
                </div>
            )
        )
    }
}

module.exports = Input;
