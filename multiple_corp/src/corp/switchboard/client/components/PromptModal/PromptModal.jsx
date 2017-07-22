import React, { PropTypes } from 'react';
import { Modal } from 'antd';

const PromptModal = ({
  promptModalVisible,
  modalContent,
  togglePromptModal,
}) => (
  <Modal
    className="error-modal"
    wrapClassName="vertical-center-modal"
    title="温馨提示"
    width={280}
    visible={promptModalVisible}
    onCancel={() => togglePromptModal(false)}
    footer={
      <div className="center-btn-box">
        <button
          className="ok"
          onClick={() => togglePromptModal(false)}
        >确认</button>
      </div>
    }
  >
    <p>{modalContent}</p>
  </Modal>
);

PromptModal.propTypes = {
  promptModalVisible: PropTypes.bool.isRequired,
  modalContent: PropTypes.string.isRequired,
  togglePromptModal: PropTypes.func.isRequired,
};

export default PromptModal;
