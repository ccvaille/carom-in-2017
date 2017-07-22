import React, { PropTypes } from 'react';
import { Button } from 'antd';
import './modal-footer.less';

const ModalFooter = ({ errorText, onOk, onCancel }) => (
  <div className="ec-modal-footer clearfix">
    <div className="modal-error-text">{errorText}</div>
    <Button type="ghost" onClick={onCancel}>取消</Button>
    <Button type="primary" onClick={onOk}>确定</Button>
  </div>
);

ModalFooter.propTypes = {
  errorText: PropTypes.string,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default ModalFooter;
