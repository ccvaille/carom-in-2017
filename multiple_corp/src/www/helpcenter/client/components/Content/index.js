import React, { Component, PropTypes } from 'react';
import './index.less'

class Content extends Component {
    static propTypes = {
        helpDetail: PropTypes.object.isRequired,
    }

    render() {
        const { helpDetail } = this.props;
        return (
            <div className="help-detail">
                <h2>{helpDetail.f_title}</h2>
                <div dangerouslySetInnerHTML={{__html: helpDetail.f_content}}></div>
            </div>
        )
    }
}

export default Content