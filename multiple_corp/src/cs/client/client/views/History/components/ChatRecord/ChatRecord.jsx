import React, { PropTypes } from 'react';
import moment from 'moment';
import shortid from 'shortid';
import { Modal, Form, Radio, Button, Popover, Select } from 'antd';
import { transformPropsFitForm } from '~comm/utils';
import '~comm/public/styles/iconfont.less';
import HistoryListTypes from 'constants/HistoryListTypes';
import TrackWayTable from 'components/TrackWayTable';
import MsgList from '../MsgList';
import './chat-record.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
};

const timeFilters = [{
    title: '今天',
    value: '0',
}, {
    title: '昨天',
    value: '1',
}, {
    title: '最近7天',
    value: '2',
}, {
    title: '最近30天',
    value: '3',
}];

const trackList = [{      // 轨迹列表
    date: '',
    engine: '',
    keyword: '',
    referer: '',
    list: [],
}];

class ChatRecord extends React.Component {
    static propTypes = {
        onModalHandleCancel: PropTypes.func.isRequired,
        visible: PropTypes.bool.isRequired,
        isAddMsg: PropTypes.number.isRequired,
        messageInfos: PropTypes.object.isRequired,
        form: PropTypes.object.isRequired,
        leftMsg: PropTypes.object.isRequired,
        saveLeftMsg: PropTypes.func.isRequired,
        trackList: PropTypes.array.isRequired,
        getTrackHistoryList: PropTypes.func.isRequired,
        getTrackHistoryListSuccess: PropTypes.func.isRequired,
        updateTrackParams: PropTypes.func.isRequired,
        trackParams: PropTypes.object.isRequired,
        trackPagination: PropTypes.object.isRequired,
        chat: PropTypes.object.isRequired,
        getChatList: PropTypes.func.isRequired,
        updateChatParams: PropTypes.func.isRequired,
        openAddCustomPV: PropTypes.func.isRequired,
        getChatListSuccess: PropTypes.func.isRequired,
        date: PropTypes.number.isRequired,
        currentCrmId: PropTypes.number.isRequired,
    };

    state = {
        popoverVisible: false,
        hasLoaded: false,
        isSubmitting: false,
    };

    handlePopoverClose = () => {
        this.setState({
            popoverVisible: false,
        });
        this.props.getTrackHistoryListSuccess({ trackList });
        this.props.updateTrackParams({
            isLoading: true,
        });
    };

    handleShowPopover = (e) => {
        e.preventDefault();
        const popoverVisible = this.state.popoverVisible;
        const {
            updateTrackParams,
            getTrackHistoryList,
            messageInfos,
        } = this.props;

        if (popoverVisible) {
            this.setState({
                popoverVisible: false,
            });
            // getTrackHistoryListSuccess({ trackList });
            updateTrackParams({
                isLoading: true,
            });
        } else {
            const { date } = this.props;

            updateTrackParams({
                guId: messageInfos.guId,
                isNext: false,
                isCompleted: false,
                type: date * 1 === 4 ? 3 : date,
            });

            getTrackHistoryList();

            this.setState({
                popoverVisible: true,
            });
        }
    };

    // eslint-disable-next-line consistent-return
    handleOk = () => {
        if (this.state.isSubmitting) {
            return false;
        }

        this.setState({
            isSubmitting: true,
        });
        this.props.saveLeftMsg().then(() => {
            this.setState({
                isSubmitting: false,
            });
        });
        this.props.getTrackHistoryListSuccess({ trackList });
    };

    handleCancel = () => {
        this.setState({
            popoverVisible: false,
        });

        this.props.onModalHandleCancel();
        this.props.getChatListSuccess({ data: { list: [] } });
        this.props.getTrackHistoryListSuccess({ trackList });
        this.props.updateTrackParams({
            isLoading: true,
        });
    };

