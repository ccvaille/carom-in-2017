import React, { PropTypes } from "react";
import { Modal, Input, Radio, Icon } from "antd";
import ModalFooter from "~comm/components/ModalFooter";
import Label from '../Label';
import "./apply-pass.less";

const RadioGroup = Radio.Group;

class ApplyPassModal extends React.Component {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        toggleApplyPass: PropTypes.func.isRequired,
        passApplyOne: PropTypes.func.isRequired
    };

    state = {
        phoneNumber: "",
        acceptanceType: 1,
        errorText: "",
        editState: '',
        editIndex: ''
    };

    componentWillReceiveProps(nextProps) {
        if (!nextProps.visible) {
            this.setState({
                phoneNumber: "",
                acceptanceType: 1,
                errorText: "",
                editState: '',
                editIndex: ''
            });
        }
    }

    onOk = () => {
        const { acceptanceType } = this.state;

        let errorList = this.props.getErrorEditPhone();
        let number = this.props.labels.join(',');
        if (errorList.length) {
            return false;
        }
        return this.props.passApplyOne({ number, acceptanceType });
    };

    onCancel = () => {
        this.setState({
            phoneNumber: "",
            acceptanceType: 1,
            errorText: ""
        });
        this.props.clearPhoneList();
        this.props.toggleApplyPass(false);
        this.props.cancelError();
    };

    onPhoneNumberChange = e => {
        this.setState({
            phoneNumber: e.target.value
        });
    };

    onTypeChange = e => {
        this.setState({
            acceptanceType: e.target.value
        });
    };
    setLabelEdit = (editState, editIndex) => {
        this.setState({
            editState,
            editIndex
        })
    }
    render() {
        const { 
            visible,
            labels, 
            errorLabelsIndex, 
            editModifyPhone,
            setLabelProps,
            addLabel,//添加号码
            delLabel,//删除号码
            currentPassNum
        } = this.props;
        const footer = (
            <ModalFooter
                errorText={this.state.errorText}
                onOk={this.onOk}
                onCancel={this.onCancel} />
        );
        return (
            <Modal
                wrapClassName="apply-pass-one"
                title="审核反馈"
                visible={visible}
                maskClosable={false}
                onOk={this.onOk}
                onCancel={this.onCancel}
                footer={footer} >
                <p className="tip">审核通过！</p>
                
                <div>
                    <div className="content-phone">
                    {
                        labels && labels.map((item, index) => {
                            let isError = errorLabelsIndex.findIndex((element) => {
                                return element == index
                            });
                            return (
                                <Label 
                                    key={index}
                                    index={index}
                                    setLabelEdit={this.setLabelEdit}
                                    editState={index == this.state.editIndex ? this.state.editState : false}
                                    value={item} 
                                    editModifyPhone={editModifyPhone}
                                    delLabel={delLabel.bind(this, index)}
                                    isDel={true}
                                    isError={isError === -1 ? false : true}/>
                            )
                        })
                    }
                        <a 
                            href="javascript: void 0"
                            className="add-label"
                            onClick={addLabel}>
                            <Icon type="plus-circle" />
                        </a>
                       
                    </div>
                    <div className="surplus-phone">
                        <span>{labels.length}</span>
                        <span>/</span>
                        <span>{currentPassNum}</span>
                    </div>
                    <div className="group">
                        <p>确认客户提交的受理单类型：</p>
                        <RadioGroup
                            value={this.state.acceptanceType}
                            onChange={this.onTypeChange}
                        >
                            <Radio value={1}>受理单1</Radio>
                            <Radio value={2}>受理单2</Radio>
                        </RadioGroup>
                    </div>
                </div>
            </Modal>
        );
    }
}

export default ApplyPassModal;
