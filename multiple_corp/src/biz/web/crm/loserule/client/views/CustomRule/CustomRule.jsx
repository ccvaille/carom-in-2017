import React from 'react';
import { Checkbox, Input, Button, DatePicker, Modal, Icon, Radio } from 'antd';
import moment from 'moment';
import CustomSign from '../CustomSign';
import CustomEarlyWarn from '../CustomEarlyWarn';
import CustomBackInfo from '../CustomBackInfo';
import imgPointer from '../../images/pointer.svg';

import './index.less';

const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;




class CustomRule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isCloseModalShow: false,
            checkedDate: null,//缓存时间
            canShowObject: {
                condition1: false,
                condition2: false,
                condition3: false,
            },
            autoChange: false,//是否是自动回写时间
        };
    }
    componentDidMount() {
        //获取整单数据
        this.props.ruleActions.getRule();
    }
    //日期控件禁用的日期
    disableDate = (current) => {
        if (current) {
            return current.isBefore(this.props.data.today) || current.isAfter(this.props.data.maxDay);
        }
        return false;
    }
    //判断用户输入数字是否为大于min小于max 的整数
    isNumberAviliable(min, max, text) {
        let number = parseFloat(text);
        return number >= min && number <= max && number % 1 <= 0;
    }
    //判断确定按钮是否可用
    isSaveBtnCanUse = (isDataChanged) => {
        let data = this.props.data;
        if (!(data.isCheckCondition1 || data.isCheckCondition2 || data.isCheckCondition3)) return false;
        if (data.isCheckCondition1 && !this.isNumberAviliable(3, 365, data.conditionText1)) return false;
        if (data.isCheckCondition2 && !this.isNumberAviliable(7, 365, data.conditionText2)) return false;
        if (data.isCheckCondition3 && !this.isNumberAviliable(7, 365, data.conditionText3)) return false;
        if ((data.isCheckCondition1 || data.isCheckCondition2) && data.checkedContactWays.length <= 0) return false;
        if (data.isCheckCustomSign && data.checkedSigns.length <= 0) return false;
        if (isDataChanged) if (data.isAlreadyEdit) return false;
        if (!data.isCheckAgreeProtcol) return false;
        return true;
    }
    //判断输入数据是否与原数据不同
    isDataChanged = () => {
        let pageData = this.getDataFromPage(),
            serverData = this.props.data.serverData;
        if (!serverData) return false;
        if (pageData.no_contact !== serverData.no_contact) return true;
        if (pageData.no_connection !== serverData.no_connection) return true;
        if (pageData.no_update !== serverData.no_update) return true;
        if (pageData.contact_type.length !== serverData.contact_type.length) return true;
        if (serverData.contact_type.length > 0) {
            let pctStr = pageData.contact_type.sort().join('');
            let sctStr = serverData.contact_type.sort().join('');
            if (pctStr != sctStr) return true;
        }
        if (pageData.effective_time !== serverData.effective_time) return true;

        let pTagArray = pageData.tag_set.split(',').filter(item => item.length > 0), tagCount = 0;
        if (pTagArray.length !== serverData.tag_set.length) return true;
        for (let i = 0, len = pTagArray.length; i < len; i++) {
            let id = pTagArray[i];
            serverData.tag_set.map(function (item) {
                if (item.id == id) tagCount++;
            })
        }
        if (tagCount != pTagArray.length) return true;

        return false;
    }
    //拦截器，可以显示警告
    proxyValueChange = (name, func) => {
        return (e) => {
            this.state.canShowObject[name] = true;
            func(e);
        }
    }
    //拦截器，不可以显示警告
    proxyValueChecked = (name, func) => {
        return (e) => {
            this.state.canShowObject[name] = false;
            func(e);
        }
    }
    //协议同意方法
    onProtcolAgree = () => {
        this.props.ruleActions.changeAgreeProtcol(true);
        this.props.ruleActions.changeProtcolShow(false);
    }
    //协议不同意方法
    onProtcolReject = () => {
        this.props.ruleActions.changeAgreeProtcol(false);
        this.props.ruleActions.changeProtcolShow(false);
    }
    //获取用户输入数据
    getDataFromPage = () => {
        let data = this.props.data, result = {
            no_contact: '',
            no_connection: '',
            no_update: '',
            contact_type: '',
            tag_set: '',
            status: '',
            effective_time: '',
        };
        if (data.isCheckCondition1) result.no_contact = parseInt(data.conditionText1);
        if (data.isCheckCondition2) result.no_connection = parseInt(data.conditionText2);
        if (data.isCheckCondition3) result.no_update = parseInt(data.conditionText3);
        if (data.isCheckCondition1 || data.isCheckCondition2) result.contact_type = data.checkedContactWays;
        let tagArray = [];
        if (data.isCheckNoSign) {
            tagArray.push('0');
        }
        if (data.isCheckCustomSign) {
            let tag_set = '';
            data.checkedSigns.forEach(function (item) {
                tagArray.push(item.id);
            });
        }
        result.tag_set = tagArray.join(',');
        result.status = 1;
        result.effective_time = data.checkedDate && (data.isCheckCondition1 || data.isCheckCondition2 || data.isCheckCondition3) ?
            data.checkedDate.format('YYYY-MM-DD') : '';
        if (this.state.autoChange) result.auto = 1;
        return result;
    }
    //确定按钮保存事件
    saveBackRule = () => {
        if (this.props.data.backRuleDataLoading) {
            return;
        };
        let data = this.getDataFromPage();
        data.effective_time = this.state.checkedDate.format('YYYY-MM-DD');
        this.props.ruleActions.setRule(data);
    }
    //显示掉单关闭确认框
    toggleBackRule = (e) => {
        let value = e.target.value;
        // if (value === '1') {
        //     this.props.ruleActions.openBackRuleStatus();
        // } else 
        if (value === '2') {
            this.setState({
                isCloseModalShow: true,
            });
        }
    }
    //关闭掉单
    closeBackRule = () => {
        if (this.props.data.backRuleCloseLoading) return;
        this.props.ruleActions.closeBackRuleStatus(() => {
            this.state.isCloseModalShow = false;
        });
    }
    //打开掉单
    openBackRule = () => {
        this.props.ruleActions.openBackRuleStatus();
    }
    //渲染方法
    render() {
        const data = this.props.data;
        const actions = this.props.ruleActions;
        let isDataChanged = this.isDataChanged();
        //判断数据是否发生变化来设置时间
        if (isDataChanged) {
            //数据修改，设置为占用修改字数
            this.state.autoChange = false;
            if (data.checkedDate && data.checkedDate.format('YYYY-MM-DD') != data.defaultDate) {
                //如果用户改变时间，就用用户的时间
                this.state.checkedDate = data.checkedDate;
            } else {
                //如果用户没有改变时间，就回写时间
                this.state.checkedDate = data.resetDate;
            }
        } else {
            if (data.fromCloseToOpen) {
                //如果为从关闭掉单打开的，回写时间，并且设置为自动修改，不占用修改字数
                this.state.checkedDate = data.resetDate;
                this.state.autoChange = true;
            } else if (typeof data.defaultDate != 'string' || data.defaultDate.length <= 0) {
                //如果服务器时间没有,就回写时间
                this.state.checkedDate = data.resetDate;
            } else {
                //如果服务器时间有,就用服务器时间
                this.state.checkedDate = moment(data.defaultDate);
            }
        }
        if (data.backRuleNothing) return null;
        return (<div className="back-rule">
            <div className="back-rule-continer">
                <CustomEarlyWarn enable={data.theRuleIsOpen} />
                {
                    data.theRuleIsOpen ?
                        <div>
                            <div className="back-rule-body">
                                <p className="back-rule-point">
                                    是否开启“客户回收策略”
                            </p>
                                <RadioGroup value={data.theRuleIsOpen ? '1' : '2'} onChange={this.toggleBackRule}>
                                    <Radio value="1">开启</Radio>
                                    <Radio value="2">关闭</Radio>
                                </RadioGroup>
                            </div>
                            <div className="back-rule-body">
                                <p className="back-rule-point"> 当客户满足下述任意条件时，强制收回客户资源</p>
                                <p><Checkbox className="back-rule-check" checked={data.isCheckCondition1} onChange={actions.changeCondition1} />
                                    当客户入库后，达到
                            <Input disabled={!data.isCheckCondition1}
                                        placeholder="3~365以内整数"
                                        value={data.conditionText1}
                                        onChange={actions.changeConditionInput1} />
                                    天，从未发生有效联系时;
                            {
                                        (this.isNumberAviliable(3, 365, data.conditionText1) || !data.isCheckCondition1) ? null :
                                            <span className="back_rule_error"><i className="iconfont">&#xe60b;</i>请输入3~365以内的整数！</span>
                                    }
                                </p>
                                <p>
                                    <Checkbox className="back-rule-check" checked={data.isCheckCondition2} onChange={actions.changeCondition2} />
                                    当客户入库后，距上次有效联系客户后，达到
                            <Input disabled={!data.isCheckCondition2}
                                        placeholder="7~365以内整数"
                                        value={data.conditionText2}
                                        onChange={actions.changeConditionInput2} />
                                    天，从未发生有效联系时;
                            {
                                        (this.isNumberAviliable(7, 365, data.conditionText2) || !data.isCheckCondition2) ? null :
                                            <span className="back_rule_error"><i className="iconfont">&#xe60b;</i>请输入7~365以内的整数！</span>
                                    }
                                </p>
                                <p>
                                    <Checkbox className="back-rule-check" checked={data.isCheckCondition3} onChange={actions.changeCondition3} />
                                    当客户入库后，距上次设定客户阶段后，达到
                            <Input disabled={!data.isCheckCondition3}
                                        placeholder="7~365以内整数"
                                        value={data.conditionText3}
                                        onChange={actions.changeConditionInput3} />
                                    天，未再更新客户阶段时;
                            {
                                        (this.isNumberAviliable(7, 365, data.conditionText3) || !data.isCheckCondition3) ? null :
                                            <span className="back_rule_error"><i className="iconfont">&#xe60b;</i>请输入7~365以内的整数！</span>
                                    }
                                </p>
                                <div style={{ display: (data.isCheckCondition1 || data.isCheckCondition2) ? 'block' : 'none' }}>
                                    <p className="tips" style={{ lineHeight: '15px' }}>以下属于有效的联系方式
                            {
                                            (data.checkedContactWays.length > 0) ? null :
                                                <span className="back_rule_error"><i className="iconfont">&#xe60b;</i>请勾选属于有效联系了客户的联系方式！</span>
                                        }
                                    </p>
                                    <div className={(data.checkedContactWays.length > 0) ? 'back-rule-way' : 'back-rule-way way-no-check'} >
                                        <CheckboxGroup
                                            options={data.contactWays}
                                            className="back-rule-checkgroup"
                                            value={data.checkedContactWays}
                                            onChange={actions.changContactWays} />
                                    </div>
                                </div>
                            </div>
                            <div className="back-rule-body">
                                <p className="back-rule-point no-point">当客户满足上述任意条件，且满足下述任意附加条件才强收回客户资源</p>
                                <p><Checkbox disabled={!(data.isCheckCondition1 || data.isCheckCondition2 || data.isCheckCondition3)}
                                    className="back-rule-check" checked={data.isCheckNoSign} onChange={actions.changeCheckNoSign} />
                                    该客户没有任何标签</p>
                                <p><Checkbox disabled={!(data.isCheckCondition1 || data.isCheckCondition2 || data.isCheckCondition3)}
                                    className="back-rule-check" checked={data.isCheckCustomSign} onChange={actions.changeSign} />
                                    该客户具备以下任意一个标签：
                            {
                                        (data.checkedSigns.length > 0 || !data.isCheckCustomSign) ? null :
                                            <span className="back_rule_error"><i className="iconfont">&#xe60b;</i>请添加需要的标签！</span>
                                    }
                                </p>
                                {data.isCheckCustomSign ? <CustomSign checkedSigns={data.checkedSigns} /> : null}
                            </div>
                            <div className="back-rule-body">
                                <p className="back-rule-point">开始回收客户资源的时间</p>
                                <p><Checkbox disabled checked={(data.isCheckCondition1 || data.isCheckCondition2 || data.isCheckCondition3)} />
                                    收回客户在
                            <DatePicker disabled={!(data.isCheckCondition1 || data.isCheckCondition2 || data.isCheckCondition3)}
                                        placeholder="未来30天以内日期" style={{ width: 160, marginRight: 10 }} disabledDate={this.disableDate}
                                        value={(data.isCheckCondition1 || data.isCheckCondition2 || data.isCheckCondition3) ? this.state.checkedDate : null}
                                        onChange={actions.changeBackDate} ref="date" showToday={false} allowClear={false} />开始执行</p>
                                <p>
                                    <Checkbox
                                        checked={data.isCheckAgreeProtcol}
                                        onChange={(e) => { actions.changeAgreeProtcol(e.target.checked) }} />
                                    我已阅读并同意
                            <a onClick={() => { actions.changeProtcolShow(true) }}>《客户收回策略使用协议》</a>
                                </p>
                                <p>
                                    <Button type="primary"
                                        disabled={!this.isSaveBtnCanUse(isDataChanged)}
                                        onClick={() => { actions.changeSaveConfirmShow(true) }}>
                                        确定
                                </Button>
                                    {
                                        (data.isAlreadyEdit && isDataChanged) ?
                                            <span className="back_rule_error"><i className="iconfont">&#xe60b;</i>同一天只可以修改一次！</span> : null
                                    }
                                </p>
                            </div>
                            <div className="back-rule-body" style={{ marginTop: 40 }}>
                                <p className="tips-head"><img src={imgPointer} style={{width:14,height:14,verticalAlign:'middle',marginBottom:2}}/>&nbsp;帮助说明:</p>
                                <p className="tips">
                                    1、设定“客户收回策略”能够强制收回销售员私有库内未得到有效跟进的客户资源，让更多有精力的销售员能够领取这些客户，并重新跟进，使公司客户资源发挥更大价值，减少客户的流失；<br />
                                    2、符合某个条件的客户，会在次日00:00强制收回客户资源，收回的资源会被放入“公共库”，销售员可以通过“我的客户”查 看48小时内掉单的客户；若企业开启了撞单规则，而客户及其公司这两者的跟进人一致的情况下，客户及其公司将同时被收回。<br />
                                    3、所有条件只针对处于客户阶段“新入库”~“方案制定”的客户，“合同签订”的客户不会受到影响；<br />
                                    4、入库时间是指客户进入企业私有库的最新时间。即：客户进入企业私有库后，未发生移入公共库操作，入库时间就为客户创建时间；如果后续发生了移入公共库操作，入库时间就为客户被领取分配的最新时间。<br />
                                    5、“有效联系方式”中的“QQ”、“EC”每天只记录当天第一次联系的时间；
                            </p>
                            </div>

                            <Modal
                                title="客户收回策略使用协议"
                                visible={data.isProtocolShow}
                                okText="同意" width={610}
                                cancelText="不同意"
                                onCancel={this.onProtcolReject}
                                onOk={this.onProtcolAgree}
                                wrapClassName="gray-foot-modal vertical-center-modal">
                                <div className="back_rule_protocol">
                                    <h3>用户在使用“客户收回策略”服务之前，请务必仔细阅读本条款并同意本声明。</h3>
                                    <p><i className="number">1</i>“客户收回策略”功能仅为帮助企业在销售过程中，提高销售员努力跟进客户效率或能力，对未得到有效跟进且符合客户收回策略的客户实现自动化掉入公共库；</p>
                                    <p><i className="number">2</i> 您或您的企业在使用“客户收回策略”时，表示您或您的企业已明确了解并同意：</p>
                                    <p><i className="drop" />开启“客户收回策略”后，可能会存在大批量客户掉入公共库，这是由于这些客户并未得到有效跟进（包括但不限于未开启客户收回策略前已存在此类情况的客户），发生了包括但不限于：未在指定的时间内与客户产生有效联系、未及时更新客户阶段等；</p>
                                    <p><i className="drop" />触发“客户收回策略”的客户将会自动解除QQ、EC关联关系，批量删除所有共享同事，删除该客户所有销售计划，这些操作将不可逆转；</p>
                                </div>
                            </Modal>
                            <Modal title="修改策略"
                                wrapClassName="vertical-center-modal"
                                visible={data.isSaveConfirmShow}
                                onCancel={() => { actions.changeSaveConfirmShow(false) }}
                                onOk={this.saveBackRule}
                                okText={data.backRuleDataLoading ? '确定中...' : '确定'}>
                                收回策略每天只能修改一次，确定修改吗？
                    </Modal>
                            <Modal title="关闭策略"
                                wrapClassName="vertical-center-modal"
                                visible={this.state.isCloseModalShow}
                                onCancel={() => { this.setState({ isCloseModalShow: false }) }}
                                onOk={this.closeBackRule}
                                okText={data.backRuleCloseLoading ? '确定中...' : '确定'}>
                                确定关闭客户收回策略吗？
                    </Modal>
                        </div>
                        : <CustomBackInfo onOpen={this.openBackRule} />
                }
            </div>
        </div>);
    }
}

export default CustomRule;
