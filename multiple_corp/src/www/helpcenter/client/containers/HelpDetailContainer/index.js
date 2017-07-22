import React, { Component, PropTypes } from 'react'
import { Router, Route, hashHistory, Link } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actionCreators from '../../actions'
import HelpList from '../../components/HelpList'
import Feedback from '../../components/Feedback'
import Content from '../../components/Content'
import './index.less'

class HelpDetailContainer extends Component {

    componentDidMount() {
        this.props.fetchHelpDetail(this.props.location.query.kid);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.location.query.kid != nextProps.location.query.kid) {
            this.props.clearPrevState();
            this.props.fetchHelpDetail(nextProps.location.query.kid);
        }
    }

    render() {
        const { helpDetail } = this.props
        return ( 
            <div className="main-content">
                <div className = "help-related">
                    <Content helpDetail={ helpDetail } />
                    <Feedback kid={ helpDetail.f_id }/>
                    <HelpList helpList={helpDetail.about} related="true" flag={ helpDetail.flag }/>
                </div> 
            </div>
        );
    }
}

HelpDetailContainer.propTypes = {
    helpDetail: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        helpDetail: state.helpDetail
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(HelpDetailContainer)
