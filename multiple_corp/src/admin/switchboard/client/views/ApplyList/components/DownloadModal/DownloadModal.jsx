import React, { PropTypes } from 'react';
import { Modal, Table, Button } from 'antd';

const DownloadModal = ({ fileList, visible, onCancel }) => {
  const filesColumns = [{
    title: '文件名',
    dataIndex: 'filename',
    render: (text, record) => (
      <a target="_blank" href={record.downloadPath} download>{text}</a>
    ),
  }, {
    title: '操作',
    dataIndex: 'downloadPath',
    width: '20%',
    render: (text) => (
      <a target="_blank" href={text} download>下载</a>
    ),
  }];

  return (
    <Modal
      title=""
      className="ant-confirm download-modal"
      width={440}
      visible={visible}
      footer={
        <Button type="primary" onClick={onCancel}>关闭</Button>
      }
      onOk={onCancel}
      onCancel={onCancel}
    >
      <span style={{ fontWeight: 'bold', color: '#666' }}>资料下载：</span>
      <div className="content" style={{ marginTop: 8 }}>
        <Table
          columns={filesColumns}
          dataSource={fileList}
          pagination={false}
        />
      </div>
    </Modal>
  );
};

DownloadModal.propTypes = {
  fileList: PropTypes.array.isRequired,
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default DownloadModal;
