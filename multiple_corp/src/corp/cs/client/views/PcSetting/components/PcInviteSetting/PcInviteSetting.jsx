import React, { PropTypes } from 'react';
import { Form, Radio } from 'antd';
import classNames from 'classnames';
import { transformPropsFitForm } from '~comm/utils';
import CorpInput from 'components/CorpInput';
import SaveButton from 'components/SaveButton';
import PositionPreview from 'components/PositionPreview';
import './pc-invite-setting.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const formItemlayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
};
const verticalRadioStyle = {
    display: 'block',
    marginBottom: 7,
};

class PcInviteSetting extends React.Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        pcInviteSetting: PropTypes.object.isRequired,
        saveSetting: PropTypes.func.isRequired,
    }

    state = {
        isSaved: 0,
    }

    onSave = () => {
        this.setState({
            isSaved: 1,
        }, () => {
            this.props.saveSetting('pc').then(({ errorMsg }) => {
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
    }

    render() {
        const { pcInviteSetting } = this.props;
        const { getFieldDecorator } = this.props.form;
        let previewSquareStyles = {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
        };

        switch (pcInviteSetting.floatPosition) {
            case 0:
                previewSquareStyles = {
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                };
                break;
            case 1:
                previewSquareStyles = {
                    top: 'auto',
                    left: 'auto',
                    right: '0px',
                    bottom: '0px',
                    transform: 'translate(0, 0)',
                };
                break;
            case 2:
                previewSquareStyles = {
                    top: 'auto',
                    left: '0px',
                    right: 'auto',
                    bottom: '0px',
                    transform: 'translate(0, 0)',
                };
                break;
            default:
                break;
        }

        const autoIntervalClasses = classNames({
            'inline-block': true,
            'disabled-block': pcInviteSetting.allowAutoInviteAgain === 0,
        });

        const manualIntervalClasses = classNames({
            'inline-block': true,
            'disabled-block': pcInviteSetting.allowManualInviteAgain === 0,
        });

        const autoInviteIntervalNode = getFieldDecorator('allowAutoInviteAgain', {
            initialValue: pcInviteSetting.allowAutoInviteAgain,
        })(
            <RadioGroup disabled={pcInviteSetting.allowAutoInvite === 0}>
                <Radio value={0}>本次访问不再自动邀请</Radio>
                <Radio value={1}>
                    <div className={autoIntervalClasses}>
                        间隔
                        {
                            getFieldDecorator('autoInviteInterval', {
                                initialValue: pcInviteSetting.autoInviteInterval,
                            })(
                                <CorpInput
                                    className="inline-input"
                                    disabled={
                                        pcInviteSetting.allowAutoInvite === 0 ||
                                        pcInviteSetting.allowAutoInviteAgain === 0
                                    }
                                />
                            )
                        }
                        秒再次发起邀请
                    </div>
                </Radio>
            </RadioGroup>
        );

        const manualInviteInteralNode = getFieldDecorator('allowManualInviteAgain', {
            initialValue: pcInviteSetting.allowManualInviteAgain,
        })(
            <RadioGroup disabled={pcInviteSetting.allowManualInvite === 0}>
                <Radio value={0}>本次访问不再手动邀请</Radio>
                <Radio value={1}>
                    <div className={manualIntervalClasses}>
                        间隔
                        {
                            getFieldDecorator('manualInviteInterval', {
                                initialValue: pcInviteSetting.manualInviteInterval,
                            })(
                                <CorpInput
                                    className="inline-input"
                                    disabled={
                                        pcInviteSetting.allowManualInvite === 0 ||
                                        pcInviteSetting.allowManualInviteAgain === 0
                                    }
                                />
                            )
                        }
                        秒再次手动邀请
                    </div>
                </Radio>
            </RadioGroup>
        );

        // const manualInviteInteralNode = getFieldDecorator('allowManualInviteAgain', {
        //     initialValue: pcInviteSetting.allowManualInviteAgain,
        // })(
        //     <Checkbox
        //         checked={pcInviteSetting.allowManualInviteAgain === 1}
        //         disabled={pcInviteSetting.allowManualInvite === 0}
        //     >
        //         <div className={manualIntervalClasses}>
        //             间隔
        //             {
        //                 getFieldDecorator('manualInviteInterval', {
        //                     initialValue: pcInviteSetting.manualInviteInterval,
        //                 })(
        //                     <Input
        //                         className="inline-input"
        //                         disabled={pcInviteSetting.allowManualInviteAgain === 0}
        //                     />
        //                 )
        //             }
        //             秒再次手动邀请
        //         </div>
        //     </Checkbox>
        // );

        return (
            <div className="pc-invite-setting">
                <Form>
                    <FormItem
                        {...formItemlayout}
                        label="邀请框"
                    >
                        {
                            getFieldDecorator('theme', {
                                initialValue: pcInviteSetting.theme,
                            })(
                                <RadioGroup>
                                    <Radio value={0}>信封</Radio>
                                    <Radio value={1}>便签</Radio>
                                </RadioGroup>
                            )
                        }
                    </FormItem>

                    <FormItem
                        {...formItemlayout}
                        label="邀请内容"
                    >
                        {
                            getFieldDecorator('content', {
                                initialValue: pcInviteSetting.content,
                            })(
                                <CorpInput placeholder="EC在线客服竭诚为您服务" />
                            )
                        }
                    </FormItem>

                    <FormItem
                        {...formItemlayout}
                        label="自动邀请"
                    >
                        {
                            getFieldDecorator('allowAutoInvite', {
                                initialValue: pcInviteSetting.allowAutoInvite,
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
                            initialValue: pcInviteSetting.defer,
                        })(
                            <div style={{ marginBottom: 12, marginLeft: 68 }}>
                                访客访问网站
                                <CorpInput
                                    value={pcInviteSetting.defer}
                                    className="inline-input"
                                    disabled={pcInviteSetting.allowAutoInvite === 0}
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
                        {...formItemlayout}
                        label="手动邀请"
                    >
                        {
                            getFieldDecorator('allowManualInvite', {
                                initialValue: pcInviteSetting.allowManualInvite,
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
                        {manualInviteInteralNode}
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
                                initialValue: pcInviteSetting.closeDelay,
                            })(
                                <div>
                                    发起邀请
                                    <CorpInput
                                        className="inline-input"
                                        value={pcInviteSetting.closeDelay}
                                        disabled={
                                            pcInviteSetting.allowAutoInvite === 0 &&
                                            pcInviteSetting.allowManualInvite === 0
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
                                    initialValue: pcInviteSetting.floatPosition,
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
                                            value={1}
                                        >
                                            右下角
                                        </Radio>
                                        <Radio
                                            style={verticalRadioStyle}
                                            value={2}
                                        >
                                            左下角
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

const mapPropsToFields = props => transformPropsFitForm(props.pcInviteSetting);
const onFieldsChange = (props, fields) => props.updateInviteSettingFields({ fields, type: 'pc' });

export default Form.create({ mapPropsToFields, onFieldsChange })(PcInviteSetting);
