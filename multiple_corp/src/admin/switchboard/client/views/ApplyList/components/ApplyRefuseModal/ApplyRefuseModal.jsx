import React, { PropTypes } from 'react';
import { Modal, Input } from 'antd';
import ModalFooter from '~comm/components/ModalFooter';
import './apply-refuse.less';

class ApplyRefuseModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    toggleApplyRefuse: PropTypes.func.isRequired,
    refuseApply: PropTypes.func.isRequired,
  }

  state = {
    reasonContent: '',
    errorText: '',
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.visible) {
      this.setState({
        reasonContent: '',
        errorText: '',
      });
    }
  }

  onContentChange = (e) => {
    this.setState({
      reasonContent: e.target.value,
    });
  }

  onOk = () => {
    const { reasonContent } = this.state;
    if (!reasonContent) {
      this.setState({
        errorText: '请输入不通过理由',
      });
      return false;
    }

    if (reasonContent.length > 20) {
      this.setState({
        errorText: '最多输入20个字',
      });
      return false;
    }

    return this.props.refuseApply(this.state.reasonContent);
  }

  onCancel = () => {
    this.props.toggleApplyRefuse(false);
    this.setState({
      reasonContent: '',
      errorText: '',
    });
  }

  render() {
    const { visible } = this.props;
    const footer = (
      <ModalFooter errorText={this.state.errorText} onOk={this.onOk} onCancel={this.onCancel} />
    );
    return (
      <Modal
        wrapClassName="apply-refuse-modal"
        title="审核反馈"
        visible={visible}
        maskClosable={false}
        onOk={this.onOk}
        onCancel={this.onCancel}
        footer={footer}
      >
        <p className="tip">审核不通过！</p>
        <p style={{ marginBottom: 8 }}>请输入理由：</p>
        <Input
          type="textarea"
          placeholder="最多输入不超过20个字"
          rows={3}
          value={this.state.reasonContent}
          onChange={this.onContentChange}
        />
      </Modal>
    );
  }
}

export default ApplyRefuseModal;