    // 选择轨迹时间
    handleChange = (v) => {
        const { updateTrackParams, getTrackHistoryList } = this.props;
        const value = Number(v);
        const today = moment();
        const todayValue = today.format('YYYY-MM-DD');

        switch (value) {
            case 0: {   // 今天
                updateTrackParams({
                    page: 1,
                    start: todayValue,
                    end: todayValue,
                    type: 0,
                    isNext: false,
                    isCompleted: false,
                    isLoading: true,
                });
                break;
            }
            case 1: {   // 昨天
                const yestoday = today.subtract(1, 'd');
                const yestodayValue = yestoday.format('YYYY-MM-DD');
                updateTrackParams({
                    page: 1,
                    start: yestodayValue,
                    end: yestodayValue,
                    type: 1,
                    isNext: false,
                    isCompleted: false,
                    isLoading: true,
                });
                break;
            }
            case 2: {   // 最近7天
                const sevenDayEarlier = today.subtract(6, 'd');
                const sevenDayEarlierValue = sevenDayEarlier.format('YYYY-MM-DD');
                updateTrackParams({
                    page: 1,
                    start: sevenDayEarlierValue,
                    end: todayValue,
                    type: 2,
                    isNext: false,
                    isCompleted: false,
                    isLoading: true,
                });
                break;
            }
            case 3: {   // 近一个月
                const thirtyDayEarlier = today.subtract(29, 'd');
                const thirtyDayEarlierValue = thirtyDayEarlier.format('YYYY-MM-DD');
                updateTrackParams({
                    page: 1,
                    start: thirtyDayEarlierValue,
                    end: todayValue,
                    type: 3,
                    isNext: false,
                    isCompleted: false,
                    isLoading: true,
                });
                break;
            }
            default:
                break;
        }
        getTrackHistoryList().then(() => {
            this.setState({
                popoverVisible: true,
                hasLoaded: false,
            });
        });
    };

    handleTrackNextPage = () => {
        // eslint-disable-next-line react/no-string-refs
        const trackScroll = this.refs.trackScroll;
        const offsetHeight = trackScroll.offsetHeight;
        const scrollHeight = trackScroll.scrollHeight;
        const scrollTop = trackScroll.scrollTop;

        if (scrollTop + offsetHeight > scrollHeight - 40) {
            const hasLoaded = this.state.hasLoaded;
            const { isCompleted } = this.props.trackParams;
            if (!hasLoaded && !isCompleted) {
                this.setState({
                    hasLoaded: true,
                });

                const {
                    trackPagination,
                    updateTrackParams,
                    getTrackHistoryList,
                } = this.props;
                updateTrackParams({
                    page: trackPagination.current + 1,
                    isNext: true,
                });

                getTrackHistoryList().then(() => {
                    this.setState({
                        hasLoaded: false,
                    });
                });
            }
        }
    };

    // 打开PV窗口
    handleOpenPV = (e) => {
        e.preventDefault();
        this.props.openAddCustomPV();
    };

