import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CrmStage from './CrmStage';
import * as actions from 'actions/crmstageActions';

function mapStateToProps(state) {
    return {
        ...state.crmstageReducer
    }
}

function mapDispatchToProps(dispach) {
    return {
        crmstageActions: bindActionCreators(actions, dispach),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CrmStage);
