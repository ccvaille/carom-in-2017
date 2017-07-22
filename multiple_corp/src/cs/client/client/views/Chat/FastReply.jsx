import React from 'react';
import { replace } from 'react-router-redux';
import { connect } from 'react-redux';
import noneImg from 'images/none.png';
import { selectFastReplyStr } from '../../actions/chat';
import { setIsShowFastReply } from '../../actions/chatInput';

let bodyClickEvt;
const groupNames = {
    commonGroup: '公共回复',
    myGroup: '我的回复',
};
let prevSeletedGroup = '';
class FastReply extends React.Component {
    static propTypes = {
        chat: React.PropTypes.object.isRequired,
        dispatch: React.PropTypes.func.isRequired,
    }
    constructor(props) {
        super(props);
        this.state = {
            bigGroupStates: {
                0: true, // 公共回复
                1: true, // 我的回复
                2: true // 热点回复
            },
            groupStates: {},
            replyList: [],
            selectedGroup: prevSeletedGroup,
        };
    }
    componentWillReceiveProps(nextProps) {
        const nextShow = nextProps.chat.isShowFastReply;
        const nextReplies = nextProps.chat.replies;
        const cShow = this.props.chat.isShowFastReply;
        if (nextShow !== cShow && nextShow && this.state.selectedGroup === 'hotGroup') {
            this.setState({
                replyList: nextReplies.hotGroup,
            });
        }
    }
    componentWillUnmount() {
        prevSeletedGroup = this.state.selectedGroup;
        document.body.removeEventListener('click', bodyClickEvt);
    }
    onSelect(id, str) {
        this.props.dispatch(selectFastReplyStr(id, str));
        setTimeout(() => {
            document.querySelector('.session-input textarea').focus();
        }, 16);
    }
    showFastReply = () => {
        this.props.dispatch(setIsShowFastReply(true));
    }
    hideFastReply = () => {
        this.props.dispatch(setIsShowFastReply(false));
    }
    toggleBigGroup = (index, isHotGroup) => {
        if (isHotGroup) {
            this.selectGroup('hotGroup');
            return;
        }
        this.setState({
            bigGroupStates: {
                ...this.state.bigGroupStates,
                [index]: !this.state.bigGroupStates[index],
            },
        });
    }
    selectGroup = (bigGroupName, index, groupId) => {
        const { replies = {} } = this.props.chat;
        if (bigGroupName === 'hotGroup') {
            this.setState({
                replyList: replies.hotGroup,
                selectedGroup: 'hotGroup'
            });
        } else {
            this.setState({
                replyList: replies[bigGroupName][index].replyList || [],
                selectedGroup: groupId,
            });
        }
    }
    renderGroup(group, bigGroupName, index) {
        // const { replyList = [] } = group;
        const isSelected = this.state.selectedGroup === group.f_id;
        return (
            <div className={`sub-group ${isSelected ? 'selected' : ''}`} key={group.f_name}>
                <p onClick={() => this.selectGroup(bigGroupName, index, group.f_id)}>
                    {group.f_name}
                </p>
                {
                    // isGroupOpened ? this.renderItems(replyList) : null
                }
            </div>
        );
    }
    renderItems(replyList) {
        return (
            <ul>
                {
                    replyList.map(str => (
                        <li
                            onClick={() => this.onSelect(str.f_id, str.f_content)}
                            key={str.f_content}
                        >{str.f_content}</li>
                    ))
                }
            </ul>
        );
    }
    render() {
        const { replies = {}, isShowFastReply } = this.props.chat;
        let replyItemsNode = null;

        if (!this.state.selectedGroup) {
            replyItemsNode = (
                <div className="empty-reply">
                    <div className="empty-wrapper">
                        <img src={noneImg} alt="" />
                        <p>请选中相应分组</p>
                    </div>
                </div>
            );
        } else if (!this.state.replyList.length) {
            replyItemsNode = (
                <div className="empty-reply">
                    <div className="empty-wrapper">
                        <img src={noneImg} alt="" />
                        <p>暂无快捷回复语</p>
                    </div>
                </div>
            );
        } else if (this.state.replyList.length > 0) {
            replyItemsNode = this.renderItems(this.state.replyList);
        }

        return (
            <div className="fast-reply" style={{ display: replies && isShowFastReply ? 'block' : 'none' }}>
                <div className="top-title">
                    快捷回复
                    <i
                        className="anticon anticon-close"
                        onClick={this.hideFastReply}
                        role="button"
                        tabIndex="0"
                    />
                    <i
                        className="anticon anticon-setting"
                        onClick={() => {
                            this.props.dispatch(replace('/kf/client/quickreply'));
                        }}
                        role="button"
                        tabIndex="0"
                    />
                </div>
                <div className="reply-list">
                    <ul>
                        {
                            replies && Object.keys(replies).map((groupName, index) => {
                                const bigGroup = replies[groupName] || [];
                                const isBigGroupOpened = this.state.bigGroupStates[index];
                                const isHotGroup = groupName === 'hotGroup';

                                let groupCont = null;
                                if (isHotGroup) {
                                    if (isBigGroupOpened) {
                                        groupCont = null;
                                    }
                                } else if (isBigGroupOpened) {
                                    groupCont = bigGroup.map(
                                        (group, gindex) => this.renderGroup(
                                            group, groupName, gindex
                                        )
                                    );
                                }

                                let cls = '';
                                if (isHotGroup) {
                                    cls = 'hot-group';

                                    if (this.state.selectedGroup === 'hotGroup') {
                                        cls += ' selected';
                                    }
                                } else if (isBigGroupOpened) {
                                    cls = 'open';
                                }

                                return (
                                    <li className={cls} key={groupName}>
                                        <p onClick={() => this.toggleBigGroup(index, isHotGroup)}>
                                            <i className="anticon anticon-right" />
                                            <span>{isHotGroup ? '热点回复' : groupNames[groupName]}</span>
                                        </p>
                                        {groupCont}
                                    </li>
                                );
                            })
                        }
                    </ul>
                </div>
                <div className="reply-items">
                    {replyItemsNode}
                </div>
            </div>
        );
    }
}

export default connect((state) => {
    const { chat } = state;
    return {
        chat
    };
})(FastReply);
