import React, { PropTypes } from 'react';

function resizableElemHOC(WrappedComponent, passDelta) {
    return class resizableElem extends React.Component {
        static propTypes = {
            style: PropTypes.object,
            delta: PropTypes.number,
        }

        static defaultProps = {
            style: null,
            delta: 0,
        }

        state = {
            height: window.innerHeight - passDelta,
        }

        componentDidMount() {
            window.addEventListener('resize', this.onResize);
        }

        componentDidUpdate(prevProps) {
            if (this.props.delta !== prevProps.delta) {
                this.onResize();
            }
        }

        componentWillUnmount() {
            window.removeEventListener('resize', this.onResize);
        }

        onResize = () => {
            this.setState({
                height: window.innerHeight - passDelta - this.props.delta,
            });
        }

        render() {
            const { delta, ...cloneProps } = this.props;
            const style = {
                ...this.props.style,
                height: this.state.height,
            };
            return (
                <WrappedComponent {...cloneProps} style={style} />
            );
        }
    };
}

export default resizableElemHOC;
