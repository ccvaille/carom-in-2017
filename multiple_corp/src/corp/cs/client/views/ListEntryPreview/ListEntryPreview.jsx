import React, { PropTypes } from 'react';
import classNames from 'classnames';
import shortid from 'shortid';
import { Icon } from 'antd';
import locale from '../../locale';
import './list-entry-preview.less';

class ListEntryPreview extends React.Component {
    static propTypes = {
        listTheme: PropTypes.number.isRequired,
        systemThemeNumber: PropTypes.number.isRequired,
        groupTextColor: PropTypes.string.isRequired,
        listBackground: PropTypes.string.isRequired,
        customerServices: PropTypes.array.isRequired,
        onSwitchListMode: PropTypes.func.isRequired,
        localeKey: PropTypes.string.isRequired,
    }

    state = {
        expandList: [],
    }

    toggleExpandCs = (i) => {
        const index = this.state.expandList.indexOf(i);
        if (index !== -1) {
            const copyList = JSON.parse(JSON.stringify(this.state.expandList));
            copyList.splice(index, 1);
            this.setState({
                expandList: copyList,
            });
        } else {
            this.setState({
                expandList: this.state.expandList.concat([i]),
            });
        }
    }

    renderPreviewNode = () => {
        const {
            listTheme,
            systemThemeNumber,
            groupTextColor,
            listBackground,
            customerServices,
            localeKey,
        } = this.props;

        const customArrowStyle = {
            borderLeft: `5px solid ${groupTextColor}`,
        };

        const groupNodes = customerServices.map((group, i) => {
            const csNodes = group.data.map(p => (
                <li key={shortid.generate()} className="customer-service clearfix">
                    {
                        listTheme === -1
                        ?
                            <span className="service-icon icon icon-customer-service-two" />
                        : null
                    }
                    {
                        listTheme === -1
                        ?
                            <a>{p.showname}</a>
                        :
                            <a style={{ color: groupTextColor }}>{p.showname}</a>
                    }

                </li>
            ));

            const csListClasses = classNames({
                services: true,
            });

            const arrowClasses = classNames({
                'group-arrow': true,
                expand: this.state.expandList.indexOf(i) !== -1,
            });

            const groupClasses = classNames({
                'cs-group': true,
                'cs-hidden': this.state.expandList.indexOf(i) === -1,
            });

            return (
                <li key={shortid.generate()} className={groupClasses}>
                    <a
                        role="button"
                        tabIndex="-2"
                        style={
                            listTheme === 0
                            ?
                            {
                                color: groupTextColor,
                            }
                            : null
                        }
                        onClick={() => this.toggleExpandCs(i)}
                    >
                        <span
                            className={arrowClasses}
                            style={
                                listTheme === 0
                                ?
                                customArrowStyle
                                : null
                            }
                        />
                        <span
                            style={listTheme === 0 ? { color: groupTextColor } : null}
                        >
                            {group.name}
                        </span>
                    </a>
                    <ul className={csListClasses}>
                        {csNodes}
                    </ul>
                </li>
            );
        });

        const entryPreviewClasses = classNames({
            'list-entry-preview': true,
            default: listTheme === -1 && systemThemeNumber === 1,
            'cyan-blue': listTheme === -1 && systemThemeNumber === 2,
            'dark-green': listTheme === -1 && systemThemeNumber === 3,
            orange: listTheme === -1 && systemThemeNumber === 4,
            'jade-green': listTheme === -1 && systemThemeNumber === 5,
            'theme-custom': listTheme === 0,
        });

        const groupsClasses = classNames({
            'cs-groups': true,
            'theme-system': listTheme === -1 && systemThemeNumber !== 1,
            default: listTheme === -1 && systemThemeNumber === 1,
            'cyan-blue': listTheme === -1 && systemThemeNumber === 2,
            'dark-green': listTheme === -1 && systemThemeNumber === 3,
            orange: listTheme === -1 && systemThemeNumber === 4,
            'jade-green': listTheme === -1 && systemThemeNumber === 5,
            'theme-custom': listTheme === 0,
        });

        switch (listTheme) {
            case -1:
                return (
                    <div className={entryPreviewClasses}>
                        <div
                            className="entry-head clearfix"
                        >
                            <span>{locale[localeKey].listTitle}</span>
                            <Icon type="close" onClick={() => this.props.onSwitchListMode(1)} />
                        </div>
                        <ul
                            className={groupsClasses}
                        >
                            {groupNodes}
                        </ul>
                    </div>
                );
            case 0:
                return (
                    <div
                        className={entryPreviewClasses}
                        style={{
                            background: `url(${listBackground}) 50% 50% / cover no-repeat`,
                        }}
                    >
                        <div
                            className="entry-head clearfix"
                        >
                            <span
                                style={{ color: groupTextColor }}
                            >
                                {locale[localeKey].listTitle}
                            </span>
                            <Icon
                                type="close"
                                onClick={() => this.props.onSwitchListMode(1)}
                                style={{
                                    color: groupTextColor,
                                }}
                            />
                        </div>
                        <ul
                            className={groupsClasses}
                        >
                            {groupNodes}
                        </ul>
                    </div>
                );
            default:
                break;
        }

        return null;
    }

    render() {
        const previewNode = this.renderPreviewNode();
        return previewNode;
    }
}

export default ListEntryPreview;
