import React from 'react';
import HelpTip from 'components/HelpTip'
import HelpIntro from 'components/HelpIntro'
import {Popover, Radio, Button, Collapse, Modal} from 'antd'
const RadioGroup = Radio.Group;
const Panel = Collapse.Panel;
import imgToSee from 'images/1.png'
import imgLead from 'images/group.png'

const text = '使用“客户阶段”能够跟踪客户当前的销售状态，帮助企业了解每个状态下的客户情况。';
const content = (
    <div className="see-popover">
        <p>我的客户 > 客户资料 > 客户阶段</p>
        <img src={imgToSee} alt=""/>
    </div>
)

const helpIntro = [
    '“客户阶段”主要用于快速标记及衡量客户处于哪个销售阶段，帮助企业管理合理管理客户资源，“阶段四”定义为已进入成交阶段的客户；'
]

class CrmStage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stageModalShow: false,
            canSubmit: true,
            stages: [],
            inputError: [0, 0, 0, 0],
            submitting: false,
            closeSubmitting: false,
        }
    }

    handleRadio = (e) => {
        const value = e.target.value;
        if(value == 0) {
            this.setState({
                stageModalShow: true
            })
        } else {
            this.props.crmstageActions.setStage({
                value: 1,
                stages: this.props.stages,
                justSwitch: 1
            });
        }
    }

    stageModalOk = () => {
        if(this.state.closeSubmitting) return;
        this.setState({
            closeSubmitting: true
        })
        this.props.crmstageActions.setStage({
            value: 0
        }, function() {
            this.setState({
                closeSubmitting: false,
                stageModalShow: false,
            })
        }.bind(this));
    }

    stageModalCancel = () => {
        this.setState({
            stageModalShow: false
        })
    }

    handleInput = (e) => {
        const index = e.target.name;
        const value = e.target.value.trim();
        const stages = this.state.stages;
        var inputError = this.state.inputError;
        var textLength = 0;
        for(let i = 0, j = value.length; i < j; i++) {
            if(value.charCodeAt(i) > 255)
                textLength += 2;
            else
                textLength += 1;
        }
        if(textLength > 10) {
            inputError[index] = 1;
        } else if(textLength == 0) {
            inputError[index] = 2;
        } else {
            inputError[index] = 0;
        }
        if(inputError.indexOf(1) < 0 && inputError.indexOf(2) < 0) {
            this.setState({
                inputError: inputError,
                canSubmit: true
            })
        } else {
            this.setState({
                inputError: inputError,
                canSubmit: false
            })
        }
        stages[index] = value;
        this.setState({
            stages: stages
        })
    }

    //关闭引导
    setTipState = () => {
        this.props.crmstageActions.setTipState();
    }

    handleSubmit = () => {
        if(this.state.submitting) return;
        this.setState({
            submitting: true
        })
        this.props.crmstageActions.setStage({
            value: 1,
            stages: this.state.stages
        }, function() {
            this.setState({
                submitting: false
            })
        }.bind(this));
    }

    componentDidMount = () => {
        this.props.crmstageActions.getTipState();
        this.props.crmstageActions.getStageData();
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({
            stages: nextProps.stages
        })
    }

    render() {
        const radioStyle = {
            marginRight: '20px'
        }

        const errorMsgStyle = {
            border: 0,
            color: '#DF3631',
            fontSize: '14px',
            paddingLeft: 10,
            textAlign: 'left'
        }
        const { status, stages, dataLoading } = this.props;
        const { inputError, submitting, closeSubmitting } = this.state;
        return (
            <div className="rule-container">
                <div className="rule_lead_modal" hidden={ !this.props.tipShow }>
                    <div className="rule-modal-mask"></div>
                    <div className="out-lead-cube">
                        <span>客户上限</span>
                    </div>
                    <div className="rule-modal-content">
                        <img src={ imgLead } alt=""/>
                        <p>“客户上限”搬到了这里</p>
                        <footer>
                            <Button type="primary" onClick={this.setTipState}>我知道了</Button>
                        </footer>
                    </div>
                </div>
                <HelpTip text={text} content={content}/>
                <div className="rule-content">
                    <div className="title">是否使用“客户阶段”</div>
                    <RadioGroup onChange={ this.handleRadio } value={ status } disabled={ dataLoading }>
                        <Radio style={radioStyle} value={1}>使用</Radio>
                        <Radio style={radioStyle} value={0}>不使用</Radio>
                    </RadioGroup>
                    <Modal title="关闭阶段"
                        wrapClassName="vertical-center-modal"
                        visible={ this.state.stageModalShow }
                        width={391}
                        onOk={this.stageModalOk}
                        onCancel={this.stageModalCancel}
                        okText={closeSubmitting ? '确定...' : '确定'}
                        footer={
                            <div>
                                <Button onClick={this.stageModalCancel}>取消</Button>
                                <Button type="primary" onClick={this.stageModalOk}>确定</Button>
                            </div>
                        }
                    >
                        <p>将同时关闭客户上限和客户收回策略，确认要这样操作吗？</p>
                        <Collapse bordered={false}>
                            <Panel header="查看规则" key="1">
                                <p>客户上限和客户收回策略依赖于客户阶段，关闭阶段会导致上述功能无法正常使用，因此会一并关闭。</p>
                            </Panel>
                        </Collapse>
                    </Modal>
                    <table className="stage-table">
                        <tbody>
                            <tr>
                                <th width="120">阶段</th>
                                <th width="180" style={{ paddingLeft: 50 }}>名称</th>
                            </tr>
                            <tr>
                                <td>初始</td>
                                <td style={{ paddingLeft: 50 }}>新入库</td>
                            </tr>
                            <tr>
                                <td>阶段一</td>
                                <td style={{ paddingLeft: 0, textAlign: 'center' }}>
                                    <input className="ant-input" disabled={ status == 0 || dataLoading } name="0" type="text" value={ stages[0] } onChange={ this.handleInput } placeholder="初步沟通"/>
                                </td>
                                <td style={ errorMsgStyle } hidden={ inputError[0] == 0 }>
                                    {
                                        inputError[0] == 1 ?
                                        '阶段名称最多5个字！'
                                        :
                                        '请输入正确的阶段名称！'
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td>阶段二</td>
                                <td style={{ paddingLeft: 0, textAlign: 'center' }}>
                                    <input className="ant-input" disabled={ status == 0 || dataLoading} name="1" type="text" value={ stages[1] }  onChange={ this.handleInput } placeholder="立项分析"/>
                                </td>
                                <td style={ errorMsgStyle } hidden={ inputError[1] == 0 }>
                                    {
                                        inputError[1] == 1 ?
                                        '阶段名称最多5个字！'
                                        :
                                        '请输入正确的阶段名称！'
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td>阶段三</td>
                                <td style={{ paddingLeft: 0, textAlign: 'center' }}>
                                    <input className="ant-input" disabled={ status == 0 || dataLoading } name="2" type="text" value={ stages[2] }  onChange={ this.handleInput } placeholder="方案调度"/>
                                </td>
                                <td style={ errorMsgStyle } hidden={ inputError[2] == 0 }>
                                    {
                                        inputError[2] == 1 ?
                                        '阶段名称最多5个字！'
                                        :
                                        '请输入正确的阶段名称！'
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td>阶段四</td>
                                <td style={{ paddingLeft: 0, textAlign: 'center' }}>
                                    <input className="ant-input" disabled={ status == 0 || dataLoading } name="3" type="text" value={ stages[3] }  onChange={ this.handleInput } placeholder="合同签订"/>
                                </td>
                                <td style={ errorMsgStyle } hidden={ inputError[3] == 0 }>
                                    {
                                        inputError[3] == 1 ?
                                        '阶段名称最多5个字！'
                                        :
                                        '请输入正确的阶段名称！'
                                    }
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <Button type="primary"
                        className="submit-btn"
                        disabled={ status == 0 || !this.state.canSubmit || dataLoading }
                        onClick={ this.handleSubmit }>
                        {
                            submitting ?
                            '确定...'
                            :
                            '确定'
                        }
                    </Button>
                </div>
                 <HelpIntro list={ helpIntro } />
            </div>
        )
    }
}

export default CrmStage;
