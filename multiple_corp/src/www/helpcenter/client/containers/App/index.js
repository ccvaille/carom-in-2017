import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Sidebar from '../../components/Sidebar'
import * as actionCreators from '../../actions'
import { fetchCategory } from '../../actions'
import './index.less'

class App extends Component {
  componentDidMount() {
    this.props.fetchCategory();
  }

  render() {
    const { categorys, params, location } = this.props
    return (
      <div className="main-app">
          <Sidebar categorys={ categorys } params={params} location={ location }/>
          {this.props.children}
      </div>
    )
  }
}

App.propTypes = {
  categorys: PropTypes.array.isRequired,
  fetchCategory: PropTypes.func.isRequired,
  // children: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    categorys: state.sidebar.categorys
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App)