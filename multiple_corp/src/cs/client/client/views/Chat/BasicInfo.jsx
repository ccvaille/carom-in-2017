/* eslint-disable react/no-string-refs, eqeqeq */
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import { Form, Input, Button, Select, Tooltip } from 'antd';
import {
    saveCrmInfo as saveCrmInfoAction,
    updateCrmInfoFields as updateCrmInfoFieldsAction,
    updateCrmInfoError as updateCrmInfoErrorAction,
    restoreFieldValue as restoreFieldValueAction,
    updateInfoSavedStatus as updateInfoSavedStatusAction,
} from 'actions/visitorDetails';
import { transformPropsFitForm } from '~comm/utils';
// import ECBridge from 'utils/ECBridge';
import elementWithTipHOC from '~comm/components/ElementWithTipHOC';
import SaveButton from '~comm/components/SaveButton';

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 18,
    },
};

const tipClassName = 'basic-info-tip';
const tipPlacement = 'top';

/* eslint-disable no-useless-escape, max-len */
const regMobile = /^[\+\-\s\(\)(\d)+]*$/;
const regEmail = /^\w+((\-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
const regQQ = /^[1-9][0-9]{4,10}$/;
const regUrl = /^(http[s]?:\/\/)?([\w-]+\.)+[\w-]+([\w-./?%&=]*)?$/;
// const regUrl = /(((http|ftp|https):)\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?)/g;
/* eslint-enable no-useless-escape, max-len */

const originInput = Input;
const InputWithTip = elementWithTipHOC(originInput);

class BasicInfo extends React.Component {
    static propTypes = {
        info: PropTypes.object.isRequired,
        errorKeys: PropTypes.object.isRequired,
        form: PropTypes.object.isRequired,
        saveCrmInfo: PropTypes.func.isRequired,
        updateCrmInfoError: PropTypes.func.isRequired,
        // eslint-disable-next-line react/no-unused-prop-types
        updateCrmInfoFields: PropTypes.func.isRequired,
        guid: PropTypes.number.isRequired,
        restoreFieldValue: PropTypes.func.isRequired,
        originInfo: PropTypes.object.isRequired,
        txguid: PropTypes.string.isRequired,
        visitorType: PropTypes.number.isRequired,
        updateInfoSavedStatus: PropTypes.func.isRequired,
        isInfoSaved: PropTypes.number.isRequired
    }

    onInputBlur = (e, key) => {
        const { updateCrmInfoError } = this.props;
        const value = e.target.value;
        if (key === 'name') {
            this.onRestoreValue({
                key,
                value,
            });
        }
        let name = '';

        if (key === 'qq') {
            name = 'QQ';
        } else {
            name = key.charAt(0).toUpperCase() + key.slice(1);
        }

        const result = this[`validate${name}`](value);
        if (result.ok) {
            updateCrmInfoError({
                key,
                update: {
                    show: false,
                    content: '',
                    isTip: false,
                },
            });
        }
    }

    onInputFocus = (key) => {
        this.props.updateCrmInfoError({
            key,
            update: {
                show: false,
                isTip: false,
            },
        });
    }

    onMouseEnterInput = (key) => {
        const { updateCrmInfoError, errorKeys, info } = this.props;
        const refName = `${key}InputRef`;
        if (
            !errorKeys[key].show
            && info[key].length > 12
            && this[refName] !== document.activeElement
        ) {
            updateCrmInfoError({
                key,
                update: {
                    isTip: true,
                    content: info[key],
                },
            });
        }
    }

    onMouseLeaveInput = (key) => {
        const { errorKeys, updateCrmInfoError } = this.props;
        if (errorKeys[key].isTip) {
            updateCrmInfoError({
                key,
                update: {
                    // show: false,
                    isTip: false,
                },
            });
        }
    }

    onKeyUp = (e) => {
        if (e.keyCode === 13) {
            if (document.activeElement) {
                document.activeElement.blur();
            }
            this.onSaveInfo();
        }
    }

    onSaveInfo = () => {
        if (this.validateForm()) {
            const { saveCrmInfo, guid, txguid, visitorType, updateInfoSavedStatus } = this.props;
            updateInfoSavedStatus(1);
            saveCrmInfo(guid, txguid, visitorType);
        }
    }

    onViewInfo = () => {
        const { info } = this.props;
        window.ECBridge.exec({
            command: 504,
            url: `https://my.workec.com/crm/detail?crmid=${info.crmid}`,
            title: '客户资料',
            needLogin: '1', //0:不需要登录态，1：需要登录态，打开PV时直接写cookie pv_key,httponly格式 不要
            width: '1000', //宽度，单位像素
            height: '700', //高度 ，单位像素
            status: '', //状态，max：最大化，不填则为宽高的值，宽高不填，则用默认的宽高 不要
            minButton: '0', //0：需要，1：不需要；如果不传，默认是0
            maxButton: '0', //0：需要，1：不需要；如果不传，默认是0
            titleBar: '0', //0：native的，1：web控制的，如果是1，minButton和maxButton失效，如果不传，默认是0
            resizeAble: '0', //0：可以拖拉变更窗口大小，1：不可以拖拉变更窗口大小，默认0
            callback: (json) => {
                console.log(json);
            },
        });
        // window.location.href = `showec://13-${userId}-${info.crmid}-9-`;
    }

    onRestoreValue = (obj) => {
        const { value, key } = obj;
        const { restoreFieldValue, originInfo } = this.props;

        if (!value && originInfo[key]) {
            restoreFieldValue(key);
        }
    }

    // onBeforeHandleFieldError = (obj) => {
    //     const { value, key, validateFn } = obj;
    //     const { restoreFieldValue, originInfo } = this.props;

    //     if (!value && originInfo[key]) {
    //         restoreFieldValue(key);
    //     } else if (validateFn && typeof validateFn === 'function') {
    //         const result = validateFn(value);
    //         this.handleFieldError(result, key, value);
    //     }
    // }

    getTipContainer = (key) => {
        const refName = `${key}ItemRef`;
        // eslint-disable-next-line react/no-find-dom-node, react/no-string-refs
        return ReactDOM.findDOMNode(this.refs[refName]);
    }

    handleFieldError = (result, key, value = '') => {
        if (!result.ok) {
            const refName = `${key}InputRef`;
            this[refName].focus();
            this.updateFieldError({
                key,
                content: result.msg,
                value,
            });
        } else {
            this.clearFieldError({
                key,
            });
        }
    }

    validateForm = () => {
        const { info } = this.props;
        const nameResult = this.validateName(info.name);
        if (!nameResult.ok) {
            this.handleFieldError(nameResult, 'name');
            return false;
        }

        const mobileResult = this.validateMobile(info.mobile);
        if (!mobileResult.ok) {
            this.handleFieldError(mobileResult, 'mobile');
            return false;
        }

        const emailResult = this.validateEmail(info.email);
        if (!emailResult.ok) {
            this.handleFieldError(emailResult, 'email');
            return false;
        }

        const urlResult = this.validateUrl(info.url);
        if (!urlResult.ok) {
            this.handleFieldError(urlResult, 'url');
            return false;
        }

        const qqResult = this.validateQQ(info.qq);
        if (!qqResult.ok) {
            this.handleFieldError(qqResult, 'qq');
            return false;
        }

        return true;
    }

    validateName = (value) => {
        if (!value) {
            return {
                ok: false,
                msg: '姓名为必填项',
            };
        }

        if (value.length > 10) {
            return {
                ok: false,
                msg: '姓名最多10个字',
            };
        }

        return {
            ok: true,
            msg: '',
        };
    }

    validateMobile = (value) => {
        if (value) {
            if (value.length <= 30 && regMobile.test(value)) {
                const mobileNum = value.replace(/[^0-9]/ig, '');
                if (mobileNum.length >= 11 && mobileNum.length <= 20) {
                    return {
                        ok: true,
                        msg: '',
                    };
                }
                return {
                    ok: false,
                    msg: '手机号格式不正确',
                };
            }

            return {
                ok: false,
                msg: '手机号格式不正确',
            };
        }

        return {
            ok: true,
            msg: '',
        };
    }

    validateEmail = (value) => {
        if (value && !regEmail.test(value)) {
            return {
                ok: false,
                msg: '邮箱格式不正确',
            };
        }

        return {
            ok: true,
            msg: '',
        };
    }

    validateUrl = (value) => {
        if (value && !regUrl.test(value)) {
            return {
                ok: false,
                msg: '网址格式不正确',
            };
        }

        return {
            ok: true,
            msg: '',
        };
    }

    validateQQ = (value) => {
        if (value && !regQQ.test(value)) {
            return {
                ok: false,
                msg: 'QQ格式不正确',
            };
        }

        return {
            ok: true,
            msg: '',
        };
    }

    updateFieldError = (obj) => {
        const { key, content } = obj;
        const { updateCrmInfoError } = this.props;
        updateCrmInfoError({
            key,
            update: {
                show: true,
                isTip: false,
                content,
            },
        });
    }

    clearFieldError = (obj) => {
        const { key } = obj;
        const { updateCrmInfoError } = this.props;

        updateCrmInfoError({
            key,
            update: {
                show: false,
                content: '',
            },
        });
    }

    render() {
        const { info, errorKeys, isInfoSaved } = this.props;
        const { getFieldDecorator } = this.props.form;
        const disableInput = info.act === '0';

        const nameClasses = classNames({
            'name-input': true,
            'has-error': errorKeys.name.show && !errorKeys.name.isTip,
        });
        const nameInput = getFieldDecorator('name', {
            initialValue: info.name,
        })(
            <InputWithTip
                className={nameClasses}
                ref={(wrapper) => {
                    this.nameInputRef = wrapper && wrapper.refs.wrappedElement.refs.input;
                }}
                maxLength={10}
                disabled={disableInput}
                showTip={errorKeys.name.show}
                tipContent={errorKeys.name.content}
                tipClassName={tipClassName}
                onBlur={e => this.onInputBlur(e, 'name')}
                onFocus={() => this.onInputFocus('name')}
                onKeyUp={this.onKeyUp}
                onMouseEnter={() => this.onMouseEnterInput('name')}
                onMouseLeave={() => this.onMouseLeaveInput('name')}
            />
        );

        const genderSelect = getFieldDecorator('sex', {
            initialValue: info.sex,
            onChange: () => {
                if (document.activeElement) {
                    document.activeElement.blur();
                }
                // this.onSaveInfo();
            },
        })(
            <Select
                className="gender-select"
                dropdownClassName="gender-dropdown"
                disabled={disableInput}
                ref={(wrapper) => { this.genderRef = wrapper; }}
            >
                <Option key="0" value="0" />
                <Option key="1" value="1">男</Option>
                <Option key="2" value="2">女</Option>
            </Select>
        );

        const mobileClasses = classNames({
            'has-error': errorKeys.mobile.show && !errorKeys.mobile.isTip,
        });
        const mobileInput = getFieldDecorator('mobile', {
            initialValue: info.mobile,
        })(
            <InputWithTip
                className={mobileClasses}
                ref={(wrapper) => {
                    this.mobileInputRef = wrapper && wrapper.refs.wrappedElement.refs.input;
                }}
                disabled={disableInput}
                showTip={errorKeys.mobile.show}
                tipContent={errorKeys.mobile.content}
                tipClassName={tipClassName}
                onFocus={() => this.onInputFocus('mobile')}
                onBlur={e => this.onInputBlur(e, 'mobile')}
                onKeyUp={this.onKeyUp}
                onMouseEnter={() => this.onMouseEnterInput('mobile')}
                onMouseLeave={() => this.onMouseLeaveInput('mobile')}
            />
        );

        const emailClasses = classNames({
            'has-error': errorKeys.email.show && !errorKeys.email.isTip,
        });
        const emailInput = getFieldDecorator('email', {
            initialValue: info.email,
        })(
            <InputWithTip
                className={emailClasses}
                ref={(wrapper) => {
                    this.emailInputRef = wrapper && wrapper.refs.wrappedElement.refs.input;
                }}
                disabled={disableInput}
                showTip={errorKeys.email.show}
                tipContent={errorKeys.email.content}
                tipClassName={tipClassName}
                onFocus={() => this.onInputFocus('email')}
                onBlur={e => this.onInputBlur(e, 'email')}
                onKeyUp={this.onKeyUp}
                onMouseEnter={() => this.onMouseEnterInput('email')}
                onMouseLeave={() => this.onMouseLeaveInput('email')}
            />
        );

        const urlClasses = classNames({
            'has-error': errorKeys.url.show && !errorKeys.url.isTip,
        });
        const urlInput = getFieldDecorator('url', {
            initialValue: info.url,
        })(
            <InputWithTip
                className={urlClasses}
                ref={(wrapper) => {
                    this.urlInputRef = wrapper && wrapper.refs.wrappedElement.refs.input;
                }}
                disabled={disableInput}
                showTip={errorKeys.url.show}
                tipContent={errorKeys.url.content}
                tipClassName={tipClassName}
                onFocus={() => this.onInputFocus('url')}
                onBlur={e => this.onInputBlur(e, 'url')}
                onKeyUp={this.onKeyUp}
                onMouseEnter={() => this.onMouseEnterInput('url')}
                onMouseLeave={() => this.onMouseLeaveInput('url')}
            />
        );

        const qqClasses = classNames({
            'has-error': errorKeys.qq.show && !errorKeys.qq.isTip,
        });
        const qqInput = getFieldDecorator('qq', {
            initialValue: info.qq,
        })(
            <InputWithTip
                className={qqClasses}
                ref={(wrapper) => {
                    this.qqInputRef = wrapper && wrapper.refs.wrappedElement.refs.input;
                }}
                disabled={disableInput}
                showTip={errorKeys.qq.show}
                tipContent={errorKeys.qq.content}
                tipClassName={tipClassName}
                onFocus={() => this.onInputFocus('qq')}
                onBlur={e => this.onInputBlur(e, 'qq')}
                onKeyUp={this.onKeyUp}
                onMouseEnter={() => this.onMouseEnterInput('qq')}
                onMouseLeave={() => this.onMouseLeaveInput('qq')}
            />
        );

        const companyClasses = classNames({
            'has-error': errorKeys.company.show && !errorKeys.company.isTip,
        });
        const companyInput = getFieldDecorator('company', {
            initialValue: info.company,
        })(
            <InputWithTip
                className={companyClasses}
                ref={(wrapper) => {
                    this.companyInputRef = wrapper && wrapper.refs.wrappedElement.refs.input;
                }}
                disabled={disableInput}
                maxLength={40}
                showTip={errorKeys.company.show}
                tipContent={errorKeys.company.content}
                tipClassName={tipClassName}
                onFocus={() => this.onInputFocus('company')}
                onKeyUp={this.onKeyUp}
                onMouseEnter={() => this.onMouseEnterInput('company')}
                onMouseLeave={() => this.onMouseLeaveInput('company')}
            />
        );

        const addressClasses = classNames({
            'has-error': errorKeys.address.show && !errorKeys.address.isTip,
        });
        const addressInput = getFieldDecorator('address', {
            initialValue: info.address,
        })(
            <InputWithTip
                className={addressClasses}
                ref={(wrapper) => {
                    this.addressInputRef = wrapper && wrapper.refs.wrappedElement.refs.input;
                }}
                disabled={disableInput}
                maxLength={40}
                showTip={errorKeys.address.show}
                tipContent={errorKeys.address.content}
                tipClassName={tipClassName}
                onFocus={() => this.onInputFocus('address')}
                onKeyUp={this.onKeyUp}
                onMouseEnter={() => this.onMouseEnterInput('address')}
                onMouseLeave={() => this.onMouseLeaveInput('address')}
            />
        );

        const memoClasses = classNames({
            'has-error': errorKeys.memo.show && !errorKeys.memo.isTip,
        });
        const memoInput = getFieldDecorator('memo', {
            initialValue: info.memo,
        })(
            <InputWithTip
                className={memoClasses}
                ref={(wrapper) => {
                    this.memoInputRef = wrapper && wrapper.refs.wrappedElement.refs.input;
                }}
                disabled={disableInput}
                maxLength={150}
                showTip={errorKeys.memo.show}
                tipContent={errorKeys.memo.content}
                tipClassName={tipClassName}
                onFocus={() => this.onInputFocus('memo')}
                onKeyUp={this.onKeyUp}
                onMouseEnter={() => this.onMouseEnterInput('memo')}
                onMouseLeave={() => this.onMouseLeaveInput('memo')}
            />
        );

        return (
            <div style={{ height: '100%' }}>
                <Form className="basic-info">
                    <FormItem
                        {...formItemLayout}
                        label={(<span>姓名<span className="necessary-hint">*</span></span>)}
                        ref="nameItemRef"
                    >
                        <Tooltip
                            overlayClassName={tipClassName}
                            placement={tipPlacement}
                            title={info.name}
                            visible={errorKeys.name.isTip}
                            getTooltipContainer={() => this.getTipContainer('name')}
                        >
                            {nameInput}
                        </Tooltip>
                    </FormItem>

                    {
                        info.act === '0' && info.username
                        ?
                            <FormItem
                                {...formItemLayout}
                                label="跟进人"
                            >
                                <span style={{ padding: '4px 7px' }}>{info.username}</span>
                            </FormItem>
                        : null
                    }

                    <FormItem
                        {...formItemLayout}
                        label="性别"
                    >
                        {genderSelect}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="手机"
                        ref="mobileItemRef"
                    >
                        <Tooltip
                            overlayClassName={tipClassName}
                            placement={tipPlacement}
                            title={info.mobile}
                            visible={errorKeys.mobile.isTip}
                            getTooltipContainer={() => this.getTipContainer('mobile')}
                        >
                            {mobileInput}
                        </Tooltip>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="邮箱"
                        ref="emailItemRef"
                    >
                        <Tooltip
                            overlayClassName={tipClassName}
                            placement={tipPlacement}
                            title={info.email}
                            visible={errorKeys.email.isTip}
                            getTooltipContainer={() => this.getTipContainer('email')}
                        >
                            {emailInput}
                        </Tooltip>

                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="网址"
                        ref="urlItemRef"
                    >
                        <Tooltip
                            overlayClassName={tipClassName}
                            placement={tipPlacement}
                            title={info.url}
                            visible={errorKeys.url.isTip}
                            getTooltipContainer={() => this.getTipContainer('url')}
                        >
                            {urlInput}
                        </Tooltip>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="QQ"
                        ref="qqItemRef"
                    >
                        <Tooltip
                            overlayClassName={tipClassName}
                            placement={tipPlacement}
                            title={info.qq}
                            visible={errorKeys.qq.isTip}
                            getTooltipContainer={() => this.getTipContainer('qq')}
                        >
                            {qqInput}
                        </Tooltip>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="公司"
                        ref="companyItemRef"
                    >
                        <Tooltip
                            overlayClassName={tipClassName}
                            placement={tipPlacement}
                            title={info.company}
                            visible={errorKeys.company.isTip}
                            getTooltipContainer={() => this.getTipContainer('company')}
                        >
                            {companyInput}
                        </Tooltip>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="地址"
                        ref="addressItemRef"
                    >
                        <Tooltip
                            overlayClassName={tipClassName}
                            placement={tipPlacement}
                            title={info.address}
                            visible={errorKeys.address.isTip}
                            getTooltipContainer={() => this.getTipContainer('address')}
                        >
                            {addressInput}
                        </Tooltip>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="备注"
                        ref="memoItemRef"
                    >
                        <Tooltip
                            overlayClassName={tipClassName}
                            placement={tipPlacement}
                            title={info.memo}
                            visible={errorKeys.memo.isTip}
                            getTooltipContainer={() => this.getTipContainer('memo')}
                        >
                            {memoInput}
                        </Tooltip>
                    </FormItem>
                </Form>

                <div className="operates">
                    {
                        info.act === '1'
                        ?
                            <SaveButton
                                isSaved={isInfoSaved}
                                onSave={this.onSaveInfo}
                            />
                        : null
                    }
                    {
                        info.crmid && info.crmid != 0
                        ?
                            <Button
                                type="ghost"
                                className="view-info"
                                onClick={this.onViewInfo}
                            >
                            查看
                        </Button>
                        : null
                    }
                </div>
            </div>
        );
    }
}

const mapPropsToFields = props => transformPropsFitForm(props.info);
const onFieldsChange = (props, fields) => props.updateCrmInfoFields({ fields });

const BasicInfoForm = Form.create({ mapPropsToFields, onFieldsChange })(BasicInfo);

const mapDispatchToProps = dispatch => bindActionCreators({
    saveCrmInfo: saveCrmInfoAction,
    updateCrmInfoError: updateCrmInfoErrorAction,
    updateCrmInfoFields: updateCrmInfoFieldsAction,
    restoreFieldValue: restoreFieldValueAction,
    updateInfoSavedStatus: updateInfoSavedStatusAction,
}, dispatch);

export default connect(null, mapDispatchToProps)(BasicInfoForm);
