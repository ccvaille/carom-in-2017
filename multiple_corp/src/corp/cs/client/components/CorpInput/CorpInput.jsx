import React, { PropTypes } from 'react';
import { Input } from 'antd';

class CorpInput extends React.Component {
    static propTypes = {
        onFocus: PropTypes.func,
        onBlur: PropTypes.func,
        placeholder: PropTypes.string,
    }

    static defaultProps = {
        onFocus: null,
        onBlur: null,
        placeholder: '',
    }

    // constructor(props) {
    //     super(props);
    //     const { onFocus, onBlur } = this.props;

    //     if (onFocus && typeof onFocus === 'function') {
    //         console.log(onFocus);
    //     }

    //     if (onBlur && typeof onBlur === 'function') {
    //         this.origOnBlur = () => {
    //             console.log(onBlur.arguments);
    //         }
    //     }
    // }

    onFocus = (e) => {
        const { onFocus } = this.props;

        e.target.placeholder = '';

        if (onFocus && typeof onFocus === 'function') {
            onFocus(e);
        }
    }

    onBlur = (e) => {
        const { onBlur, placeholder = '' } = this.props;

        e.target.placeholder = placeholder;

        if (onBlur && typeof onBlur === 'function') {
            onBlur(e);
        }
    }

    render() {
        return (
            <Input
                {...this.props}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
            />
        );
    }
}

export default CorpInput;
