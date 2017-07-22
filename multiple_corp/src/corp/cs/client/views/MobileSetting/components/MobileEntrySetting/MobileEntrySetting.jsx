import React, { PropTypes } from 'react';
import { Form, Radio } from 'antd';
import { transformPropsFitForm } from '~comm/utils';
import message from '~comm/components/Message';
import CorpInput from 'components/CorpInput';
import ColorList from 'components/ColorList';
import Uploader from 'components/Uploader';
import PositionPreview from 'components/PositionPreview';
import SaveButton from 'components/SaveButton';
import uploadPlaceholder from 'img/upload-placeholder.png';
import 'styles/entry-setting.less';
import './mobile-entry-setting.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
};

const verticalRadioStyle = {
    display: 'block',
    marginBottom: 7,
};

const positionPreviewBaseWidth = 70;
const positionPreviewBaseHeight = 114;

const getTopDelta = percent => positionPreviewBaseHeight * (percent / 100);
const getSideDelta = percent => positionPreviewBaseWidth * (percent / 100);

class MobileEntrySetting extends React.Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        mobileEntrySetting: PropTypes.object.isRequired,
        updateEntrySettingFields: PropTypes.func.isRequired,
        uploadImage: PropTypes.func.isRequired,
        saveSetting: PropTypes.func.isRequired,
        setLocale: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            btnBackgroundUploading: false,
            minimizeBackgroundUploading: false,
            isSaved: 0, // 0 默认， 1 保存中， 2 已保存
        };
    }

    onBtnBackgroundUpload = (files) => {
        this.setState({
            btnBackgroundUploading: true,
        });
        this.onUpload(files, 'btnBackground');
    };

    onUpload = (files, type) => {
        if (!files.length) {
            return false;
        }

        const file = files[0];

        return this.props.uploadImage({
            file,
        }, { type: 'mobile', imageType: type });
    };

    onChooseBtnColor = (hexCode) => {
        this.props.updateEntrySettingFields({
            fields: {
                buttonStyleBackgroundColor: {
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

    onBgRejected = (rejectedFiles, error, duration = 1.5) => {
        message.error(error, duration);
    }

    render() {
        const { mobileEntrySetting, setLocale } = this.props;
        const { btnTheme } = this.props.mobileEntrySetting;
        const { getFieldDecorator } = this.props.form;

        let btnThemeCustom = null;

        if (btnTheme === -1) {
            btnThemeCustom = (
                <div style={{ marginBottom: 24, marginTop: -20 }}>
                    <ColorList
                        initialActive={mobileEntrySetting.buttonStyleBackgroundColor}
                        onColorSelected={this.onChooseBtnColor}
                    />
                </div>
            );
        } else if (btnTheme === 0) {
            btnThemeCustom = (
                <div
                    className="background-upload entry-btn-background clearfix"
                    style={{ marginBottom: 24 }}
                >
                    <div className="clearfix">
                        <div
                            className="img"
                            style={{
                                /* eslint-disable max-len */
                                background: `url(${mobileEntrySetting.btnBackground || uploadPlaceholder}) 0% 0% / contain no-repeat`,
                                /* eslint-enable */
                            }}
                        >
                            {/*<img src={mobileEntrySetting.btnBackground} alt=""/>*/}
                        </div>
                        <div className="text">
                            <Uploader
                                className="upload-point"
                                uploadText="上传"
                                isUploading={this.btnBackgroundUploading}
                                onUpload={this.onBtnBackgroundUpload}
                                onRejected={this.onBgRejected}
                            />
                            <span>按钮背景</span>
                        </div>
                    </div>

                    <div className="image-prompt">
                        <p>请上传尺寸在260*400 px 以内的png或jpg图片</p>
                    </div>
                </div>
            );
        }


        // 页面位置部分
        let topPosition = 0;
        let sidePosition = 0;

        if (!mobileEntrySetting.topMargin || mobileEntrySetting.topMargin < 0) {
            topPosition = 0;
        } else if (mobileEntrySetting.topMargin > 100) {
            topPosition = 100;
        } else {
            const topDelta = getTopDelta(mobileEntrySetting.topMargin);
            topPosition = topDelta;
        }

        let previewSquareStyles = {
            top: `${topPosition}px`,
            left: '0',
            right: '0',
        };

        if (!mobileEntrySetting.sideMargin) {
            sidePosition = 0;
        } else if (mobileEntrySetting.sideMargin > 100) {
            sidePosition = 100;
        } else {
            const sideDelta = getSideDelta(mobileEntrySetting.sideMargin);
            sidePosition = sideDelta;
        }

        if (mobileEntrySetting.floatPosition === 0) {
            previewSquareStyles = {
                ...previewSquareStyles,
                left: `${sidePosition}px`,
                right: 'auto',
            };
        } else if (mobileEntrySetting.floatPosition === 1) {
            previewSquareStyles = {
                ...previewSquareStyles,
                left: 'auto',
                right: `${sidePosition}px`,
            };
        }

        return (
            <div className="mobile-entry-setting">

                <FormItem
                    {...formItemLayout}
                    label="语言"
                >
                    {
                        getFieldDecorator('language', {
                            initialValue: mobileEntrySetting.language,
                            onChange: (e) => {
                                const value = e.target.value;
                                switch (value) {
                                    case 0:
                                        setLocale('zh-cn');
                                        break;
                                    case 1:
                                        setLocale('en-us');
                                        break;
                                    case 2:
                                        setLocale('zh-tw');
                                        break;
                                    default:
                                        break;
                                }
                            },
                        })(
                            <RadioGroup>
                                <Radio value={0}>简体中文</Radio>
                                <Radio value={1}>英文</Radio>
                                <Radio value={2}>繁体中文</Radio>
                            </RadioGroup>
                        )
                    }
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="按钮样式"
                    className="entry-style"
                />
                <div>
                    <div className="entry-button-styles">
                        {
                            getFieldDecorator('buttonStyle', {
                                initialValue: mobileEntrySetting.buttonStyle,
                            })(
                                <RadioGroup className="custom-radio-group">
                                    <Radio value={3}>
                                        <div className="style-btn circle-btn" />
                                        <div>圆形</div>
                                    </Radio>
                                    <Radio value={2}>
                                        <div className="style-btn square-btn" />
                                        <div>方形</div>
                                    </Radio>
                                    <Radio value={0}>
                                        <div className="style-btn h-rectangle" />
                                        <div>横矩形</div>
                                    </Radio>
                                    <Radio value={1}>
                                        <div className="style-btn v-rectangle" />
                                        <div>竖矩形</div>
                                    </Radio>
                                </RadioGroup>
                            )
                        }

                    </div>
                </div>

                <div>
                    <FormItem
                        {...formItemLayout}
                        label="个性化"
                    >
                        {
                            getFieldDecorator('btnTheme', {
                                initialValue: mobileEntrySetting.btnTheme,
                            })(
                                <RadioGroup>
                                    <Radio value={-1}>按钮颜色</Radio>
                                    <Radio value={0}>自定义</Radio>
                                </RadioGroup>
                            )
                        }
                    </FormItem>
                    {btnThemeCustom}
                </div>

                <FormItem
                    {...formItemLayout}
                    label="随屏滚动"
                >
                    {
                        getFieldDecorator('fixed', {
                            initialValue: mobileEntrySetting.fixed,
                        })(
                            <RadioGroup>
                                <Radio value={0}>滚动</Radio>
                                <Radio value={1}>固定</Radio>
                            </RadioGroup>
                        )
                    }
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="页面位置"
                >
                    <div className="position-set clearfix">
                        <PositionPreview previewSquareStyles={previewSquareStyles} />
                        <div className="set-side">
                            <div>
                                {
                                   getFieldDecorator('floatPosition', {
                                       initialValue: mobileEntrySetting.floatPosition,
                                   })(
                                       <RadioGroup>
                                           <Radio
                                               style={verticalRadioStyle}
                                               value={0}
                                           >
                                               左边
                                           </Radio>
                                           <Radio
                                               style={verticalRadioStyle}
                                               value={1}
                                           >
                                               右边
                                           </Radio>
                                       </RadioGroup>
                                   )
                               }
                            </div>
                            <div>
                                {
                                   getFieldDecorator('sideMargin', {
                                       initialValue: mobileEntrySetting.sideMargin,
                                   })(
                                       <div style={{ margin: '10px 0' }}>
                                           <span>边距</span>
                                           <CorpInput
                                               value={mobileEntrySetting.sideMargin}
                                               style={{ width: 80, marginRight: 7, marginLeft: 7 }}
                                               placeholder="边界距离"
                                           />%
                                       </div>
                                   )
                               }
                                {
                                   getFieldDecorator('topMargin', {
                                       initialValue: mobileEntrySetting.topMargin,
                                   })(
                                       <div>
                                           <span>顶部</span>
                                           <CorpInput
                                               value={mobileEntrySetting.topMargin}
                                               style={{ width: 80, marginRight: 7, marginLeft: 7 }}
                                               placeholder="顶部距离"
                                           />%
                                       </div>
                                   )
                               }
                            </div>
                        </div>
                    </div>
                </FormItem>

                <SaveButton
                    isSaved={this.state.isSaved}
                    onSave={this.onSave}
                />

                <FormItem>
                    <div className="entry-tips" style={{ marginTop: 20 }}>
                        会话插件是一种灵活的通讯工具，
                        支持所有访客在没有通过任何通讯工具加您为好友的前提下向您发起临时会话，
                        让沟通无距离；将您的接待组件发布在互联网上（网站、论坛、微信、微博等），
                        访客人点击即可与您联系，沟通就这么一“点”距离。
                    </div>
                </FormItem>


            </div>
        );
    }
}

/* eslint-disable max-len */
const mapPropsToFields = props => transformPropsFitForm(props.mobileEntrySetting);
const onFieldsChange = (props, fields) => props.updateEntrySettingFields({ fields, type: 'mobile' });
/* eslint-enable */

export default Form.create({ mapPropsToFields, onFieldsChange })(MobileEntrySetting);
