import App from './App';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionTypes from '../../actions/visitorInfo'

function mapStateToProps({visitorInfo}){
    return {
        info:visitorInfo.info,
    }
}

function mapDispatchToProps(dispatch){
    return {
        visitorAction:bindActionCreators(actionTypes,dispatch),
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(App);