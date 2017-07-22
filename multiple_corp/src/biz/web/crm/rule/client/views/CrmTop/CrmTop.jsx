import React from 'react';
import { browserHistory } from 'react-router'
import HelpTip from 'components/HelpTip'
import HelpIntro from 'components/HelpIntro'
import {Select, Radio, Button, Modal, Input} from 'antd'
const RadioGroup = Radio.Group;
const Option = Select.Option;
const InputGroup = Input.Group;

import imgToSee from 'images/2.png'

const text = '使用“客户上限”能够集中式管理员工的客户数量，帮助企业合理管理客户资源。';
const content = (
    <div className="see-popover">
        <p>我的客户 > 新增客户 > 客户上限</p>
        <img src={imgToSee} alt=""/>
    </div>
)

const helpIntro = [
    '“客户上限”指限制该员工私有库处于“跟进中（客户阶段1~3）”的客户总数，跟进中的客户必须处于“客户阶段4”后，才能继续添加（手动添加、QQ导入、被转让、被分配等）客户到私有库；',
    '“客户上限”依赖于“客户阶段”，若关闭了“客户阶段”那么“客户上限”也将失效；',
    '若在启用“客户上限”前，销售员手中的客户数量已超出设置的上限时，这些客户可以继续跟进；'
]

class CrmTop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ifSetStageModalShow: false,  //是否去开启客户阶段弹窗
            ifCloseTopModalShow: false,  //不使用客户上限弹窗
            selectValue: '0',   //客户上限下拉框value
            outOfRange: 0,   //是否超出界限
            limitNum: 0,   //限制数量
            submitting: false, 
            closeSubmitting: false
        }
    }

    handleSubmit = () => {
        if(this.state.submitting) return;
        this.setState({
            submitting: true
        })
        const { selectValue, limitNum } = this.state;
        const limit = selectValue == 1 ? limitNum : selectValue;
        this.props.crmtopActions.switchUseState({
            value: 1,
            limit: limit
        }, function() {
            this.setState({
                submitting: false
            })
        }.bind(this));
    }

    handleRadio = (e) => {
        const value = e.target.value;
        const { selectValue, limitNum } = this.state;
        const limit = selectValue == 1 ? limitNum : selectValue;
        if(value == 0) {
            this.setState({
                ifCloseTopModalShow: true
            })
        } else if(this.props.stageStatus == 0) {
            this.setState({
                ifSetStageModalShow: true
            })
        } else {
            this.props.crmtopActions.switchUseState({
                value: 1,
                limit: limit,
                justSwitch: 1
            });
        }
    }

    handleSelect = (value) => {
        const selectValue = this.state.selectValue;
        if(value == 1) {
            if(this.state.limitNum == 0) {
                this.setState({
                    selectValue: value,
                    outOfRange: 1
                })
            } else {
                this.setState({
                    selectValue: value,
                    limitNum: selectValue,
                    outOfRange: 0
                })
            }
        } else {
            this.setState({
                selectValue: value,
                limitNum: selectValue
            })
        }
    }

    changeLimit = (e) => {
        const value = e.target.value;
        const reg = /^[1-9][0-9]*$/;
        if(value > 1000000 || !reg.test(value)) {
            this.setState({
                limitNum: value,
                outOfRange: 1
            })
        } else {
            this.setState({
                limitNum: value,
                outOfRange: 0
            })
        }
        // this.props.crmtopActions.setLimitNum(value);
    }

    ifSetStageModalOk = () => {
        this.setState({
            ifSetStageModalShow: false
        })
        browserHistory.push('/biz/web/crm/rule/stage.html');
    }

    ifSetStageModalCancel = () => {
        this.setState({
            ifSetStageModalShow: false
        })
    }

    ifCloseTopModalOk = () => {
        if(this.state.closeSubmitting) return;
        this.setState({
            closeSubmitting: true,
        })
        const { selectValue, limitNum } = this.state;
        const limit = selectValue == 1 ? limitNum : selectValue;
        this.props.crmtopActions.switchUseState({
            value: 0,
            limit: limit
        }, function() {
            this.setState({
                 ifCloseTopModalShow: false,
                 closeSubmitting: false
            })
        }.bind(this));
    }

    componentDidMount = () => {
        this.props.crmtopActions.checkLimit();
    }

    componentWillReceiveProps = (nextProps) => {
        var isUserDefined = nextProps.isUserDefined;
        this.setState({
            limitNum: nextProps.limit,
            selectValue: this.state.selectValue != 0 ? this.state.selectValue : isUserDefined ? '1' : nextProps.limit
        })
    }

    render() {
        const radioStyle = {
            marginRight: '20px'
        }
        const { ison, limit,  dataLoading } = this.props;
        const { limitNum, selectValue, outOfRange, closeSubmitting, submitting } = this.state;

        const selectObj = {};
        if(limit > 0) {
            selectObj.defaultValue = '' + selectValue;
        }

        var ifShowLimit = 0;
        if(ison == 1 && selectValue == 1) {
            ifShowLimit = 1;
        }

        var canSubmit = true;
        if(selectValue == 0 ||(selectValue == 1 && limitNum == 0) || (outOfRange == 1 && selectValue == 1)) {
            canSubmit = false
        }
        return (
            <div className="rule-container">
                <HelpTip text={text} content={content}/>
                <div className="rule-content">
                    <div className="title">是否使用“客户上限”：</div>
                    <RadioGroup onChange={ this.handleRadio } value={ ison } disabled={ dataLoading }>
                        <Radio style={radioStyle} value={1}>使用</Radio>
                        <Radio style={radioStyle} value={0}>不使用</Radio>
                    </RadioGroup>
                    <Modal title="使用上限"
                        wrapClassName="vertical-center-modal"
                        width={432}
                        visible={ this.state.ifSetStageModalShow }
                        onOk={this.ifSetStageModalOk}
                        onCancel={this.ifSetStageModalCancel}
                        okText={'去设置'}>
                        <p style={{ padding: '10px 0' }}>客户上限依赖于客户阶段，您还没有设置客户阶段，是否去设置？</p>
                    </Modal>
                    <Modal title="关闭上限"
                        wrapClassName="vertical-center-modal"
                        width={405}
                        visible={ this.state.ifCloseTopModalShow }
                        onOk={this.ifCloseTopModalOk}
                        onCancel={() => this.setState({ ifCloseTopModalShow: false })}
                        okText={closeSubmitting ? '确定...' : '确定'}>
                        <p style={{ padding: '10px 0' }}>关闭上限后，员工的客户数将不受限制，确认要这样操作吗？</p>
                    </Modal>
                    <div className="title">每个员工库中的客户数（客户阶段1~3）最多：</div>
                    <div style={{ marginTop: 15 }}>
                        <InputGroup>
                            {
                                ison == 0 || dataLoading ?
                                <Input style={{ width: 120, float: 'left', fontSize: 14 }} value="不限制" disabled/>
                                :
                                <Select { ...selectObj }
                                        style={{ width: 120, float: 'left' }}
                                        onChange={this.handleSelect} 
                                        placeholder="请选择">
                                    <Option value="100">100个</Option>
                                    <Option value="200">200个</Option>
                                    <Option value="300">300个</Option>
                                    <Option value="400">400个</Option>
                                    <Option value="1">自定义</Option>
                                </Select>
                            }
                            {
                                ifShowLimit == 1 ?
                                <span style={{ verticalAlign: 'sub', marginLeft: 5 }}>
                                    <Input  style={{ width: 120, float: 'left', marginLeft: 20 }} 
                                        defaultValue={ limitNum == 0 ? '' : limitNum } 
                                        placeholder="1~1000000"
                                        onChange={this.changeLimit}/>
                                    个客户
                                </span>
                                :
                                ''
                            }
                            {
                                ison == 1 && this.state.outOfRange == 1 && selectValue == 1?
                                <span style={{ color: '#DF3631', marginLeft: 10, verticalAlign: 'sub' }}>客户上限数必须在1至1000000以内的整数！</span>
                                :
                                ''
                            }
                        </InputGroup>
                    </div>
                    <div>
                        <Button onClick={ this.handleSubmit } 
                                type="primary" 
                                className="submit-btn" 
                                style={{ marginTop: 50 }}
                                disabled={ ison == 0 || !canSubmit }>
                            {submitting ? '确定...' : '确定'}
                        </Button>
                        <span hidden={ ison == 0 || canSubmit || dataLoading || outOfRange == 1 } style={{ color: '#DF3631', marginLeft: 10 }}>请选择客户上限数</span>
                    </div>
                </div>
                 <HelpIntro list={ helpIntro } />
            </div>
        )
    }
}

export default CrmTop;
