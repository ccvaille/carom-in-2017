import React, {PropTypes} from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import './index.less'

class A extends React.Component {
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
                <div>AAAAAAAAAAAAAAAAAAAAAAA</div>
                <Footer />
            </div>
        );
    }
}

A.propTypes = {
    children: PropTypes.node.isRequired,
};

A.contextTypes = {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

export default A;