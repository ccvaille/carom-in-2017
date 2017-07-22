import React, { PropTypes } from 'react';
import { Form, Radio } from 'antd';
import classNames from 'classnames';
import { transformPropsFitForm } from '~comm/utils';
import CorpInput from 'components/CorpInput';
import SaveButton from 'components/SaveButton';
import PositionPreview from 'components/PositionPreview';
import './mobile-invite-setting.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
};

const verticalRadioStyle = {
    display: 'block',
    marginButton: 7,
};

class MobileInviteSetting extends React.Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        mobileInviteSetting: PropTypes.object.isRequired,
        saveSetting: PropTypes.func.isRequired,
    };

    state = {
        isSaved: 0,
    };

    onSave = () => {
        this.setState({
            isSaved: 1,
        }, () => {
            this.props.saveSetting('mobile').then(({ errorMsg }) => {
                if (!errorMsg) {
                    this.setState({
                        isSaved: 2,
                    }, () => {
                        setTimeout(() => {
                            this.setState({
                                isSaved: 0,
                            });
                        }, 2000);
                    });
                } else {
                    this.setState({
                        isSaved: 0,
                    });
                }
            });
        });
    };

    render() {
        const { mobileInviteSetting } = this.props;
        const { getFieldDecorator } = this.props.form;
        let previewSquareStyles = {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
        };

        switch (mobileInviteSetting.floatPosition) {
            case 0:
                previewSquareStyles = {
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                };
                break;

            case 3:
                previewSquareStyles = {
                    left: '50%',
                    bottom: '0px',
                    transform: 'translateX(-50%)',
                };
                break;

            default:
                break;
        }

        // 自动邀请
        const autoIntervalClasses = classNames({
            'inline-block': true,
            'disabled-block': mobileInviteSetting.allowAutoInviteAgain === 0,
        });

        const manualIntervalClasses = classNames({
            'inline-block': true,
            'disabled-block': mobileInviteSetting.allowManualInviteAgain === 0,
        });

        const autoInviteIntervalNode = getFieldDecorator('allowAutoInviteAgain', {
            initialValue: mobileInviteSetting.allowAutoInviteAgain,
        })(
            <RadioGroup disabled={mobileInviteSetting.allowAutoInvite === 0}>
                <Radio value={0}>本次访问不再自动邀请</Radio>
                <Radio value={1}>
                    <div className={autoIntervalClasses}>
                        间隔
                        {
                            getFieldDecorator('autoInviteInterval', {
                                initialValue: mobileInviteSetting.autoInviteInterval,
                            })(
                                <CorpInput
                                    className="inline-input"
                                    disabled={
                                        mobileInviteSetting.allowAutoInvite === 0 ||
                                        mobileInviteSetting.allowAutoInviteAgain === 0
                                    }
                                />
                            )
                        }
                        秒再次发起邀请
                    </div>
                </Radio>
            </RadioGroup>
        );

        const manualInviteIntervalNode = getFieldDecorator('allowManualInviteAgain', {
            initialValue: mobileInviteSetting.allowManualInviteAgain,
        })(
            <RadioGroup disabled={mobileInviteSetting.allowManualInvite === 0}>
                <Radio value={0}>本次访问不再手动邀请</Radio>
                <Radio value={1}>
                    <div className={manualIntervalClasses}>
                        间隔
                        {
                            getFieldDecorator('manualInviteInterval', {
                                initialValue: mobileInviteSetting.manualInviteInterval,
                            })(
                                <CorpInput
                                    className="inline-input"
                                    disabled={
                                        mobileInviteSetting.allowManualInvite === 0 ||
                                        mobileInviteSetting.allowManualInviteAgain === 0
                                    }
                                />
                            )
                        }
                        秒再次手动邀请
                    </div>
                </Radio>
            </RadioGroup>
        );

        // const manualInviteIntervalNode = getFieldDecorator('allowManualInviteAgain', {
        //     initialValue: mobileInviteSetting.allowManualInviteAgain,
        // })(
        //     <Checkbox
        //         checked={mobileInviteSetting.allowManualInviteAgain === 1}
        //         disabled={mobileInviteSetting.allowManualInvite === 0}
        //     >
        //         <div className={manualIntervalClasses}>
        //             间隔
        //             {
        //                 getFieldDecorator('manualInviteInterval', {
        //                     initialValue: mobileInviteSetting.manualInviteInterval,
        //                 })(
        //                     <Input
        //                         className="inline-input"
        //                         disabled={mobileInviteSetting.allowManualInviteAgain === 0}
        //                     />
        //                 )
        //             }
        //             秒再次手动邀请
        //         </div>
        //     </Checkbox>
        // );

        return (
            <div className="mobile-invite-setting">
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="邀请框"
                    >
                        {
                            getFieldDecorator('theme', {
                                initialValue: mobileInviteSetting.theme,
                            })(
                                <RadioGroup>
                                    <Radio value={0}>信封</Radio>
                                    <Radio value={1}>便签</Radio>
                                </RadioGroup>
                            )
                        }
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="邀请内容"
                    >
                        {
                            getFieldDecorator('content', {
                                initialValue: mobileInviteSetting.content,
                            })(
                                <CorpInput placeholder="EC在线客服竭诚为您服务" />
                            )
                        }
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="自动邀请"
                    >
                        {
                            getFieldDecorator('allowAutoInvite', {
                                initialValue: mobileInviteSetting.allowAutoInvite,
                            })(
                                <RadioGroup>
                                    <Radio value={1}>开启</Radio>
                                    <Radio value={0}>关闭</Radio>
                                </RadioGroup>
                            )
                        }

                        <div
                            className="invite-tips"
                            style={{ marginLeft: -64 }}
                        >
                            访客访问您的网站时，系统可以自动向其发送邀请框
                        </div>
                    </FormItem>

                    {
                        getFieldDecorator('defer', {
                            initialValue: mobileInviteSetting.defer,
                        })(
                            <div style={{ marginBottom: 12, marginLeft: 68 }}>
                                访客访问网站
                                <CorpInput
                                    value={mobileInviteSetting.defer}
                                    className="inline-input"
                                    disabled={mobileInviteSetting.allowAutoInvite === 0}
                                />
                                秒后自动发起邀请
                            </div>
                        )
                    }

                    <FormItem
                        label="当访客拒绝邀请后"
                        className="refuse-set"
                    >
                        {autoInviteIntervalNode}
                    </FormItem>


                    <FormItem
                        {...formItemLayout}
                        label="手动邀请"
                    >
                        {
                            getFieldDecorator('allowManualInvite', {
                                initialValue: mobileInviteSetting.allowManualInvite,
                            })(
                                <RadioGroup>
                                    <Radio value={1}>开启</Radio>
                                    <Radio value={0}>关闭</Radio>
                                </RadioGroup>
                            )
                        }

                        <div className="invite-tips" style={{ marginLeft: -64 }}>
                            客服人员可以在访客列表中，手动向客户发起邀请框
                        </div>
                    </FormItem>

                    <FormItem
                        label="当访客拒绝邀请后"
                        className="refuse-set"
                    >
                        {manualInviteIntervalNode}
                    </FormItem>

                    <FormItem
                        label="其他邀请规则"
                        wrapperCol={{
                            offset: 2,
                            span: 20,
                        }}
                    >
                        {
                            getFieldDecorator('closeDelay', {
                                initialValue: mobileInviteSetting.closeDelay,
                            })(
                                <div>
                                    发起邀请
                                    <CorpInput
                                        className="inline-input"
                                        value={mobileInviteSetting.closeDelay}
                                        disabled={
                                            mobileInviteSetting.allowAutoInvite === 0 &&
                                            mobileInviteSetting.allowManualInvite === 0
                                        }
                                    />
                                    秒后关闭邀请框
                                </div>
                            )
                        }
                    </FormItem>

                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 19 }}
                        label="页面位置"
                    >
                        <PositionPreview previewSquareStyles={previewSquareStyles} />
                        <div className="set-side">
                            {
                                getFieldDecorator('floatPosition', {
                                    initialValue: mobileInviteSetting.floatPosition,
                                })(
                                    <RadioGroup>
                                        <Radio
                                            style={verticalRadioStyle}
                                            value={0}
                                        >
                                            居中
                                        </Radio>
                                        <Radio
                                            style={verticalRadioStyle}
                                            value={3}
                                        >
                                            底部居中
                                        </Radio>

                                    </RadioGroup>
                                )
                            }
                        </div>
                    </FormItem>

                    <SaveButton
                        isSaved={this.state.isSaved}
                        onSave={this.onSave}
                    />
                </Form>
            </div>
        );
    }
}

/* eslint-disable max-len */
const mapPropsToFields = props => transformPropsFitForm(props.mobileInviteSetting);
const onFieldsChange = (props, fields) => props.updateInviteSettingFields({ fields, type: 'mobile' });
/* eslink-enable */

export default Form.create({ mapPropsToFields, onFieldsChange })(MobileInviteSetting);
