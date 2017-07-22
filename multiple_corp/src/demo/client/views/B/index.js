import React, {PropTypes} from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import './index.less'

class B extends React.Component {
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
                <Header />
                <Sidebar />
                <div>BBBBBBBBBBBBBBBBBB</div>
                <Footer />
            </div>
        );
    }
}

B.propTypes = {
    children: PropTypes.node.isRequired,
};

B.contextTypes = {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

export default B;