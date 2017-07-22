import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Row, Col, Icon, Menu, Dropdown, Button, Checkbox, Radio, Popover, Modal, Input, message} from 'antd';
import Message from '../Message';
import {Link} from 'react-router';
import SmallLabel from './smalLabel';
import {isExitsLabelInGroup, isExitsLabelInGroupOld} from './smalLabel';
import {
    getActiveLabel, addLabel, addLabelGroup, swichVisible, editLabel, editGroup, operateType,
    saveOldData, fetchSaveOldData, selectColor, delGroup, agreeMultiChoice, setSelectGroupName,
    setSelectLabelName, delLabel, selectGroupAct, setInputValue
} from '../../actions/label.js'
import './index.less'
import { getWindowHeight } from '../../views/App/index'
const groupTips = {
    '0': '请输入分组名',
    '-1': '分组名最多6个字',
    '-2': '已有30个分组，不能创建更多'
};
const labelTips = {
    '0': '请输入标签名',
    '-1': '标签名最多6个字',
    '-2': '已有200个标签，无法添加更多'
};
const colorTable = [
    'c1', 'c2', 'c3', 'c4', 'c5', 'c6' , 'c7', 'c8', 'c9', 'c10',
    'c11', 'c12', 'c13', 'c14', 'c15', 'c16', 'c17', 'c18', 'c19', 'c20'
];
class LeftGroup extends React.Component {
    componentWillMount() {
        // todo :: actions.getOldTags()

        this.setState({
            "visible": false,
            "createLabelvisible": false,
            "colorVisible": false,
            "oldLabelConfirm": false,
            "groupDeleteConfirm": false,
            "oldLabel": this.oldLabel,
            "groupName": "",
            "labelList": [],
            "groupList": [],
            "newLableName": "",
            'currentGroup': 0,//当前显示的分组index
            'currentGroupId': '',//当前显示分组id
            'editLabelName': '',
            'editGroupName': '',
            'oldLabelvisible': false,//整理旧标签显示
            'color': 'c1',
            'selectGroup': {},
            'activeLabelName': '',
            'activeColor': 'c1',
            'height': this.getHeight(),
            'width': '400px',
            'widthColor': '460px',
            'widthOldLabel': '520px'
        });
        window.addEventListener('resize', function() {
            // this.setState({
            //     'height': getWindowHeight(),
            // });
            // console.log(this.getWidth());
            this.setState({
                'height': this.getHeight(),
                'width': this.getWidth(),
                "widthColor": this.getWidth('color'),
                "widthOldLabel": this.getWidth('oldLabel')
            });
        }.bind(this));


    }
    getWidth(str) {
        let width;
        if (str == 'color') {
            width = getWindowWidth() > 1024 ? "460px" : "300px";
        } else if (str == 'oldLabel') {
            width = getWindowWidth() > 1024 ? "520px" : "300px";
        } else {
            width = getWindowWidth() > 1024 ? "440px" : "300px";
        }
        return width;
    }
    getHeight() {
        let height;
        if (getWindowWidth() > 1024) {
            height = getWindowHeight() < 768 ? 470 + 4: getWindowHeight() - 298 + 4;
        } else {
             height = getWindowHeight() < 768 ? 502 + 4: getWindowHeight() - 266 + 4;
        }
       /* if (height < 768){
            height = 768;
        }*/
        return height;
    }
    //创建分组
    saveGroup() {
        const {dispatch} = this.props;
        const {type} = this.props.postsByReddit.corpData;
        const {inputValues} = this.props.postsByReddit;
        // if (!inputValues.groupName) {
        //     Message.error('分组名不能为空');
        //     return false
        // }
        if (this.props.postsByReddit.isPosting) {
            return;
        }
        if(!this.validateCreateGroupName()){
            // this.setState({
            //     showCreateGroupTip: false,
            //     createGroupTipText: ''
            // });
            return;
        }
        if (type) {
            dispatch(addLabelGroup(inputValues.groupName.trim()));
            // dispatch(saveOldData(this.props.groupList))
        } else {
            // dispatch(addLabelGroup(inputValues.groupName));
            dispatch(operateType({
                type: 'CREATE_GROUP',
                data: inputValues.groupName.trim()
            }));
            dispatch(swichVisible(false, 'isNewGroupVisible'));
            dispatch(setInputValue('groupName', ''));
            fetchSaveOldData({
                gtag: this.props.postsByReddit.groupList
            });
        }

    }
    //设置颜色
    handleColorOk() {
        const {dispatch} = this.props;
        let selectGroup;
        let groupList = this.props.postsByReddit.groupList;
        groupList.groups.map((element, index) => {
            if (element.f_group_name == this.props.postsByReddit.selectGroupName) {
                selectGroup = element;
            }
        });
        dispatch(selectColor({
            id: selectGroup.f_group_id,
            color: this.state.activeColor
        }));
        dispatch(swichVisible(false, 'isColorVisible'));
        this.state.colorActiveObjIndex= 0;
        this.state.color = 'c1';
        this.setState(this.state);
    }

    oldLabelvisible() {
        this.setState({
            "oldLabelvisible": true
        })
    }

