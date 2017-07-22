import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Popover, Input, Modal, Button, Checkbox, message} from 'antd'
import Message from '../Message'
import classNames from 'classnames'

import { 
	editLabelGroup,delLabelGroup,moveLabelGroup, 
	moveLabel, editLabel, swichVisible, requireEdit, delLabel, 
	delGroup, moveGroup, operateType, fetchSaveOldData,
	setLabelCtrlIndex, setInputValue
} from '../../actions/label.js'
class SmallLabel extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			ctrlFromFirstLabel: false,
			ctrlFromLastLabel: false,
			ctrlFromFirstGroup: false,
			ctrlFromLastGroup: false
		}
	}
	componentWillMount() {
		const type = this.props.postsByReddit.corpData.type;
		this.groupOperate = this.renderGroupCtrl();

		this.labelOperate = this.renderLabelCtrl();
		this.setState({
			'groupName': '',
			'labelName': '',
			'visible': false
			// "babelPoverVisbel": false
		})
	}
	// componentDidMount = () => {
 //        var container = reactDom.findDOMNode(this);
 //        dragula([container]);
 //    }
    drop = (el, target, source, sibling) => {
        // dispatch(sortGroup)
    }
	hide() {
		this.state.visible = false;
		this.setState(this.state);
	}
	//  如果需要二次确认的删除
	// showConfirmDelGroup(id, name) {
	// 	const { dispatch } = this.props;
	// 	dispatch(swichVisible(true, 'isConfirmDelGroup'));
	// 	dispatch(requireEdit({
	// 		type: 'group',
	// 		id: id,
	// 		name: name
	// 	}));
	// }
	showConfirmDelLabel(id, name) {
		const { dispatch } = this.props;
		dispatch(swichVisible(true, 'isConfirmDelLabel'));
		dispatch(requireEdit({
			type: 'label',
			id: id,
			name: name
		}));
	}
 	handleVisibleChange(visible) {
		// this.state.visibel = visibel;
		this.setState({ visible });
	}
	delGroup(id, name) {
		const {dispatch} = this.props;
		const {type} = this.props.postsByReddit.corpData;
		// let exit = !type && isExitsLabelInGroupOld(name, this.props.postsByReddit.groupList);
		// if (exit) {
		// 	Message.error('该分组中有标签，不允许删除');
		// 	return ;
		// }
		
		if (type) {
			//if 有标签删除失败会弹出框从redux里处理弹出框
			dispatch(delGroup({
				id: id,
				name: name
			}));

		} else {
			dispatch(operateType({
				type: 'DEL_GROUP_OLD',
				data: name
			}));
			fetchSaveOldData({
				gtag: this.props.postsByReddit.groupList
			});
		}
		// dispatch(swichVisible(false, 'isRightEditOrDelGroupVisble'));
	}
	delLabel(id, name) {
		const { dispatch } = this.props;
		const {type} = this.props.postsByReddit.corpData;
		if (type) {
			// dispatch(delLabel({
			// 	id: id
			// }));
			this.showConfirmDelLabel(id, name);
		} else {
			dispatch({
				type: 'DEL_LABEL_OLD',
				data: {
					id: id,
					groupName: name
				}
			})
			fetchSaveOldData({
                gtag: this.props.postsByReddit.groupList
            });
		}

	}
	moveGroup(type) {
		const {dispatch} = this.props;
		let prop = this.props.postsByReddit;
		let list = !prop.corpData.type ? prop.groupList : prop.groupList.groups;
		let oldData;
		let newData;

		if (prop.corpData.type) {
			newData = moveNewGroupFilter(this.props.labelName, list, type);
			if (!newData) return false;
			dispatch(moveGroup(newData));
		} else {
			oldData = moveOldGroupFilter(this.props.labelName, list, type);
			if (!oldData) return false;
			dispatch(operateType({
				type: 'MOVE_GROUP_OLD',
				data: oldData
            }));
			fetchSaveOldData({
                gtag: this.props.postsByReddit.groupList
            });

		}
		
	}
	moveLabel(moveType) {
		const {dispatch} = this.props;
		const {type} = this.props.postsByReddit.corpData;
		let ids = getMoveParam(moveType, this.props.index, this.props.labelList);
		if (!ids[0] || !ids[1]) { 
			return false ;
		}
		if (type) {
			dispatch(moveLabel({
				ids: [ids[0].f_class_id, ids[1].f_class_id],
				gid: ids[0].f_group_id
			}));
		} else {
			dispatch(operateType({
				type: 'MOVE_LABEL_OLD',
				data: {
					ids: [ids[0].id, ids[1].id],
					groupName: ids[0].f_group_name
				}
			}));
			fetchSaveOldData({
                gtag: this.props.postsByReddit.groupList
            });
		}
		
	}
	handleShowLabel(id, name) {
		const { dispatch } = this.props;
		dispatch(requireEdit({
			type: 'label',
			id: id,
			name: name
		}));
		dispatch(setInputValue('editLabelName', name));
		this.props.showEditLabel();
	}
	handleShowGroup(id, name) {
		const { dispatch } = this.props;
		dispatch(requireEdit({
			type: 'group',
			id: id,
			name: name
		}));
		this.props.dispatch(setInputValue('editGroupName', name));
		// dispatch(swichVisible(true, 'isEditGroupVisibel'));
		this.props.showEditGroupRight(false);
	}
 	setValue(event) {
        this.state.name = event.target.value;
        this.setState(this.state);
	}
	handleCancelLabel(type) {
		this.state[type] = false;
		this.setState(this.state);
	}
	handleCancelGroup() {
		const { dispatch } = this.props;
		dispatch(swichVisbel(true))
	}
	addLiClass(type,event) { 
		var nowClass = event.currentTarget.className;
		if (nowClass!="active") {
			event.currentTarget.className=(type=="over"?"hover":"");
			// if (type=="over") {
			// 	this.state.babelPoverVisbel = true;
			// } else {
			// 	this.state.babelPoverVisbel = false;
			// }
			// this.setState(this.state);
		}
		
	}
	setLabelCtrlIndex(e) {
		e.preventDefault();
		e.stopPropagation(); 
		this.setState({
			ctrlFromFirstLabel: this.props.index === 0,
			ctrlFromLastLabel: this.props.index === this.props.labelList.length - 1
		});
	}
	setGroupCtrlIndex() {
		this.setState({
			ctrlFromFirstGroup: this.props.index === 0,
			ctrlFromLastGroup: this.isLastGroup()
		});
	}
	//出现系统默认分组，重新判断是否为ctrlFromLastGroup
	isLastGroup = () => {
		const { dispatch } = this.props.postsByReddit;
		const { groups } = this.props.postsByReddit.groupList;
		let isLast = 0;

		groups.map((element, index, arr) => {
			if (element.f_group_id == this.props.labelId) {
				if (index == groups.length - 1) {
					isLast = 1;
				} else if (arr[index + 1] && arr[index + 1].f_isdefault) {
					isLast = 1;
				}
			}
		});
		return isLast;
	}
	renderGroupCtrl() {
		return (
			<ul className="label-control" onClick={() => this.hide()}>
				{
					!this.state.ctrlFromFirstGroup ? <li onClick={this.moveGroup.bind(this, 0)}><a href="javascript:;" ><i className="iconfont">&#xe603;</i>向上移动</a></li> : null
				}
				{
					!this.state.ctrlFromLastGroup ? <li onClick={this.moveGroup.bind(this, 1)}><a href="javascript:;" ><i className="iconfont">&#xe604;</i>向下移动</a></li> : null
				}					
				<li onClick={this.handleShowGroup.bind(this, this.props.labelId, this.props.labelName)}><a href="javascript:;" ><i className="iconfont">&#xe607;</i>修改名称</a></li>
				<li onClick={this.delGroup.bind(this, this.props.labelId, this.props.labelName)}><a href="javascript:;" ><i className="iconfont">&#xe602;</i>删除</a></li>
			</ul>
		)
	}
	renderLabelCtrl() {
		const type = this.props.postsByReddit.corpData.type;
		return (
			<ul className="label-control" onClick={ () => this.hide() }>
				{
					!this.state.ctrlFromFirstLabel ? <li onClick={this.moveLabel.bind(this, 0)}><a href="javascript:;" ><i className="iconfont">&#xe606;</i>向前移动</a></li> : null 
				}
				{
					!this.state.ctrlFromLastLabel ? <li onClick={this.moveLabel.bind(this, 1)}><a href="javascript:;" ><i className="iconfont">&#xe605;</i>向后移动</a></li> : null
				}
				{
					type ?
						<li onClick={this.handleShowLabel.bind(this, this.props.labelId, this.props.labelName)}>
							<a href="javascript:;" >
								<i className="iconfont">&#xe607;</i>修改名称
							</a>
						</li>
						: ''
				}
				<li onClick={this.delLabel.bind(this, this.props.labelId, this.props.labelName)}><a href="javascript:;" ><i className="iconfont">&#xe602;</i>删除</a></li>
			</ul>
		)
	}
	groupClick() {
		!this.props.isSelect && this.props.groupClick();
	}
	labelClick(isChecked, labelId) {
		const { dispatch } = this.props;
		dispatch({
			type: 'SWITCH_LABEL_CHECK',
			data: {
				labelId: labelId,
				isChecked: !isChecked
			}
		});
	}
  	render () {
		let fStyle = this.props.fStyle || 'c1';
		// let classString = 'iconfont doc-icon' + ' ' + fStyle;
		this.labelOperate = this.renderLabelCtrl();
		this.groupOperate = this.renderGroupCtrl();
		const isManageModal = this.props.postsByReddit.isManageModal;
		const manageModalLabels = this.props.postsByReddit.manageModalLabels;
		let isLabelChecked = false;
		manageModalLabels.map((element, index) => {
			if (element == this.props.labelId) {
				isLabelChecked = true;
			}
		})

    	return (
			<li id={"test" + this.props.labelId} 
				data-default={ this.props.fIsdefault ? 1 : '' }
				className={classNames(
					{'pop-active': !this.props.isSelect && this.state.visible},
						this.props.isSelect ? 
							 ('active ' + fStyle + (this.props.isLabel ? ' label' : ' group')) + (isManageModal ? ' manage' : '') : 
							(fStyle + (this.props.isLabel ? ' label' : ' group')) +  (isManageModal ? ' manage' : ''),
							isManageModal && isLabelChecked ? 'label-checked' : ''
					)}>
			{
				this.props.dataType =="group" ?
					<div style={{ zIndex: 2 }}>
						<div onClick={this.groupClick.bind(this)} >
							<i className="iconfont doc-icon" 
							   	dangerouslySetInnerHTML={
								   { __html: this.props.isSelect && fStyle == 'c1' ? '&#xe613;' : '&#xe60f;'}
								}
							   style={ {'color': this.props.isSelect && fStyle == 'c1' ? '#fff' : ''} }></i>
							<span>{ this.props.labelName }</span>
						</div>
						<Popover getPopupContainer={() => document.getElementById("test" + this.props.labelId) } 
								 placement="bottomRight"  content={this.props.isLabel ? this.labelOperate : this.groupOperate} 
								 title="" trigger="click" visible={this.state.visible}
        						 onVisibleChange={this.handleVisibleChange.bind(this)}>
								<i className="iconfont label-down-icon" 
									dangerouslySetInnerHTML={
									   { __html: this.props.isSelect ? '&#xe60e;' : '&#xe608;'}
									}
									onClick={ this.setGroupCtrlIndex.bind(this) }></i>
						</Popover>
					</div>:

					(
						isManageModal ? 
							<a href="javascript:void(0);" 
								onClick={this.labelClick.bind(this, isLabelChecked, this.props.labelId)} 
								className={this.props.isActive ? 'tag-item tag-item-checbox active' : 'tag-item tag-item-checbox' }>
								<label className="ec-label-checkbox">
	                                <Checkbox checked={ isLabelChecked } />
                                </label>
								<span>{ this.props.labelName }</span>
							</a> :
							<a href="javascript:void(0);" className={this.props.isActive ? 'tag-item active' : 'tag-item' }>
								<span>{ this.props.labelName }</span>
							 	<Popover getPopupContainer={() => document.getElementById("test" + this.props.labelId) } 
								 		 placement="bottom" content={this.props.isLabel ? this.labelOperate : this.groupOperate} 
								 		 title="" trigger="click" visible={this.state.visible}
		        						 onVisibleChange={this.handleVisibleChange.bind(this)}>
									<i className="iconfont com-down-icon" 
									   onClick={ this.setLabelCtrlIndex.bind(this) }
									   dangerouslySetInnerHTML={{ __html: this.props.isSelect ? '&#xe60e;' : '&#xe608;'}}></i>
								</Popover>
							</a>
					)
			}
			</li>
    	)
  	}
}

