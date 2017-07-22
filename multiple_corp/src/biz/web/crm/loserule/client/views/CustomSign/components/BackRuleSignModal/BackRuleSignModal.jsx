import React, { PropTypes } from 'react';
import { Modal, Icon } from 'antd';
import './index.less';

//客户标签选择弹层
class BackRuleSignModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openTabs: [],
            checkArray: [],
            defaultCheckArray: [],
        };
    }
    componentWillReceiveProps = (nexProps) => {
        //当弹层出现时，整理数据已选数组和默认已选数组和总数据的展示方式
        if (nexProps.visible) {
            this.state.openTabs.length = 0;
            let ob = {}, array = nexProps.tabData;
            for (let i = 0, length = array.length; i < length; i++) {
                if (!ob[array[i].id]) {
                    this.state.openTabs.push(array[i].id);
                    ob[array[i].id] = true;
                }
            }
            this.state.checkArray = [].concat(nexProps.checkedData);
            this.state.defaultCheckArray = [].concat(nexProps.checkedData);
        }
    }
    //确定事件
    onModalOk = () => {
        this.props.onOk(this.state.checkArray);
    }
    //取消事件
    onModalCancle = () => {
        this.props.onCancle();
    }
    //根据ID创建展开收回回调函数
    makeExpandHandle(id) {
        return () => {
            let isOpened = false;
            let openTabs = this.state.openTabs.filter(item => {
                if (id === item) { isOpened = true; return false; }
                return true;
            });
            if (!isOpened) openTabs.push(id);
            this.setState({
                openTabs,
            })
        }
    }
    //判断此组标签是否为展开
    isOpen = (id) => {
        for (let i = 0, length = this.state.openTabs.length; i < length; i++) {
            if (id === this.state.openTabs[i]) return true;
        }
        return false;
    }
    //判断此标签是否为选中
    isChecked = (id) => {
        for (let i = 0, length = this.state.checkArray.length; i < length; i++) {
            let item = this.state.checkArray[i];
            if (id === item.id) return true;
        }
    }
    //判断此标签是否已经选中
    isAlreadyChecked = (id) => {
        for (let i = 0, length = this.state.defaultCheckArray.length; i < length; i++) {
            let item = this.state.defaultCheckArray[i];
            if (id == item.id) return true;
        }
    }
    //判断此组标签是否全部选中
    isGroupAllChecked = (tags) => {
        let tagCount = 0;
        for (let i = 0, length = this.state.defaultCheckArray.length; i < length; i++) {
            let item = this.state.defaultCheckArray[i];
            for (let j = 0, len = tags.length; j < len; j++) {
                if (item.id == tags[j].id) tagCount++;
            }
        }
        return tagCount === tags.length;
    }
    //选择标签
    checkItem(item, style, group_id) {
        return () => {
            let canPush = true, array = this.state.checkArray;
            for (let i = 0, length = array.length; i < length; i++) {
                if (item.id === array[i].id) {
                    canPush = false;
                    break;
                }
            }
            if (canPush) {
                array.push({
                    ...item,
                    style,
                    group_id,
                })
                this.setState({
                    checkArray: array,
                })
            }
        }
    }
    render() {
        let listView = this.props.tabData.map((item) => {
            //通过是否含有tags来判断新老标签
            if (item.tags) {
                if (item.tags.length <= 0 || this.isGroupAllChecked(item.tags)) return null;//已选不展示
                return <li className={'back-rule-signitem selected ' + item.style} key={item.id}>
                    <p className="signitem-title">
                        <span className="signitem-name">{item.name}</span>
                        <span className="signitem-expand" onClick={this.makeExpandHandle(item.id)}>
                            {this.isOpen(item.id) ? '收起' : '展开'}
                        </span>
                    </p>
                    <ul className="signitem-subitem-list" style={{ display: this.isOpen(item.id) ? 'block' : 'none' }}>
                        {
                            item.tags.map((tag) => {
                                if (this.isAlreadyChecked(tag.id)) return null;
                                return <li key={tag.id} onClick={this.checkItem(tag, item.style, item.id)}>
                                    <p className={this.isChecked(tag.id) ? 'checked' : null}>{tag.name}</p>
                                </li>;
                            })
                        }
                    </ul>
                </li>
            } else {
                if (this.isAlreadyChecked(item.id)) return null;
                return <li key={item.id} onClick={this.checkItem(item, '', null)} className="signitem-single-item">
                    <p className={this.isChecked(item.id) ? 'checked' : null}>{item.name}</p>
                </li>
            };
        });
        listView = listView.filter((item) => (item != null));
        return (
            <Modal title="请选择标签"
                onOk={this.onModalOk}
                onCancel={this.onModalCancle}
                visible={this.props.visible}
                width={450}
                wrapClassName="gray-foot-modal vertical-center-modal">
                <p style={{ display: listView.length > 0 ? 'none' : 'block' }} className="back-sign-loading">
                    {
                        this.props.isLoading ? <Icon type="loading" /> : '没有可选择的标签'
                    }
                </p>
                <ul className="back-rule-signlist ec--tr-tag" style={{ display: this.props.tabData.length > 0 ? 'block' : 'none' }}>
                    {listView}
                </ul>
            </Modal>
        );
    }
}

export default BackRuleSignModal;
