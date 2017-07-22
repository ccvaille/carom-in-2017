
import { combineReducers } from 'redux';
import { message } from 'antd';
import Message from '../components/Message'
import { 
	GETCORP_STATUS,GETGROUP_LIST,
	GETLABEL,
	ADDLABELGROUP,
	EDIT_GROUP,
	DEL_GROUP,
	ADD_LABEL,
	ADD_GROUP,
	MOVE_LABEL,
	SWICH_VISIBLE,
	EDIT_LABEL,
	STORAGE_REQUIRE_EDIT,
	FETCH_PEND,
	FETCH_COMPLETE,
	DEL_LABEL,
	MOVE_GROUP,
	GET_ACTIVE_LABEL,
	GET_TMP_OLDDATA,
	CREATE_GROUP_OLD,
	MOVE_GROUP_OLD,
	EDIT_GROUP_OLD,
	DEL_GROUP_OLD,
	ALL_Old_LABEL,
	OLDLABLE_TO_GROUP,
	GET_ACTIVE_OLDLABEL,
	MOVE_LABEL_OLD,
	DEL_LABEL_OLD ,
	AGREE_MULTI_CHOICE,
	SELECT_COLOR,
	SET_SELECT_GROUPNAME,
 	SET_SELECT_LABELNAME,
 	SET_LABEL_CTRL_INDEX,
 	SET_INPUT_VALUE,
 	SET_GROUP

} from '../actions/label.js';

const initialState = {
	corpData:{
		step: 0,
		type: '' 
	},
	groupList:[],
	saveStatus:200,
	currentLabels: [],	//当前需要显示的标签
	isPosting: false,	//请求是否在发送中
	isNewLabelVisible: false,	//创建标签弹窗显示
	isNewGroupVisble: false,	//创建分组弹窗显示
	isEditLabelVisibel: false,	//更改标签名弹窗显示
	isEditGroupVisibel: false,  //更改分组名弹窗显示
	isSetGroupVisible: false, //设置分组弹窗显示
	selectGroupName:'',
	selectLabelName: '',
	allOldLabel: [],  //所有的旧标签
	isColorVisible: false, //颜色弹窗是否显示
	isAgreeManyChecked: false,//是否允许多选
	isRightEditOrDelGroupVisble: false, //右侧的修改分组，删除分组是否显示
	isConfirmDelGroup: false,
	isConfirmDelLabel: false,
	isConfirmDelLabels: false,
	isFirst: false, //是否是列表第一个元素
	isLast: false, //是否是列表最后一个元素
	labelNum: 0, //新标签记录数量
	selectGroupOrLabel: {
		
	},
	inputValues	: {},
	leftWarn: {},
	delGroupVisible: false,
	loadComponent: false,
	isWelcome: false,
	isManageModal: false, //是否是批量管理模式
	manageModalLabels: [],
	setGroupWarn: '',
	setGroupName: '',
	isConfirmMultiDelLabel: false,//批量删除标签
	isShowGuide: false
}

function exchangeLabelPosition(currentLabel, data) {
	let labelList = currentLabel;
	let index_exf;
	let index_exe;
	let ids = data.ids;
	labelList.map(function(element, index) {
		if (element.f_class_id == ids[0]) {
			index_exf = index;
		}
		if (element.f_class_id == ids[1]) {
			index_exe = index;
		}
	});
	labelList[index_exf] = labelList.splice(index_exe, 1, labelList[index_exf])[0];
	return currentLabel;
}

function changeLabelName(currentLabel, data) {
	let labelList = currentLabel;
	labelList.map(function(element, index) {
		if (element.f_class_id == data.id) {
			element.f_class_name = data.name;
			return true;
		}
	});
	return currentLabel;
}

function changeGrouplName(group, data) {
	let groupList = group.groups;
	groupList.map(function(element, index) {
		if (element.f_group_id == data.id) {
			element.f_group_name = data.name;
			return true;
		}
	});
	return group;
}

function delLabel(currentLabel, data) {
	let labelList = currentLabel;
	labelList.map(function(element, index, arr) {
		if (element.f_class_id == data.id) {
			arr.splice(index, 1);
			return true;
		}
	});
	return currentLabel;
}

function delGroup(group, data) {
	let groupList = group.groups;
	groupList.map(function(element, index, arr)	 {
		if (element.f_group_id == data.id) {
			arr.splice(index, 1);
		}
	})
}

