
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions';
import CustomRule from './CustomRule';

function mapStateToProps(state) {
    return { data: state.datas };
}
function mapDispatchToProps(dispatch) {
    return {
        ruleActions: bindActionCreators(actions, dispatch),
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(CustomRule);
