import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import * as actionCreators from '../../actions'
import HelpList from '../../components/HelpList'
import SearchInput from '../../components/SearchInput'
import './index.less'

class HelpListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curpage: 1
    }
  }

  componentDidMount() {
    if (JSON.stringify(this.props.location.query) == "{}") {
      this.props.fetchLists();
    } else {
      this.props.fetchLists({...this.props.location.query})
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.query !== this.props.location.query) {
      this.props.clearPrevState();
      this.props.fetchLists({...nextProps.location.query})
    }
  }

  handleSearch = text => {
    if (text.length !== 0) {
      this.props.router.push('/tech/help?keyword=' + text)
    } else {
      this.props.router.push('/tech/help')
      this.props.fetchLists()
    }
  }

  onChange = (pageNumber) => {
      const querys = this.props.location.query;
      if(querys.keyword) {
        this.props.router.push('/tech/help?keyword=' + querys.keyword + '&page=' + pageNumber);
        return;
      }
      this.props.router.push('/tech/help?cat=' + querys.cat + '&page=' + pageNumber);
      this.props.fetchLists({...querys, page: pageNumber});
  }

  render() {
    const { helpList, location } = this.props
    return (
      <div className="main-content">
          <SearchInput onSearch={this.handleSearch}
                       placeholder="请输入关键词"/>
          <HelpList helpList={ helpList.helpinfo }  page={ helpList.page } params={ location.query } flag={ helpList.flag } onChange={ this.onChange }/>
      </div>
    )
  }
}

HelpListContainer.propTypes = {
  helpList: PropTypes.object.isRequired,
  fetchLists: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  return {
    helpList: state.helpList
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HelpListContainer))