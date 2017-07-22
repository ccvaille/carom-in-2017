import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import App from './App';
import { closeGuide } from 'actions/loseruleActions'

function mapStateToProps(state) {
    return {
        showGuide: state.loseruleReducer.showGuide,
        theRuleIsOpen:state.loseruleReducer.theRuleIsOpen,
    }
}
function mapDispatchToProps(dispatch){
    return {
        actions:bindActionCreators({closeGuide},dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
