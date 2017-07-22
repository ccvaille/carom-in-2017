import React, { PropTypes } from "react";
import {Link} from 'react-router';

import NoRoundAnswer from './components/NoRoundAnswer';
import RoundAnswer from './components/RoundAnswer';
import RoundAddUser from './components/RoundAddUser';
import MobileSetting from './MobileSetting';

import { Modal, Table } from 'antd';
import "./setting.less";
import "./mix.less";


class Setting extends React.Component {
    static propTypes = {
        settingActions: PropTypes.object.isRequired,
        switchboardSetting: PropTypes.object.isRequired,
        commonModal: PropTypes.object.isRequired,
        commonModalActions: PropTypes.object.isRequired
    };
    componentDidMount() {
        this.props.settingActions.getSetting();
    }

    componentDidUpdate() {
        const {
            configureType
        } = this.props.switchboardSetting;

        // if (configureType === 1) {
        //     this.refs.typeOneInput.focus();
        // } else if (configureType === 2) {
        //     this.refs.typeTwoInput.focus();
        // }
    }

    onTypeChange = e => {
        const {
            settingActions
        } = this.props;
        const value = Number(e.target.value);
        settingActions.updateSettingType(value);
    };

    onNumberChange = (e, type) => {
        if (type === 1) {
            this.props.settingActions.updateTypeOneNumber(e.target.value);
        } else if (type === 2) {
            this.props.settingActions.updateTypeTwoNumber(e.target.value);
        }
    };

    onSubmitSetting = () => {
        this.props.settingActions.submitSetting();
    };
    //初始化模式二选择
    buildTree = () => {
        let that = this;
        let setting = {
            view: {
                showIcon: (treeId, treeNode) => false,                  //显示叶子节点的图标
                showLine: true,                             //显示连接线
                dblClickExpand: false,                       //双击展开
                selectedMulti: false                        //禁止多选
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onClick: that.setMode2Selected
            }
        };

        jq.getJSON('//api.workec.com/usercenter/usergroup/corpstruct?with_staff=1&callback=?', function(result){
            //部门+员工
            jq.fn.zTree.init(jq("#tree2"), setting, result.data);
        });
    }
    //模式二选择员工
    setMode2Selected = (e, treeId, treeNode) => {
        this.props.settingActions.setMode2Selected({
            id: treeNode.id,
            name: treeNode.name
        });
    }
    //模式二选择员工接听电话输入
    mode2SelectedInput = (e) => {
        this.props.settingActions.setMode2SelectedInput(e.target.value.trim());
    }
    //关闭轮转选择员工
    closeSelectEmployee = () => {
        const {
            isSelectEmployee
        } = this.props.switchboardSetting;
        this.props.settingActions.toggleSelectEmployee(false);
    }
    //展示轮转选择员工
    showSelectEmployee = () => {
        const {
            isSelectEmployee
        } = this.props.switchboardSetting;
        this.props.settingActions.toggleSelectEmployee(true);
        this.buildTree();
    } 
    //保存轮转选择员工
    saveSelectEmployee =() => {
        this.props.settingActions.setRoundAnswer();  
    }
    showNoRoundAddUser = (modeType, id) => {
        let that = this;
        jq('#' + id).ztree({
            url: '//api.workec.com/usercenter/usergroup/corpstruct?with_staff=1&callback',
            callback: function (nodeId, name, type) {
                that.mode1AddUser(nodeId, name, modeType);
            }
        });
    }

