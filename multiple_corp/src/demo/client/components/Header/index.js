import React, {PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import './index.less'


class Header extends React.Component {
    componentWillMount() {

    }

    render() {
        return (
            <div className="header">
                header
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const {demo} = state;
    return {demo}
};

export default connect(mapStateToProps)(Header)



