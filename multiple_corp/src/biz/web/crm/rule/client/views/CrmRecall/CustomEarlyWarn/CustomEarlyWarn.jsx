import React from 'react';
import { Modal, Icon, Input, Button } from 'antd';
import SelectUser from 'components/SelectUser';
import './index.less';
import HelpIntro from 'components/HelpIntro'

const helpIntro = [
    '实际收回客户数达到设置的数值时，上述人员会提前一天收到预警；',
    '只要其中一位人员确认收回，那么在次日凌晨系统就会收回客户；若无人员确认或者有人员确认暂不收回，就不收回客户；'
]

function isNumberAviliable(text) {
    const number = parseFloat(text);
    return number >= 10000 && number <= 1000000 && number % 1 <= 0;
}

function isNumber(text) {
    let number = parseFloat(text);
    return number >= 0 && number % 1 <= 0;
}

//预警信息弹层
class CustomEarlyWarn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isNumAviliable: false,
            isSelectUserShow: false,
            option: {},

        }
    }
    //展示弹层方法
    showModal = () => {
        if (this.props.enable)
            this.props.ruleActions.getEarlyWarn();
    }
    //关闭弹层方法
    closeModal = () => {
        this.props.ruleActions.showEarlyWarn(false);
    }

    //处理通知上限人数输入框
    handleChange = (e) => {
        let value = e.target.value.replace(new RegExp('[,]', 'g'), '');
        this.props.ruleActions.changeNoticNum(value);
    }
    //组织架构选择确定回调
    selectUserOk = (array) => {
        this.setState({
            isSelectUserShow: false,
        });
        if (array.length > 0) this.props.ruleActions.changeCheckedUsers(array);
    }
    //组织架构选择取消回调
    selectUserCancle = () => {
        this.setState({
            isSelectUserShow: false,
        })
    }
    //展示组织架构选择组件
    showSelectUser = (e) => {
        let target = e.target;
        this.setState({
            isSelectUserShow: true,
            option: {
                left: target.offsetLeft + Math.floor(target.offsetWidth / 2),
                top: target.offsetTop + target.offsetHeight,
            },
        });
        if (this.props.allUserData.length <= 0) {
            this.props.ruleActions.loadAllUsers();
        };
    }
    //保存预警设置数据
    saveEarlyWarnData = () => {
        if (this.props.earlyWarnSendLoading) return;
        if (isNumberAviliable(this.props.earlyWarnUserNum) && this.props.checkedEarlyWarnUsers.length >= 0) {
            let user_ids = '';
            this.props.checkedEarlyWarnUsers.forEach(function (item) {
                user_ids += item.id + ',';
            });
            user_ids = user_ids.substr(0, user_ids.length - 1);
            this.props.ruleActions.setEarlyWarn({
                number: this.props.earlyWarnUserNum,
                user_ids,
            })
        }
    }
    //删除预警通知人
    deleteUser(id) {
        return () => {
            let newArray = this.props.checkedEarlyWarnUsers.filter((item) => (item.id !== id));
            this.props.ruleActions.changeCheckedUsers(newArray);
        }
    }
    //修饰输入数字(三位计数)
    formatNumber(number) {
        number = number + '';
        if (isNumber(number)) {
            let array = [];
            for (let i = 0; i < number.length; i++) {
                if (i % 3 == 0 && i != 0) {
                    array.push(',');
                }
                array.push(number.substr(number.length - i - 1, 1));
            }
            array = array.reverse();
            return array.join('');
        }
        return number;
    }
    render() {
        let isNumAviliable = isNumberAviliable(this.props.earlyWarnUserNum);
        return (
            <div className="back-rule-mostwarn">
                <span onClick={this.showModal} style={this.props.enable ? null : { color: '#999' }}><Icon type="setting" />设置上限预警</span>
                <Modal title="设置上限预警" visible={this.props.isEarlyWarnShow} width={690} footer={null} onCancel={this.closeModal} 
                    wrapClassName="gray-foot-modal vertical-center-modal ant-content-modal">
                    <div className="back-rule-warn">
                        <p className="warn-title">预警设置：</p>
                        <p>当天收回客户数超过
                        <Input style={{ width: '145px', margin: '0 5px', fontSize: 12 }} placeholder="1万~100万以内的整数"
                                onChange={this.handleChange} value={this.formatNumber(this.props.earlyWarnUserNum)} />
                            时，需要以下人员确认：
                            {
                                isNumAviliable || this.props.isEarlyWarnEmpty ? null :
                                    <span className="back_rule_error">请输入1万~100万以内的整数</span>
                            }
                        </p>
                        <SelectUser
                            visible={this.state.isSelectUserShow} //弹窗展示
                            option={this.state.option}  //位置数据{left:xxx,top:xxx}
                            data={this.props.allUserData} //全部数据
                            onOk={this.selectUserOk}  //确定回调 带参数 已选数组
                            onCancle={this.selectUserCancle}  //取消回调
                            checkedArray={this.props.checkedEarlyWarnUsers}  //已选的数据
                        />
                        <p><button className="ant-btn" ref="addButton" onClick={this.showSelectUser}>添加人员</button>
                            {
                                this.props.checkedEarlyWarnUsers.length > 0 || this.props.isEarlyWarnEmpty ? null :
                                    <span className="back_rule_error">请添加人员</span>
                            }
                        </p>
                        <ul className="warn-user-list">
                            {
                                this.props.checkedEarlyWarnUsers.map(item => (
                                    <li key={item.id}>{item.name}<Icon type="close" onClick={this.deleteUser(item.id)} /></li>))
                            }
                        </ul>
                        <div className="back-rule-body">
                            <HelpIntro list={ helpIntro } />
                        </div>
                        <div className="back_rule_action" >
                            <Button type="primary" onClick={this.saveEarlyWarnData}
                                disabled={!(isNumAviliable && this.props.checkedEarlyWarnUsers.length > 0)}>
                                {
                                    this.props.earlyWarnSendLoading ? '确定中...' : '确定'
                                }
                            </Button>
                            <Button onClick={this.closeModal}>取消</Button>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
};

export default CustomEarlyWarn;