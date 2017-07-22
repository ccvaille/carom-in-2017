import React from 'react'
import {Button, Icon} from 'antd';
import './index.less';




class FilterPopover extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            isAllExpend:true,
            selectedIds:[]
        };
    }
    //分组的展开和收起
    handleToggleGroup = (group,groupIndex) =>{
        group.isExpend = !group.isExpend;
        let newData = this.state.data;
        newData[groupIndex] = group;
        this.setState({
            data:newData
        });
    };

    //所有分组的展开和收起
    handleToggleAllGroup = () =>{
        let isAllExpend = !this.state.isAllExpend;
        let newData = this.state.data;
        newData.forEach((item,index)=>{
            item.isExpend = isAllExpend;
        });
        this.setState({
            data:newData,
            isAllExpend:isAllExpend
        });
    }

    //单个标签点击的时候
    handleTagClick = (group,tag,tagIndex) =>{
        let selectedIds = this.state.selectedIds;
        group.tags.forEach((item,index)=>{
            if(selectedIds.indexOf(item.tagId)>-1&&item.tagId!==tag.tagId){
                selectedIds.splice(selectedIds.indexOf(item.tagId),1);
            }
        });

        if(selectedIds.indexOf(tag.tagId)>-1){
            selectedIds.splice(selectedIds.indexOf(tag.tagId),1);
        }
        else{
            selectedIds.push(tag.tagId);
        }
        this.setState({
            selectedIds:this.state.selectedIds
        });
    };

    //点击确定的时候
    handleSubmit = (e) =>{
        let {onSubmit,...others} = this.props;
        onSubmit(this.state.selectedIds);
    };

    //点击取消，关闭弹层
    handleCancel = (e) =>{
        let {onCancel} = this.props;
        onCancel();
    };



    componentWillMount() {
        let {data,selectedIds} = this.props;
        data.forEach((item,index)=>{
            item.isExpend=true;
        });

        this.setState({
            data:this.props.data,
            selectedIds:selectedIds
        });
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            data:nextProps.data,
            selectedIds:nextProps.selectedIds
        });
    }

    render() {
        let {data,...others} = this.props;
        return (
            <div className="filter-popover">
                <h1 className="ctrl-wrapper">
                    <span className="title">分类</span>
                    <span className="ctrl" onClick={this.handleToggleAllGroup}>
                        {
                            this.state.isAllExpend?'全部收起':'全部展开'
                        }
                        </span>
                </h1>
                <div className="groups">
                    {
                        data.map((group, groupIndex)=> {
                            return (<div className="group">
                                <h2 className="ctrl-wrapper">
                                    <span className="title">{group.name}</span>
                                    <span className="ctrl" onClick={this.handleToggleGroup.bind(this,group,groupIndex)}>{group.isExpend?'收起':'展开'}</span>
                                </h2>
                                {
                                    group.isExpend?(<ul className="tags">
                                        {
                                            group.tags ? group.tags.map((tag, tagIndex)=> {
                                                return (
                                                    <li className="tag">
                                                        <a href="javascript:;" className={this.state.selectedIds.indexOf(tag.tagId)>-1?'active':''} onClick={this.handleTagClick.bind(this,group,tag,tagIndex)}>{tag.name}</a>
                                                    </li>
                                                )
                                            }) : ''
                                        }
                                        <li className="clearfix"></li>
                                    </ul>):''
                                }

                            </div>)
                        })
                    }
                </div>
                <div className="footer">
                    <Button type="primary" onClick={this.handleSubmit}>确定</Button>
                    <Button onClick={this.handleCancel}>取消</Button>
                </div>
            </div>
        )
    }
}

export default FilterPopover
