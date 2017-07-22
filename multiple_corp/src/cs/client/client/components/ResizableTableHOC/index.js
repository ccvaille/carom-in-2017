import React, { PropTypes } from 'react';
import { baseTableScrollDelta } from 'constants/shared';
import { Table, Icon } from 'antd';

function resizableTableHOC(delta = baseTableScrollDelta) {
    return class resizableTable extends React.Component {
        static propTypes = {
            delta: PropTypes.number,
        }

        static defaultProps = {
            delta: 0,
        }

        state = {
            scrollHeight: window.innerHeight - delta,
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
                scrollHeight: window.innerHeight - delta - this.props.delta,
            });
        }

        render() {
            return (
                <Table
                    locale={{
                        emptyText: (<span><Icon type="exclamation-circle-o" />暂无数据</span>),
                    }}
                    {...this.props}
                    scroll={{ y: this.state.scrollHeight }}
                    bodyStyle={{ overflowY: 'auto' }}
                />
            );
        }
    };
}

export default resizableTableHOC;
