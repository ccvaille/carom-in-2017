import {orderChart} from './orderChart';
import {orderDetail} from './orderDetail'
import {accountNum} from './accountNum';
import {companyNum} from './companyNum'
import { combineReducers } from 'redux'

const rootReducer = {
	orderDetail,
	orderChart,
	accountNum,
	companyNum
};

export default rootReducer
