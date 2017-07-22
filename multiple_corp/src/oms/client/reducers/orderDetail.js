import {OD_KEYWORDS_CHANGE,OD_SHOW_CONFIRM_CHANGE,OD_PAGE_CHANGE,OD_AGENTTYPE_CHANGE,OD_TYPE_CHANGE,OD_EPACKAGETYPE_CHANGE,OD_YPACKAGETYPE_CHANGE,OD_ZPACKAGETYPE_CHANGE,OD_DATE_CHANGE,OD_SEARCH_TEXT_CHANGE,OD_FETCH_SEARCH_REQUEST,OD_ADDRESS_CHANGE,OD_FETCH_FAILURE,OD_FETCH_SEARCH_FAILURE,OD_FETCH_SEARCH_SUCCESS} from '../constants/ActionTypes';
import moment from 'moment';

let startDate = moment().startOf('isoWeek').format('YYYY-MM-DD');
let today = moment().format('YYYY-MM-DD');

const initialState = {
    searchText: '',
    startDate:startDate,
    endDate:today,
    province:0,
    city:0,
    type:'-999',
    ePackageType:'0',
    zPackageType:'0',
    yPackageType:'0',
    agentType:'0',
    pageData:[],
    totalOrderNum:0,
    totalPrice:0,
    shopOrderNum:0,
    upgradeOrderNum:0,
    renewOrderNum:0,
    pagination: {
        showSizeChanger: true,
        pageSize:10,
        current:1,
    },
    dateType: 1,//选择的时间类型 0:今天 1:本周 2:本月 4:开始时间 4:结束时间
    isFetching:true,
    isShowConfirm:false
};

const orderDetail=(state = initialState,action)=>{
    let newState=Object.assign({},state);
    switch (action.type){
        //搜索成功
        case OD_FETCH_SEARCH_SUCCESS:
            newState.pageData=action.payload.pageData;
            newState.shopOrderNum=action.payload.shopOrderNum;
            newState.upgradeOrderNum=action.payload.upgradeOrderNum;
            newState.renewOrderNum=action.payload.renewOrderNum;
            newState.totalOrderNum=action.payload.totalOrderNum;
            newState.pagination.current=action.payload.current;
            newState.pagination.total=action.payload.totalOrderNum;
            newState.totalPrice=action.payload.totalPrice;
            newState.isFetching=false;
            break;
        //搜索内容改变了
        case OD_KEYWORDS_CHANGE:
            newState.searchText=action.payload.searchText;
            break;
        //搜索内容改变了
        case OD_SEARCH_TEXT_CHANGE:
            let st=action.payload.searchText;
            newState=initialState;
            newState.searchText=st;
            // newState.searchText=action.payload.searchText;
            newState.isFetching=true;
            break;
        //地址改变了
        case OD_ADDRESS_CHANGE:
            newState.province=action.payload.province;
            newState.city=action.payload.city;
            newState.pageData=[];
            newState.pagination={
                showSizeChanger: true,
                pageSize:10,
                current:1,
            };
            newState.isFetching=true;
            break;
        //时间改变了
        case OD_DATE_CHANGE:
            newState.startDate=action.payload.startDate;
            newState.endDate=action.payload.endDate;
            newState.dateType=action.payload.dateType;
            newState.pageData=[];
            newState.pagination={
                showSizeChanger: true,
                pageSize:10,
                current:1,
            };
            newState.isFetching=true;
            break;
        //类型改变了
        case OD_TYPE_CHANGE:
            newState.type=action.payload.type;
            newState.pageData=[];
            newState.pagination={
                showSizeChanger: true,
                pageSize:10,
                current:1,
            };
            newState.isFetching=true;
            break;
        //代理商类型改变了
        case OD_AGENTTYPE_CHANGE:
            newState.agentType=action.payload.type;
            newState.pageData=[];
            newState.pagination={
                showSizeChanger: true,
                pageSize:10,
                current:1,
            };
            newState.isFetching=true;
            break;
        //ec类型改变了
        case OD_EPACKAGETYPE_CHANGE:
            newState.ePackageType=action.payload.type;
            newState.pageData=[];
            newState.pagination={
                showSizeChanger: true,
                pageSize:10,
                current:1,
            };
            newState.isFetching=true;
            break;
        //增值服务改变了
        case OD_ZPACKAGETYPE_CHANGE:
            newState.zPackageType=action.payload.type;
            newState.pageData=[];
            newState.pagination={
                showSizeChanger: true,
                pageSize:10,
                current:1,
            };
            newState.isFetching=true;
            break;
        //硬件设备改变了
        case OD_YPACKAGETYPE_CHANGE:
            newState.yPackageType=action.payload.type;
            newState.pageData=[];
            newState.pagination={
                showSizeChanger: true,
                pageSize:10,
                current:1,
            };
            newState.isFetching=true;
            break;
        //分页改变了
        case OD_PAGE_CHANGE:
            newState.pagination.current=action.payload.current;
            newState.pagination.pageSize=action.payload.pageSize;
            newState.pageData=[];
            newState.isFetching=true;
            break;
        case OD_SHOW_CONFIRM_CHANGE:
            newState.isShowConfirm=action.payload.isShowConfirm;
            break;

    }
    return newState;
};

export {orderDetail};