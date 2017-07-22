import React, { PropTypes } from 'react';
import { Button, Modal } from 'antd';
import WithdrawAppeal from '../WithdrawAppeal';

class ReleaseFailModal extends React.Component {
  static propTypes = {
    releaseFailVisible: PropTypes.bool.isRequired,
    toggleReleaseFailModal: PropTypes.func.isRequired,
    currentId: PropTypes.string,
  }

  onCancel = () => {
    this.props.toggleReleaseFailModal(false);
  }

  render() {
    const { releaseFailVisible } = this.props;
    return (
      <Modal
        title="放号检验"
        wrapClassName="vertical-center-modal"
        visible={releaseFailVisible}
        maskClosable={false}
        onOk={this.onCancel}
        onCancel={this.onCancel}
        footer={(
          <Button type="primary" onClick={this.onCancel}>关闭</Button>
        )}
      >
        <p>申诉号码还未释放！</p>
        <p>请督促占号用户释放申诉号码。</p>

        <WithdrawAppeal currentId={this.props.currentId} />
      </Modal>
    );
  }
}

export default ReleaseFailModal;
