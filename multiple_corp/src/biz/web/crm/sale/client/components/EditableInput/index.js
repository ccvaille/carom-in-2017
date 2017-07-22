import React, { Component, PropTypes } from 'react'
import {connect} from 'react-redux'
import { Modal, Icon, Alert, message,Button } from 'antd'
import FieldForm from '../FieldForm'
import Item from './items'
import Message from '../../components/Message'

import {
    selectType,
    nameVaild,
    nameUnVaild,
    fetchGetip,
    setGuideOk
} from '../../actions';

export class EditableInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            items: [],
            visible: false,
            tipVisible: false,
            delGroupId: '',
            delIndex: '',
            editData: {}
        }
    }

    static propTypes = {
        salemoneyIndexData: PropTypes.any.isRequired,
        postMovefield: PropTypes.func.isRequired,
        postDelfield: PropTypes.func.isRequired,

        postEditgroup: PropTypes.func.isRequired,
        postDelgroup: PropTypes.func.isRequired,
        postMovegroup: PropTypes.func.isRequired,

        uiUpdateField: PropTypes.func.isRequired,
    }

    componentDidMount() {
     }
     componentWillMount(){
        this.props.fetchGetip()
     }

    componentWillReceiveProps(nextProps) {
        const { salemoneyIndexData,showSuccessMessage } = nextProps;
        if (showSuccessMessage && showSuccessMessage.success === true) {
            this.setState({
                visible: false
            });
        }
        else if (showSuccessMessage && showSuccessMessage.success === false) {
            this.setState({
                visible: false
            });
        }

        this.setState({
            items: nextProps.salemoneyIndexData.data,
        })
    }

    swapItems = (arr, index_1, index_2) => {
        arr[index_1] = arr.splice(index_2, 1, arr[index_1])[0]
        return arr;
    }

    handleGroupMoveUp = (index, group_id, arr) => {
        if (index == 0) {
            return null;
        }
        const { postMovegroup } = this.props
        let items = this.swapItems(arr, index, index - 1)
        let thisId = arr[index].f_group_id
        let previousId = arr[index - 1].f_group_id
        postMovegroup([thisId, previousId])
        return this.setState({ items: items })


    }

    handleGroupMoveDown = (index, group_id, arr) => {
        if (index == arr.length - 1) {
            return null;
        }
        const { postMovegroup } = this.props
        let items = this.swapItems(arr, index, index + 1)
        let thisId = arr[index].f_group_id
        let nextId = arr[index + 1].f_group_id
        postMovegroup([thisId, nextId])
        return this.setState({ items: items })
    }

    handleGroupDelete = (index, data, arr) => {
        if (data && data.fields && data.fields.length > 0) {
            Message.error('删除分组前，请先清理组内的数据！');
        }
        else {
            this.setState({
                tipVisible: true,
                delGroupId: data.f_group_id,
                delIndex: index
            })
        }
    }

    tipHandleOk = () => {
        const { postDelgroup } = this.props
        this.setState({
            tipVisible: false
        })
        postDelgroup(this.state.delGroupId)
        let arr = this.state.items
        let items = arr.splice(this.state.delIndex, 1) && arr
        this.setState({ items: items })
    }

    tipHandleCancel = () => {
        this.setState({
            tipVisible: false
        })
    }

    handleGroupEdit = (d) => {
      const {changeType} = this.props

        d.groupType = 'group'
        this.setState({
            visible: true,
            editData: d
        });

        changeType({type: 'group'});
    }

    handleOk = () => {
        const { uiUpdateField, changeModalVisible } = this.props

        uiUpdateField({ isUpdate: true })
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }

    render() {
        const { postMovefield,
            postDelfield,
            uiUpdateField,
            isNameValid,
            changeType,
            showSuccessMessage,
            postNameVaild,
            postNameUnVaild,
            setGuideOk,
            isShowGuide
    } = this.props
            console.log(this.props);

        return (
            <div>
                {this.state.visible && (<Modal
                    title="编辑分组"
                    visible={this.state.visible}
                    width={450}
                    maskClosable={false}
                    wrapClassName="vertical-center-modal"
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
                        <Button key="submit" type="primary"  onClick={this.handleOk}>
                        确定
                        </Button>]}
                >
                    <FieldForm
                        editData={this.state.editData}
                        groupData={this.state.items}
                    />
                </Modal>)}

                {this.state.tipVisible && (<Modal
                    title="删除分组"
                    wrapClassName="vertical-center-modal"
                    visible={this.state.tipVisible}
                    width={450}
                    maskClosable={false}
                    onOk={this.tipHandleOk}
                    onCancel={this.tipHandleCancel}
                >
                    <div>
                        删除后，销售金额对应的分组字段数据将同时被清除，确定删除吗？
          </div>
                </Modal>)}


                {this.state.items && this.state.items.map((d, index) => {
                    return (
                        <div key={index}>
                            <div className="group-title-wrapper">
                                {d.f_group_status == 0 ? (<h3 className="items-group-title">{d.f_group_name}</h3>) : (<h3 className="items-group-title items-group-title-disable">{d.f_group_name}</h3>)}
                                <ul className="editabel-btn-wrapper">
                                    {index != 0 && index != 1 && d.f_group_name != '基础信息' &&
                                        (<li onClick={(e) => { this.handleGroupMoveUp(index, d.f_group_id, this.state.items) }}>
                                            <Icon type="arrow-up" />
                                        </li>)}
                                    {(index != this.state.items.length - 1) &&
                                        d.f_group_name != '基础信息' &&
                                        (<li onClick={(e) => { this.handleGroupMoveDown(index, d.f_group_id, this.state.items) }}>
                                            <Icon type="arrow-down" />
                                        </li>)}
                                    {d.f_group_name != '基础信息' && (<li onClick={(e) => { this.handleGroupEdit(d) }}>
                                        <Icon type="edit" />
                                    </li>)}
                                    {d.f_group_name != '基础信息' && (<li onClick={(e) => { this.handleGroupDelete(index, d, this.state.items) }}>
                                        <Icon type="delete" />
                                    </li>)}
                                </ul>
                            </div>
                            <Item
                                key={index}
                                items={d}
                                postMovefield={postMovefield}
                                postDelfield={postDelfield}
                                uiUpdateField={uiUpdateField}
                                isNameValid={isNameValid}
                                changeType={changeType}
                                showSuccessMessage={showSuccessMessage}
                                postNameVaild={postNameVaild}
                                postNameUnVaild={postNameUnVaild}
                                isShowGuide={isShowGuide}
                                onGuideOk={setGuideOk}
                            />
                        </div>)
                })
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
  return {
    type: state.fieldType,
    showSuccessMessage:state.showSuccessMessage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeType: (data) => {
      dispatch(selectType(data))
    },
    postNameVaild: (data) => {
        dispatch(nameVaild())
    },
    postNameUnVaild: (data) => {
        dispatch(nameUnVaild())
    },
    fetchGetip: () => {
        dispatch(fetchGetip())
    },
    setGuideOk: () => {
        dispatch(setGuideOk())
    },
  }
}

 export default connect(mapStateToProps, mapDispatchToProps)(EditableInput);