    handleOldOk() {
        this.setState({
            oldLabelvisible: false,
        });
    }
    delGroup() {
        const {type} = this.props.postsByReddit.corpData;
        const groupList = type ? this.props.postsByReddit.groupList.groups : this.props.postsByReddit.groupList;
        const {dispatch} = this.props;
        let selectGroup;
        // let exit = !type && isExitsLabelInGroupOld(name, this.props.postsByReddit.groupList);
        groupList.map((element, index) => {
            if (element.f_group_name == this.props.postsByReddit.selectGroupName) {
                selectGroup = element;
            }
        });

        // if (exit) {
        //     Message.error('该分组中有标签，不允许删除');
        //     return ;
        // }
        if (type) {
            //if 有标签删除失败会弹出框从redux里处理弹出框
            dispatch(delGroup({
                id: selectGroup.f_group_id,
                name: selectGroup.f_group_name
            }));

        } else {
            dispatch(operateType({
                type: 'DEL_GROUP_OLD',
                data: selectGroup.f_group_name
            }));
            fetchSaveOldData({
                gtag: this.props.postsByReddit.groupList
            });
        }
    }
    sureDelGroup() {
        let obj = this.props.postsByReddit.selectGroupOrLabel;
        const {dispatch} = this.props;
        const {type} = this.props.postsByReddit.corpData;
        const groupList = type ? this.props.postsByReddit.groupList.groups : this.props.postsByReddit.groupList;
        let selectGroup;
        groupList.map((element, index) => {
            if (element.f_group_name == this.props.postsByReddit.selectGroupName) {
                selectGroup = element;
            }
        });

        let name;
        if (type) {
            let id;
            if (this.state.isLight) {

                id = selectGroup.f_group_id;
                name = selectGroup.f_group_name;
                // id = this.props.postsByReddit.selectGroup.f_group_id;
            } else {
                id = obj.id;
                name = obj.name;
            }
            dispatch(delGroup({
                id: id,
                name: name
            }));
        } else {
            let exit;
            if (this.state.isLight) {
                name = selectGroup.f_group_name
                // id = this.props.postsByReddit.selectGroup.f_group_id;
            } else {
                name = obj.name;
            }
            exit = isExitsLabelInGroupOld(name, this.props.postsByReddit.groupList);
            if (exit) {
                Message.error('该分组下有标签不允许删除');
                return false;
            }
            dispatch(operateType({
                type: 'DEL_GROUP_OLD',
                data: name
            }));
            dispatch(swichVisible(false, 'isRightEditOrDelGroupVisble'));
            dispatch(swichVisible(false, 'isConfirmDelGroup'));
            const newList = this.props.postsByReddit.groupList;
            if(newList[0]) {
                dispatch(selectGroupAct(newList[0]));
            } else {
                dispatch(setSelectGroupName(''));
            }
            fetchSaveOldData({
                gtag: this.props.postsByReddit.groupList
            });
        }
        this.state.isLight = false;
        this.setState(this.state);
    }
    sureDelLabel() {
        let obj = this.props.postsByReddit.selectGroupOrLabel;
        const {dispatch} = this.props;
        const {type} = this.props.postsByReddit.corpData;

        if (type) {
            dispatch(delLabel({
                id: obj.id
            }));
        } else {
            dispatch(operateType({
                type: 'DEL_LABEL_OLD',
                data: obj
            }));
            fetchSaveOldData({
                gtag: this.props.postsByReddit.groupList
            });

        }
        dispatch(swichVisible(false, 'isConfirmDelLabel'));
    }
    showDig() {
        const{dispatch} = this.props;
        dispatch(swichVisible(true, 'isNewGroupVisible'));
        setTimeout(() => {
            document.getElementsByName('newGroupInput')[0].focus();
        }, 100);
    }

    showColorVisible() {
        const{dispatch} = this.props;
        const selectGroupName = this.props.postsByReddit.selectGroupName;
        const groupList = this.props.postsByReddit.groupList.groups;
        let selectGroup;
        groupList.map((element, index) => {
            if (element.f_group_name == selectGroupName) {
                selectGroup = element;
            }
        });
        this.state.activeColor = selectGroup.f_style;
        this.setState(this.state);
        dispatch(swichVisible(true, 'isColorVisible'));
    }
    showDigNoRedux(type) {
        if (!this.props.postsByReddit.groupList.length) {
            Message.error('还未创建分组，请先创建分组！');
            return;
        }
        if (!this.props.postsByReddit.selectGroupName) {
            Message.error('还未选中分组,请选中分组！');
            return;
        }
        this.state[type] = true;
        this.setState(this.state);
    }

    showNewLabelDialog() {
        const {dispatch} = this.props;
        dispatch(swichVisible(true, 'isNewLabelVisible'));
        setTimeout(() => {
            document.getElementsByName('newLableNameInput')[0].focus();
        }, 100)
        //  this.setState(this.state);
    }

    hideNewLabelDialog() {
        const {dispatch} = this.props;
        dispatch(swichVisible(false, 'isNewLabelVisible'));
        dispatch({
            type: 'CHANGE_LEFT_WARN',
            data: {
                showCreateLabelTip: false,
                createLabelTipText: ''
            }
        });
        this.props.dispatch(setInputValue('newLableName', ''));
        // this.setState(this.state);
    }

    handleCancelDig(type) {
        const {dispatch} = this.props;
        // this.state[type] = false;
        // this.setState(this.state);
        dispatch(swichVisible(false, 'isNewGroupVisible'));
        dispatch(setInputValue('groupName', ''));
        this.setState({
            showCreateGroupTip: false,
            createGroupTipText: ''
        });
        dispatch({
            type: 'CHANGE_LEFT_WARN',
            data: {
                showCreateGroupTip: false,
                createGroupTipText: ''
            }
        })

    }