function getCurrentOldLabel(data, groupName) {
	let groupIndex = 0;
	if (data && data.length) {
		data.map(function(element, index, arr) {
			if (element.f_group_name == groupName) {
				groupIndex = index;
			}
		});
		return data[groupIndex].data
	} else {
		return [];
	}
}

function createOldGroup(data, groupList) {
	let obj = {};
	let isChongming = false;
	obj.f_group_id = '0',
	obj.f_group_name = data.trim();
	obj.f_style = data.f_style || 'c1';
	obj.f_ismore = data.f_ismore;
	obj.f_sort = groupList.length + 1;
	obj.data = [];
	groupList.map(function(element, index, arr) {
		if (element.f_group_name == obj.f_group_name) {
			isChongming = true;
			Message.error('已有该分组，创建失败');
		}
	});
	if (isChongming) return false;
	return obj;
}

function editOldGroupName(data, groupList) {
	groupList.map(function(element, index, arr) {
		if (element.f_group_name == data.preName) {
			element.f_group_name = data.name
		}
	})
}
function delOldGroup(data, groupList, newState) {
	groupList.map(function(element, index, arr){
		if (element.f_group_name == data) {
			newState.allOldLabel = newState.allOldLabel.concat(element.data);
			arr.splice(index, 1);
			if (element.f_group_name == newState.selectGroupName) {
				newState.selectGroupName = newState.groupList[0] ? newState.groupList[0].f_group_name : '';
				newState.currentLabels = newState.groupList[0] ? getCurrentOldLabel(newState.groupList, newState.selectGroupName) : [];
			}
		}
	});
}

function setLabelToGroup(data, groupList, allOldLabel) {
	let groupIndex;
	let labelIndex;
	let activeOldLabels = [];
	groupList.map(function(element, index, arr) {
		if (element.f_group_name == data.groupName) {
			groupIndex = index;
		}
	})
	allOldLabel.map(function(element, index, arr) {
		if (element.id == data.id) {
			labelIndex = index;
		}
	})
	allOldLabel[labelIndex].f_group_name = groupList[groupIndex].f_group_name;
	groupList[groupIndex].data.push(allOldLabel[labelIndex]);
	allOldLabel.splice(labelIndex, 1);

}

function moveOldLabel(data, labelList, groupList) {
	let index_exf;
	let index_exe;
	let ids = data.ids;
	let groupName = data.groupName;
	labelList.map(function(element, index) {
		if (element.id == ids[0]) {
			index_exf = index;
		}
		if (element.id == ids[1]) {
			index_exe = index;
		}
	});
	labelList[index_exf] = labelList.splice(index_exe, 1, labelList[index_exf])[0];
	groupList.map(function(element, index, arr) {
		if (element.f_group_name == groupName) {
			arr[index].data = labelList;
		}
	});
	
}

function delOldLabel(data, labelList, groupList, allOldLabel) {
	labelList.map(function(element, index) {
		if (element.id == data.id) {
			allOldLabel.push(element);//将删除的数据返回allOldLabe
			labelList.splice(index, 1); //当前显示labelList删除该元素
		}
	});
	
	groupList.map(function(element, index) { //已分配的分组数据中删除此元素
		if (element.f_group_name == data.groupName) {
			element.data = labelList;
		}
	});
	

}

function agreeMultiChoiceOld(data, groupList) {
	groupList.map(function(element, index) { //设置就标签分组是否多选
		if (element.f_group_name == data.groupName) {
			element.f_ismore = data.multi
		}
	});
}

function agreeMultiChoice(data, groupList) {
	groupList.map(function(element, index) { //设置标签分组是否多选
		if (element.f_group_id == data.id) {
			element.f_ismore = data.multi
		}
	});
}

