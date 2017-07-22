import React, {Component, PropTypes}  from 'react'
import {Row, Col, Icon, Menu, Dropdown, Button, Checkbox, Radio, Popover, Modal} from 'antd'
import './index.less'
import LabelSetup from '../Label/labelSetup';
import NewLabel from '../../components/Label/newLabel';
import OldLabel from '../../components/Label/oldLabel';
import smalLabel from '../../components/Label/smalLabel';
import {selectReddit, fetchPostsIfNeeded, invalidateReddit, fetchCorpStatus, getGroupList, setStep} from '../../actions/label.js'
import {connect} from 'react-redux'

const content = (
    <ul className="where-to-see">
        <li>
            <p><i></i>通过创建客户、客户资料窗口为客户打上公司已事先定义好的标签，可以更直观地展示一些标准化后的客户属性，有助于帮助销售员快速定位客户类型。</p>
            <img src={ecbiz.cdn + 'comm/public/images/where-a.png'} alt=""/>
        </li>
        <li>
            <p><i></i>借助客户标签，可以在“我的客户”或“客户管理”，快速筛选出符合条件的客户，帮助销售员作出一些批量的操作，例如：添加销售计划、发送邮件等操作，挖掘客户不再是难事。</p>
            <img src={ecbiz.cdn + 'comm/public/images/where-b.png'} alt=""/>
        </li>
    </ul>
);

class CrmTag extends React.Component {
    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(fetchCorpStatus());

    }

    showNewLabel() {
        const {dispatch} = this.props;
        dispatch(setStep(2));
    }

    render() {
        const {type, step} = this.props.corpData;

        // const type=0;
        return (
            <div className="new-label-container">
                <p className="new-label-tips">
                    通过标签，客服可对客户进行属性分类，以方便后续的整理和分析。
                    <i className="iconfont">&#xe60c;</i>
                    <Popover placement="bottomLeft" content={content} title="">
                        <a href="javascript:;" className="ec-link-text">在哪里能看到</a>
                    </Popover>
                </p>
                {
                    type !== '' ? ( type ?  <NewLabel /> :
                        <div>
                        {
                            step <= 1 ? <LabelSetup handleStatus={this.showNewLabel.bind(this)} /> : null
                        }
                        {
                            step > 1 ? <OldLabel /> : null
                        }
                        </div> ) : ''
                }
            </div>
        )
    }
};

CrmTag.propTypes = {
    dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    const {postsByReddit} = state;
    return postsByReddit
}
export default connect(mapStateToProps)(CrmTag);
