import React, { Component, PropTypes } from 'react'
import { Form, message, Icon, Button, Popover, Modal } from 'antd'
import Message from '../../components/Message'
import './index.less'

import { connect } from 'react-redux'
import AddModal from '../AddModal'
import EditableInput from '../../components/EditableInput'

const FormItem = Form.Item;

import {
    fetchSalemoneyIndex,

    fetchMovefield,
    fetchDelfield,
    fetchHandlefield,

    fetchEditgroup,
    fetchDelgroup,
    fetchMovegroup,

    updateUIField,
    repeatingField,
    modalVisible,

    successMessage,
    nameVaild,
    nameUnVaild

} from '../../actions'


const mapStateToProps = (state) => {

    return {
        salemoneyIndexData: state.salemoneyIndex,
        modalIsVisible: state.modalIsVisible,
        showSuccessMessage: state.showSuccessMessage,
        isNameValid:state.isNameValid.isNameValid,
        isShowGuide:state.isShowGuide.isShowGuide
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getSalemoneyIndex: () => {
            dispatch(fetchSalemoneyIndex())
        },

        postMovefield: (group_id, ids) => {
            dispatch(fetchMovefield(group_id, ids))
        },
        postDelfield: (group_id, ids) => {
            dispatch(fetchDelfield(group_id, ids))
        },
        postHandlefield: (data) => {
            dispatch(fetchHandlefield(data))
        },

        postEditgroup: (data) => {
            dispatch(fetchEditgroup(data))
        },
        postDelgroup: (data) => {
            dispatch(fetchDelgroup(data))
        },
        postMovegroup: (data) => {
            dispatch(fetchMovegroup(data))
        },

        uiUpdateField: (data) => {
            dispatch(updateUIField(data))
        },
        repeatingField: (data) => {
            dispatch(repeatingField(data))
        },
        changeModalVisible: (visible) => {
            dispatch(modalVisible({ visible: visible }))
        },
        hideSuccessMessage: (success) => {
            dispatch(successMessage({ success: success }))
        },
        postNameVaild: (data) => {
            dispatch(nameVaild())
        },
        postNameUnVaild: (data) => {
            dispatch(nameUnVaild())
        },

    }
}

const content = (
    <div>
        <img src={'//1.staticec.com/biz/web/crm/sale/comm/public/images/where-sale.png'} alt="" />
    </div>
);

class CrmTag extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            updateSaleField: false,
            salemoneyIndexData: {}
        }
    }

    componentDidMount() {
        // const { getSalemoneyIndex} = this.props
        // getSalemoneyIndex()
    }

    componentWillReceiveProps(nextProps) {
        const { hideSuccessMessage } = this.props
        const { salemoneyIndexData, modalIsVisible, showSuccessMessage,isNameValid  } = nextProps;

        if (showSuccessMessage && showSuccessMessage.success === true) {
            Message.success('操作成功！');
            // message.success(showSuccessMessage.msg);
            hideSuccessMessage();
            //关闭弹窗
            this.setState({
                visible: false,
                updateSaleField: true
            });
        }
        else if (showSuccessMessage && showSuccessMessage.success === false) {
            Message.error('操作失败，请稍候再试！');
            // message.error(showSuccessMessage.msg);
            hideSuccessMessage();
            //关闭弹窗
            this.setState({
                visible: false,
                updateSaleField: true
            });
        }

        this.setState({
            salemoneyIndexData: salemoneyIndexData,
            // visible: modalIsVisible && modalIsVisible.visible
        })
    }

    handleOk = () => {
        const { uiUpdateField, changeModalVisible} = this.props
        uiUpdateField({ isUpdate: true });
        // changeModalVisible(true)
        // this.setState({
        //     visible: false,
        //     updateSaleField: true
        // });
    }

    handleCancel = (e) => {
        const { uiUpdateField, changeModalVisible} = this.props
        uiUpdateField({ isUpdate: false });
        this.setState({
            visible: false,
        });
    }

    showModal = () => {
        const { changeModalVisible,postNameUnVaild, postNameVaild,uiUpdateField } = this.props;
        uiUpdateField({ isUpdate: false });
        postNameUnVaild();
        // changeModalVisible(true)
        this.setState({
            visible: true,
        });
    }

    render() {
        const { postMovefield,
            postDelfield,
            postHandlefield,
            postEditgroup,
            postDelgroup,
            postMovegroup,
            uiUpdateField,
            modalIsVisible,
            changeModalVisible,
            isNameValid,
            setNameUnValid,
            isShowGuide,
    } = this.props;

        const formItemLayout = {
            labelCol: { span: 1 },
            wrapperCol: { span: 8 },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                span: 18
            }
        };
        //计算分组和字段的总数
        let fieldNum = 0;
        if (this.state.salemoneyIndexData.data) {
            this.state.salemoneyIndexData.data.forEach(function (item, index, arr) {
                fieldNum += 1;
                if (item.fields) {
                    fieldNum += item.fields.length;
                }
            });
        }

        return (
            <div className="sale-global">
                {this.state.visible&&(<Modal
                    className="add-modal"
                    title="添加字段"
                    wrapClassName="vertical-center-modal"  
                    visible={this.state.visible}
                    width={840}
                    maskClosable={false}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
                        <Button key="submit" type="primary"   onClick={this.handleOk}>
                        确定
                        </Button>,
                    ]}
                >
                    <AddModal postHandlefield={postHandlefield} updateSaleField={this.state.updateSaleField} />
                </Modal>)}

                <div className="sale-header">
                    <span className="desc">
                        通过自定义字段配置，可丰富销售金额表单信息。
                    </span>
                    <i className="iconfont">&#xe60c;</i>
               <Popover placement="bottomLeft" content={content} title="">
                        <a href="javascript:;" className="ec-link-text">在哪里能看到</a>
                    </Popover>
                </div>

                <div className="formLayout">
                    <h3>字段个数( {fieldNum}个)</h3>
                        <div className="add-btn-wrapper">
                                <Button disabled={fieldNum >= 100 ? true : false}
                                    onClick={this.showModal}
                                    size="default">
                                    添加字段
                                </Button>
                                {
                                    fieldNum >= 100 ?(<span className="add-field-warning">已有100个字段，无法添加更多</span>):''
                                }

                        </div>
                        <EditableInput
                            salemoneyIndexData={this.state.salemoneyIndexData}
                            postMovefield={postMovefield}
                            postDelfield={postDelfield}
                            postEditgroup={postEditgroup}
                            postDelgroup={postDelgroup}
                            postMovegroup={postMovegroup}
                            uiUpdateField={uiUpdateField}
                            modalIsVisible={modalIsVisible}
                            isNameValid={isNameValid}
                            changeModalVisible={changeModalVisible}
                            isShowGuide={isShowGuide}
                        />

                </div>
            </div>
        )
    }
};

CrmTag.propTypes = {
    getSalemoneyIndex: PropTypes.func.isRequired,

    postMovefield: PropTypes.func.isRequired,
    postDelfield: PropTypes.func.isRequired,

    postEditgroup: PropTypes.func.isRequired,
    postDelgroup: PropTypes.func.isRequired,
    postMovegroup: PropTypes.func.isRequired,


    salemoneyIndexData: PropTypes.any.isRequired,
    modalIsVisible: PropTypes.any.isRequired,

    uiUpdateField: PropTypes.func.isRequired,
    changeModalVisible: PropTypes.func.isRequired,
    hideSuccessMessage: PropTypes.func.isRequired,
    postNameVaild: PropTypes.func.isRequired,
    postNameUnVaild: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(CrmTag);
