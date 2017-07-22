import React, { PropTypes } from 'react';
import { Form, Radio, Input } from 'antd';
import { transformPropsFitForm } from '~comm/utils';
import CorpInput from 'components/CorpInput';
import ColorList from 'components/ColorList';
import SaveButton from 'components/SaveButton';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
// const TabPane = Tabs.TabPane;
const formItemlayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

class PcChatSetting extends React.Component {
    static propTypes = {
        updateChatSettingFields: PropTypes.func.isRequired,
        pcChatSetting: PropTypes.object.isRequired,
        form: PropTypes.object.isRequired,
        saveSetting: PropTypes.func.isRequired,
    }

    state = {
        isSaved: 0,
    }

    onChooseThemeColor = (hexCode) => {
        this.props.updateChatSettingFields({
            fields: {
                themeColor: {
                    value: hexCode,
                },
            },
            type: 'pc',
        });
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
        const { pcChatSetting } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="pc-chat-setting">
                <Form>
                    <FormItem
                        {...formItemlayout}
                        label="会话框"
                    >
                        {
                            getFieldDecorator('mode', {
                                initialValue: pcChatSetting.mode,
                            })(
                                <RadioGroup>
                                    <Radio value={2}>小浮窗</Radio>
                                    <Radio value={0}>标准窗</Radio>
                                </RadioGroup>
                            )
                        }
                    </FormItem>

                    <FormItem
                        label="颜色"
                    >
                        <ColorList
                            initialActive={pcChatSetting.themeColor}
                            onColorSelected={this.onChooseThemeColor}
                        />
                    </FormItem>

                    <FormItem
                        {...formItemlayout}
                        label="标题"
                    >
                        {
                            getFieldDecorator('title', {
                                initialValue: pcChatSetting.title,
                            })(
                                <CorpInput placeholder="EC在线客服竭诚为您服务" />
                            )
                        }
                    </FormItem>

                    {
                        pcChatSetting.mode === 0
                        ?
                            <FormItem
                                {...formItemlayout}
                                label="会话框公告"
                            >
                                {
                                    getFieldDecorator('notice', {
                                        initialValue: pcChatSetting.notice,
                                    })(
                                        <CorpInput placeholder="已出新产品，欢迎咨询" />
                                    )
                                }
                            </FormItem>
                        : null
                    }

                    {/* @todo 字段名修改 */}
                    <FormItem
                        {...formItemlayout}
                        label="留言板公告"
                    >
                        {
                            getFieldDecorator('leaveMsgnotice', {
                                initialValue: pcChatSetting.leaveMsgnotice,
                            })(
                                <Input placeholder="您好，我暂时不在线，您可以给我发送短信或者留言。" maxLength="100" />
                            )
                        }
                    </FormItem>

                    <FormItem
                        {...formItemlayout}
                        label="问候语"
                    >
                        {
                            getFieldDecorator('welcomeMessage', {
                                initialValue: pcChatSetting.welcomeMessage,
                            })(
                                <CorpInput placeholder="您好，请问有什么可以帮到您？" />
                            )
                        }
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

const mapPropsToFields = props => transformPropsFitForm(props.pcChatSetting);
const onFieldsChange = (props, fields) => props.updateChatSettingFields({ fields, type: 'pc' });

export default Form.create({ mapPropsToFields, onFieldsChange })(PcChatSetting);
