import React, { PropTypes } from 'react';
import './index.less';

import { ListView, RefreshControl, ActivityIndicator } from 'antd-mobile';
import { Link } from 'react-router';
import { withRouter } from 'react-router';

const pageSize = 30;

class H5FormData extends React.Component {
	constructor(props) {
        super(props);
        const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];
        const dataSource = new ListView.DataSource({
      		getRowData,
      		rowHasChanged: (row1, row2) => row1 !== row2,
    	});
    }
    componentWillMount = () => {
    	const formId = this.props.params.formId;
    	const { h5FormDataActions, h5FormDataReducers } = this.props;

		h5FormDataActions.setFormId(formId);
    }
	componentDidMount = () => {
		const { h5FormDataActions, h5FormDataReducers } = this.props;
        h5FormDataActions.clearDataList();
		h5FormDataActions.getDataList({
	    	page: 1,
	    	per: pageSize,
            isRefresh: true
	    });
	}
	getDataSource = (data) => {
    	return new ListView
    		.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    		.cloneWithRows(data);
    }
	getMoreList = () => {
		const { h5FormDataActions, h5FormDataReducers } = this.props;
		const { isDataLoading, dataList } = h5FormDataReducers;
		if (isDataLoading || dataList.curr >= dataList.totalpage) {
			return false;
		} else {
			// setTimeout(() => {
			h5FormDataActions.getDataList({
		    	page: ++ dataList.curr,
		    	per: pageSize
    		});
			// }, 1000);
		}
	}
	renderListFooter = () => {
		const { isDataLoading, dataList, dataRefreshing } = this.props.h5FormDataReducers;
		// if (dataList.totalpage && dataList.curr >= dataList.totalpage) {
			return (
                <div className={
                    !dataRefreshing
                    && isDataLoading
                    && dataList.curr
                    <= dataList.totalpage ?
                    'load-foot load-foot-data show':
                    'load-foot load-foot-data hide'
                }>
                </div>
			)
		// }
	}
	row = (rowData, sectionId, rowId) => {
		const { formId } = this.props.h5FormDataReducers;
		return (
			<div
				key={rowId}
				className="form-list-item" >
                <Link
                    to={`/mobile/ecform/app/index/data/${formId}/detail/${rowData.f_id}`}
                    onClick={this.lookData}>
    					<div className="fl">
    						<span></span>
    					</div>
    					<div className="fr">
    						<p className="f1">
    							<span>{rowData.title || '无数据'}</span>
    						</p>
                            <p className="f2">
                                <i className="iconfont icon-xiaojiantou"></i>
                            </p>
    					</div>
                </Link>
			</div>
		)
	}
	onRefresh = () => {
		const { h5FormDataActions, h5FormDataReducers } = this.props;
		h5FormDataActions.dataRefreshing(true);
    	h5FormDataActions.getDataList({
	    	page: 1,
	    	per: pageSize,
	    	isRefresh: true
	    });
	}
	render = () => {
		const {
			dataList,
			isDataLoading,
			dataRefreshing
		} = this.props.h5FormDataReducers;
        const imgSrc = {
            noData: require('~comm/public/images/no-data.png')
        };
		return (
            dataList.data && dataList.data.length ?
			<div className="form-data">
				<div className="head">
					<h2>{dataList.head.title}</h2>
                    {
                        dataList.head.hasPay ?
                            <p>
                                <span className="money-img">¥</span>
                                <span>{dataList.head.allMoney}</span>
                            </p> : null
                    }

				</div>
				<div className="content">
                {
                    <ListView
                        dataSource={this.getDataSource(dataList.data)}
                        onEndReached={() => {
                            setTimeout(this.getMoreList, 500)
                        }}
                        onEndReachedThreshold={50}
                        scrollRenderAheadDistance={500}
                        scrollEventThrottle={500}
                        renderFooter={this.renderListFooter}
                        renderRow={this.row}
                        pageSize={pageSize}
                        initialListSize={pageSize}
                        style={{
                            height: '100%',
                            overflowY: 'auto'
                        }}
                        className="data-list"
                        refreshControl={
                            <RefreshControl
                                onRefresh={this.onRefresh}
                                refreshing={dataRefreshing}/>
                        }/>
                }
				</div>
			</div> :  (
                !isDataLoading ?
                    <div className="no-data has-bg">
                        <img src={imgSrc.noData} />
                        <span>暂无数据</span>
                    </div> :
                    <ActivityIndicator
                        toast
                        text="正在加载"
                        animating={
                            !(dataList.data && dataList.data.length) &&
                            isDataLoading
                        }/>

            )
		)
	}
}

export default withRouter(H5FormData);
