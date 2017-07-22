import React, { PropTypes } from 'react';
import { Form, Radio, Tabs } from 'antd';
import { transformPropsFitForm } from '~comm/utils';
import message from '~comm/components/Message';
import { hexRegex } from 'constants/shared';
import CorpInput from 'components/CorpInput';
import ColorList from 'components/ColorList';
import Uploader from 'components/Uploader';
import PositionPreview from 'components/PositionPreview';
import SaveButton from 'components/SaveButton';
import uploadPlaceholder from 'img/upload-placeholder.png';
import 'styles/entry-setting.less';
import './pc-entry-setting.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;

const formItemlayout = {
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

class PcEntrySetting extends React.Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        pcEntrySetting: PropTypes.object.isRequired,
        updateEntrySettingFields: PropTypes.func.isRequired,
        uploadImage: PropTypes.func.isRequired,
        saveSetting: PropTypes.func.isRequired,
        setLocale: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            activeEntryMode: this.props.pcEntrySetting.showStyle === 1 ? 'singleBtn' : 'list',
            btnBackgroundUploading: false,
            listBackgroundUploading: false,
            minimizeBackgroundUploading: false,
            isSaved: 0, // 0 默认，1 保存中， 2 已保存
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.pcEntrySetting.showStyle !== this.props.pcEntrySetting.showStyle) {
            this.setState({
                activeEntryMode: nextProps.pcEntrySetting.showStyle === 1 ? 'singleBtn' : 'list',
            });
        }
    }

    onEntryModeChange = (key) => {
        this.setState({
            activeEntryMode: key,
        });

        let showStyle = this.props.pcEntrySetting.showStyle;

        switch (key) {
            case 'list':
                showStyle = 0;
                break;
            case 'singleBtn':
                showStyle = 1;
                break;
            default:
                break;
        }

        this.props.updateEntrySettingFields({
            fields: {
                showStyle: {
                    value: showStyle,
                },
            },
            type: 'pc',
        });
    }

    onUpload = (files, type) => {
        if (!files.length) {
            return false;
        }

        const file = files[0];
        return this.props.uploadImage({
            file,
        }, { type: 'pc', imageType: type });
    }

    onListBackgroudUpload = (files) => {
        this.setState({
            listBackgroundUploading: true,
        });
        this.onUpload(files, 'listBackground');
    }

    onMiniBackgroudUpload = (files) => {
        this.setState({
            btnBackgroundUploading: true,
        });
        this.onUpload(files, 'minimizeBackground');
    }

    onBtnBackgroudUpload = (files) => {
        this.setState({
            btnBackgroundUploading: true,
        });
        this.onUpload(files, 'btnBackground');
    }

    onChooseGroupColor = (hexCode) => {
        this.props.updateEntrySettingFields({
            fields: {
                groupTextColor: {
                    value: hexCode,
                },
            },
            type: 'pc',
        });
    }

    onChooseBtnColor = (hexCode) => {
        this.props.updateEntrySettingFields({
            fields: {
                buttonStyleBackgroundColor: {
                    value: hexCode,
                },
            },
            type: 'pc',
        });
    }

    // eslint-disable-next-line consistent-return
    onSave = () => {
        const {
            showStyle,
            listTheme,
            listBackground,
            minimizeBackground,
        } = this.props.pcEntrySetting;
        if (showStyle === 0 && listTheme === 0) {
            if (!listBackground) {
                message.error('请上传列表背景图');
                return false;
            }

            if (!minimizeBackground) {
                message.error('请上传最小化背景图');
                return false;
            }
        }

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

    onBgRejected = (rejectedFiles, error, duration = 1.5) => {
        message.error(error, duration);
    }

    onRestoreListBg = () => {
        this.props.updateEntrySettingFields({
            fields: {
                listBackground: {
                    value: '',
                },
            },
            type: 'pc',
        });
    }

    onRestoreMiniBg = () => {
        this.props.updateEntrySettingFields({
            fields: {
                minimizeBackground: {
                    value: '',
                },
            },
            type: 'pc',
        });
    }

    render() {
        const { pcEntrySetting, setLocale } = this.props;
        const { listTheme, btnTheme } = this.props.pcEntrySetting;
        const { getFieldDecorator } = this.props.form;

        let listThemeCustom = null;
        let btnThemeCustom = null;

        if (listTheme === -1) {
            listThemeCustom = (
                <div className="system-list-theme">
                    {
                        getFieldDecorator('systemThemeNumber', {
                            initialValue: pcEntrySetting.systemThemeNumber,
                        })(
                            <RadioGroup className="custom-radio-group">
                                <Radio value={1}>
                                    <div className="system-theme default" />
                                    <div className="mode-name">默认</div>
                                </Radio>
                                <Radio value={2}>
                                    <div className="system-theme cyan-blue" />
                                    <div className="mode-name">青色</div>
                                </Radio>
                                <Radio value={3}>
                                    <div className="system-theme dark-green" />
                                    <div className="mode-name">墨绿</div>
                                </Radio>
                                <Radio value={4}>
                                    <div className="system-theme orange" />
                                    <div className="mode-name">橙色</div>
                                </Radio>
                                <Radio value={5}>
                                    <div className="system-theme jade-green" />
                                    <div className="mode-name">翠绿</div>
                                </Radio>
                            </RadioGroup>
                        )
                    }
                </div>
            );
        } else if (listTheme === 0) {
            listThemeCustom = (
                <div className="custom-list-theme">
                    <div className="upload-wrapper clearfix">
                        <div className="clearfix">
                            <div className="background-upload list-background clearfix">
                                <div
                                    className="img"
                                    style={{
                                        background: `url(${pcEntrySetting.listBackground || uploadPlaceholder}) 0% 0% / contain no-repeat`,
                                    }}
                                />
                                <div className="text">
                                    <Uploader
                                        className="upload-point"
                                        uploadText="上传"
                                        isUploading={this.listBackgroundUploading}
                                        onUpload={this.onListBackgroudUpload}
                                        onRejected={this.onBgRejected}
                                    />
                                    <span>列表背景</span>
                                </div>
                            </div>
                            <div className="background-upload minimize-background clearfix">
                                <div
                                    className="img"
                                    style={{
                                        background: `url(${pcEntrySetting.minimizeBackground || uploadPlaceholder}) 0% 0% / contain no-repeat`,
                                    }}
                                />
                                <div className="text">
                                    <Uploader
                                        className="upload-point"
                                        uploadText="上传"
                                        onUpload={this.onMiniBackgroudUpload}
                                        isUploading={this.minimizeBackgroundUploading}
                                        onRejected={this.onBgRejected}
                                    />
                                    <span>最小化背景</span>
                                </div>
                            </div>
                        </div>

                        <div className="image-prompt">
                            <p>请上传尺寸在260*400 px 以内的png或jpg图片</p>
                        </div>
                    </div>
                    <FormItem
                        label="字体颜色"
                    >
                        <ColorList
                            initialActive={pcEntrySetting.groupTextColor}
                            onColorSelected={this.onChooseGroupColor}
                        />
                    </FormItem>

                    <FormItem
                        label="色值设置"
                    >
                        {
                            getFieldDecorator('customGroupTextColor', {
                                initialValue: pcEntrySetting.customGroupTextColor,
                            })(
                                <CorpInput
                                    maxLength={7}
                                    style={{ width: 80, marginRight: 7 }}
                                    placeholder="#2580e6"
                                    onBlur={() => {
                                        if (
                                            pcEntrySetting.customGroupTextColor
                                            && !hexRegex.test(pcEntrySetting.customGroupTextColor)
                                        ) {
                                            message.error('色值格式错误');
                                        }
                                    }}
                                />
                            )
                        }
                        <span>请输入十六进制的数值，仅改变字体颜色</span>
                    </FormItem>
                </div>
            );
        }

        if (btnTheme === -1) {
            btnThemeCustom = (
                <div style={{ marginBottom: 24, marginTop: -20 }}>
                    <ColorList
                        initialActive={pcEntrySetting.buttonStyleBackgroundColor}
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
                                background: `url(${pcEntrySetting.btnBackground || uploadPlaceholder}) 0% 0% / contain no-repeat`,
                            }}
                        />
                        <div className="text">
                            <Uploader
                                className="upload-point"
                                uploadText="上传"
                                isUploading={this.btnBackgroundUploading}
                                onUpload={this.onBtnBackgroudUpload}
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

        let topPosition = 0;
        let sidePosition = 0;

        if (!pcEntrySetting.topMargin || pcEntrySetting.topMargin < 0) {
            topPosition = 0;
        } else if (pcEntrySetting.topMargin > 100) {
            topPosition = 100;
        } else {
            const topDelta = getTopDelta(pcEntrySetting.topMargin);
            topPosition = topDelta;
        }

        let previewSquareStyles = {
            top: `${topPosition}px`,
            left: 0,
            right: 0,
        };

        if (!pcEntrySetting.sideMargin) {
            sidePosition = 0;
        } else if (pcEntrySetting.sideMargin > 100) {
            sidePosition = 100;
        } else {
            const sideDelta = getSideDelta(pcEntrySetting.sideMargin);
            sidePosition = sideDelta;
        }

        if (pcEntrySetting.floatPosition === 0) {
            previewSquareStyles = {
                ...previewSquareStyles,
                left: `${sidePosition}px`,
                right: 'auto',
            };
        } else if (pcEntrySetting.floatPosition === 1) {
            previewSquareStyles = {
                ...previewSquareStyles,
                left: 'auto',
                right: `${sidePosition}px`,
            };
        }

        return (
            <div className="pc-entry-setting">
                <Form>
                    <FormItem
                        {...formItemlayout}
                        label="语言"
                    >
                        {
                            getFieldDecorator('language', {
                                initialValue: pcEntrySetting.language,
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
                        {...formItemlayout}
                        label="样式"
                        className="entry-style"
                    >
                        <Tabs
                            activeKey={this.state.activeEntryMode}
                            onChange={this.onEntryModeChange}
                        >
                            <TabPane tab="列表样式" key="list" />
                            <TabPane tab="按钮样式" key="singleBtn" />
                        </Tabs>
                    </FormItem>

                    {
                        this.state.activeEntryMode === 'singleBtn'
                        ?
                            <div>
                                <div className="entry-button-styles">
                                    {
                                    getFieldDecorator('buttonStyle', {
                                        initialValue: pcEntrySetting.buttonStyle,
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
                                <FormItem
                                    {...formItemlayout}
                                    label="个性化"
                                >
                                    {
                                    getFieldDecorator('btnTheme', {
                                        initialValue: pcEntrySetting.btnTheme,
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
                        :
                            <div>
                                <FormItem
                                    {...formItemlayout}
                                    label="列表模板"
                                >
                                    {
                                    getFieldDecorator('listTheme', {
                                        initialValue: pcEntrySetting.listTheme,
                                    })(
                                        <RadioGroup>
                                            <Radio value={-1}>系统模板</Radio>
                                            <Radio value={0}>自定义</Radio>
                                        </RadioGroup>
                                    )
                                }
                                </FormItem>
                                {listThemeCustom}
                            </div>
                    }

                    {
                        this.state.activeEntryMode === 'list'
                        ?
                            <div>
                                <FormItem
                                    {...formItemlayout}
                                    label="客服排序"
                                >
                                    {
                                        getFieldDecorator('csSort', {
                                            initialValue: pcEntrySetting.csSort,
                                        })(
                                            <RadioGroup>
                                                <Radio value={0}>顺序</Radio>
                                                <Radio value={1}>随机</Radio>
                                            </RadioGroup>
                                        )
                                    }
                                </FormItem>

                                <FormItem
                                    {...formItemlayout}
                                    label="离线客服"
                                >
                                    {
                                        getFieldDecorator('showOffline', {
                                            initialValue: pcEntrySetting.showOffline,
                                        })(
                                            <RadioGroup>
                                                <Radio value={0}>显示</Radio>
                                                <Radio value={1}>隐藏</Radio>
                                            </RadioGroup>
                                        )
                                    }
                                </FormItem>
                            </div>
                        : null
                    }

                    <FormItem
                        {...formItemlayout}
                        label="随屏滚动"
                    >
                        {
                            getFieldDecorator('fixed', {
                                initialValue: pcEntrySetting.fixed,
                            })(
                                <RadioGroup>
                                    <Radio value={0}>滚动</Radio>
                                    <Radio value={1}>固定</Radio>
                                </RadioGroup>
                            )
                        }
                    </FormItem>

                    <FormItem
                        {...formItemlayout}
                        label="页面位置"
                    >
                        <div className="position-set clearfix">
                            <PositionPreview previewSquareStyles={previewSquareStyles} />
                            <div className="set-side">
                                <div>
                                    {
                                        getFieldDecorator('floatPosition', {
                                            initialValue: pcEntrySetting.floatPosition,
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
                                            initialValue: pcEntrySetting.sideMargin,
                                        })(
                                            <div style={{ margin: '10px 0' }}>
                                                <span>边距</span>
                                                <CorpInput
                                                    value={pcEntrySetting.sideMargin}
                                                    style={{
                                                        width: 80,
                                                        marginRight: 7,
                                                        marginLeft: 7,
                                                    }}
                                                    placeholder="边界距离"
                                                />%
                                            </div>
                                        )
                                    }
                                    {
                                        getFieldDecorator('topMargin', {
                                            initialValue: pcEntrySetting.topMargin,
                                        })(
                                            <div>
                                                <span>顶部</span>
                                                <CorpInput
                                                    value={pcEntrySetting.topMargin}
                                                    style={{
                                                        width: 80,
                                                        marginRight: 7,
                                                        marginLeft: 7,
                                                    }}
                                                    placeholder="顶部距离"
                                                />%
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </FormItem>

                    {
                        this.state.activeEntryMode === 'list'
                        ?
                            <FormItem
                                {...formItemlayout}
                                label="默认状态"
                            >
                                {
                                getFieldDecorator('defaultStyle', {
                                    initialValue: pcEntrySetting.defaultStyle,
                                })(
                                    <RadioGroup>
                                        <Radio value={0}>展开</Radio>
                                        <Radio value={1}>最小化</Radio>
                                    </RadioGroup>
                                )
                            }
                            </FormItem>
                        : null
                    }

                    <SaveButton
                        isSaved={this.state.isSaved}
                        onSave={this.onSave}
                    />
                </Form>
            </div>
        );
    }
}

const mapPropsToFields = props => transformPropsFitForm(props.pcEntrySetting);
const onFieldsChange = (props, fields) => props.updateEntrySettingFields({ fields, type: 'pc' });

export default Form.create({ mapPropsToFields, onFieldsChange })(PcEntrySetting);
