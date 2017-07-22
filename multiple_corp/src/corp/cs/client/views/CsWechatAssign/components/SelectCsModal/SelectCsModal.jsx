/* eslint-disable */
import React, { PropTypes } from 'react';
import { Modal, Icon, Input } from 'antd';
import classNames from 'classnames';
import CenterModalFooter from 'components/CenterModalFooter';
import '~comm/public/styles/iconfont.less';
import './select-cs-modal.less';

class SelectCsModal extends React.Component {
    static propTypes = {
        // toggleSelectCsModal: PropTypes.func.isRequired,
        selectModalVisible: PropTypes.bool.isRequired,
        onSaveSelectedCs: PropTypes.func.isRequired,
        toggleSelectCsModal: PropTypes.func.isRequired,
        csData: PropTypes.object.isRequired,
    }

    state = {
        csSelectedList: [],
        groupIds: [],
        groupFloder: [],
        csFuzzyQueriesList: [],
        isQueringList: false,
        searchInputValue: '',
    }

    onConfirmAdd = () => {
        const { onSaveSelectedCs } = this.props;
        const { csSelectedList } = this.state;

        if (csSelectedList.length > 0) {
            onSaveSelectedCs(csSelectedList);
            this.setState({
                csSelectedList: [],
                isQueringList: false,
                csFuzzyQueriesList: [],
                searchInputValue: '',
            });
        }
    }

    onCancelAdd = () => {
        this.props.toggleSelectCsModal(false);
        this.setState({
            csSelectedList: [],
            isQueringList: false,
            csFuzzyQueriesList: [],
            searchInputValue: '',
        });
    }

    getLiStatus = (item, csPrevList, csSelectedList) => {
        let isPrevCs = false;
        let isSelectedCs = false;

        for (let j = 0, len = csPrevList.length; j < len; j ++) {
            if (item.csid.toString() === csPrevList[j].csid.toString()) {
                isPrevCs = true;
                break;
            }
        }

        for (let j = 0, len = csSelectedList.length; j < len; j ++) {
            // console.log(csSelectedList[j],'sele')
            if (item.csid.toString() === csSelectedList[j].csid.toString()) {
                isSelectedCs = true;
                break;
            }
        }

        const checkedIconNames = classNames({
            'active-icon': true,
            'icon': true,
            'icon-check-circle': isSelectedCs,
            'icon-uncheck': !isSelectedCs,
        });

        const liNames = classNames({
            'clearfix': true,
            'active': isSelectedCs,
        })

        return (
            <li
                key={item.csid}
                data-id={item.csid}
                className={liNames}
                onClick={isPrevCs ? null : this.selectedCs.bind(this, item)}
            >
                <span className="service-name">{item.name}</span>
                {
                    isPrevCs ? '' : (<span className={checkedIconNames} />)
                }
            </li>
        );
    }

    changeGroupStatus = (groupid, index) => {
        const { groupIds, groupFloder } = this.state;

        groupIds[index] = groupid;
        groupFloder[index] = !groupFloder[index];

        this.setState({
            groupIds,
            groupFloder,
        });
    }

    selectedCs = (item) => {
        const { csSelectedList } = this.state;

        let isSelected = false;
        for (let i = 0, len = csSelectedList.length; i < len; i ++) {
            if (item.csid === csSelectedList[i].csid) {
                isSelected = true;
                csSelectedList.splice(i, 1);
                break;
            }
        }

        if (!isSelected) {
            csSelectedList.push(item);
        }

        this.setState({
            csSelectedList,
        });
    }

    delSelectedCs = (item) => {
        const { csSelectedList } = this.state;

        for (let i = 0, len = csSelectedList.length; i < len; i ++) {
            if (item.csid === csSelectedList[i].csid) {
                csSelectedList.splice(i, 1);
                break;
            }
        }

        this.setState({
            csSelectedList,
        });
    }

    queryCsList = (e) => {
        const queryStr = e.target.value;
        const { csList } = this.props.csData;
        const csFuzzyQueriesList = [];

        if (queryStr === '' || queryStr.trim() === '') {
            this.setState({
                isQueringList: false,
                csFuzzyQueriesList,
                searchInputValue: '',
            });
        } else {
            // console.log(csList, 'csList')
            csList.map((item) => {
                if (item.name && item.name.indexOf(queryStr) !== -1) {
                    csFuzzyQueriesList.push(item);
                }
            });
            this.setState({
                isQueringList: true,
                csFuzzyQueriesList,
                searchInputValue: queryStr,
            });
        }
    }

    render() {
        const { selectModalVisible } = this.props;

        const { csList, csPrevList } = this.props.csData;
        const {
            csSelectedList,
            groupIds,
            groupFloder,
            csFuzzyQueriesList,
            isQueringList,
            searchInputValue,
        } = this.state;

        // const csListHtml1 = csList.map((group, i) => {
        //
        //     const groupNames = classNames({
        //         'group-name': true,
        //         'opened': !(group.groupid === groupIds[i] && groupFloder[i])
        //     });
        //
        //     const liHtml = group.data.map((item) => {
        //         return this.getLiStatus(item, csPrevList, csSelectedList);
        //     })
        //
        //     return (<div className="cs-group " key={group.groupid}>
        //         <div
        //             className={groupNames}
        //             data-id={group.groupid}
        //             onClick={this.changeGroupStatus.bind(this, group.groupid, i)}
        //         >
        //             <span className="arrow"></span>
        //             <span>{group.groupname}</span>
        //         </div>
        //         <ul className="group-item-list">
        //             {liHtml}
        //         </ul>
        //     </div>);
        // });

        const csListHtml = csList.map((item) => {
            return this.getLiStatus(item, csPrevList, csSelectedList);
        });

        const csSelectedHtml = csSelectedList.map((item, i) => {
            return (
                <li
                    key={item.csid}
                    data-id={item.csid}
                    className="clearfix"
                >
                    <span className="service-name">{item.name}</span>
                    <span className="active-icon icon icon-close" onClick={this.delSelectedCs.bind(this, item)}/>
                </li>
            );
        });

        let csQueriesListHtml = csFuzzyQueriesList.map((item) => {
            return this.getLiStatus(item, csPrevList, csSelectedList);
        });

        if (!csQueriesListHtml.length) {
            csQueriesListHtml = (<div className="empty-result"><span>暂无搜索结果</span></div>);
        }

        const okClassName = classNames({
            'btn-disable': this.state.csSelectedList.length === 0,
        });

        return (
            <Modal
                title="选择客服"
                visible={selectModalVisible}
                onCancel={this.onCancelAdd}
                maskClosable={false}
                footer={(
                    <CenterModalFooter
                        onOk={this.onConfirmAdd}
                        onCancel={this.onCancelAdd}
                        okClassName={okClassName}
                    />
                )}
            >

                <div className="select-cs clearfix">
                    <div className="left-box">
                        <div className="search">
                            <span className="search-icon">
                                <Icon type="search" />
                            </span>
                            <Input
                                type="text"
                                className="search-btn"
                                placeholder="请输入客服名称"
                                prefix={<Icon type="search" />}
                                onChange={this.queryCsList}
                                ref="searchInput"
                                value={searchInputValue}
                            />
                        </div>
                        <div className="service-list-box">
                            {
                                isQueringList ? csQueriesListHtml : csListHtml
                            }
                        </div>
                    </div>

                    <div className="right-box">
                        <div className="choice">
                            <span>已选择：</span>
                        </div>
                        <div className="selected-list">
                            <ul className="service-list-box">
                                {csSelectedHtml}
                            </ul>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}

export default SelectCsModal;
