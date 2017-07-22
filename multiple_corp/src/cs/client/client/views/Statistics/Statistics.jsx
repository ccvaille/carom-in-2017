import React, { PropTypes } from 'react';
import { withRouter } from 'react-router';
import SideMenu from './components/SideMenu';
import './statistics.less';

class Statistics extends React.Component {
    static propTypes = {
        // eslint-disable-next-line react/require-default-props
        children: PropTypes.element,
        routes: PropTypes.array.isRequired,
    }

    state = {
        activeRoute: 'overview',
    }

    componentWillMount() {
        const { routes } = this.props;
        const activeRoute = routes[routes.length - 1].path;

        this.setState({
            activeRoute,
        });
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        const { routes } = this.props;
        const { routes: nextRoutes } = nextProps;
        const currentActive = routes[routes.length - 1].path;
        const nextActive = nextRoutes[nextRoutes.length - 1].path;
        if (nextActive !== currentActive) {
            this.setState({
                activeRoute: nextActive,
            });
        }
    }

    render() {
        return (
            <div className="cs-statistics">
                <div
                    className="menu"
                >
                    <SideMenu activeRoute={this.state.activeRoute} />
                </div>

                <div className="statistics-content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default withRouter(Statistics);
