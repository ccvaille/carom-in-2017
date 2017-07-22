import React from 'react';
import './mobile-error.less';

class MobileError extends React.Component {
    static propTypes = {
        duration: Number,
    };

    static defaultProps = {
        duration: 1500,
    };

    state = {
        show: true,
    };

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                show: false,
            });
        }, this.props.duration * 1000);
    }

    render() {
        return (
            this.state.show ?
            <div className = "mobile-error" >
                <p>{this.props.msg || '系统繁忙'}</p>
            </div> : null
        );
    }
}

export default MobileError;