    //模式二移动轮转接听人员次序
    moveRoundAnswerEmployees = (operateType, index) => {
        this.props.settingActions.moveRoundAnswerEmployees({
            operateType,
            index
        })
    }
    //模式二删除接听人员
    delRoundAnswerEmployees = (index) => {
        this.props.settingActions.delRoundAnswerEmployees({
            index
        })
    }
    //模式二振铃时间设置
    changeIntervalTime = (e) => {
         this.props.settingActions.changeIntervalTime({
            time: e.target.value.trim()
        })
    }
    //切换模式2radio
    radioChangeMode2 = (type) => {
        this.props.settingActions.setMode2ActiveType(type);
    }
    //关闭业务配置
    cancelSetting = () => {
        this.props.settingActions.toggleSetting('');
        this.props.settingActions.cancelSetting();
    }
    toggleMode = (mode) => {
        this.props.settingActions.toggleMode(mode);
    }
    //切换模式1radio
    radioChangeMode1 = (type) => {
        this.props.settingActions.setMode1ActiveType(type);
    }
    //模式1 输入号码
    mode1InfoPhone = (e, type) => {
        this.props.settingActions.setMode1InfoPhone({
            type: type,
            phone: e.target.value.trim()
        })
    }
    //模式1 选择员工
    mode1AddUser = (userId, userName, type) => {
       
        this.props.settingActions.setMode1InfoUser({
            userId,
            userName,
            type
        })
    }
    //模式1 删除员工
    resetMode1InfoUser = (type) => {
        this.props.settingActions.resetMode1InfoUser(type);
    }
    
    render() {
        const {
            errorText
        } = this.props.commonModal;
        const {
            configureType,
            typeOneNumber,
            typeTwoNumber,
            isSelectEmployee,//选择员工显示
            roundAnswerEmployees,//轮转接听人员
            settingId, //号码业务配置
            mode1Info,
            mode2Info,
            mode,
            mode2Selected
        } = this.props.switchboardSetting;
        return (
            settingId ? 
            <div className="switchboard-setting">
                <div className="inner-box">
                    <div className="succeed-tips">
                        恭喜， 您的企业云呼总机功能现在可以正常使用了！
                        <p> 云呼总机的使用权限和EC云呼一致， 请在员工账号详情处操作。 </p>
                    </div>

                    <ul className="deploy-nav">
                        <li className="active">
                           号码配置
                        </li>
                        
                    </ul>
                    
                    <NoRoundAnswer
                        showNoRoundAddUser={this.showNoRoundAddUser} 
                        mode={mode}
                        mode1Info={mode1Info}
                        mode1InfoPhone={this.mode1InfoPhone}
                        toggleMode={this.toggleMode}
                        radioChangeMode1={this.radioChangeMode1} 
                        resetMode1InfoUser={this.resetMode1InfoUser}/>
                    <RoundAnswer
                        delRoundAnswerEmployees={this.delRoundAnswerEmployees}
                        moveRoundAnswerEmployees={this.moveRoundAnswerEmployees}
                        roundAnswerEmployees={roundAnswerEmployees}
                        showSelectEmployee={this.showSelectEmployee}
                        mode={mode}
                        mode2Info={mode2Info}
                        changeIntervalTime={this.changeIntervalTime}
                        radioChangeMode2={this.radioChangeMode2}
                        toggleMode={this.toggleMode}/>
                    <div className="btn-box config-btn-box">
                        <p className="error-hint"> {errorText} </p>
                        <button
                            className="submit"
                            onClick={this.onSubmitSetting}
                        >
                            保存
                        </button>
                        <button
                            className="submit cancel"
                            onClick={this.cancelSetting}
                        >
                            取消
                        </button>
                       
                    </div>

                    <Modal
                        className="modal-employee"
                        title="添加接听坐席"
                        wrapClassName="vertical-center-modal"
                        visible={isSelectEmployee}
                        height={700}
                        width={610}
                        footer={
                            (<div className="center-btn-box"></div>)
                        }
                        onCancel={this.closeSelectEmployee} >
                            <RoundAddUser 
                                mode2Selected={mode2Selected}
                                mode2SelectedInput={this.mode2SelectedInput}
                                saveSelectEmployee={this.saveSelectEmployee}/>
                    </Modal>
                </div>
            </div> : 
            <MobileSetting />
        );
    }
}

export default Setting;
