// import {
// 	Switch_Category,
// 	Switch_Radio,
// 	Switch_Scecond_Category
// } from '../actions';

// const initialState = {
// 	index: 0,
// 	activeIndex: 0,
// 	radioChecked: 0,
// 	radioSuccess: false,
// 	category: {},
// 	helpList: {},
// 	pages: 0
// }

// function rootReducer(state = {}, action) {
// 	const newState = Object.assign({}, initialState, state);
// 	switch (action.type) {
// 		case Switch_Categoty:
// 			newState.index = action.index;
// 			break;
// 		case Switch_Scecond_Category:
// 			newState.activeIndex = action.activeIndex;
// 			break;
// 		case Switch_Radio:
// 			newState.radioChecked = active.radioChecked;
// 			break;
// 	}
// 	return newState;
// }

import sidebar from './sidebar';
import helpList from './helpList';
import helpDetail from './helpDetail';
import feedback from './feedback';

export default {
	sidebar,
    helpList,
    helpDetail,
    feedback,
};