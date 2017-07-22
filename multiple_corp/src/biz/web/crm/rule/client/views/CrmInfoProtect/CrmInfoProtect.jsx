import React from 'react';
import HelpTip from 'components/HelpTip'
import HelpIntro from 'components/HelpIntro'
import SelectUser from 'components/SelectUser'
import {Select, Radio, Button, Icon, Modal} from 'antd'
const RadioGroup = Radio.Group;
const Option = Select.Option;

import imgToSee from 'images/4.png'

const text = '通过对客户的联系方式进行加密，可尽量避免客户资源被带走的问题。';
const content = (
    <div className="see-popover">
        <p>我的客户 > 客户资料 > 资料</p>
        <img src={imgToSee} alt=""/>
    </div>
)

const helpIntro = [
    '使用后，只对没有加入白名单的员工生效，名单内的员工不受该功能影响；',
    '使用后，没有加入白名单的员工，将无法对客户使用短信相关功能，例如：发送短信，制定短信销售计划等；',
    '使用后，没有加入白名单的员工，手机端仅支持Android5.05、IOS5.0及以上版本登陆；',
    '不受影响的员工白名单每天只允许修改10次；',
    'EC无法控制外部硬件设备和其他网络电话，例如：使用带显示屏座机进行拨号，显示屏会正常显示拨号内容。'
]

class HitRule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isNumAviliable: false,
            isSelectUserShow: false,
            option: {},
            notHideModalShow: false,
            hideModalShow: false,
            submitting: false,
            notHideSubmitting: false
        }
    }
    //组织架构选择确定回调
    selectUserOk = (array) => {
        this.setState({
            isSelectUserShow: false,
        });
        if (array.length > 0) this.props.crminfoActions.changeCheckedUsers(array);
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
            this.props.crminfoActions.loadAllUsers();
        };
    }

    //删除已选
    deleteUser(id) {
        return () => {
            let newArray = this.props.checkedUsers.filter((item) => (item.id !== id));
            this.props.crminfoActions.changeCheckedUsers(newArray);
        }
    }

    //是否隐藏
    handleRadio = (e) => {
        const value = e.target.value;
        if (value == 0) {
            this.setState({
                notHideModalShow: true
            })
        } else {
            this.props.crminfoActions.switchHideState({
                value: e.target.value,
                checkedUsers: this.props.checkedUsers, 
                justSwitch: 1
            });
        }
    }

    //不隐藏弹窗确定
    notHideModalOk = () => {
        //判断是否有做修改
        if(this.props.initStatus == 0) {
            this.props.crminfoActions.switchHideState({value: 0, justSwitch: 1});
            this.setState({
                notHideModalShow: false
            })
            return;
        }
        if(this.state.notHideSubmitting) return;
        this.setState({
            notHideSubmitting: true
        })
        this.props.crminfoActions.switchHideState({
            value: 0
        }, function() {
            this.setState({
                notHideSubmitting: false,
                notHideModalShow: false
            })
        }.bind(this));
    }

    //不隐藏弹窗取消
    notHideModalCancel = () => {
        this.setState({
            notHideModalShow: false
        })
    }

    //隐藏弹窗确定
    hideModalOk = () => {
        //判断是否有做修改
        if(!this.props.hasChange && this.props.initStatus == 1) {
            this.setState({
                 hideModalShow: false
            })
            return;
        }
        if(this.state.submitting) return;
        this.setState({
            submitting: true
        })
        this.props.crminfoActions.switchHideState({
            value: 1,
            checkedUsers: this.props.checkedUsers, 
        }, function() {
            this.setState({
                submitting: false,
                hideModalShow: false
            })
        }.bind(this))
    }

    //隐藏弹窗取消
    hideModalCancel = () => {
        this.setState({
            hideModalShow: false
        })
    }

    //提交
    handleSubmit = () => {
        this.setState({
            hideModalShow: true
        })
    }

    componentDidMount = () => {
        this.props.crminfoActions.protectCheck();
    }

    render() {
        const radioStyle = {
            marginRight: '20px'
        }
        const { canSubmit, ison, nums, ban, dataLoading } = this.props;
        const { submitting, notHideSubmitting } = this.state;
        var ifDisableSubmit = false;
        if(!canSubmit || ison == 0 || ban == 1) {
            ifDisableSubmit = true
        }
        return (
            <div className="rule-container">
                <HelpTip text={text} content={content}/>
                <div className="rule-content">
                    <div className="title">是否隐藏客户的联系方式：</div>
                    <RadioGroup onChange={ this.handleRadio } value={ ison } disabled={ dataLoading }>
                        <Radio style={radioStyle} value={1}>隐藏</Radio>
                        <Radio style={radioStyle} value={0}>不隐藏</Radio>
                    </RadioGroup>
                    <Modal title="关闭隐藏"
                        wrapClassName="vertical-center-modal"
                        width={390}
                        visible={ this.state.notHideModalShow }
                        onOk={this.notHideModalOk}
                        onCancel={this.notHideModalCancel}
                        okText={ notHideSubmitting ? '确定...' : '确定' }>
                        <p style={{ padding: '10px 0' }}>客户的联系方式将不再隐藏，确定要这样操作吗？</p>
                    </Modal>
                    <Modal title="隐藏资料"
                        wrapClassName="vertical-center-modal"
                        width={390}
                        visible={ this.state.hideModalShow }
                        onOk={this.hideModalOk}
                        onCancel={this.hideModalCancel}
                        okText={ submitting ? '确定...' : '确定' }>
                        <div style={{ padding: '10px 0' }}>
                            <p>客户联系方式将被隐藏，确定要这样操作吗？</p>
                            <p style={{ color: '#727C8F', fontSize: '12px' }}>
                                每天只允许修改名单 10 次，现已修改<span style={{ color: '#ff0018', margin: '0 3px' }}>{ nums }</span>次
                            </p>
                        </div>
                    </Modal>
                    <SelectUser
                        visible={this.state.isSelectUserShow} //弹窗展示
                        option={this.state.option}  //位置数据{left:xxx,top:xxx}
                        data={this.props.allUserData} //全部数据
                        onOk={this.selectUserOk}  //确定回调 带参数 已选数组
                        onCancle={this.selectUserCancle}  //取消回调
                        checkedArray={this.props.checkedUsers}  //已选的数据
                    />
                    <p className="label">
                        <span>以下员工不受影响：</span>没有加入白名单的员工，将隐藏客户的手机、电话、传真中间的四位。
                    </p>
                    <div>
                        <button disabled={ !canSubmit || ison == 0 }
                                style={{ background: '#fff', marginTop: 20 }} 
                                className="ant-btn" 
                                ref="addButton" 
                                onClick={this.showSelectUser}>
                            添加人员
                        </button>
                    </div>
                    <ul className="warn-user-list" disabled={ !canSubmit || ison == 0 }>
                        {
                            this.props.checkedUsers.map(item => (
                                <li key={item.id}>{item.name}<Icon type="close" onClick={this.deleteUser(item.id)} /></li>))
                        }
                        <div className="no-allowed-cover"></div>
                    </ul>
                    <div style={{ marginTop: 30 }} >
                        <Button type="primary" disabled={ ifDisableSubmit } onClick={ this.handleSubmit }>确定</Button>
                        {
                            ban == 1 ?
                            <span className="validate-error">同一天只允许修改名单10次</span>
                            :
                            ''
                        }
                    </div>
                </div>
                 <HelpIntro list={ helpIntro } />
            </div>
        )
    }
}

export default HitRule;