    seachOldLabel(event) {
        this.setState({
            searchVal: event.target.value
        });
    }

    setValue(type, event) {
        //只允许输入中文，字母，数字，下划线
        this.state[type] = event.target.value;//.replace(/[^A-Za-z0-9\u4E00-\u9FA5_]/g, '');
        this.setState(this.state);
        this.props.dispatch(setInputValue(type, event.target.value));
    }
    validateCreateGroupName() {
        const { dispatch } = this.props;
        const { inputValues } = this.props.postsByReddit;
        const val = inputValues.groupName.trim();
        let validateResult = this.doValidateName(val);

        const {type} = this.props.postsByReddit.corpData;
        const groupList = type ? this.props.postsByReddit.groupList.groups : this.props.postsByReddit.groupList;
        if(groupList.length >= 30){
            validateResult = -2;
        }
        // this.setState({
        //     showCreateGroupTip: validateResult <= 0,
        //     createGroupTipText: groupTips[validateResult]
        // });
        dispatch({
            type: 'CHANGE_LEFT_WARN',
            data: {
                showCreateGroupTip: validateResult <= 0,
                createGroupTipText: groupTips[validateResult]
            }
        })
        return validateResult > 0;
    }
    validateModifyGroupName() {
        const val = this.props.postsByReddit.inputValues.editGroupName.trim();
        const { dispatch } = this.props;
        let validateResult = this.doValidateName(val);
        // this.setState({
        //     showModifyGroupTip: validateResult <= 0,
        //     modifyGroupTipText: groupTips[validateResult]
        // });
        dispatch({
            type: 'CHANGE_LEFT_WARN',
            data: {
                showModifyGroupTip: validateResult <= 0,
                modifyGroupTipText: groupTips[validateResult]
            }
        })
        return validateResult > 0;
    }
    validateCreateLabelName() {
        const val = this.props.postsByReddit.inputValues.newLableName.trim();
        const { dispatch } = this.props;
        let validateResult = this.doValidateName(val);
        if(this.props.postsByReddit.labelNum >= 200){
            validateResult = -2;
        }
        dispatch({
            type: 'CHANGE_LEFT_WARN',
            data: {
                showCreateLabelTip: validateResult <= 0,
                createLabelTipText: labelTips[validateResult]
            }
        })
        // this.setState({
        //     showCreateLabelTip: validateResult <= 0,
        //     createLabelTipText: labelTips[validateResult]
        // });
        return validateResult > 0;
    }
    validateModifyLabelName() {
        const val = this.props.postsByReddit.inputValues.editLabelName.trim();
        const { dispatch } = this.props;
        let validateResult = this.doValidateName(val);
        dispatch({
            type: 'CHANGE_LEFT_WARN',
            data: {
                showModifyLabelTip: validateResult <= 0,
                modifyLabelTipText: labelTips[validateResult]
            }
        })
        // this.setState({
        //     showModifyLabelTip: validateResult <= 0,
        //     modifyLabelTipText: labelTips[validateResult]
        // });
        return validateResult > 0;
    }
    doValidateName(val) {
        let result = 1;
        if (!val) {
            result = 0;
        }
        if (getByteLen(val) > 12) {
            result = -1;
        }
        return result;
    }

    saveNewLabel() {
        this.setState(this.state);
    }

    createGroupModalFooter() {
        const leftWarn = this.props.postsByReddit.leftWarn;
        return [
            <div className="ec-modal-tip" style={{
                display: leftWarn.showCreateGroupTip ? 'block' : 'none'
            }}>{ leftWarn.createGroupTipText }</div>,
            <div className="ec-btn-group"> 
                <Button key="submit"
                        type="primary"
                        loading={this.state.loading}
                        onClick={this.saveGroup.bind(this)}>
                    { this.props.postsByReddit.isPosting ? `确定中...` : `确定` }
                </Button>
                <Button key="back"
                        type="ghost"
                        onClick={ this.handleCancelDig.bind(this, "visible") }>
                    取消
                </Button>
            </div>
        ]
    }

    addNewTagModalFooter() {
       const leftWarn = this.props.postsByReddit.leftWarn;
        return [
            <div className="ec-modal-tip" style={{
                display: leftWarn.showCreateLabelTip ? 'block' : 'none'
            }}>{ leftWarn.createLabelTipText }</div>,
            
            <div className="ec-btn-group">
                <Button key="submit"
                        type="primary"
                        loading={ this.state.loading }
                        onClick={ this.newLabel.bind(this) }>
                    { this.props.postsByReddit.isPosting ? `确定中...` : `确定` }
                </Button>
                <Button key="back"
                        type="ghost"
                        onClick={ this.hideNewLabelDialog.bind(this) }>
                    取消
                </Button>
            </div>
        ]
    }

    createEditGroupModalFooter() {
        const leftWarn = this.props.postsByReddit.leftWarn;
        return [
            <div className="ec-modal-tip" style={{
                display: leftWarn.showModifyGroupTip ? 'block' : 'none'
            }}>{ leftWarn.modifyGroupTipText }</div>,
            <div className="ec-btn-group">
                <Button key="submit"
                        type="primary"
                        onClick={this.editGroup.bind(this)}>
                    {this.props.postsByReddit.isPosting ? '确定中...' : '确定'}
                </Button>
                <Button key="back"
                        type="ghost"
                        onClick={ this.handleCancelGroup.bind(this) }>
                    取消
                </Button>
            </div>
        ]
    }

