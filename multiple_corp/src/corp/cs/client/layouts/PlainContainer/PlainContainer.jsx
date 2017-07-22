import React, { PropTypes } from 'react';
import { withRouter } from 'react-router';
import { authErrorType } from 'constants/shared';

let loginCounter = 0;

class PlainContainer extends React.Component {
    static propTypes = {
        children: PropTypes.element.isRequired,
        simulateLogin: PropTypes.func.isRequired,
        router: PropTypes.object.isRequired,
    }

    state = {
        loginSuccess: false,
        // notActive: false,
    }

    // eslint-disable-next-line consistent-return
    componentWillMount() {
        if (window.activateStatus === '0') {
            // this.setState({
            //     notActive: true,
            // });
            this.props.router.replace('/kf/index/notactive');
            // window.location.href = '/kf/index/notactive';
        }
    }

    componentDidMount() {
        this.props.simulateLogin().then(this.handleAfterLogin);
    }

    handleAfterLogin = ({ ok, reason }) => {
        if (!ok && reason === authErrorType.sessionError) {
            if (loginCounter < 3) {
                this.props.simulateLogin().then(this.handleAfterLogin);
                loginCounter += 1;
            }
        } else if (ok) {
            this.setState({
                loginSuccess: true,
            });
        }
    }

    render() {
        // let child = null;
        // if (this.state.notActive) {
        //     child = (
        //         <NotActivePage />
        //     );
        // } else if (this.state.loginSuccess) {
        //     child = this.props.children;
        // }
        return (
            <div>
                {
                    this.state.loginSuccess
                    ?
                    this.props.children
                    : null
                }
            </div>
        );
    }
}

export default withRouter(PlainContainer);
