import React, { PropTypes } from 'react';
import { Modal } from 'antd';
import './ReleaseSuccessModal.less';

class ReleaseSuccessModal extends React.Component {
  static propTypes = {
    releaseSuccssVisible: PropTypes.bool.isRequired,
    toggleReleaseSuccessModal: PropTypes.func.isRequired,
    sendReleaseSms: PropTypes.func.isRequired,
  }

  render() {
    const { releaseSuccssVisible, toggleReleaseSuccessModal, sendReleaseSms } = this.props;
    return (
      <Modal
        title="放号检验"
        wrapClassName="vertical-center-modal"
        visible={releaseSuccssVisible}
        maskClosable={false}
        onOk={sendReleaseSms}
        onCancel={() => toggleReleaseSuccessModal(false)}
      >
        <p>申诉号码已被释放，并已为申诉用户自动更换！</p>
        <p>是否立即发送短信通知申诉用户？</p>
      </Modal>
    );
  }
}

export default ReleaseSuccessModal;
