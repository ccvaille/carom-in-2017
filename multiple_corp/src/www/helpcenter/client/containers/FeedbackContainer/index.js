import React, { Component } from 'react'
import './index.less'
class FeedbackContainer extends Component {

  render() {
    return (
      <div className="main-content">
        <iframe id="feed-iframe" src="https://www.workec.com/feedback?version=new" width="688" height="1302"></iframe>
      </div>
    )
  }
}


export default FeedbackContainer