    createEditLabelModalFooter() {
        const leftWarn = this.props.postsByReddit.leftWarn;
        return [
            <div className="ec-modal-tip" style={{
                display: leftWarn.showModifyLabelTip ? 'block' : 'none'
            }}>{ leftWarn.modifyLabelTipText }</div>,
            <div className="ec-btn-group">
                <Button key="submit"
                        type="primary"
                        onClick={this.editLabel.bind(this)}>
                    {this.props.postsByReddit.isPosting ? '确定中...' : '确定'}
                </Button>
                <Button key="back"
                        type="ghost"
                        onClick={ this.handleCancelLabel.bind(this) }>
                    取消
                </Button>
            </div>
        ]
    }
    createOldLabelModalFooter() {
        return [
            <div className="ec-btn-group">
                <Button key="back"
                        type="ghost"
                        onClick={ this.cancelLabelToGroup.bind(this) }>
                    关闭
                </Button>
            </div>
        ]
    }
    cancelGroupModalFooter() {
          return [
            <div className="ec-btn-group">
                <Button key="cancel"
                        type="primary"
                        onClick={this.hideDelGroupVisible.bind(this)}>
                    确定
                </Button>
            </div>
        ]
    }   
    cancelLabelToGroup() {
        this.state.oldLabelvisible = false;
        this.state.searchVal = '';
        this.setState(this.state);
    }
    editLabel() {
        let obj = this.props.postsByReddit.selectGroupOrLabel;
        const {dispatch} = this.props;
        if (!this.validateModifyLabelName()) {
            // Message.error('标签名不能为空');
            return false;
        }
        if (this.props.postsByReddit.isPosting) {
            return;
        }
        if (this.props.postsByReddit.inputValues.editLabelName.trim() == obj.name.trim()) {
            Message.success('操作成功!');
            dispatch(swichVisible(false, 'isEditLabelVisibel'));
            return;
        }
        dispatch(editLabel({
            id: obj.id,
            name: this.props.postsByReddit.inputValues.editLabelName.trim()
        }));
    }

    handleCancelGroup() {
        const {dispatch} = this.props;
        dispatch(swichVisible(false, 'isEditGroupVisibel'));
        dispatch({
            type: 'CHANGE_LEFT_WARN',
            data: {
                showModifyGroupTip: false,
                modifyGroupTipText: ''
            }
        })
        this.state.isLight = false;
        // this.state.showModifyGroupTip = false;
        // this.state.modifyGroupTipText = '';
        this.setState(this.state);
    }

    editGroup() {
        let obj = this.props.postsByReddit.selectGroupOrLabel;
        const {dispatch} = this.props;
        const {type} = this.props.postsByReddit.corpData;
        const groupList = type ? this.props.postsByReddit.groupList.groups : this.props.postsByReddit.groupList;
        let selectGroup;
        // if (!this.props.postsByReddit.inputValues.editGroupName) {
        //     Message.error('分组名不能为空');
        //     return false;
        // }
        
        if(!this.validateModifyGroupName()){
           
            return false;
        }
        groupList.map((element, index) => {
            if (element.f_group_name == this.props.postsByReddit.selectGroupName) {
                selectGroup = element;
            }
        });
        if (type) {
            let id, editData = {
                name: this.props.postsByReddit.inputValues.editGroupName.trim()
            };
            // if(selectGroup.f_group_name == obj.name){
            //     this.handleCancelGroup();
            //     return;
            // }
            if (this.props.postsByReddit.isPosting) {
                return;
            }
            if (this.state.isLight) {
                if (selectGroup.f_group_name.trim() == this.props.postsByReddit.inputValues.editGroupName.trim()) {
                    Message.success('操作成功!');
                    dispatch(swichVisible(false, 'isEditGroupVisibel'));
                    return;
                }
                editData.id = selectGroup.f_group_id
                // id = this.props.postsByReddit.selectGroup.f_group_id;
                editData.prevName = selectGroup.f_group_name.trim();
            } else {
                if (obj.name.trim() == this.props.postsByReddit.inputValues.editGroupName.trim()) {
                    Message.success('操作成功!');
                    dispatch(swichVisible(false, 'isEditGroupVisibel'));
                    return;
                }
                editData.id = obj.id;
                editData.prevName = obj.name;
            }
            dispatch(editGroup(editData));
        } else {
            let name;
            if (this.state.isLight) {
                name = selectGroup.f_group_name;
            } else {
                name = obj.name;
            }
            let itemIndex = groupList.findIndex((element, index) => {
                return element.f_group_name === this.props.postsByReddit.inputValues.editGroupName;
            });
            if (this.props.postsByReddit.inputValues.editGroupName.trim() == name.trim()) {
                Message.success('操作成功!');
                dispatch(swichVisible(false, 'isEditGroupVisibel'));
                return;
            }
            if (itemIndex != -1) {
                dispatch({
                    type: 'CHANGE_LEFT_WARN',
                    data: {
                        showModifyGroupTip: -3,
                        modifyGroupTipText: '标签分组名不能重复'
                    }
                })
                return;
            }

            let isSelectGroup = (name.trim() === this.props.postsByReddit.selectGroupName.trim());

            dispatch(swichVisible(false, 'isEditGroupVisibel'));
            dispatch(operateType({
                type: 'EDIT_GROUP_OLD',
                data: {
                    name: this.props.postsByReddit.inputValues.editGroupName.trim(),
                    preName: name
                }
            }));
            if (isSelectGroup) {
                let newList = this.props.postsByReddit.groupList;
                let tempIndex = newList.findIndex((element, index) => {
                    return element.f_group_name === this.props.postsByReddit.inputValues.editGroupName;
                });
                dispatch(selectGroupAct(newList[tempIndex]));
            }
            fetchSaveOldData({
                gtag: this.props.postsByReddit.groupList
            });
        }

    }
    handleCancelLabel() {
        const {dispatch} = this.props;
        dispatch(swichVisible(false, 'isEditLabelVisibel'));
        dispatch({
            type: 'CHANGE_LEFT_WARN',
            data: {
                showModifyLabelTip: false,
                modifyLabelTipText: ''
            }
        });
        this.props.dispatch(setInputValue('editLabelName', ''));
    }

