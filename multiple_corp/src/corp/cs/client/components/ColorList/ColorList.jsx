import React, { PropTypes } from 'react';
import classNames from 'classnames';
import shortid from 'shortid';
import './color-list.less';

class ColorList extends React.Component {
    static propTypes = {
        onColorSelected: PropTypes.func.isRequired,
        initialActive: PropTypes.string.isRequired,
        needBW: PropTypes.bool,
    }

    static defaultProps = {
        needBW: false,
    }

    constructor(props) {
        super(props);
        this.colors = [{
            name: 'cornflower-blue',
            hexCode: '#2580e6',
        }, {
            name: 'ocean-green',
            hexCode: '#48b274',
        }, {
            name: 'fire-bush',
            hexCode: '#e69e23',
        }, {
            name: 'olive-drab',
            hexCode: '#69ad2d',
        }, {
            name: 'amethyst',
            hexCode: '#9264cd',
        }, {
            name: 'havelock-blue',
            hexCode: '#588ad4',
        }, {
            name: 'carnation',
            hexCode: '#f26c63',
        }, {
            name: 'ship-cove',
            hexCode: '#7889b9',
        }];

        if (this.props.needBW) {
            this.colors.push({
                name: 'color-white',
                hexCode: '#ffffff',
            }, {
                name: 'color-black',
                hexCode: '#000000',
            });
        }

        const activeIndex = this.onInitialActiveChange(this.props.initialActive);

        this.state = {
            activeIndex,
        };
    }

    state = {
        activeIndex: 0,
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.initialActive !== this.props.initialActive) {
            const index = this.onInitialActiveChange(nextProps.initialActive);
            this.setState({
                activeIndex: index,
            });
        }
    }

    onInitialActiveChange(activeColor) {
        let activeIndex = -1;
        this.colors.forEach((color, i) => {
            if (color.hexCode === activeColor) {
                activeIndex = i;
            }
        });

        return activeIndex;
    }

    onColorSelected = (index, hexCode) => {
        this.setState({
            activeIndex: index,
        });

        this.props.onColorSelected(hexCode);
    }

    render() {
        const colorNodes = this.colors.map((color, i) => {
            const liClasses = classNames({
                'color-block': true,
                active: this.state.activeIndex === i,
            });
            return (
                <li
                    key={shortid.generate()}
                    className={liClasses}
                    onClick={() => this.onColorSelected(i, color.hexCode)}
                >
                    <span className={color.name} />
                </li>
            );
        });
        return (
            <ul className="clearfix">
                {colorNodes}
            </ul>
        );
    }
}

export default ColorList;
