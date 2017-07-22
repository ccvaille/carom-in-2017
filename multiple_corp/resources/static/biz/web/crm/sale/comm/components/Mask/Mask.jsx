import React from 'react';
import classNames from 'classnames';
import './mask.less';

class Mask extends React.Component {
  static propTypes = {
    transparent: React.PropTypes.bool,
    duration: Number,
  };

  static defaultProps = {
    transparent: false,
    duration: 1.5,
  };

  state = {
    showMask: true,
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        showMask: false,
      });
    }, this.props.duration * 1000);
  }

  render() {
    const { transparent } = this.props;
    const showMask = this.state.showMask;
    const className = classNames({
      ec_mask: !transparent,
      ec_mask_transparent: transparent,
    });

    return (
      showMask ? <div className={className}></div> : null
    );
  }
}

export default Mask;
