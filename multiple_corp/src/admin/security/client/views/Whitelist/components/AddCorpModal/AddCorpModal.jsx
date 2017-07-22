import React, { PropTypes } from 'react';
import { Modal, Form, Input } from 'antd';
import message from '~comm/components/Message';
import './AddCorpModal.less';

const FormItem = Form.Item;

class AddCorpModal extends React.Component {
  static propTypes = {
    addModalVisible: PropTypes.bool.isRequired,
    toggleAddModal: PropTypes.func.isRequired,
    addWhitelistCorps: PropTypes.func.isRequired,
    addCorpsChange: PropTypes.func.isRequired,
    addCorps: PropTypes.array.isRequired,
  }

  onAddWhitelistCorps = () => {
    const addCorps = this.props.addCorps.filter(id => (id !== 0 || id !== ''));

    if (!addCorps.length) {
      message.error('请输入1-5个要加入的企业ID！');
    } else {
      this.props.addWhitelistCorps(addCorps);
    }
  }

  render() {
    const { addModalVisible, toggleAddModal, addCorps, addCorpsChange } = this.props;
    return (
      <Modal
        className="add-whitelist"
        title="添加白名单"
        wrapClassName="vertical-center-modal"
        visible={addModalVisible}
        onOk={this.onAddWhitelistCorps}
        onCancel={() => toggleAddModal(false)}
      >
        <p>填写要加入白名单的企业ID，每行输入1个，最多5个</p>
        <Form className="add-whitelist-form">
          <FormItem>
            <Input
              value={addCorps[0]}
              onChange={(event) => addCorpsChange({ num: 0, value: event.target.value })}
            />
          </FormItem>

          <FormItem>
            <Input
              value={addCorps[1]}
              onChange={(event) => addCorpsChange({ num: 1, value: event.target.value })}
            />
          </FormItem>

          <FormItem>
            <Input
              value={addCorps[2]}
              onChange={(event) => addCorpsChange({ num: 2, value: event.target.value })}
            />
          </FormItem>

          <FormItem>
            <Input
              value={addCorps[3]}
              onChange={(event) => addCorpsChange({ num: 3, value: event.target.value })}
            />
          </FormItem>

          <FormItem>
            <Input
              value={addCorps[4]}
              onChange={(event) => addCorpsChange({ num: 4, value: event.target.value })}
            />
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default AddCorpModal;
