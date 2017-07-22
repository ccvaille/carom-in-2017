import React, {Component, PropTypes} from 'react'
import './index.less'
import {connect} from 'react-redux'

import Tab from '../../components/Tab'

export default class AddModal  extends Component {
  constructor(props) {
    super(props)
  }

  static propTypes = {}
  
  render () {
    return (
      <div className="add-modal-wrapper">
        <Tab  />
      </div>
    )
  }
}
