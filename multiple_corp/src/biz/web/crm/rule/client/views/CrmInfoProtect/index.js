import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CrmInfoProtect from './CrmInfoProtect';
import * as actions from 'actions/crminfoActions';

function mapStateToProps(state) {
    return {
        ...state.crminfoReducer
    }
}

function mapDispatchToProps(dispach) {
    return {
        crminfoActions: bindActionCreators(actions, dispach),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CrmInfoProtect);