    render() {
        const {
            visible,
            isAddMsg,
            messageInfos,
            currentCrmId,
        } = this.props;
        const { getFieldDecorator } = this.props.form;

        let chatTitleHtml = '';
        let bodyContentHtml = '';
        let showFooter = '';
        let popoverClassName = '';

        if (isAddMsg !== HistoryListTypes.CHAT_LEAVE_MSG) {
            chatTitleHtml = (
                <span>
                    <span className="name-color" style={{ paddingRight: 7 }}>
                        {messageInfos.kfName}
                    </span>
                    与
                    <span className="name-color" style={{ paddingLeft: 7, paddingRight: 7 }}>
                        {messageInfos.visitorName}
                    </span>
                    的聊天记录
                </span>
            );

            bodyContentHtml = (
                <div className="msg-list-wrapper" >
                    <MsgList
                        chat={this.props.chat}
                        getChatList={this.props.getChatList}
                        updateChatParams={this.props.updateChatParams}
                        messageInfos={messageInfos}
                        chatType={isAddMsg}
                    />
                </div>
            );
        } else {
            const { leftMsg } = this.props;
            popoverClassName = ' higher';

            chatTitleHtml = (
                <span>
                    <span className="name-color">{messageInfos.visitorName}</span> 的留言记录
                </span>
            );

            bodyContentHtml = (
                <div className="leave-msg-wrapper" style={{ paddingTop: 35 }}>
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="标题"
                        >
                            <p>{leftMsg.title}</p>
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="姓名"
                        >
                            <p>{leftMsg.name}</p>
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="电话"
                        >
                            <p>{leftMsg.tel}</p>
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="QQ"
                        >
                            <p>{leftMsg.qq}</p>
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="邮箱"
                        >
                            <p>{leftMsg.email}</p>
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="备注"
                        >
                            <p className="leave-msg-content">{leftMsg.content}</p>
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                        >
                            <div className="radio-right">
                                {getFieldDecorator('read', {
                                    initialValue: leftMsg.read,
                                })(
                                    <RadioGroup>
                                        <Radio value={2}>已回复</Radio>
                                        <Radio value={3}>待跟进</Radio>
                                    </RadioGroup>
                                )}
                            </div>
                        </FormItem>
                    </Form>
                </div>
            );

            showFooter = ([
                <Button
                    key="back"
                    size="large"
                    onClick={this.handleCancel}
                >
                    取消
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    size="large"
                    onClick={this.handleOk}
                >
                    确定
                </Button>,
            ]);
        }

        const timeOptions = timeFilters.map(filter => (
            <Option key={shortid.generate()} value={filter.value}>{filter.title}</Option>
        ));


        const title = (
            <div className="track-popover-title" >
                <Select
                    value={this.props.trackParams.type.toString()}
                    onChange={this.handleChange}
                    dropdownClassName="ant-select-dropdown-style-custom"
                >
                    {timeOptions}
                </Select>
                <span>对话轨迹：{messageInfos.visitorName}</span>
                <button
                    className="ant-modal-close"
                    onClick={this.handlePopoverClose}
                >
                    <span className="ant-modal-close-x" />
                </button>
            </div>
        );

        const { isLoading } = this.props.trackParams;
        /* eslint-disable react/no-string-refs */
        const content = (
            <div
                className="popover-track-wrapper"
                ref="trackScroll"
                onScroll={this.handleTrackNextPage}
            >
                {
                    isLoading ? (
                        <div className="loading-wrapper">
                            <span className="loading" />
                            正在加载……
                        </div>
                    ) : this.props.trackList.map((trackItem, i) => (
                        <div key={shortid.generate()}>
                            <div className="table-header" style={{ marginTop: i === 0 ? 0 : 20 }}>
                                <span className="title-item title-sign">{trackItem.date}</span>
                                <span className="title-item">搜索引擎：{trackItem.engine}</span>
                                <span className="title-item">关键词：{trackItem.keyword}</span>
                                <div style={{ marginTop: 5 }}>
                                    <span className="referer-text">来源：{trackItem.referer}</span>
                                </div>
                            </div>
                            <TrackWayTable
                                dataSource={trackItem.list}
                            />
                        </div>
                    ))
                }
            </div>
        );
        /* eslint-enable react/no-string-refs */

        return (
            <Modal
                wrapClassName="chat-record vertical-center-modal"
                title={isAddMsg !== HistoryListTypes.CHAT_LEAVE_MSG ? '聊天记录' : '留言记录'}
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={showFooter}
                width="560"
                maskClosable={false}
            >
                <div className="body-wrapper">
                    <div className="title-wrapper">
                        {chatTitleHtml}
                        <div className="float-right">
                            <a
                                role="button"
                                tabIndex="-1"
                                onClick={this.handleOpenPV}
                            >
                                {
                                    currentCrmId === 0 ? (
                                        <span>
                                            <span className="icon icon-edit" />
                                            <span style={{ marginLeft: 3 }}>备注</span>
                                        </span>
                                    ) : (
                                        <span>
                                            <span className="icon icon-eye" style={{ fontSize: 16 }} />
                                            <span style={{ marginLeft: 3 }}>查看</span>
                                        </span>
                                    )
                                }
                            </a>
                            {
                                isAddMsg === HistoryListTypes.CHAT_QQ
                                || isAddMsg === HistoryListTypes.CHAT_WX ? null : (
                                    <Popover
                                        placement="bottomRight"
                                        title={title}
                                        content={content}
                                        visible={this.state.popoverVisible}
                                        overlayClassName={isAddMsg ? popoverClassName : ''}
                                    >
                                        <a
                                            role="button"
                                            tabIndex="-2"
                                            onClick={this.handleShowPopover}
                                            style={{ marginLeft: 15 }}
                                        >
                                            <span className="icon icon-clock-arrow-o" />
                                            <span style={{ marginLeft: 3 }}>轨迹</span>
                                        </a>
                                    </Popover>
                                )
                            }

                        </div>
                    </div>

                    {bodyContentHtml}
                </div>
            </Modal>
        );
    }
}

const mapPropsToFields = props => transformPropsFitForm(props.leftMsg);
const onFieldsChange = (props, fields) => props.updateLeftMsgFields({ fields });

export default Form.create({ mapPropsToFields, onFieldsChange })(ChatRecord);