    getLabel(item, event) {
        const {dispatch} = this.props;
        // const {type} = this.props.postsByReddit.corpData;
        // this.state.selectGroup = item;
        dispatch(selectGroupAct(item));
    }

    newLabel() {
        const {dispatch} = this.props;
        if (this.props.postsByReddit.isPosting) {
            return false;
        }
        let target;
        this.props.postsByReddit.groupList.groups.forEach((element, index) => {
            if (element.f_group_name.trim() == this.props.postsByReddit.selectGroupName.trim()) {
                target = element;
            }
        });
        if (!this.validateCreateLabelName()) {
            // Message.error('标签名不允许为空');
            return false;
        }
        dispatch(addLabel({'gid': target.f_group_id, 'name': this.props.postsByReddit.inputValues.newLableName.trim()}));
        // this.setState({
        //     showCreateLabelTip: false,
        //     createLabelTipText: ''
        // });
    }

    setOldLableToGroup(id) {
        const {dispatch} = this.props;
        const {groupList} = this.props.postsByReddit;
        if (!this.props.postsByReddit.selectGroupName) {
            Message.error('请先选中一个分组！');
            return false
        }
        if (groupList && groupList.length) {
            dispatch(operateType({
                type: 'OLDLABLE_TO_GROUP',
                data: {
                    id: id,
                    groupName: this.props.postsByReddit.selectGroupName
                }
            }))
            fetchSaveOldData({
                gtag: this.props.postsByReddit.groupList
            });
        } else {
            Message.error('请先创建一个分组！');
        }

    }
    isAgreeManyChecked(e) {
        const {dispatch} = this.props;
        const {type} = this.props.postsByReddit.corpData;
        // const {isAgreeManyChecked} = this.props.postsByReddit;
        if (!this.props.postsByReddit.selectGroupName) {
            Message.error('请先选中分组！');
            return false;
        }
        let groupList;
        let data = {};
        // dispatch(swichVisible(!isAgreeManyChecked, 'isAgreeManyChecked'));
        let selectGroup;
        groupList = type ? this.props.postsByReddit.groupList.groups : this.props.postsByReddit.groupList;
        groupList.forEach((element, index) => {
            if (element.f_group_name == this.props.postsByReddit.selectGroupName) {
                selectGroup = element;
            }
        });
        if (type) {
            data = {
                id: selectGroup.f_group_id,
                multi: !selectGroup.f_ismore ? 1 : 0
            }
            dispatch(agreeMultiChoice(data));
        } else {
            data = {
                groupName: selectGroup.f_group_name,
                multi: !selectGroup.f_ismore ? 1 : 0
            }
            dispatch({
                type: 'AGREE_MULTI_CHOICE_OLD',
                data: data
            })
            fetchSaveOldData({
                gtag: this.props.postsByReddit.groupList
            });
        }

    }
    showEditGroupRight(isLight) {
        const {type} = this.props.postsByReddit.corpData;
        const {dispatch} = this.props;
        const groupList = type ? this.props.postsByReddit.groupList.groups : this.props.postsByReddit.groupList;
        let selectGroup;
        let obj = this.props.postsByReddit.selectGroupOrLabel;
        groupList.map((element, index) => {
            if (element.f_group_name == this.props.postsByReddit.selectGroupName) {
                selectGroup = element;
            }
        });
        if (isLight) {
            this.props.postsByReddit.inputValues.editGroupName = selectGroup.f_group_name;
        } else {
            this.props.postsByReddit.inputValues.editGroupName = obj.name;
        }
        this.state.isLight = isLight;

        dispatch(swichVisible(true, 'isEditGroupVisibel'));
        this.setState(this.state);

        setTimeout(() => {
            document.getElementsByName('editGroupNameInput')[0].select();
        }, 100)
    }
    showEditLabel() {
        const {dispatch} = this.props;
        let obj = this.props.postsByReddit.selectGroupOrLabel;
        this.props.postsByReddit.inputValues.editLabelName = obj.name;
        dispatch(swichVisible(true, 'isEditLabelVisibel'));
        this.setState(this.state);

        setTimeout(() => {
            document.getElementsByName('editLabelNameInput')[0].select();
        }, 100)
    }
    swichActiveColor(index, e) {
        this.state.activeColor = colorTable[index];
        this.setState(this.state);
    }
    handleCancelColorDig() {
        const {dispatch} = this.props;
        dispatch(swichVisible(false, 'isColorVisible'));
        this.state.colorActiveObjIndex = 0;
        this.state.color = 'c1';
        this.setState(this.state);
    }
    hideDelGroupVisible() {
        const { dispatch } = this.props;
        dispatch({
            type: 'DELGROUP_MODAL',
            data: false
        })
    }
    // showConfirmDelGroup(isLight) {
    //     // const {dispatch} = this.props;
    //     const {dispatch} = this.props;
    //     if (isLight) {
    //         this.state.isLight = true;
    //     }
    //     dispatch(swichVisible(true, 'isConfirmDelGroup'));
    //     this.setState(this.state);

