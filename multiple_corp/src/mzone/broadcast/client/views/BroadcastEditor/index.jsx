import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {withRouter, browserHistory} from 'react-router'
import { goBack, go, push } from 'react-router-redux'
import * as actionCreators from '../../actions'

import ECEditor from '../../components/ECEditor'
import SelectUser from '../../components/SelectUser'

import {fetchMembers} from '../../actions'

import {Button, Modal, Icon, message} from 'antd';

import './index.less'


var publishOnce = true;
var draftOnce = true;

class EditContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSelectUserShow: false,
            option: {
                left: 60,
                top: 96
            },
            checkedArray: [],
            idArray: [],
            titleValue: '',
            initTitleValue: '',
            titleChanged: false,
            editorContent: '',
            initContent: '',
            contentChanged: false,
            isChange: false
        }
    }

    selectUserOk = (checkedArray, idArray) => {
        this.setState({isSelectUserShow: false, checkedArray: checkedArray, idArray: idArray})
    }

    selectUserCancel = () => {
        this.setState({isSelectUserShow: false})
    }

    searchFunc = (value) => {
        this.props.searchUsername(value);
    }

    removeUser = (id) => {
        var checkedArray = this.state.checkedArray;
        var idArray;
        checkedArray = checkedArray.filter(function (item) {
            return item.id != id;
        })
        idArray = this.formatData(checkedArray);
        this.setState({checkedArray: checkedArray, idArray: idArray})
    }

    checkIfChanged = () => {
        const _this = this;
        if (this.state.titleChanged || this.state.contentChanged) {
            Modal.confirm({
                content: '广播未保存，确定离开吗？',
                onOk() {
                    history.go(-1)
                }
            })
        } else {
            history.go(-1)
        }
    }

    showSelectUser = () => {
        this.setState({isSelectUserShow: true})
    }

    fetchDetail = () => {
        const bdid = this.props.location.query.bdid;
        if (bdid != undefined) {
            this
                .props
                .fetchBroadcastDetail(bdid);
        }
    }

    changeTitle = (e) => {
        this.setState({
            titleValue: e.target.value,
            titleChanged: e.target.value != this.state.initTitleValue
        })
    }

    changeContent = (content, flag) => {
        this.setState({
            editorContent: content,
            contentChanged: this.props.reEdit
                ? flag
                : true
        })
    }

    publishBroadcast = (content) => {
        const _this = this;
        const idArray = _this.state.idArray;
        const titleValue = _this.trim(_this.state.titleValue);
        const editorContent = content;
        if (titleValue == '') {
            message.warning('标题不能为空')
            return;
        } else if (titleValue.length > 32) {
            message.warning('标题不能超过32个字符')
            return;
        } else if (editorContent == '') {
            message.warning('内容不能为空')
            return;
        } else if (idArray.length == 0) {
            message.warning('请选择发送范围')
            return;
        }
        const params = this.getParams();
        params.content = encodeURIComponent(content);
        // console.log(content)
        if(!publishOnce) return;
        publishOnce = false;
        
        _this.props.publishBroadcast(params, publishOnce);
    }

    getParams = () => {
        const _this = this;
        const idArray = _this.state.idArray;
        const titleValue = _this.trim(_this.state.titleValue);
        const editorContent = _this.state.editorContent;
        const params = {};

        params.uidstr = idArray.join(',');
        params.title = titleValue;
        params.content = editorContent;

        if (_this.props.reEdit) {
            params.bdid = _this.props.location.query.bdid;
        }

        return params
    }

    saveToDraft = (content) => {
        const params = this.getParams();
        if(!draftOnce) return;
        draftOnce = false;
        const draftParams = {};
        draftParams.title = params.title;
        draftParams.content = encodeURIComponent(content);
        if(this.props.reEdit) {
            draftParams.bdid = params.bdid;
            this.props.saveToDraft(draftParams,draftOnce);
        } else {
            this.props.saveToDraft(draftParams,draftOnce);
        }
    }

    trim = (str) => {
        return str.replace(/(^\s*)|(\s*$)/g, '');
    }

    getStrLength = (str) => {
        return str
            .replace(/[\u0391-\uFFE5]/g, "aa")
            .length;
    }

    html_Encode = (str) => {
        var s = "";
        if (str.length == 0) 
            return "";
        s = str.replace(/&/g, "&amp;");
        // s = s.replace(/</g, "&lt;");
        // s = s.replace(/>/g, "&gt;");
        // s = s.replace(/ /g, "&nbsp;");
        // s = s.replace(/\'/g, "&#39;");
        // s = s.replace(/\"/g, "&quot;");
        return s;
    }

    // 转义字符转换为html
    html_decode = (str) => {
        var s = "";
        if (str.length == 0) 
            return "";
        s = str.replace(/&amp;/g, "&");
        // s = s.replace(/&lt;/g, "<");
        // s = s.replace(/&gt;/g, ">");
        // s = s.replace(/&nbsp;/g, " ");
        // s = s.replace(/&#39;/g, "\'");
        // s = s.replace(/&quot;/g, "\"");
        return s;
    }

    //获取整理数据
    formatData = (data) => {
        let array = [];
        const _this = this;
        if (Array.isArray(data)) {
            for (let i = 0, len = data.length; i < len; i++) {
                array = array.concat(_this.formatData(data[i]));
            }
        } else if (data.im0.indexOf('leaf')<0) {
            let list = data.item;
            for (let i = 0, len = list.length; i < len; i++) {
                array = array.concat(_this.formatData(list[i]));
            }
        }
        else {
            array.push(data.id);
        }
        return array;
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.reEdit) {
            const content_html = this.html_decode(nextProps.broadcastDetail.f_content)
            this.setState({
                editorContent: content_html, 
                initContent: content_html, 
                titleValue: nextProps.broadcastDetail.f_title, 
                initTitleValue: nextProps.broadcastDetail.f_title
            })
        }
    }

    componentDidMount = () => {
        this
            .props
            .fetchMembers();
    }
    render() {
        const {membersData, broadcastDetail, reEdit, searchMembers} = this.props;
        const {checkedArray, initContent, titleValue} = this.state;
        const _this = this;
        return (
            <div className="broadcast-edit">
                <div>
                    <Button className="btn-return" onClick={this.checkIfChanged}>返回</Button>
                </div>

                <div className="checked-btn-group">
                    <Button
                        className="btn-choose"
                        type="dashed"
                        icon="plus"
                        ref="range-btn"
                        onClick={this.showSelectUser}>选择发送范围</Button>
                    <div className="checked-btns">
                        {checkedArray
                            .map(function (item, index) {
                                return (
                                    <Button key={index} onClick={() => this.removeUser(item.id)} size="small">{item.text}<Icon type="close" /></Button>
                                )
                            }.bind(this))
                        }
                    </div>
                    <SelectUser
                        visible={this.state.isSelectUserShow}
                        option={this.state.option}
                        data={membersData}
                        onOk={this.selectUserOk}
                        onCancel={this.selectUserCancel}
                        rule={{
                            id: 'id',
                            name: 'text',
                            sublist: 'item'
                        }}
                        searchFunc={this.searchFunc}
                        checkedArray={this.state.checkedArray}
                        result={searchMembers}
                        searchValue={this.props.searchValue}/>
                </div>
                <div className="h-line"></div>
                <input
                    className="title-input"
                    type="text"
                    placeholder="请输入广播标题..."
                    onChange={this.changeTitle}
                    value={titleValue}/>
                <ECEditor
                    content={initContent}
                    fetchDetail={this.fetchDetail}
                    onChange={this
                    .changeContent
                    .bind(this)}
                    html_Encode={this.html_Encode}
                    html_decode={this.html_decode}
                    publishBroadcast={this.publishBroadcast}
                    saveToDraft={this.saveToDraft}/>
                
            </div>
        );
    }
}

EditContainer.propTypes = {
    membersData: PropTypes.array.isRequired,
    broadcastDetail: PropTypes.object.isRequired,
    reEdit: PropTypes.bool.isRequired,
    searchMembers: PropTypes.array.isRequired,
    searchValue: PropTypes.string.isRequired
}

function mapStateToProps(state) {
    return {
        membersData: state.broadcastEdit.membersData,
        broadcastDetail: state.broadcastEdit.broadcastDetail, 
        reEdit: state.broadcastEdit.reEdit,
        searchMembers: state.broadcastEdit.searchMembers,
        searchValue: state.broadcastEdit.searchValue
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EditContainer))
