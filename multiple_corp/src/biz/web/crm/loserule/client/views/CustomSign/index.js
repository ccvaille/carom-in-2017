import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CustomSign from './CustomSign';
import {loadSignTabs,changeCheckedSigns} from '../../actions';


function mapStateToProps({ datas }){
    return {
        allSignTabList:datas.allSignTabList,
        checkedSigns:datas.checkedSigns,
        signTabListLoading:datas.signTabListLoading,
    }
}
function mapDispatchToProps(dispatch){
    return {
        ruleAction:bindActionCreators({loadSignTabs,changeCheckedSigns},dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(CustomSign);
