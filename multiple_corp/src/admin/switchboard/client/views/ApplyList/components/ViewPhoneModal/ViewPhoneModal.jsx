import React, { PropTypes } from "react";
import { Modal, Table, Button } from "antd";

const ViewPhoneModal = ({ 
    phoneList, 
    visible, 
    onCancel, 
    viewPhoneChange,
    totalPhoneList, 
}) => {
    const columns = [
        {
            title: "云呼总机号码",
            dataIndex: "f_number",
            key: "phone"
        },
        {
            title: "状态",
            dataIndex: "f_status",
            key: "phoneStatus",
            render: text => {
                if (text === "1") {
                    return <span>已激活</span>;
                } else if (text === "0") {
                    return <span>未激活</span>;
                } else if (text === "2") {
                    return <span>已退订</span>;
                }

                return <span />;
            }
        }
    ];

    return (
        <Modal
            title=""
            className="ant-confirm view-phone-modal"
            width={440}
            visible={visible}
            footer={<Button type="primary" onClick={onCancel}>关闭</Button>}
            onOk={onCancel}
            onCancel={onCancel}
        >
            <span style={{ fontWeight: "bold", color: "#666" }}>
                查看已下发的云呼总机号码：
            </span>
            <div className="content" style={{ marginTop: 8 }}>
                <Table
                    columns={columns}
                    dataSource={phoneList}
                    onChange={viewPhoneChange}
                    pagination={{
                        pageSize: 10,
                        total: totalPhoneList >> 0
                    }} />
            </div>
        </Modal>
    );
};

ViewPhoneModal.propTypes = {
    phoneList: PropTypes.array.isRequired,
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default ViewPhoneModal;
