import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'actions/loseruleActions';
import CustomRule from './CustomRule';

function mapStateToProps(state) {
    return { data: state.loseruleReducer };
}
function mapDispatchToProps(dispatch) {
    return {
        ruleActions: bindActionCreators(actions, dispatch),
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(CustomRule);
