import React, { PropTypes } from 'react';
import { Form, Input } from 'antd';
import { transformPropsFitForm } from '~comm/utils';
import ColorList from 'components/ColorList';
import SaveButton from 'components/SaveButton';

const FormItem = Form.Item;

class MobileChatSetting extends React.Component {
    static propTypes = {
        updateChatSettingFields: PropTypes.func.isRequired,
        mobileChatSetting: PropTypes.object.isRequired,
        form: PropTypes.object.isRequired,
        saveSetting: PropTypes.func.isRequired,
    };

    state = {
        isSaved: 0,
    };

    onChooseThemeColor = (hexCode) => {
        this.props.updateChatSettingFields({
            fields: {
                themeColor: {
                    value: hexCode,
                },
            },
            type: 'mobile',
        });
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
        const { mobileChatSetting } = this.props;
        const { getFieldDecorator } = this.props.form;

        return (
            <div className="mobile-chat-setting">
                <Form>
                    <FormItem
                        label="皮肤颜色"
                    >
                        <ColorList
                            initialActive={mobileChatSetting.themeColor}
                            onColorSelected={this.onChooseThemeColor}
                        />
                    </FormItem>

                    <FormItem
                        label="留言板公告"
                    >
                        {
                            getFieldDecorator('leaveMsgnotice', {
                                initialValue: mobileChatSetting.leaveMsgnotice,
                            })(
                                <Input placeholder="您好，我暂时不在线，您可以给我发送短信或者留言。" maxLength="100" />
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

const mapPropsToFields = props => transformPropsFitForm(props.mobileChatSetting);
const onFieldsChange = (props, fields) => props.updateChatSettingFields({ fields, type: 'mobile' });

export default Form.create({ mapPropsToFields, onFieldsChange })(MobileChatSetting);
