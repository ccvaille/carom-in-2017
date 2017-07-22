import React, { PropTypes } from 'react';
import {
    ListView,
    RefreshControl,
    ActivityIndicator
} from 'antd-mobile';
import { Link } from 'react-router';
import './index.less';
import FormTabs from './components/FormTabs';
import MenuUl from './components/MenuUl';
import MenuFilter from './components/MenuFilter';

let pageSize = 20;
let groupMenuData = [
    '公共',
    '团队',
    '我的',
    '我收到的'
];
let timeGroupData = [
    '按最近修改时间降序',
    '按创建时间降序',
    '按填写量降序',
    '按阅读量降序'
];

class H5Form extends React.Component {
    constructor(props) {
        super(props);
        const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];
        const dataSource = new ListView.DataSource({
            getRowData,
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            dataSource: [],
            scorllTopShow: false,
            distance: 0
        }

    }
    componentWillMount() {
        const { h5FormActions, h5FormReducers } = this.props;
        //获取权限接口
        h5FormActions.getRole();
    }
    componentDidMount() {
        const { h5FormActions, h5FormReducers } = this.props;
        //获取分类数据
        h5FormActions.getClassList();
        //获取首页列表
        this.searchForms();
        //处理onScroll卡顿问题
        window.timer = setInterval(() => {
            // console.log(_listView);
            this._listView && this.scrollForm(this._listView);
            // console.log(1);
        }, 20);
    }
    componentWillUnmount() {
        window.clearInterval(window.timer);
        window.timer = null;
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.h5FormReducers.formList.data !==
            this.props.h5FormReducers.formList.data
        ) {
            this.setState({
                dataSource: nextProps.h5FormReducers.formList.data,
            });
        }
    }
    menuRender = (index) => {
        switch (index) {
            case 1:
                return this.renderTabGroupMenu();
            case 2:
                return this.renderMenuFilter();
            case 3:
                return this.renderTabTimeGroup();
            default:
                return null;
        }
    }
    renderTabGroupMenu = () => {
        const { activeTabGroupMenu, isDeptRead } = this.props.h5FormReducers;
        if (!isDeptRead) {
            delete groupMenuData[1];
        } else {
            groupMenuData[1] = '团队';
        }
        return (
            <MenuUl
                ulData={groupMenuData}
                activeLi={activeTabGroupMenu}
                changeMenuLi={this.changeGroupMenu} />
        )
    }
    renderTabTimeGroup = () => {
        const {
            activeTabTimeMenu,
            activeTabGroupMenu,
         } = this.props.h5FormReducers;
        return (
            <MenuUl
                ulData={
                    activeTabGroupMenu !== 4 ?
                        timeGroupData :
                            ['按收到时间降序']

                }
                activeLi={ activeTabTimeMenu }
                changeMenuLi={ this.changeTimeMenu } />
        )
    }
    //筛选
    renderMenuFilter = () => {
        const {
            menuFilterData,
            activeTagIds,
        } = this.props.h5FormReducers;
        return (
            <MenuFilter
                menuFilterData={menuFilterData}
                toggleActiveFilter={this.toggleActiveFilter}
                activeTagIds={activeTagIds}/>
        )
    }
    toggleActiveFilter = data => {
        const { h5FormActions, h5FormReducers } = this.props;
        const { activeTagIds } = h5FormReducers;
        if (activeTagIds[data[0]] === data[1]) {
            h5FormActions.saveActiveTagIds([data[0], undefined]);
        } else {
            h5FormActions.saveActiveTagIds(data);
        }

    }

    //团队公共
    changeGroupMenu = (index) => {
        const { activeTabGroupMenu } = this.props.h5FormReducers;
        const { h5FormActions } = this.props;

        // if (index === activeTabGroupMenu) {
        //  h5FormActions.changeTabGroupMenu(0);
        // } else {
        h5FormActions.changeTabGroupMenu(index);//本地缓存
        localStorage && localStorage.setItem('activeTabGroupMenu', index);
        if (index === 4) {
            h5FormActions.changeTabTimeMenu(1);//本地缓存
            localStorage && localStorage.setItem('activeTabTimeMenu', 1);
        }
        this.searchForms();

        // }
    }
    //修改时间
    changeTimeMenu = (index) => {
        const { activeTabTimeMenu } = this.props.h5FormReducers;
        const { h5FormActions } = this.props;

        // if (index === activeTabTimeMenu) {
        //  h5FormActions.changeTabTimeMenu(0);
        // } else {
        h5FormActions.changeTabTimeMenu(index);
        this.searchForms();
        localStorage && localStorage.setItem('activeTabTimeMenu', index);//本地缓存
        // }
    }
    cancelActiveTab = () => {
        const { h5FormActions } = this.props;
        h5FormActions.resetActiveTagIds();
        h5FormActions.switchTab("4");
    }
    switchTab = (index) => {

        const { h5FormActions, h5FormReducers } = this.props;
        h5FormActions.resetActiveTagIds();
        if (h5FormReducers.activeTab === index) {
            h5FormActions.switchTab("4");
        } else {
            h5FormActions.switchTab(index);
        }


    }
    getMoreList = () => {
        const { h5FormActions, h5FormReducers } = this.props;
        const { isFormLoading, formList } = h5FormReducers;
        if (isFormLoading || formList.curr >= formList.totalpage) {
            return false;
        } else {
            // setTimeout(() => {
            h5FormActions.loadSearchData({
                page: ++formList.curr,
                per: pageSize
            });
            // }, 1000);
        }
    }
    //根据筛选条件search列表
    searchForms = (sureSetActiveId) => {
        const { h5FormActions } = this.props;
        h5FormActions.clearFormList();
        if (sureSetActiveId) {
            h5FormActions.sureSetActiveTagIds();
        }
        h5FormActions.loadSearchData({
            page: 1,
            per: pageSize,
            isRefresh: true
        });
    }
    //重置筛选条件
    cancelActiveTagIds = () => {
        const { h5FormActions, h5FormReducers } = this.props;
        h5FormActions.cancelActiveTagIds();
        // this.searchForms();
    }
    goHref = (url, params) => {
        const { activeTabTimeMenu } = this.props.h5FormReducers;
        if (window.__ec_bridge__ && window.__ec_native__) {
            __ec_bridge__.openWebview(params, (result, error) => {
                // if (result.code === 0) {
                //     console.log('我要弹出转发了呀');
                // }
            });

        } else {
            location.href = url;
        }
        // location.href = url;
    }
    lookData = (e) => {
        e.stopPropagation();
    }
    retweet = (e, params) => {
        e.stopPropagation();
        if (window.__ec_bridge__ && window.__ec_native__) {
            __ec_bridge__.presentShareActionSheet(params, (result, error) => {
                if (result.code === 0) {
                    console.log('我要弹出转发了呀');
                }
            })
        }

    }
    row = (rowData, sectionId, rowId) => {
        const {
            activeTabGroupMenu,
        } = this.props.h5FormReducers;
        return (
            <div
                key={rowId}
                className="form-list-itme"
                onClick={this.goHref.bind(this, rowData.shareUrl, {
                    title: rowData.f_title || '',
                    description: rowData.f_description || '',
                    url: rowData.shareType ? (rowData.shareUrl + '?ecuid=' + rowData.currentUid) :
                        (rowData.shareUrl + '?uid=' + rowData.currentUid),
                    imageUrl: rowData.sharePic.replace(/https*:/i, '') + '?x-oss-process=image/resize,m_fill,h_60,w_60' || '',
                    id: rowData.f_id,
                    type: rowData.shareType ? 1 : 0
                })}>
                {
                    activeTabGroupMenu !== 4 ?
                    <div className="content">
                        <div className="ctl">
                            <h2>{rowData.f_title}</h2>
                            <p>
                                {
                                    activeTabGroupMenu == 1 ?
                                    (rowData.cname ? (
                                        rowData.cname.length < 6 ?
                                            <span>{rowData.cname}</span> :
                                                (rowData.cname.length > 5 ?
                                                    <span>{rowData.cname.substr(0, 5) + '...'}</span> : null)
                                    ) : (
                                         rowData.mname.length < 6 ?
                                            <span>{rowData.mname}</span> :
                                                (rowData.mname.length > 5 ?
                                                    <span>{rowData.mname.substr(0, 5) + '...'}</span> : null)
                                    )) :
                                    (rowData.cname && rowData.cname.length < 6 ?
                                        <span>{rowData.cname}</span> : (rowData.cname && rowData.cname.length > 5 ?
                                            <span>{rowData.cname.substr(0, 5) + '...'}</span> : null))

                                }
                                <span>{this.renderTime(rowData.mtime)}</span>
                                <span>{rowData.f_viewed || 0}阅读</span>
                            </p>
                        </div>
                        <div className="ctr">
                            <img src={(rowData.sharePic.replace(/https*:/i, '') + '?x-oss-process=image/resize,m_fill,h_150,w_150') || ''} />
                        </div>
                    </div> :
                    <div className="content">
                        <div className="ctl">
                            <h2>{rowData.f_title}</h2>
                            <p>
                                {
                                    rowData.fromName && rowData.fromName.length < 6 ?
                                        <span>{rowData.fromName}</span> : (rowData.fromName && rowData.fromName.length > 5 ?
                                            <span>{rowData.fromName.substr(0, 5) + '...'}</span> : null)
                                }
                                <span>{this.renderTime(rowData.toTime)}</span>
                                <span>{rowData.f_viewed || 0}阅读</span>
                            </p>
                        </div>
                        <div className="ctr">
                            <img src={(rowData.sharePic.replace(/https*:/i, '') + '?x-oss-process=image/resize,m_fill,h_150,w_150') || ''} />
                        </div>
                    </div>
                }
                <div className="foot">
                    <a
                        href="javascript: void(0)"
                        className="ft ftl"
                        onClick={e => { this.retweet.call(this, e, {
                            title: rowData.f_title,
                            description: rowData.f_description,
                            url: rowData.shareType ? (rowData.shareUrl + '?ecuid=' + rowData.currentUid) :
                                (rowData.shareUrl + '?uid=' + rowData.currentUid),
                            imageUrl: rowData.sharePic.replace(/https*:/i, '') + '?x-oss-process=image/resize,m_fill,h_60,w_60' || '',
                            id: rowData.f_id,
                            type: rowData.shareType ? 1 : 0
                        })} }>
                        <i className="iconfont icon-zhuanfa"></i>
                        <span>转发</span>
                    </a>
                    {
                        activeTabGroupMenu == 4 && rowData.shareType ? null :
                        <div className="ft ftr one">

                                <Link
                                    to={`/mobile/ecform/app/index/data/${rowData.f_id}`}
                                    onClick={this.lookData}
                                    className="to-data">
                                        <i className="iconfont icon-shuju"></i>
                                        <div className="shuju">
                                            <span>{rowData.f_submitted || 0}</span>
                                            {
                                                rowData.f_incr ?
                                                    (activeTabGroupMenu == 2 ||
                                                        activeTabGroupMenu == 3 ?
                                                            <div className="circle"></div> : null) :
                                                                null
                                            }
                                        </div>
                                </Link>
                        </div>
                    }

                </div>
            </div>
        )
    }
    getDataSource = (data) => {
        return new ListView
            .DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
            .cloneWithRows(data);
    }
    onRefresh = () => {
        this.setState({
                scorllTopShow: false
            });
        const { h5FormActions, h5FormReducers } = this.props;
        h5FormActions.isRefreshing(true);
        h5FormActions.loadSearchData({
            page: 1,
            per: pageSize,
            isRefresh: true
        });

    }
    renderListFooter = () => {
        const { h5FormActions, h5FormReducers } = this.props;
        const { isFormLoading, isRefreshing, formList} = h5FormReducers;

        return (
            <div className={
                !isRefreshing &&
                isFormLoading &&
                formList.curr <= formList.totalpage ?
                'load-foot show':
                'load-foot hide'
            }>
            </div>
        )
    }
    renderTime = (time) => {

        var date = new Date();
        var nowTimestamp = Date.parse(date)/1000;
        var timeDiff = nowTimestamp - time;
        var str = '';
        //设置当年的时间第一个时间戳
        var timestamp2 = date.setFullYear(date.getFullYear(), 0, 1);
            timestamp2 = timestamp2 / 1000;
        var paramTime = new Date(time*1000);

        if (timeDiff < 60) {
            str = '刚刚';
        } else if (timeDiff < 3600 && timeDiff >= 60) {
            str = parseInt(timeDiff/60, 10) + '分钟前';
        } else if (timeDiff >= 3600 && timeDiff < 86400) {
            str = parseInt(timeDiff/3600, 10) + '小时前';
        } else if (timeDiff >= 86400 && time >= timestamp2) {
            str = (paramTime.getMonth()+1) + '月' +  paramTime.getDate() + '日';
        } else if (time < timestamp2) {
            str = paramTime.getFullYear() + '年' + (paramTime.getMonth() + 1) +
                '月' + paramTime.getDate() + '日';
        }

        return str;
    }
    formTouchStart = (e) => {
        // console.log(e.nativeEvent.deltaY);
        this.startWhich = e.nativeEvent.changedTouches[0].pageY;
    }
    formTouchEnd = (e) => {
        let distance = e.nativeEvent.changedTouches[0].pageY -
            this.startWhich;
        let scrollDistance;

        if (this._listView) {
            scrollDistance = this._listView
            .refs
            .listview
            .refs
            .listviewscroll
            .domScroller
            .scroller
            .__scrollTop;
        }
        if ( Math.abs(distance) > 200 &&
            distance > 0 &&
            scrollDistance &&
            scrollDistance > 300 &&
            !this.state.scorllTopShow
        ) {
            this.setState({
                scorllTopShow: true
            });
        } else if (distance < 0 && this.state.scorllTopShow) {
            this.setState({
                scorllTopShow: false
            });
        }

    }
    scrollToTop = (e, view) => {
        view.refs.listview.scrollTo(0, 0);
        this.setState({
            scorllTopShow: false
        })
    }
    scrollForm = (view) => {
        const scrollDistance = view
            .refs
            .listview
            .refs
            .listviewscroll
            .domScroller
            .scroller
            .__scrollTop;
        if (scrollDistance < 300 && this.state.scorllTopShow) {
            this.setState({
                scorllTopShow: false
            });
        }
    }
    render = () => {
        var imgSrc = {
            noData: require('~comm/public/images/no-data.png')
        }
        const {
            activeTab,
            formList,
            isFormLoading,
            isRefreshing,
            activeTabGroupMenu,
            activeTabTimeMenu,
        } = this.props.h5FormReducers;
        return (

            <div className="form">
                <ActivityIndicator
                    toast
                    text="正在加载"
                    animating={!(formList.data && formList.data.length) && isFormLoading}/>
                <FormTabs
                    menuRender={this.menuRender}
                    switchTab={this.switchTab}
                    activeTab={activeTab}
                    cancelActiveTab={this.cancelActiveTab}
                    groupMenuData={groupMenuData}
                    timeGroupData={timeGroupData}
                    activeTabGroupMenu={activeTabGroupMenu}
                    activeTabTimeMenu={activeTabTimeMenu}
                    cancelActiveTagIds={this.cancelActiveTagIds}
                    searchForms={this.searchForms} />

                <div
                    className="form-content"
                    onTouchStart={this.formTouchStart}
                    onTouchEnd={this.formTouchEnd}>
                {
                    formList.data && formList.data.length ?
                        <ListView
                            dataSource={this.getDataSource(this.state.dataSource)}
                            onEndReached={() => {
                                setTimeout(this.getMoreList, 500)
                            }}
                            ref={(listView) => { this._listView = listView }}
                            onEndReachedThreshold={50}
                            scrollRenderAheadDistance={500}
                            scrollEventThrottle={30}
                            renderFooter={this.renderListFooter}
                            renderRow={this.row}
                            pageSize={pageSize}
                            style={{
                                height: '100%',
                                overflowY: 'auto'
                            }}
                            className="form-list"
                            refreshControl={
                                <RefreshControl
                                    onRefresh={this.onRefresh}
                                    refreshing={isRefreshing} />
                            } />: (
                                !isFormLoading ?
                                <div className="no-data">
                                    <img src={imgSrc.noData} />
                                    <span>暂无数据</span>
                                </div> : null

                             )

                }
                </div>
                <a
                    className="up"
                    href="javascript:void(0)"
                    onClick={e => {this.scrollToTop.call(this, e, this._listView)}}
                    style={{
                        'display': this.state.scorllTopShow ? 'block' : 'none'
                    }}>
                        <i className="iconfont icon-zhiding"></i>
                </a>
            </div>
        )
    }
}

export default H5Form;