    // }
    // hideConfirmDelGroup(name) {
    //     // const {dispatch} = this.props;
    //     const {dispatch} = this.props;
    //     dispatch(swichVisible(false, 'isConfirmDelGroup'));
    //     this.state.isLight = false;
    //     this.setState(this.state);

    // }
    // showConfirmDelLabel(name) {
    //     // const {dispatch} = this.props;
    //     const {dispatch} = this.props;
    //     dispatch(swichVisible(true, 'isConfirmDelLabel'));

    // }
    hideConfirmDelLabel(name) {
        // const {dispatch} = this.props;
        const {dispatch} = this.props;
        dispatch(swichVisible(false, 'isConfirmDelLabel'));

    }
    setActiveLabel(item) {
        const {dispatch} = this.props;
        dispatch(setSelectLabelName(item.f_class_name || item.name));
        this.state.activeLabelName = item.f_class_name;
        this.setState(this.state);
    }
    render() {
        const {type} =  this.props.postsByReddit.corpData;
        const groups = type ? this.props.postsByReddit.groupList.groups : this.props.postsByReddit.groupList;
        const {
                currentLabels, 
                isAgreeManyChecked, 
                allOldLabel, 
                isRightEditOrDelGroupVisble, 
                selectGroupName,
                selectLabelName,
                inputValues
            } = this.props.postsByReddit;

        const labelList = currentLabels && currentLabels.length ? currentLabels : [];
        const allOldLabelFilter = allOldLabel.filter((item) => {
            return this.state.searchVal ? item.name.indexOf(this.state.searchVal) !== -1 : true;
        })
        let selectGroup;
        groups && groups.map((element, index) => {
            if (element.f_group_name == selectGroupName) {
                selectGroup = element;
            }
        })
        let classStringA;
        let classStringUl = 'tag-theme-perview ' + this.state.activeColor;
        let classStringColorGroup = 'tag-color ' + ( selectGroup ? selectGroup.f_style : 'c1');
        let classStringColorUlLabel = 'tag-items ' + ( selectGroup ? selectGroup.f_style : 'c1');
        let remainGroupNum = 30 - (groups && groups.length || 0);
        let labelNum = this.props.postsByReddit.labelNum;
        let remainLabelNum = 200 - labelNum;
        // console.log('xxx:' + this.state.width);
        // console.log(getWindowHeight());
        return (
            <div className={ 
                    "grouping-sorting-box " + (groups && groups.length ? "" : "empty-grouping ") + ( this.props.componentType == 'newLabel' ? 'new' : 'grouping-sorting old')
                }>
                <Modal width="440px" maskClosable={ false }
                       title="创建分组"
                       visible={ this.props.postsByReddit.isNewGroupVisible}
                       wrapClassName="vertical-center-modal"
                       footer={ this.createGroupModalFooter() }
                       onCancel={ this.handleCancelDig.bind(this, "visible") }>
                       
                    <Input placeholder="最多6个字"  value={inputValues.groupName || ''} ref="newGroupInput"
                           onChange={this.setValue.bind(this, 'groupName')} name="newGroupInput" 
                           onPressEnter={ this.saveGroup.bind(this) }/>
                    <div className="grouplabel-number" >
                        您还可以创建<span>{ remainGroupNum }</span>个分组
                    </div>
                </Modal>
                <Modal width="510px" maskClosable={ false }
                       title="整理旧标签"
                       visible={this.state.oldLabelvisible}
                       wrapClassName="vertical-center-modal"
                       onOk={this.handleOldOk.bind(this)}
                       onCancel={this.cancelLabelToGroup.bind(this, 'oldLabelvisible')}
                       footer={this.createOldLabelModalFooter()}>
                    <Input placeholder="最多6个字"  
                           value={ this.state.searchVal }
                           ref="searchInput" 
                           onChange={ this.seachOldLabel.bind(this) }/>
                    <ul className="oldlaber-items oldlaber-no-data">
                        {
                            allOldLabel.length == 0 || allOldLabelFilter == 0?
                                <p className="no-data-tip">没有搜索相关的标签</p> :
                              allOldLabelFilter.map((item, i) => {
                                    return (
                                        <li key={i} onClick={this.setOldLableToGroup.bind(this, item.id)}>
                                            <span>{item.name}</span><i className="iconfont">&#xe60d;</i>
                                        </li>
                                    )
                                })
                        }
                    </ul>
                </Modal>

                <Modal width="440px" maskClosable={ false }
                       title="添加新标签"
                       visible={this.props.postsByReddit.isNewLabelVisible}
                       wrapClassName="vertical-center-modal"
                       footer={ this.addNewTagModalFooter() }
                       onCancel={ this.hideNewLabelDialog.bind(this) }>
                    <Input placeholder="最多6个字" 
                           value={ inputValues.newLableName }
                           onChange={ this.setValue.bind(this, 'newLableName') } name="newLableNameInput" 
                           onPressEnter={ this.newLabel.bind(this) } />
                    <div className="grouplabel-number" >
                        您还可以创建<span>{ remainLabelNum }</span>个标签
                    </div>
                </Modal>
                <Modal width="440px" maskClosable={ false }
                           title="删除标签"
                           visible={this.props.postsByReddit.isConfirmDelLabel}
                           wrapClassName="vertical-center-modal"
                           onOk={this.sureDelLabel.bind(this)}
                           onCancel={this.hideConfirmDelLabel.bind(this)}>
                        <div>删除后，客户对应的标签信息将同时被清除，确定要删除吗？</div>
                </Modal>
                {
                    /*<Modal width="440px" maskClosable={ false }
                           title="删除分组"
                           visible={this.props.postsByReddit.isConfirmDelGroup}
                           wrapClassName="vertical-center-modal"
                           onOk={this.sureDelGroup.bind(this)}
                           onCancel={this.hideConfirmDelGroup.bind(this)}>
                        <div>删除分组会导致客户资料对应分组标签丢失，确定删除吗？</div>
                    </Modal>
                    <Modal width="440px" maskClosable={ false }
                           title="删除标签"
                           visible={this.props.postsByReddit.isConfirmDelLabel}
                           wrapClassName="vertical-center-modal"
                           onOk={this.sureDelLabel.bind(this)}
                           onCancel={this.hideConfirmDelLabel.bind(this)}>
                        <div>删除标签会同时删除客户资料上对应的标签，确定要删除吗？</div>
                    </Modal>*/

                }
                <Modal width="440px" maskClosable={ false }
                           title="温馨提示"
                           visible={this.props.postsByReddit.delGroupVisible}
                           wrapClassName="vertical-center-modal"
                           footer={ this.cancelGroupModalFooter() }
                           onOk={this.hideDelGroupVisible.bind(this)}
                           onCancel={this.hideDelGroupVisible.bind(this)}>
                        <p>删除分组前，请先将该分组内的标签删除！</p>
                </Modal>
                <Modal width="440px" maskClosable={ false }
                       title="修改分组"
                       visible={this.props.postsByReddit.isEditGroupVisibel}
                       wrapClassName="vertical-center-modal"
                       footer={ this.createEditGroupModalFooter() }
                       onCancel={ this.handleCancelGroup.bind(this) }>
                    <Input placeholder="最多6个字"  value={this.props.postsByReddit.inputValues.editGroupName}
                           onChange={this.setValue.bind(this, 'editGroupName')} 
                           onPressEnter={ this.editGroup.bind(this) }
                           name="editGroupNameInput"/>
                </Modal>
                <Modal width="440px" maskClosable={ false }
                       title="修改标签"
                       visible={this.props.postsByReddit.isEditLabelVisibel}
                       wrapClassName="vertical-center-modal"
                       footer={ this.createEditLabelModalFooter() }
                       onCancel={ this.handleCancelLabel.bind(this) }>
                    <Input placeholder="最多6个字"  value={this.props.postsByReddit.inputValues.editLabelName}
                           onChange={this.setValue.bind(this, 'editLabelName')} 
                           onPressEnter={ this.editLabel.bind(this) }
                           name="editLabelNameInput" />
                </Modal>
                {
                    this.props.componentType === 'oldLabel' ? <p className="grouping-title">对原有的标签进行分组整理：</p> : ''
                }
                <div className="grouping-sorting-container">
                    <div className="grouping-sorting-box" style={{height: type == 0 ? 
                        this.state.height - 173 + 'px' : this.state.height + 'px'}}>
                        <div className="grouping-sorting-left">
                            <div className="grouping-sorting-left-head">
                                <h4>标签分组</h4>
                                <Button type="ghost" onClick={this.showDig.bind(this)}>创建分组</Button>
                            </div>
                            {
                                groups && groups.length == 0 ?
                                    <div className="no-grouping">
                                        <img src={ecbiz.cdn + 'comm/public/images/empty-left.png'} alt=""/>
                                        <span>还没有建立分组</span>
                                    </div> : ''
                            }

                            <ul className="grouping-sorting-name">
                                {
                                    groups && groups.map((item, index) => {
                                        return (<SmallLabel
                                            editDig={this.showDig.bind(this)}
                                            key={item.f_group_name}
                                            isSelect={selectGroupName === item.f_group_name}
                                            groupClick={this.getLabel.bind(this, item)}
                                            labelName={item.f_group_name}
                                            dataType="group"
                                            labelId={item.f_group_id}
                                            showEditGroupRight={this.showEditGroupRight.bind(this)}
                                            fStyle={item.f_style}
                                            index={ index }
                                            groups={ groups }
                                        /> );
                                    })
                                }
                            </ul>
                        </div>
                        <div className={labelList && labelList.length ? "grouping-sorting-right" : "grouping-sorting-right empty-tag" }>

                            {
                                /*
                                    !groups || groups.length == 0 || !selectGroupName ?
                                        <div className="no-grouping">
                                            <img src={ecbiz.cdn + 'comm/public/images/empty-right.png'} alt=""/>
                                            <span>请先到左侧列表{groups && groups.length ? '选择' : '创建'}一个分组</span>
                                        </div> : ''
                           
                                */
                            }
                            {
                                selectGroupName ? <div className="grouping-sorting-right-head">
                                    <h4>{selectGroupName}（{labelList.length || 0}个）</h4>
                                    {
                                        selectGroupName ?
                                            <div className="right-control" >
                                                <a href="javascript:;"
                                                   className="ec-link-text"
                                                   onClick={this.showEditGroupRight.bind(this, true)}>修改分组名</a>
                                                <span>|</span>
                                                <a href="javascript:;"
                                                   onClick={this.delGroup.bind(this)}
                                                   className="ec-link-text">删除分组</a>
                                            </div>: ''
                                    }
                                </div>: null
                            }
                            {
                                this.props.componentType == 'oldLabel' ?
                                    (selectGroupName ?
                                        <p className="add-tag">
                                            <Button type="ghost"
                                                    onClick={this.showDigNoRedux.bind(this, 'oldLabelvisible')}>
                                                分配旧标签
                                            </Button>
                                            <label>
                                                <Checkbox checked={selectGroup && selectGroup.f_ismore}
                                                          onChange={this.isAgreeManyChecked.bind(this)}/>
                                                <span>允许这组标签多选</span>
                                            </label>
                                        </p> : null) :
                                    (selectGroupName ?
                                        <p className="add-tag">
                                            <Button type="ghost"
                                                    onClick={this.showNewLabelDialog.bind(this)}>
                                                添加标签
                                            </Button>
                                        </p> : null)
                            }
                            <ul className={classStringColorUlLabel}>
                                {
                                    labelList && labelList.map((item, index) => {
                                        return (<SmallLabel
                                            key={item.f_class_id || item.id}
                                            labelName={item.f_class_name || item.name}
                                            labelId={item.f_class_id || item.id}
                                            groupName={item.f_group_name}
                                            labelClick={this.setActiveLabel.bind(this, item)}
                                            isLabel={true}
                                            showEditLabel={this.showEditLabel.bind(this)}
                                            isActive={item.f_class_name == this.state.activeLabelName ? 1 : 0}
                                            labelList={labelList}
                                            index={index}/>)
                                    })
                                }
                            </ul>
                            {
                                !groups || groups.length == 0 ?  
                                    <div className={selectGroupName ? "no-grouping center-no-grouping" : "no-grouping"}>
                                        <img src={ecbiz.cdn + 'comm/public/images/empty-right.png'} alt=""/>
                                        <span>请先到左侧列表创建一个分组</span>
                                    </div> : (!labelList || labelList.length == 0 ?
                                            <div className={selectGroupName ? "no-grouping center-no-grouping" : "no-grouping"}>
                                                <img src={ecbiz.cdn + 'comm/public/images/empty-tag.png'} alt=""/>
                                                <span>该分组还没有标签</span>
                                                {   this.props.componentType == 'oldLabel' ? '' :
                                                    <Button type="ghost" onClick={this.showNewLabelDialog.bind(this)}>
                                                            添加标签
                                                    </Button>
                                                }
                                            </div> : ''
                                        )
                                
                            }

                            {
                                this.props.componentType == 'newLabel' && this.props.postsByReddit.selectGroupName ?
                                    <div className="add-tag-footer">
                                        <label>
                                            <Checkbox checked={selectGroup && selectGroup.f_ismore} onChange={this.isAgreeManyChecked.bind(this)}/>
                                            <span>允许这组标签多选</span>
                                        </label>
                                        <div className="current-themes">
                                            <span>标签组颜色：</span>
                                            <a className={classStringColorGroup}
                                               onClick={this.showColorVisible.bind(this)}></a>
                                        </div>
                                    </div> : ''
                            }

                        </div>
                    </div>
                </div>
                <Modal width="460px" title="设置标签颜色" wrapClassName="vertical-center-modal" maskClosable={ false }
                       visible={this.props.postsByReddit.isColorVisible} footer={[
                    <div key={ Math.random() + 1 } className="ec-modal-tip"></div>,
                    <div key={ Math.random() + 2 } className="ec-btn-group">
                        <Button key="submit" type="primary" loading={this.state.loading}
                                onClick={this.handleColorOk.bind(this)}>
                            确 定
                        </Button>
                        <Button key="back" type="ghost" onClick={this.handleCancelColorDig.bind(this, 'colorVisible')}>取消</Button>
                    </div>
                ]} onCancel={this.handleCancelColorDig.bind(this, 'colorVisible')}>
                    <div className="set-tag-theme">
                        <div className="color-items">
                            {
                                colorTable.map((element, index) => {
                                    classStringA = (element == this.state.activeColor) ? 'tag-color ' +  'c' + (index + 1) + ' active':
                                    'tag-color ' + 'c' + (index + 1);
                                    return (<a key={ index } className={classStringA} onClick={this.swichActiveColor.bind(this, index)}></a>)
                                })
                            }
                        </div>
                        <p><i className="iconfont">&#xe60b;</i>标签颜色可以帮助您快速定位标签类型哦。</p>
                    </div>
                </Modal>
            </div>
        )
    }
}
function mapStateToProps(state) {
    const {postsByReddit} = state;
    return {postsByReddit}
}
export default connect(mapStateToProps)(LeftGroup);
export function getWindowWidth() {
    var _width= window.innerWidth;

    if (window.innerWidth)
        _width = window.innerWidth;
    else if ((document.body) && (document.body.clientWidth))
        _width = document.body.clientWidth;
// 通过深入 Document 内部对 body 进行检测，获取窗口大小
    if (document.documentElement && document.documentElement.clientWidth && document.documentElement.clientWidth) {
        _width = document.documentElement.clientWidth;
    }
    return _width;
}
export function getByteLen(str) {   
    let l;   
    let n; 
    if (str) {
        n = l = str.length;
    } else {
        return 0;
    }
     
    for ( var i = 0; i < l; i++) {  
        if (str.charCodeAt(i) < 0 || str.charCodeAt(i) > 255) {  
            n++;   
        }   
    }   
    return n;   
}  