import React, {PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import { connect } from 'react-redux'
import {Row, Col, message, Icon, Menu, Dropdown, Button, Checkbox, Radio, Popover, Modal, Input} from 'antd'
import {Link} from 'react-router';
import Message from '../Message'
import SmallLabel from './smalLabel';
import LeftGroup from './leftGroup';
import {updateTag} from '../../actions/label.js'
import './index.less'

const content = (<ul className="ec-drop-box">
    <li><i className="iconfont">&#xe603;</i>向上移动</li>
    <li><i className="iconfont">&#xe604;</i>向下移动</li>
    <li><i className="iconfont">&#xe607;</i>修改名称</li>
    <li><i className="iconfont">&#xe602;</i>删除</li>
</ul>);
const confirm = Modal.confirm;
class OldLabel extends React.Component {
    componentWillMount() {
        this.oldLabel = [{"id": "1", "name": "一级标签"}, {"id": "2", "name": "二级标签"}, {
            "id": "3",
            "name": "三级标签"
        }, {"id": "4", "name": "四级标签"}, {"id": "5", "name": "五级标签"}, {"id": "6", "name": "六级标签"}, {
            "id": "7",
            "name": "七级标签"
        }, {"id": "8", "name": "八级标签"}, {"id": "9", "name": "九级标签"}, {"id": "10", "name": "十级标签"}];

        this.setState({
            "visible": false,
            "createLabelvisible": false,
            "oldLabelConfirm": false,
            "groupDeleteConfirm": false,
            "oldLabel": this.oldLabel,
            "groupName": "",
            "labelList": [],
            "groupList": [],
            'checked': false
        });
        // console.info("进的旧标签");
    }

    saveGroup() {
        this.state.groupList.push({
            "name": this.state.groupName
        })
        this.state.visible = false;
        this.setState(this.state);
    }

    handleColorOk() {
        this.setState({
            colorVisible: false,
        });
    }

    oldLabelvisible() {
        this.setState({"oldLabelvisible": true})
    }

    handleOldOk() {
        this.setState({
            oldLabelvisible: false,
        });
    }

    setUp() {
        this.setState({
            oldLabelConfirm: false,
        });
    }

    delteGroup() {
        this.setState({
            groupDeleteConfirm: false,
        });
    }

    showDig(type) {
        this.props.counter.get('value');
        //this.state[type] = true;
        //this.setState(this.state);
    }

    handleCancelDig(type) {
        this.state[type] = false;
        this.setState(this.state);
    }

    seachOldLabel(event) {
        var val = event.target.value;
        var labelList = this.oldLabel.filter(function (item) {
            return (item.name.indexOf(val) >= 0 ? true : false)
        })
        this.state.oldLabel = labelList;
        this.setState(this.state);
    }

    addOldLabel(id, name) {
        this.state.labelList.push({"id": id, "name": name});
        this.state.oldLabelvisible = false;
        this.setState(this.state);

    }

    setValue(event) {
        this.state.groupName = event.target.value;
        this.setState(this.state);
    }
    confirmUpdate() {
        const {dispatch} = this.props;
        let allOldLabels = this.props.postsByReddit.allOldLabel;
        if (!this.state.checked) {
            Message.error('请先同意“升级须知”后再试！');
            return false
        }
        if (allOldLabels.length) {
            this.state.oldLabelConfirm = true;
        } else {
            updateTag({
                gtag: this.props.postsByReddit.groupList
            }) 
        }
        this.setState(this.state);
    }
    sureUpdate() {
        const {dispatch} = this.props;
        // // dispatch(setStep(2));
        // fetchSaveOldData({
        //         gtag: this.props.postsByReddit.groupList
        //     });
        updateTag({
            gtag: this.props.postsByReddit.groupList
        });
        this.state.oldLabelConfirm = false;
        this.setState(this.state);
    }
    cancelSureUpdate() {
         this.state.oldLabelConfirm = false;
         this.setState(this.state);
    }
    isChecked() {
        this.state.checked = !this.state.checked;
        this.setState(this.state);
    }
    render() {
        let allOldLabels = this.props.postsByReddit.allOldLabel;
        return (
            <div>

                <div className="ec-steps">
                    <div className="ec-steps-tail">
                        <div className="ec-steps-active" style={{"width": "58%"}}></div>
                    </div>
                    <ul>
                        <li className="active">
                            <div className="ec-steps-text">
                                <div className="ec-steps-num">1</div>
                                <span>同意升级新版</span>
                            </div>
                        </li>
                        <li className="active">
                            <div className="ec-steps-text">
                                <div className="ec-steps-num">2</div>
                                <span>旧标签分类整理</span>
                            </div>
                        </li>
                        <li>
                            <div className="ec-steps-text">
                                <div className="ec-steps-num">3</div>
                                <span>升级完成</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <LeftGroup componentType="oldLabel"/>
                <div className="prompt-footer">
                    <p className="prompt-btn">
                        <Button type="primary" size="large"
                                onClick={this.confirmUpdate.bind(this)}>确认升级</Button>
                        <label>
                            <Checkbox  checked={this.state.checked} onChange={this.isChecked.bind(this)}/>
                            <span>我已阅读并同意“升级须知”</span>
                        </label>
                    </p>
                    <div className="prompt-notes">
                        <h4><i className="iconfont">&#xe60b;</i>升级须知</h4>
                        <ul>
                            <li>1、您最多可以创建30个分组，200个标签，每个分组所容纳的标签数量不限；
                            </li>
                            <li>2、升级前请确保需要的旧标签已完成整理，如有未整理的旧标签，升级后将丢失；</li>
                            <li>3、新版标签将完全兼容现有旧版标签的所有功能，请放心升级；</li>
                        </ul>
                    </div>
                </div>
                
                <Modal width="440" title="升级标签" visible={this.state.oldLabelConfirm}
                       wrapClassName="vertical-center-modal" onOk={this.sureUpdate.bind(this)}
                       onCancel={this.cancelSureUpdate.bind(this)}>
                    <div>还有{allOldLabels.length}个旧标签尚未整理，如强行升级将会导致未整理的标签丢失，确定要升级吗？</div>
                </Modal>
            </div>
        )
    }
}
function mapStateToProps(state) {
    const {postsByReddit} = state;
    return {postsByReddit}
}
export default connect(mapStateToProps)(OldLabel);
// export default OldLabel