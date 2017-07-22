import React, { PropTypes } from 'react';

class WithdrawAppeal extends React.Component {
  static propTypes = {
    currentId: PropTypes.string,
    withdrawAppeal: PropTypes.func.isRequired,
  }

  onWithdrawAppeal = () => {
    const { currentId, withdrawAppeal } = this.props;
    withdrawAppeal(currentId);
  }

  render() {
    return (
      <p
        style={{ margin: '7px 0', fontSize: 12 }}
      >
        或者
        <a
          style={{ textDecoration: 'underline' }}
          onClick={this.onWithdrawAppeal}
        >
          点此撤回用户申诉
        </a>
      </p>
    );
  }
}

export default WithdrawAppeal;
