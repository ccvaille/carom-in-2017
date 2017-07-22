import { connect } from 'react-redux';

import { changeCategoryTab,clearData, changeRankSort,changePi} from '../../actions';
import CategoryTab from './CategoryTab.jsx';

const sortMap = ["callpercent", "calltime", "num", "contact", "timeaverage"];

const mapPropToType = {
    dailyData: "CHANGE_TAB_INDEX",
    historyData: "CHANGE_HISTORY_TAB_INDEX",
    employeeData: "EMPLOYEE_CHANGE_TAB"
}

const mapStateToProps = (state, ownProps) => {
    return {
        tabIndex: state[ownProps.type].tabIndex
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onClick: (index) => {
            dispatch(changeCategoryTab(index, mapPropToType[ownProps.type]));
            if(ownProps.type == "employeeData"){
                dispatch(changeRankSort(sortMap[index - 1], 'down'));
                dispatch(changePi(1));
            }
        }
    }
}

const ChangeCategoryTab = connect(
    mapStateToProps,
    mapDispatchToProps
)(CategoryTab)

export default ChangeCategoryTab;