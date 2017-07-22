import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import './index.less'
import './media.less'

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    render() {
        return (
            <div>
                <div className="testApp">
                    { this.props.children }
                </div>

            </div>
        );
    }
}

App.propTypes = {
    children: PropTypes.node.isRequired,
};

App.contextTypes = {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

export default App;