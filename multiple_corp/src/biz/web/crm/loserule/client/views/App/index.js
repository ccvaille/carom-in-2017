import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import App from './App';
import { closeGuide } from '../../actions'

function mapStateToProps({ datas }) {
    return {
        showGuide: datas.showGuide,
        theRuleIsOpen:datas.theRuleIsOpen,
    }
}
function mapDispatchToProps(dispatch){
    return {
        actions:bindActionCreators({closeGuide},dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
