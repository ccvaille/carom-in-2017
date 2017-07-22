import React, { PropTypes } from 'react';
import { Button, Icon, Modal, Input } from 'antd';
import { baseTableScrollDelta } from 'constants/shared';
import resizableTableHOC from 'components/ResizableTableHOC';
import './reply-detail.less';

const ResizableRepliesTable = resizableTableHOC(baseTableScrollDelta + 10);

// const confirm = Modal.confirm;

class QuickReplyDetail extends React.Component {
    static propTypes = {
        params: PropTypes.shape({
            id: PropTypes.string,
        }).isRequired,
        getQuickReplies: PropTypes.func.isRequired,
        toggleEditReplyModal: PropTypes.func.isRequired,
        toggleRemoveReplyModal: PropTypes.func.isRequired,
        replies: PropTypes.array.isRequired,
        editReplyModalVisible: PropTypes.bool.isRequired,
        removeReplyModalVisible: PropTypes.bool.isRequired,
        addReply: PropTypes.func.isRequired,
        editReply: PropTypes.func.isRequired,
        removeReply: PropTypes.func.isRequired,
    }

    state = {
        isEdit: false,
        modalTitle: '',
        editReplyContent: '',
        editReplyId: '',
        removeReplyId: '',
        isSubmitting: false,
    }

    componentDidMount() {
        this.props.getQuickReplies(this.props.params.id);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.removeReplyModalVisible) {
            document.body.addEventListener('keydown', this.onKeyDown);
        } else {
            document.body.removeEventListener('keydown', this.onKeyDown);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.params.id !== this.props.params.id) {
            this.props.getQuickReplies(this.props.params.id);
        }
    }

    onKeyDown = (e) => {
        if (e.keyCode === 13) {
            this.onConfirmRemove();
        }
    }

    onAddReply = () => {
        this.props.toggleEditReplyModal(true);
        let editReplyContent = this.state.editReplyContent;
        if (this.state.isEdit) {
            editReplyContent = '';
        }
        this.setState({
            isEdit: false,
            modalTitle: '新建回复语',
            editReplyContent,
            editReplyId: '',
        }, () => {
            if (this.groupEditInput) {
                this.groupEditInput.focus();
            }
        });
    }

    onDeleteReply = (id) => {
        this.setState({
            removeReplyId: id,
        });
        this.props.toggleRemoveReplyModal(true);
    }

    onEditReply = (content, id) => {
        this.props.toggleEditReplyModal(true);
        this.setState({
            isEdit: true,
            modalTitle: '编辑回复语',
            editReplyContent: content,
            editReplyId: id,
        }, () => {
            if (this.groupEditInput) {
                this.groupEditInput.focus();
            }
        });
    }

    onEditCancel = () => {
        this.props.toggleEditReplyModal(false);
    }

    onReplyContentChange = (e) => {
        this.setState({
            editReplyContent: e.target.value,
        });
    }

    // eslint-disable-next-line consistent-return
    onConfirmAddOrEdit = () => {
        if (this.state.isSubmitting) {
            return false;
        }
        const { addReply, editReply, params } = this.props;
        this.setState({
            isSubmitting: true,
        });
        if (this.state.isEdit) {
            editReply({
                id: this.state.editReplyId,
                groupId: params.id,
                content: this.state.editReplyContent,
            }).then(this.resetEditContent);
        } else {
            addReply({
                groupId: params.id,
                content: this.state.editReplyContent,
            }).then(this.resetEditContent);
        }
    }

    // eslint-disable-next-line consistent-return
    onConfirmRemove = () => {
        console.log('remove');
        if (this.state.isSubmitting) {
            return false;
        }
        this.setState({
            isSubmitting: true,
        });
        this.props.removeReply({
            id: this.state.removeReplyId,
            groupId: this.props.params.id,
        }).then(() => {
            this.setState({
                isSubmitting: false,
            });
        });
    }

    onCancelRemove = () => {
        this.props.toggleRemoveReplyModal(false);
    }

    resetEditContent = ({ errorMsg }) => {
        this.setState({
            isSubmitting: false,
        });
        if (!errorMsg) {
            this.setState({
                editReplyContent: '',
            });
        }
    }

    render() {
        const {
            editReplyModalVisible,
            removeReplyModalVisible,
        } = this.props;

        const columns = [{
            title: '内容',
            key: 'title',
            width: '70%',
            dataIndex: 'f_content',
            className: 'reply-content',
        }, {
            title: '操作',
            width: '15%',
            className: 'reply-operates-td',
            render: (text, record) => (
                <div className="operates">
                    <i
                        role="button"
                        tabIndex="0"
                        className="icon icon-edit-rect"
                        onClick={() => this.onEditReply(record.f_content, record.f_id)}
                    />
                    <i
                        role="button"
                        tabIndex="-1"
                        className="icon icon-delete"
                        onClick={() => this.onDeleteReply(record.f_id)}
                    />
                </div>
            ),
        }];

        return (
            <div className="quick-reply-detail">
                <div className="head" style={{ marginBottom: 20 }}>
                    <Button
                        type="ghost"
                        onClick={this.onAddReply}
                    >
                        <Icon type="plus" />
                        添加回复语
                    </Button>
                </div>

                <ResizableRepliesTable
                    className="replies-table"
                    columns={columns}
                    dataSource={this.props.replies}
                    pagination={false}
                    locale={{
                        emptyText: (<span><Icon type="exclamation-circle-o" />您需要添加回复语</span>),
                    }}
                />

                <Modal
                    title={this.state.modalTitle}
                    visible={editReplyModalVisible}
                    maskClosable={false}
                    onOk={this.onConfirmAddOrEdit}
                    onCancel={this.onEditCancel}
                >
                    <div className="edit-reply">
                        {/* <div className="tools">
                            <Icon type="smile-o" />
                        </div> */}
                        <Input
                            // eslint-disable-next-line max-len
                            ref={(wrapper) => { this.groupEditInput = (wrapper && wrapper.refs.input) || null; }}
                            type="textarea"
                            placeholder="输入回复语内容，最多支持200字..."
                            maxLength={200}
                            rows={7}
                            value={this.state.editReplyContent}
                            onChange={this.onReplyContentChange}
                        />
                    </div>
                </Modal>

                <Modal
                    title="删除提醒"
                    visible={removeReplyModalVisible}
                    width={360}
                    onOk={this.onConfirmRemove}
                    onCancel={this.onCancelRemove}
                    maskClosable={false}
                >
                    <p>确定删除回复语吗?</p>
                </Modal>
            </div>
        );
    }
}

export default QuickReplyDetail;
