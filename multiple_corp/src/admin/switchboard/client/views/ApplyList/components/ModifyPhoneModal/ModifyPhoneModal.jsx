import React, { PropTypes } from "react";
import { Modal, Input } from "antd";
import ModalFooter from "~comm/components/ModalFooter";
import Label from '../Label';
class ModifyPhoneModal extends React.Component {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        toggleModifyPhone: PropTypes.func.isRequired,
        editModifyPhone: PropTypes.func.isRequired,
        labels: PropTypes.array.isRequired,
        errorLabelsIndex: PropTypes.array.isRequired
    };

    state = {
        phoneNumber: "",
        errorText: "",
        editState: '',
        editIndex: ''
    };
    componentWillReceiveProps(nextProps) {
        if (!nextProps.visible) {
            this.setState({
                phoneNumber: "",
                errorText: "",
                editState: '',
                editIndex: ''
            });
        }

    }

    onNumberChange = e => {
        this.setState({
            phoneNumber: e.target.value
        });
    };

    onOk = () => {
        // const labels = this.props.labels;
    
        let errorList = this.props.getErrorModifyPhone();
        if (errorList.length) {
            return false;
        }
        // let sendData = {
        //     id: labels[0].id,
        //     data: []
        // }
        // sendData.data = labels.map((item, index) => {
        //     return {item.f_id: item.f_number}
        // })
        return this.props.modifyPhone();
    };
    
    onCancel = () => {
        this.setState({
            phoneNumber: "",
            errorText: ""
        });
        this.props.toggleModifyPhone(false);
        this.props.cancelError();
    };
    setLabelEdit = (editState, editIndex) => {
        this.setState({
            editState,
            editIndex 
        })
    }
    render() {

        const footer = (
            <ModalFooter
                errorText={this.state.errorText}
                onOk={this.onOk}
                onCancel={this.onCancel} />
        );
        const { 
            labels, 
            errorLabelsIndex, 
            editModifyPhone,
            setLabelProps,
            editState,
        } = this.props;
        
        return (
            <Modal
                title="号码修改"
                visible={this.props.visible}
                maskClosable={false}
                onOk={this.onOk}
                onCancel={this.onCancel}
                footer={footer}
            >
                <p style={{ marginBottom: 8 }}>
                    如果已下发给客户的云呼总机号码错误，需要修改，请重新输入号码：
                </p>
                <div className="content-phone">
                {
                    labels && labels.map((item, index) => {
                        let isError = errorLabelsIndex.findIndex((element) => {
                            return element == index
                        });
                        return item.f_status !== "2" ? (
                            <Label 
                                key={index}
                                fId={item.f_id}
                                index={index}
                                setLabelEdit={this.setLabelEdit}
                                editState={index == this.state.editIndex ? this.state.editState : false}
                                value={item.f_number} 
                                editModifyPhone={editModifyPhone}
                                isError={isError === -1 ? false : true}/>
                        ) : null;
                    })
                        
                }
                    
                </div>
            </Modal>
        );
    }
}

export default ModifyPhoneModal;
