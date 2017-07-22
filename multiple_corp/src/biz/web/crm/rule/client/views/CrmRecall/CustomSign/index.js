import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CustomSign from './CustomSign';
import {loadSignTabs,changeCheckedSigns} from 'actions/loseruleActions';


function mapStateToProps(state){
    return {
        ...state.loseruleReducer
    }
}
function mapDispatchToProps(dispatch){
    return {
        ruleAction:bindActionCreators({loadSignTabs,changeCheckedSigns},dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(CustomSign);
