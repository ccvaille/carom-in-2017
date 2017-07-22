import React, { PropTypes } from 'react';
import { getWindowHeight, getWindowWidth } from '~comm/utils';
import MainLayout from '~siteComm/components/MainLayout';
import Footer from '~siteComm/components/Footer';
import Nav from 'components/Nav';

const normalHeaderHeight = 72;
const smallHeaderHeight = 40;
const footerHeight = 40;

class MainContainer extends React.Component {
    static propTypes = {
        children: PropTypes.element.isRequired,
    }

    state = {
        height: 768,
    }

    componentDidMount() {
        window.addEventListener('resize', this.onHeightChange);
        this.onHeightChange();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onHeightChange);
    }

    onHeightChange = () => {
        const windowHeight = getWindowHeight();
        const windowWidth = getWindowWidth();
        const minusHeight = windowWidth > 1024 ? normalHeaderHeight : smallHeaderHeight;
        this.setState({
            height: windowHeight < 768 ? 696 : windowHeight - minusHeight - footerHeight,
        });
    }

    render() {
        return (
            <MainLayout>
                <Nav />
                <div className="container" style={{ height: this.state.height }}>
                    <div className="main-content">
                        <div className="content">
                            {this.props.children}
                        </div>
                    </div>
                </div>
                <Footer />
            </MainLayout>
        );
    }
}

export default MainContainer;
