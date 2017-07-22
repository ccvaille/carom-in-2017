import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CustomEarlyWarn from './CustomEarlyWarn';
import * as actions from 'actions/loseruleActions';

function mapStateToProps(state) {
    return {
        ...state.loseruleReducer
    }
}

function mapDispatchToProps(dispach) {
    return {
        ruleActions: bindActionCreators(actions, dispach),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(CustomEarlyWarn);
