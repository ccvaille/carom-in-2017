import React from 'react';
import HelpTip from 'components/HelpTip'
import HelpIntro from 'components/HelpIntro'
import {Radio, Button, Modal} from 'antd'
const RadioGroup = Radio.Group;
import imgToSee from 'images/3.png'

const text = '设置“撞单规则”可以禁止多个销售员跟进同一家公司客户。';
const content = (
    <div className="see-popover">
        <p>我的客户 > 新增客户 > 客户上限</p>
        <img src={imgToSee} alt=""/>
    </div>
    )


const helpIntro = [
    '撞单规则指的是通过“公司名”限制是否允许多个销售员同时跟进同一家公司名的联系人，如选择“不允许”即表示只有公司跟进人可以录入、领取、被转让、被分配此公司相关的联系人；',
    '选择“不允许”多个销售员跟进同一家公司的，在放弃客户时会触发连带操作，具体连带规则可在操作客户库时查看对应的提示；',
    '无论是否允许多个销售员跟进同一家公司，联系人资料上的手机、邮箱均是不允许重复；'
]
 

class HitRule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hitruleModalShow: false,
            submitting: false,
            allowSubmitting: false
        }
    }

    handleRadio = (e) => {
        const status = e.target.value;
        if(status == 0) {
            this.setState({
                hitruleModalShow: true
            })
        } else {
            this.props.hitruleActions.setHitrule({
                status: 1,
                justSwitch: 1
            });
        }
    }

    hitruleModalOk = () => {
        if(this.state.allowSubmitting) return;
        this.setState({
            allowSubmitting: true
        })
        this.props.hitruleActions.setHitrule({
            status: 0
        }, function() {
            this.setState({
                hitruleModalShow: false,
                allowSubmitting: false
            })
        }.bind(this));
    }

    hitruleModalCancel = () => {
        this.setState({
            hitruleModalShow: false
        })
    }

    handleSubmit = () => {
        if(this.state.submitting) return;
        this.setState({
            submitting: true
        })
        this.props.hitruleActions.setHitrule({
            status: 1
        }, function() {
            this.setState({
                submitting: false,
            })
        }.bind(this));
    }

    componentDidMount = () => {
        this.props.hitruleActions.getHitrule();
    }

    render() {
        const radioStyle = {
            marginRight: '20px'
        }
        const { status, dataLoading } = this.props;
        const { allowSubmitting, submitting } = this.state;
        return (
            <div className="rule-container">
                <HelpTip text={text} content={content}/>
                <div className="rule-content">
                    <div className="title">是否允许多个销售员跟进同一家公司：</div>
                    <RadioGroup
                        onChange={this.handleRadio}
                        style={{
                            display: 'block'
                        }}
                        disabled={ dataLoading }
                        value={ status }>
                        <Radio style={radioStyle} value={1}>不允许</Radio>
                        <Radio style={radioStyle} value={0}>允许</Radio>
                    </RadioGroup>
                    <Modal title="关闭撞单"
                        wrapClassName="vertical-center-modal"
                        visible={ this.state.hitruleModalShow }
                        width={ 390 }
                        onOk={this.hitruleModalOk}
                        onCancel={this.hitruleModalCancel}
                        okText={allowSubmitting ? '确定...' : '确定'}>
                        <p style={{ padding: '10px 0' }}>多个销售员跟进同一家公司将被允许，确认要这样操作吗？</p>
                    </Modal>
                    <Button
                        disabled={ status == 0 || dataLoading }
                        style={{
                            marginTop: 50
                        }}
                        onClick={ this.handleSubmit }
                        type="primary">{submitting ? '确定...' : '确定'}</Button>
                </div>
                <HelpIntro list={ helpIntro } />
            </div>
        )
    }
}
export default HitRule