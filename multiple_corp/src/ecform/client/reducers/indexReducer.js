import {SEARCH_TYPE_CHANGE,FETCH_FAILURE,FETCH_SUCCESS,FETCHING,SORT_CHANGE,SEARCH_TEXT_CHANGE,FILTER_CHANGE,FETCH_ROLE_SUCCESS,FETCH_FORM_LIST_SUCCESS,ROUTER_CHANGE,PAGE_CHANGE,FETCH_GET_CLASS_SUCCESS,FETCH_SET_CLASS_SUCCESS,FETCH_DELETE_FORM_SUCCESS,MIGRATION_TO_PUBLIC_SUCCESS} from '../constants/ActionTypes'
import { browserHistory } from 'react-router';


let initialState = {
    sort:1,
    searchText:'',
    classData:[],
    classIds:[],
    role:{},
    router:2,
    formList:[],
    isFetching:false,
    searchType:"1",
    isNeedRefresh:false,
    params:{},
    page:{
        curr:1,
        per:10
    },
};

let url = window.location.href;
if(url.indexOf('unpublished')>-1){
    initialState.router = 1;
}
else if(url.indexOf('published')>-1){
    initialState.router = 2;
}
else if(url.indexOf('public')>-1){
    initialState.router = 3;
}
else if(url.indexOf('team')>-1){
    initialState.router = 4;
}

if(url.indexOf('rollback')>-1){
    initialState = JSON.parse(localStorage.getItem('state'));
    switch(initialState.router){
        case 1:
            browserHistory.push('/ecform/index/unpublished');
            break;
        case 2:
            browserHistory.push('/ecform/index/published');
            break;
        case 3:
            browserHistory.push('/ecform/index/public');
            break;
        case 4:
            browserHistory.push('/ecform/index/team');
            break;
    }
}


export const indexReducer=(state = initialState,action)=>{
    let newState;
    switch (action.type){
        case SORT_CHANGE:
            newState = {
                ...state,
                sort:action.payload,
            };
            localStorage.setItem('state',JSON.stringify(newState));
            return newState;
        case FETCHING:
            newState = {
                ...state,
                isFetching:true,
                formList:[]
            };
            localStorage.setItem('state',JSON.stringify(newState));
            return newState;
        case SEARCH_TEXT_CHANGE:
            newState = {
                ...state,
                searchText:action.payload
            };
            localStorage.setItem('state',JSON.stringify(newState));
            return newState;
        case SEARCH_TYPE_CHANGE:
            newState = {
                ...state,
                searchType:action.payload
            };
            localStorage.setItem('state',JSON.stringify(newState));
            return newState;
        case FILTER_CHANGE:
            newState = {
                ...state,
                classIds:action.payload
            };
            localStorage.setItem('state',JSON.stringify(newState));
            return newState;

        case FETCH_ROLE_SUCCESS:
            newState = {
                ...state,
                role:action.payload,
                page:{
                    ...state.page,
                    curr:initialState.page.curr
                }
            };
            localStorage.setItem('state',JSON.stringify(newState));
            return newState;
        case ROUTER_CHANGE:
            newState = {
                ...initialState,
                router:action.payload,
                classData:state.classData,
                role:state.role,
                classIds:[],
                isNeedRefresh:false,
            };
            localStorage.setItem('state',JSON.stringify(newState));
            return newState;
            break;
        case FETCH_FORM_LIST_SUCCESS:
            newState = {
                ...state,
                formList:action.payload.data,
                page:action.payload.page,
                params:action.payload.params,
                isNeedRefresh:false,
                isFetching:false
            };
            localStorage.setItem('state',JSON.stringify(newState));
            return newState;
            break;
        case PAGE_CHANGE:
            newState = {
                ...state,
                page:{
                    ...state.page,
                    per:action.payload.per,
                    curr:action.payload.curr
                }
            };
            localStorage.setItem('state',JSON.stringify(newState));
            return newState;
            break;
        case FETCH_GET_CLASS_SUCCESS:
            newState = {
                ...state,
                classData:action.payload
            };
            localStorage.setItem('state',JSON.stringify(newState));
            return newState;
            break;
        case FETCH_DELETE_FORM_SUCCESS:
            newState = {
                ...state,
                isNeedRefresh:true
            };
            localStorage.setItem('state',JSON.stringify(newState));
            return newState;
            break;

        case MIGRATION_TO_PUBLIC_SUCCESS:
            newState = {
                ...state,
                isNeedRefresh:true
            };
            localStorage.setItem('state',JSON.stringify(newState));
            return newState;
            break;
        case FETCH_SET_CLASS_SUCCESS:
            newState = {
                ...state,
                isNeedRefresh:true
            };
            localStorage.setItem('state',JSON.stringify(newState));
            return newState;
            break;
    }
    return {...state};
};
