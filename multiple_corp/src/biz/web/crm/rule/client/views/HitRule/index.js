import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import HitRule from './HitRule';
import * as actions from 'actions/hitruleActions';

function mapStateToProps(state) {
    return {
        ...state.hitruleReducer
    }
}

function mapDispatchToProps(dispach) {
    return {
        hitruleActions: bindActionCreators(actions, dispach),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HitRule);