function selectColor(data, groupList) {
	groupList.map(function(element, index) { //设置该分组颜色f_style
		if (element.f_group_id == data.id) {
			element.f_style = data.color
		}
	});
}
function switchLabelCheck(data, manageModalLabels) {
	let isChecked = data.isChecked;
	if (isChecked) {
		manageModalLabels.push(data.labelId);
	} else {
		manageModalLabels.map((element, index, arr) => {
			if (element == data.labelId) {
				arr.splice(index, 1);
			}
		});
	}
}
// 得到当前的排序currentLabel的排序
function getCurrentLabelorGroupSort(data, List, type) {
		let nowIndex;
		let prevIndex;
		let target = target;

		List.map((element, index) => {
			let id = type === 'group' ? element.f_group_id : element.f_class_id;
			if (data[1] === '') {
				nowIndex = List.length;
			} else if (id == data[1]) {
				nowIndex = index;
			}
			if (id == data[0]) {
				prevIndex = index;
				target = element;
			}
		});
		if (nowIndex === List.length) {
			nowIndex = List.length - 1;
		} else {
			nowIndex = prevIndex > nowIndex ? nowIndex : nowIndex - 1;
		}
		
	//
	List.splice(prevIndex, 1);
	List.splice(nowIndex, 0, target);
}
//批量删除
function multiDelLabel(currentLabel, checkedLabel, data) {
	checkedLabel = [];
	
	data.ids.map((item, i) => {
		currentLabel.map((element, j, arr) => {
			if (element.f_class_id == item) {
				currentLabel.splice(j, 1);
				return false;
			}
		})
	});

	
}
//批量设置
function multiSetGroup(currentLabel, checkedLabel) {
	checkedLabel.map((item, i) => {
		currentLabel.map((element, j, arr) => {
			if (element.f_class_id == item) {
				currentLabel.splice(j, 1);
				return false;
			}
		})
	});
	// manageModalLabels = [];
}
//废弃、接收到、开始接受新闻后，将state.postsByReddit设为相关参数
function postsByReddit(state = {}, action) {
	const newState = Object.assign({},initialState, state);
	switch (action.type) {
		case GETCORP_STATUS:
			newState.corpData = action.posts || [];
			break;
		case GETGROUP_LIST:
			newState.groupList = action.list || [];
			newState.labelNum = action.list.tag_num;
			newState.isShowGuide = action.list.show_guide;
			// newState.currentLabels = (action.list && action.list.groups.length>0) ? [action.list.groups[0]] : [];
			break;
		case GET_ACTIVE_LABEL:
			newState.currentLabels = action.data.tags;
			break;
		//多选重置状态
		case 'CANCEL_MULTI':
			newState.isAgreeManyChecked = action.data;
			break;
		//浮层显示
		case SWICH_VISIBLE:
			newState[action.key] = action.isVisibel;
			if (!action.isVisibel) {
				newState.isPosting = false;
			}
			break;
		//添加标签
		case ADD_LABEL:
			newState.currentLabels.push(action.data);
			newState.labelNum++;
			break;
		//请求正在发送
		case FETCH_PEND:
			newState.isPosting = true;
			break;
		//请求发送完成
		case FETCH_COMPLETE:
			newState[action.data.type] = false;
			newState.isPosting = false;
			break;
		//移动标签
		case MOVE_LABEL:
			newState.currentLabels = exchangeLabelPosition(newState.currentLabels, action.data);
			break;
		//标签编辑
		case EDIT_LABEL:
			newState.currentLabels = changeLabelName(newState.currentLabels, action.data);
			break;
		//标签删除
		case DEL_LABEL:
			newState.currentLabels = delLabel(newState.currentLabels, action.data);
			newState.labelNum--;
			break;
		//创建分组
		case ADD_GROUP:
			newState.groupList.groups.push(action.data);
			newState.selectGroupName = action.data.f_group_name;
			newState.currentLabels = [];
			break;
		//分组编辑
		case EDIT_GROUP:
			newState.groupList = changeGrouplName(newState.groupList, action.data);
			newState.saveStatus = action.code || 200;
			break;
		//分组删除
		case DEL_GROUP:
			delGroup(newState.groupList, action.data);
			// newState.currentLabels = [];
			if (newState.selectGroupName == action.data.name) {
				newState.currentLabels = [];
			}
			break;
		//分组移动
		case MOVE_GROUP:
			newState.groupList.groups = action.data;
			break;
		//需要编辑的
		case STORAGE_REQUIRE_EDIT:
			newState.selectGroupOrLabel.name = action.data.name;
			newState.selectGroupOrLabel.id = action.data.id;
			break;
		//获取旧标签已分配的分组和label信息
		case GET_TMP_OLDDATA:
			newState.groupList = action.data.data;
			newState.allOldLabel = action.data.tags;
			newState.currentLabels = getCurrentOldLabel(newState.groupList);
			break;
		//对旧标签的操作
		//创建旧标签的分组
		case CREATE_GROUP_OLD:
			let newGroup = createOldGroup(action.data, newState.groupList);
			if (!newGroup) {
				newState.isNewGroupVisble = false;
				newState.leftWarn.showCreateGroupTip = -3,
                newState.leftWarn.createGroupTipText = '标签分组名不能重复';
			} else {
				newState.groupList.push(newGroup);
				newState.selectGroupName = newGroup.f_group_name;
				newState.currentLabels = [];
			}
			break;
			
		//移动分组
		case MOVE_GROUP_OLD:
			newState.groupList = action.data;
			break;
		//编辑旧标签分组
		case EDIT_GROUP_OLD:
			editOldGroupName(action.data, newState.groupList);
			break;
		//删除旧标签分组
		case DEL_GROUP_OLD:
			delOldGroup(action.data, newState.groupList, newState);
			// newState.currentLabels = [];
			break;
		//获取所有的旧标签
		case ALL_Old_LABEL:
			newState.allOldLabel = action.data;
			break;
		//分配旧标签到创建的分组下
		case OLDLABLE_TO_GROUP:
			setLabelToGroup(action.data, newState.groupList, newState.allOldLabel);
			newState.currentLabels  = getCurrentOldLabel(newState.groupList, action.data.groupName)
			break;
		//获取active分组下的label
		case GET_ACTIVE_OLDLABEL:
			newState.currentLabels = getCurrentOldLabel(newState.groupList, action.data); 
			break;
		//移动旧标签
		case MOVE_LABEL_OLD:
			moveOldLabel(action.data, newState.currentLabels, newState.groupList);
			break;
		case DEL_LABEL_OLD:
			delOldLabel(action.data, newState.currentLabels, newState.groupList, newState.allOldLabel);
			break;
		case 'AGREE_MULTI_CHOICE_OLD':
			agreeMultiChoiceOld(action.data, newState.groupList);
			break;
		case AGREE_MULTI_CHOICE:
			agreeMultiChoice(action.data, newState.groupList.groups);
			break;
		case SELECT_COLOR: 
			selectColor(action.data,  newState.groupList.groups);
			break;
		case SET_SELECT_GROUPNAME: 
			newState.selectGroupName = action.selectGroupName;
			break;
		case SET_SELECT_LABELNAME:
			newState.selectLabelName = action.selectLabelName;
			break;
		// case SET_LABEL_CTRL_INDEX:
		// 	newState.ctrlFromFirstLabel = false;
		// 	newState.ctrlFromLastLabel = false;
		// 	break;
		case SET_INPUT_VALUE:
			newState.inputValues[action.name] = action.value;
			break;
		case 'CHANGE_LEFT_WARN': 
			for (let prop in action.data) {
				newState.leftWarn[prop] = action.data[prop];
			}
			break;
		case 'DELGROUP_MODAL':
			newState.delGroupVisible = action.data;
			break;
		case 'LOAD_COMPONENT':
			newState.loadComponent = action.data;
			break;
		case 'GUIDE_WELCOME':
			newState.isWelcome = action.data;
			break;
		case 'SWITCH_LABEL_CHECK':
			switchLabelCheck(action.data, newState.manageModalLabels);
			break;
		case 'SWITCH_MANAGEMODAL':
			newState.isManageModal = action.data;
			newState.manageModalLabels = [];
			break;
		case 'SET_GROUP_WARN':
			newState.setGroupWarn = action.data;
			break;
		case 'GET_SETGROUPNAME':
			newState.setGroupName = action.data;
			break;
		//拖拽
		case 'START_DROP':
			if (action.data.dragType === 'label') {
				getCurrentLabelorGroupSort(action.data.ids, newState.currentLabels, 'label');
			} else {
				getCurrentLabelorGroupSort(action.data.ids, newState.groupList.groups, 'group');
			}
			break;
		//批量管理
		case 'MULTI_DEL_LABEL':
			multiDelLabel(newState.currentLabels, newState.manageModalLabels, action.data);
			newState.manageModalLabels = [];
			break;
		case 'SET_GROUP':
			multiSetGroup(newState.currentLabels, newState.manageModalLabels);
			newState.manageModalLabels = [];
			break;

	}	

  return newState;
}
//将两个reducer合并成一个reducer,也就将全局的state加上postsByReddit,selectedReddit两个属性，每个属性都有自己的state
// const rootReducer = combineReducers({
//   	postsByReddit
// })

export default {
	postsByReddit,
}