function getMoveParam(type, index, labelList) {
	//type=0,和前面的元素交换位置，1，和后面的元素交换位置
	let ids = [];
	if (type) {
		ids[0] = labelList[index];
		if (index+1 < labelList.length ){
			ids[1] = labelList[index+1];
		} else {
			ids[1] = '';
			Message.error('当前位置不能向后移动！');
		}
	} else {
		ids[1] = labelList[index];
		if ( index-1 >= 0){
			ids[0] = labelList[index-1];
		} else {
			ids[0] = '';
			Message.error('当前位置不能向前移动！');
		}
		
	}
	return ids;
}

export function isExitsLabelInGroupOld(name, data) {
	let index;
	let exit;
	data.map(function(element, item, arr) {
		if (element.f_group_name == name) {
			index = item;
		}
	})
	if (data[index].data && data[index].data.length) {
		exit = true;
	}
	return exit;
}
//处理分组的排序问题;
function moveNewGroupFilter(name, data, type) {
	let newData;
	let ids = [];
	let sort = [];
	let index1;//当前元素的位置
	let index2;//需要交换的元素位置
	data.map(function(element, index, arr) {
		if (element.f_group_name == name) {
			index1 = index;
			return true;
		}
	});
	if (index1 == 'undefined') {
		Message.error('换位失败！');
		return false
	}
	if (!type) {
		index2 = index1-1;
		if (index2 < 0) {
			Message.error('已经不能向前面移动了！');
			return false;
		}
	} else {
		index2 = index1 + 1;
		if (index2 >= data.length) {
			Message.error('不能向后面移动！');
			return false;
		}
	}
	newData = exchangeItems(data, index1, index2);
	newData.map(function(element, index) {
		ids.push(element.f_group_id);
		sort.push(index);
	})
	return {
		sortData: {
			ids: ids,
			sort: sort
		},
		arr: newData
	};
}

//处理旧标签分组排序的问题
function moveOldGroupFilter(name, data, type) {
	let newData;
	let index1;
	let index2;

	data.map(function(element, index, arr) {
		if (element.f_group_name == name) {
			index1 = index;
			return true;
		}
	});

	if (!type) {
		index2 = index1-1;
		if (index2 < 0) {
			Message.error('已经不能向前面移动了！');
			return false;
		}
	} else {
		index2 = index1 + 1;
		if (index2 >= data.length) {
			Message.error('不能向后面移动！');
			return false;
		}
	}
	newData = exchangeItems(data, index1, index2);
	return newData
}
//交换位置
function exchangeItems(arr, index1, index2) {
	arr[index1] = arr.splice(index2, 1, arr[index1])[0];
	return arr;
};
function mapStateToProps(state) {
  const {postsByReddit } = state;
  return { postsByReddit }
}

export default connect(mapStateToProps)(SmallLabel);