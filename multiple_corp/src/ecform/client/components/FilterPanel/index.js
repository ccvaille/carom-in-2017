import React from 'react'
import {connect} from 'react-redux';
import {Button, Icon, Select,Input,Popover} from 'antd';
const Option = Select.Option;
const InputGroup = Input.Group;
const Search = Input.Search;
import FilterPopover from '../FilterPopover';
import {sortChange,searchTextChange,filterChange,fetchFormList,fetchGetClass,searchTypeChange} from '../../actions/indexAction'
import './index.less';


class FilterPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };
    }

    handleSortChange = (value) => {
        const {sortChange,fetchFormList,params} = this.props;
        sortChange(value);
        fetchFormList({
            ...params,
            order:value
        });
    };
    handleSearchTextChange = (e) => {
        const {searchTextChange} = this.props;
        searchTextChange(e.target.value);
    };

    handleSearchText = (e) =>{
        const {fetchFormList,params,searchType,page,searchText,classIds,router,sort} = this.props;
        if(searchType==="1"){
            fetchFormList({
                page:1,
                per:page.per,
                order:sort,
                title:searchText,
                classIds:classIds.join(','),
                state:router,
            });
        }
        else if(searchType==="2"){
            fetchFormList({
                page:1,
                per:page.per,
                order:sort,
                userName:searchText,
                classIds:classIds.join(','),
                state:router,
            });
        }
        if(searchText===""){
            fetchFormList({
                page:1,
                per:page.per,
                order:sort,
                classIds:classIds.join(','),
                state:router,
            });
        }
    }

    handleSearchTypeChange = (value) =>{
        let {searchTypeChange} = this.props;
        searchTypeChange(value);
    };

    handleVisibleChange = (visible) => {
        this.setState({ visible });
    };
    onPopoverSubmit = (classIds) =>{
        const {filterChange,fetchFormList,params} = this.props;
        filterChange(classIds);
        fetchFormList({
            ...params,
            page:1,
            classIds:classIds.join(',')
        });
        this.setState({
            visible: false,
        });
    };

    onPopoverCancel =() =>{
        this.setState({
            visible: false,
        });
    };

	componentWillMount() {
        this.props.fetchGetClass();
	}

    componentWillReceiveProps(nextProps,nextState){

    }

    render() {
        const {sort,searchText,classData,classIds,searchType,...others} = this.props;

        let searchHolderText = searchType==1?'请输入标题':'请输入作者';
		return (
			<div className="filter-panel">
                <Select className="sort"
                        onChange = {this.handleSortChange}
                        value = {sort.toString()}
                        style={{ width: 170 }} >
                    <Option value="1">按最近修改时间降序</Option>
                    <Option value="2">按创建时间降序</Option>
                    <Option value="3">按填写量降序</Option>
                    <Option value="4">按阅读量降序</Option>
                </Select>

                <Select value={searchType} className="search-type" onChange={this.handleSearchTypeChange}>
                    <Option value="1">标题</Option>
                    <Option value="2">作者</Option>
                </Select>
                <Search
                    className = "search"
                    placeholder={searchHolderText}
                    style={{ width: 185 }}
                    value = {searchText}
                    onChange = {this.handleSearchTextChange}
                    onSearch = {this.handleSearchText}
                />

                <Popover
                    content={<FilterPopover
                        data={classData}
                        selectedIds={classIds}
                        onSubmit={this.onPopoverSubmit.bind(this)}
                        onCancel={this.onPopoverCancel}
                    >
                    </FilterPopover>}
                    visible={this.state.visible}
                    placement="bottomRight"
                    trigger="click"
                    onVisibleChange={this.handleVisibleChange}
                >
                    <Button className = "filter-btn">筛选</Button>
                </Popover>

            </div>
		)
	}
}

const mapStateToProps = state => (
    state.indexReducer
);

const mapDispatchToProps = (dispatch) => {
    return {
        sortChange: (value) => {
            dispatch(sortChange(value))
        },
        searchTextChange: (value) => {
            dispatch(searchTextChange(value))
        },
        filterChange: (value) => {
            dispatch(filterChange(value))
        },
        fetchFormList: (params) => {
            dispatch(fetchFormList(params))
        },
        fetchGetClass: () => {
            dispatch(fetchGetClass())
        },
        searchTypeChange: (value) => {
            dispatch(searchTypeChange(value))
        },

    }
}

export default connect(mapStateToProps,mapDispatchToProps)(FilterPanel)
