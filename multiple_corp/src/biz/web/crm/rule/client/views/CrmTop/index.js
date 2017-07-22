import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CrmTop from './CrmTop';
import * as actions from 'actions/crmtopActions';

function mapStateToProps(state) {
    return {
        ...state.crmtopReducer
    }
}

function mapDispatchToProps(dispach) {
    return {
        crmtopActions: bindActionCreators(actions, dispach),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CrmTop);
