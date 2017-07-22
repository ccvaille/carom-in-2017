import React from 'react';
import classNames from 'classnames';

class Mask extends React.Component {
    static propTypes = {
        transparent: React.PropTypes.bool,
        duration: Number
    };

    state = {
        showMask: true
    };

    static defaultProps = {
        transparent: false,
        duration: 1.5
    };

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                showMask: false
            });
        }, this.props.duration * 1000);
    }

    render() {
        const { transparent, duration,...others } = this.props;
        const showMask = this.state.showMask;
        const className = classNames({
            'ec_mask': !transparent,
            'ec_mask_transparent': transparent
        });

        return (
            showMask ? <div className={ className } { ...others }></div> : null
        );
    }
}

export default Mask;