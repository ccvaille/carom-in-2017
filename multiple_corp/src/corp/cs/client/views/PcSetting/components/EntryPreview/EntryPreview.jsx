import React, { PropTypes } from 'react';
import ListEntryPreview from 'views/ListEntryPreview';
import MinimizeEntryPreview from 'views/MinimizeEntryPreview';
import ButtonEntryPreview from 'components/ButtonEntryPreview';
import './entry-preview.less';

let previewNode = null;

class EntryPreview extends React.Component {
    static propTypes = {
        pcEntrySetting: PropTypes.object.isRequired,
    }

    state = {
        listPreviewMode: 0, // 0 展开，1 最小化
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            listPreviewMode: nextProps.pcEntrySetting.defaultStyle,
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { pcEntrySetting: nextPcEntrySetting, localeKey } = nextProps;
        const { showStyle: nextShowStyle, defaultStyle: nextDefaultStyle } = nextPcEntrySetting;
        switch (nextShowStyle) {
            case 0: {
                if (nextDefaultStyle === this.props.pcEntrySetting.defaultStyle) {
                    if (nextState.listPreviewMode !== this.state.listPreviewMode) {
                        switch (nextState.listPreviewMode) {
                            case 0:
                                previewNode = (
                                    <ListEntryPreview
                                        onSwitchListMode={this.onSwitchListMode}
                                    />
                                );
                                break;
                            case 1:
                                previewNode = (
                                    <MinimizeEntryPreview
                                        onSwitchListMode={this.onSwitchListMode}
                                    />
                                );
                                break;
                            default:
                                break;
                        }
                    } else {
                        previewNode = this.getDefaultPreview(nextDefaultStyle);
                    }
                } else {
                    previewNode = this.getDefaultPreview(nextDefaultStyle);
                }
                break;
            }
            case 1:
                previewNode = (
                    <ButtonEntryPreview
                        btnTheme={nextPcEntrySetting.btnTheme}
                        buttonShape={nextPcEntrySetting.buttonStyle}
                        backgroundColor={nextPcEntrySetting.buttonStyleBackgroundColor}
                        buttonImage={nextPcEntrySetting.btnBackground}
                        localeKey={localeKey}
                    />
                );
                break;
            default:
                break;
        }

        return true;
    }

    onSwitchListMode = (mode) => {
        this.setState({
            listPreviewMode: mode,
        });
    }

    getDefaultPreview = (nextDefaultStyle) => {
        switch (nextDefaultStyle) {
            case 0:
                return (
                    <ListEntryPreview
                        onSwitchListMode={this.onSwitchListMode}
                    />
                );
            case 1:
                return (
                    <MinimizeEntryPreview
                        onSwitchListMode={this.onSwitchListMode}
                    />
                );
            default:
                break;
        }
        return null;
    }

    render() {
        // const { pcEntrySetting } = this.props;
        // let themeColor = '#2480e5';
        // let csTextColor = '#555';
        // let iconColor = '#2480e5';

        // if (pcEntrySetting.listTheme === 0) {
        //     themeColor = pcEntrySetting.groupButtonColor || '#2480e5';
        // }

        // switch (pcEntrySetting.systemThemeNumber) {
        //     case 1:
        //         iconColor = '#2480e5';
        //         break;
        //     case 2:
        //         iconColor = '#838383';
        //         break;
        //     case 3:
        //         iconColor = '#2ea0e6';
        //         break;
        //     case 4:
        //         iconColor = '#858784';
        //         break;
        //     case 5:
        //         iconColor = 'white';
        //         break;
        //     default:
        //         break;
        // }

        // switch (pcEntrySetting.showStyle) {
        //     case 0: {
        //         if (pcEntrySetting.defaultStyle === 0) {
        //             if (this.state.listPreviewMode === 0) {
        //                 previewNode = (
        //                     <ListEntryPreview
        //                         onSwitchListMode={this.onSwitchListMode}
        //                     />
        //                 );
        //             } else if (this.state.listPreviewMode === 1) {
        //                 previewNode = (
        //                     <MinimizeEntryPreview
        //                         onSwitchListMode={this.onSwitchListMode}
        //                     />
        //                 );
        //             }
        //         } else {
        //             if (this.state.listPreviewMode === 0) {
        //                 previewNode = (
        //                     <ListEntryPreview
        //                         onSwitchListMode={this.onSwitchListMode}
        //                     />
        //                 );
        //             } else if (this.state.listPreviewMode === 1) {
        //                 previewNode = (
        //                     <MinimizeEntryPreview
        //                         onSwitchListMode={this.onSwitchListMode}
        //                     />
        //                 );
        //             }
        //         }
        //         break;
        //     }
        //     case 1:
        //         previewNode = (
        //             <ButtonEntryPreview
        //                 btnTheme={pcEntrySetting.btnTheme}
        //                 buttonShape={pcEntrySetting.buttonStyle}
        //                 backgroundColor={pcEntrySetting.buttonStyleBackgroundColor}
        //                 buttonImage={pcEntrySetting.btnBackground}
        //             />
        //         );
        //         break;
        //     default:
        //         break;
        // }

        /* eslint-disable max-len */
        return (
            <div>
                <div className="preview entry-preview">
                    <div className="head">
                        <h4>效果预览</h4>
                    </div>

                    <div className="preview-result">
                        {previewNode}
                    </div>
                </div>
                <p style={{ lineHeight: 1.6, marginTop: 12, color: '#bfbfbf' }}>
                    会话插件是一种灵活的通讯工具，支持所有访客在没有通过任何通讯工具加您为好友的前提下向您发起临时会话，让沟通无距离；将您的接待组件发布在互联网上（网站、论坛、微信、微博等），访客人点击即可与您联系，沟通就这么一“点”距离。
                </p>
            </div>
        );
        /* eslint-enable max-len */
    }
}

export default EntryPreview;
