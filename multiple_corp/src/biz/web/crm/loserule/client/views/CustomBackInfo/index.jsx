import React from 'react';
import { Button, Carousel, Icon, Radio, Checkbox, DatePicker, Input } from 'antd';
const RadioGroup = Radio.Group;
import './index.less';

class CustomBackInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalShow: true,
            isSmallWindow: true,
        };
    }
    hideModal = () => {
        this.setState({
            isModalShow: false,
        })
    }
    componentWillMount=()=>{
        console.log(document.body.offsetWidth);
        this.state.isSmallWindow=document.body.offsetWidth<=1024;
    }
    changeRuleState = (e) => {
        if (e.target.value == '1') {
            this.props.onOpen();
        }
    }
    render() {
        return RendcustomBackInfo.call(this, this.props, this.state);
    }
}

function RendcustomBackInfo(props, state) {
    return (
        <div>
            <div className="back-rule-body">
                <p className="back-rule-point">是否开启“客户回收策略”</p>
                <RadioGroup value={"2"} onChange={this.changeRuleState}>
                    <Radio value="1">开启</Radio>
                    <Radio value="2">关闭</Radio>
                </RadioGroup>
            </div>
            <div className="back-rule-body">
                <p className="back-rule-point"> 当客户满足下述任意条件时，强制收回客户资源</p>
                <p><Checkbox className="back-rule-check" disabled />当客户入库后，达到<Input placeholder="3~365以内整数" disabled />天，从未发生有效联系时;</p>
                <p><Checkbox className="back-rule-check" disabled />当客户入库后，距上次有效联系客户后，达到<Input placeholder="7~365以内整数" disabled />天，从未发生有效联系时;</p>
                <p><Checkbox className="back-rule-check" disabled />当客户入库后，距上次设定客户阶段后，达到<Input placeholder="7~365以内整数" disabled />天，未再更新客户阶段时;</p>
            </div>
            <div className="back-rule-body">
                <p className="back-rule-point no-point">当客户满足上述任意条件，且满足下述任意附加条件才强收回客户资源</p>
                <p><Checkbox className="back-rule-check" disabled />该客户没有任何标签</p>
                <p><Checkbox className="back-rule-check" disabled />该客户具备以下任意一个标签：</p>
            </div>
            <div className="back-rule-body">
                <p className="back-rule-point">开始回收客户资源的时间</p>
                <p><Checkbox disabled />收回客户在<DatePicker disabled placeholder="未来30天以内日期" style={{ width: 160, marginRight: 10 }} />开始执行</p>
                <p><Checkbox disabled />我已阅读并同意《客户收回策略使用协议》</p>
                <p><Button type="primary" disabled>确定</Button></p>
            </div>
            <div className="back-rule-body" style={{ marginTop: 40 }}>
                <p className="tips-head"><i className="iconfont help">&#xe60b;</i>帮助说明:</p>
                <p className="tips">
                    1、设定“客户收回策略”能够强制收回销售员私有库内未得到有效跟进的客户资源，让更多有精力的销售员能够领取这些客户，并重新跟进，使公司客户资源发挥更大价值，减少客户的流失；<br />
                    2、符合某个条件的客户，会在次日00:00强制收回客户资源，收回的资源会被放入“公共库”，销售员可以通过“我的客户”查 看48小时内掉单的客户；若企业开启了撞单规则，而客户及其公司这两者的跟进人一致的情况下，客户及其公司将同时被收回。<br />
                    3、所有条件只针对处于客户阶段“新入库”~“方案制定”的客户，“合同签订”的客户不会受到影响；<br />
                    4、入库时间是指客户进入企业私有库的最新时间。即：客户进入企业私有库后，未发生移入公共库操作，入库时间就为客户创建时间；如果后续发生了移入公共库操作，入库时间就为客户被领取分配的最新时间。<br />
                    5、“有效联系方式”中的“QQ”、“EC”每天只记录当天第一次联系的时间；
                </p>
            </div>
            <div style={state.isModalShow ? { display: 'block' } : { display: 'none' }}>
                <div className="masker"></div>
                <div className={state.isSmallWindow ? 'back-info-modalsm' : 'back-info-modal'}>
                    <div className="back-info-head">
                        <Icon type="close" onClick={this.hideModal} />
                    </div>
                    <div className="back-info-body">
                        <Carousel autoplay autoplaySpeed="4000">
                            <div className="panel">
                                <div className="left">
                                    <h6>开启策略，灵活配置规则</h6>
                                    <p>通过有效联系、客户阶段、标签<br />多维度灵活配置规则，针对性收回客户</p>
                                    <Button type="primary" size="large" onClick={props.onOpen}>马上使用</Button>
                                </div>
                                <div className="right info1"></div>
                            </div>
                            <div className="panel">
                                <div className="left info2"></div>
                                <div className="right">
                                    <h6>提前提醒预收回名单</h6>
                                    <p>根据既定规则，系统提前48小时向<br />销售员提醒预收回名单，催促其及时跟进客户</p>
                                    <Button type="primary" size="large" onClick={props.onOpen}>马上使用</Button>
                                </div>
                            </div>
                            <div className="panel">
                                <div className="left">
                                    <h6>符合规则，到点自动收回</h6>
                                    <p>预收回名单未及时采取措施的 ，到点自动收回，<br />再也不用担心销售员占着资源不作为了</p>
                                    <Button type="primary" size="large" onClick={props.onOpen}>马上使用</Button>
                                </div>
                                <div className="right info3"></div>
                            </div>
                        </Carousel>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomBackInfo;