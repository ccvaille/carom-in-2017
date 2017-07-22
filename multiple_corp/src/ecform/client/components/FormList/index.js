let logo =require('../../../images/ec-logo.png');
let loadingImg = require('../../../images/loading.gif');
import React from 'react';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import moment from 'moment';
import {connect,Link} from 'react-redux';
import {Button, Icon, Select,Input,Popover,Pagination,Spin,Modal } from 'antd';
const confirm = Modal.confirm;
import './index.less';
import {fetchFormList,pageChange,deleteForm,fetchSetClass,migrationToPublic} from '../../actions/indexAction'
import classNames from 'classnames';
import QRCode from 'qrcode.react';
import FilterPopover from '../FilterPopover';



let classModalTitleTip = (
    <span style={{'color':'#303642','font-size':'14px'}}>如果您想修改分类，请联系管理员在企业管理中设置</span>
);


let classModalTitle = (
    <h3>
        选择分类
        <Popover overlayClassName="class-modal-title-pop"  placement="bottomLeft" arrowPointAtCenter trigger="hover" content={classModalTitleTip}>
            <i className="pop-icon"></i>
        </Popover>
    </h3>
);




class FormList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            classModalVisible:false,
            previewModalVisible:false,
            currentFormItem:{}
        };
    }

    componentWillMount() {
        this.props.fetchFormList({
            page:this.props.page.curr,
            per:this.props.page.per,
            state:this.props.router,
            order:this.props.sort,
            userName:this.props.searchText,
            classIds:this.props.classIds.join(','),
        });
    }

    componentWillReceiveProps(nextProps){
        let {fetchFormList} = this.props;
        if(nextProps.router!==this.props.router){
            fetchFormList({
                state :nextProps.router,
                page:1,
                per:10,
                order:1
            });
        }
        else if(nextProps.isNeedRefresh!==this.props.isNeedRefresh){
            if(nextProps.isNeedRefresh==true){
                fetchFormList(nextProps.params);
            }
        }
    }

    //删除时候的提示语
    handleDeleteClick(item){
        let {deleteForm} = this.props;
        confirm({
            title: '删除后将无法恢复，是否删除？',
            onOk() {
                deleteForm(item.f_id);
            }
        });
    }

    //弹出预览框
    handlePreviewClick(item){
        this.setState({
            previewModalVisible:true,
            currentFormItem:item
        });
    }


    //弹出分类框
    handleEditClassClick(item){
        this.setState({
            classModalVisible:true,
            currentFormItem:item
        });
    }

    //移动到公共
    handleToPublicClick(item){
        let {migrationToPublic} = this.props;
        migrationToPublic(item.f_id);
    }

    //根据不同的条件渲染出操作栏
    renderCtrlList(item,router,role){
        //草稿箱
        if(router===1){
            let popCtrlList=(
                <ul className="pop-ctrl-area">
                    <li className="pop-ctrl"  onClick={this.handleDeleteClick.bind(this,item)}><i className="icon iconfont">&#xe669;</i><span>删除</span></li>
                    <li className="pop-ctrl"  onClick={this.handleEditClassClick.bind(this,item)}><i className="icon iconfont">&#xe663;</i><span>分类</span></li>
                </ul>
            );

            return (
                <ul className="ctrl-area" ref={'ctrlArea'+item.f_id}>
                    <li className="ctrl"><a href={'//my.workec.com/form/index/design?formid='+item.f_id}  title="编辑"><i className="icon iconfont">&#xe66a;</i></a></li>
                    <li className="ctrl"><a href={'//my.workec.com/form/index/design?formid='+item.f_id+'&act=1'} title="复制"><i className="icon iconfont">&#xe664;</i></a></li>
                    <Popover
                        content={popCtrlList}
                        placement="bottomRight"
                        trigger="hover"
                        getPopupContainer={()=>this.refs['ctrlArea'+item.f_id]}
                    >
                    <li className="ctrl"><i className="icon iconfont">&#xe66b;</i></li>
                    </Popover>
                </ul>
            )
        }
        //已发布
        else if(router==2){
            let popCtrlList;
            if(role.publicWrite){
                popCtrlList=(
                    <ul className="pop-ctrl-area">
                        <li className="pop-ctrl"><a href={'//my.workec.com/form/graph?fid='+item.f_id}><i className="icon iconfont">&#xe665;</i><span>查看数据</span></a></li>
                        <li className="pop-ctrl"><a href={'//my.workec.com/form/index/design?formid='+item.f_id+'&act=1'}><i className="icon iconfont">&#xe664;</i><span>复制</span></a></li>
                        <li className="pop-ctrl" onClick={this.handleDeleteClick.bind(this,item)}><i className="icon iconfont">&#xe669;</i><span>删除</span></li>
                        <li className="pop-ctrl" onClick={this.handleEditClassClick.bind(this,item)}><i className="icon iconfont">&#xe663;</i><span>分类</span></li>
                        <li className="pop-ctrl" onClick={this.handleToPublicClick.bind(this,item)}><i className="icon iconfont">&#xe666;</i><span>放入公共</span></li>
                    </ul>
                );
            }
            else{
                popCtrlList=(
                    <ul className="pop-ctrl-area">
                        <li className="pop-ctrl"><a href={'//my.workec.com/form/graph?fid='+item.f_id}><i className="icon iconfont">&#xe665;</i><span>查看数据</span></a></li>
                        <li className="pop-ctrl"><a href={'//my.workec.com/form/index/design?formid='+item.f_id+'&act=1'}><i className="icon iconfont">&#xe664;</i><span>复制</span></a></li>
                        <li className="pop-ctrl" onClick={this.handleDeleteClick.bind(this,item)}><i className="icon iconfont">&#xe669;</i><span>删除</span></li>
                        <li className="pop-ctrl" onClick={this.handleEditClassClick.bind(this,item)}><i className="icon iconfont">&#xe663;</i><span>分类</span></li>
                    </ul>
                );
            }

            return (
                <ul className="ctrl-area" ref={'ctrlArea'+item.f_id}>
                    <li className="ctrl"><a href={'//my.workec.com/form/publish?id='+item.f_id}  title="分享"><i className="icon iconfont">&#xe667;</i></a></li>
                    <li className="ctrl"><a href={'//my.workec.com/form/index/design?formid='+item.f_id} title="编辑"><i className="icon iconfont">&#xe66a;</i></a></li>
                    <Popover
                        content={popCtrlList}
                        placement="bottomRight"
                        trigger="hover"
                        getPopupContainer={()=>this.refs['ctrlArea'+item.f_id]}
                    >
                        <li className="ctrl"><i className="icon iconfont">&#xe66b;</i></li>
                    </Popover>
                </ul>
            )
        }
        //公共类作品
        else if(router==3){
            let popCtrlList;
            if(role.publicWrite){
                popCtrlList=(
                    <ul className="pop-ctrl-area">
                        <li className="pop-ctrl"><a href={'//my.workec.com/form/graph?fid='+item.f_id}><i className="icon iconfont">&#xe665;</i><span>查看数据</span></a></li>
                        <li className="pop-ctrl"><a href={'//my.workec.com/form/index/design?formid='+item.f_id+'&act=1'}><i className="icon iconfont">&#xe664;</i><span>复制</span></a></li>
                        <li className="pop-ctrl" onClick={this.handleDeleteClick.bind(this,item)}><i className="icon iconfont">&#xe669;</i><span>删除</span></li>
                        <li className="pop-ctrl" onClick={this.handleEditClassClick.bind(this,item)}><i className="icon iconfont">&#xe663;</i><span>分类</span></li>
                    </ul>
                );
            }
            else{
                popCtrlList=(
                    <ul className="pop-ctrl-area">
                        <li className="pop-ctrl"><a href={'//my.workec.com/form/graph?fid='+item.f_id}><i className="icon iconfont">&#xe665;</i><span>查看数据</span></a></li>
                        <li className="pop-ctrl"><a href={'//my.workec.com/form/index/design?formid='+item.f_id+'&act=1'}><i className="icon iconfont">&#xe664;</i><span>复制</span></a></li>
                    </ul>
                );
            }

            if(role.publicWrite){
                return (
                    <ul className="ctrl-area" ref={'ctrlArea'+item.f_id}>
                        <li className="ctrl"><a href={'//my.workec.com/form/publish?id='+item.f_id+'&state=3'} title="分享"><i className="icon iconfont">&#xe667;</i></a></li>
                        <li className="ctrl"><a href={'//my.workec.com/form/index/design?formid='+item.f_id} title="编辑"><i className="icon iconfont">&#xe66a;</i></a></li>
                        <Popover
                            content={popCtrlList}
                            placement="bottomRight"
                            trigger="hover"
                            getPopupContainer={()=>this.refs['ctrlArea'+item.f_id]}
                        >
                            <li className="ctrl"><i className="icon iconfont">&#xe66b;</i></li>
                        </Popover>

                    </ul>
                )
            }
            else{
                return (
                    <ul className="ctrl-area" ref={'ctrlArea'+item.f_id}>
                        <li className="ctrl"><a href={'//my.workec.com/form/publish?id='+item.f_id+'&state=3'} title="分享"><i className="icon iconfont">&#xe667;</i></a></li>
                        <Popover
                            content={popCtrlList}
                            placement="bottomRight"
                            trigger="hover"
                            getPopupContainer={()=>this.refs['ctrlArea'+item.f_id]}
                        >
                            <li className="ctrl"><i className="icon iconfont">&#xe66b;</i></li>
                        </Popover>
                    </ul>
                )
            }
        }
        //团队作品
        else if(router==4){
            let popCtrlList;
            if(role.publicWrite){
                if(role.deptWrite){
                    popCtrlList=(
                        <ul className="pop-ctrl-area">
                            <li className="pop-ctrl"><a href={'//my.workec.com/form/graph?fid='+item.f_id}><i className="icon iconfont">&#xe665;</i><span>查看数据</span></a></li>
                            <li className="pop-ctrl"><a href={'//my.workec.com/form/index/design?formid='+item.f_id+'&act=1'}><i className="icon iconfont">&#xe664;</i><span>复制</span></a></li>
                            <li className="pop-ctrl" onClick={this.handleDeleteClick.bind(this,item)}><i className="icon iconfont">&#xe669;</i><span>删除</span></li>
                            <li className="pop-ctrl" onClick={this.handleEditClassClick.bind(this,item)}><i className="icon iconfont">&#xe663;</i><span>分类</span></li>
                            <li className="pop-ctrl" onClick={this.handleToPublicClick.bind(this,item)}><i className="icon iconfont">&#xe666;</i><span>放入公共</span></li>
                        </ul>
                    );
                }
                else{
                    popCtrlList=(
                        <ul className="pop-ctrl-area">
                            <li className="pop-ctrl"><a href={'//my.workec.com/form/graph?fid='+item.f_id}><i className="icon iconfont">&#xe665;</i><span>查看数据</span></a></li>
                            <li className="pop-ctrl"><a href={'//my.workec.com/form/index/design?formid='+item.f_id+'&act=1'}><i className="icon iconfont">&#xe664;</i><span>复制</span></a></li>
                            <li className="pop-ctrl" onClick={this.handleEditClassClick.bind(this,item)}><i className="icon iconfont">&#xe663;</i><span>分类</span></li>
                            <li className="pop-ctrl" onClick={this.handleToPublicClick.bind(this,item)}><i className="icon iconfont">&#xe666;</i><span>放入公共</span></li>
                        </ul>
                    );
                }
            }
            else{
                if(role.deptWrite){
                    popCtrlList=(
                        <ul className="pop-ctrl-area">
                            <li className="pop-ctrl"><a href={'//my.workec.com/form/graph?fid='+item.f_id}><i className="icon iconfont">&#xe665;</i><span>查看数据</span></a></li>
                            <li className="pop-ctrl"><a href={'//my.workec.com/form/index/design?formid='+item.f_id+'&act=1'}><i className="icon iconfont">&#xe664;</i><span>复制</span></a></li>
                            <li className="pop-ctrl" onClick={this.handleDeleteClick.bind(this,item)}><i className="icon iconfont">&#xe669;</i><span>删除</span></li>
                            <li className="pop-ctrl" onClick={this.handleEditClassClick.bind(this,item)}><i className="icon iconfont">&#xe663;</i><span>分类</span></li>
                        </ul>
                    );
                }
                else{
                    popCtrlList=(
                        <ul className="pop-ctrl-area">
                            <li className="pop-ctrl"><a href={'//my.workec.com/form/graph?fid='+item.f_id}><i className="icon iconfont">&#xe665;</i><span>查看数据</span></a></li>
                            <li className="pop-ctrl"><a href={'//my.workec.com/form/index/design?formid='+item.f_id+'&act=1'}><i className="icon iconfont">&#xe664;</i><span>复制</span></a></li>
                            <li className="pop-ctrl" onClick={this.handleEditClassClick.bind(this,item)}><i className="icon iconfont">&#xe663;</i><span>分类</span></li>
                        </ul>
                    );
                }

            }

            return (
                <ul className="ctrl-area" ref={'ctrlArea'+item.f_id}>
                    <li className="ctrl"><a href={'//my.workec.com/form/publish?id='+item.f_id} title="分享"><i className="icon iconfont">&#xe667;</i></a></li>
                    <li className="ctrl"><a href={'//my.workec.com/form/index/design?formid='+item.f_id} title="编辑"><i className="icon iconfont">&#xe66a;</i></a></li>
                    <Popover
                        content={popCtrlList}
                        placement="bottomRight"
                        trigger="hover"
                        getPopupContainer={()=>this.refs['ctrlArea'+item.f_id]}
                    >
                        <li className="ctrl"><i className="icon iconfont">&#xe66b;</i></li>
                    </Popover>
                </ul>
            )
        }
    }

    //分页数量改变
    onPageSizeChange(current, pageSize){
        this.props.pageChange({
            curr:1,
            per:pageSize
        });
        this.props.fetchFormList({
            ...this.props.params,
            page:1,
            per:pageSize
        });
    }

    //页码改变
    onPageIndexChange(current){
        this.props.pageChange({
            curr:current,
            per:this.props.page.per
        });

        this.props.fetchFormList({
            ...this.props.params,
            page:current,
        });
    }


    //分类ok的回调
    handleClassOk(tagIds){
        const {fetchSetClass} = this.props;

        fetchSetClass({
            formId:this.state.currentFormItem.f_id,
            classIds:tagIds.join(',')
        });
        this.setState({
            classModalVisible: false,
        });
    }

    //分类框点击取消
    handleClassCancel(){
        this.setState({
            classModalVisible:false
        });
    }
    //预览框取消
    handlePreviewCancel(){
        this.setState({
            previewModalVisible:false
        });
    }

    //根据条件渲染title
    renderTitle(form){
        let {router} = this.props;
        if(router==1){
            if(form.hasPay==0){
                return (<a className="title" href={"//my.workec.com/form/index/design?formid="+form.f_id} title={form.f_title}>{form.f_title}</a>);
            }
            else{
                return (<div className="inline-block"><a className="title" href={"//my.workec.com/form/index/design?formid="+form.f_id} title={form.f_title}>{form.f_title}</a><i className="pay-icon"></i></div>);
            }
        }
        else{
            if(form.hasPay==0){
                return (<a className="title" onClick={this.handlePreviewClick.bind(this,form)} title={form.f_title}>{form.f_title}</a>);
            }
            else{
                return (<div className="inline-block"><a className="title" onClick={this.handlePreviewClick.bind(this,form)} title={form.f_title}>{form.f_title}</a><i className="pay-icon"></i></div>);
            }
        }
    }


    //根据不同的tab，显示无内容状态下的提示语
    renderNoResult(){
        let router = this.props.router;
        switch(router){
            case 1:
                return (
                    <div className="no-result">
                        <img src={logo}/>
                        <p className="title">暂无内容</p>
                        <p className="detail">此处展示您尚未发布的作品，且仅您自己可见。</p>
                    </div>
                );
                break;
            case 2:
                return (
                    <div className="no-result">
                        <img src={logo}/>
                        <p className="title">暂无内容</p>
                        <p className="detail">您还没有发布过任何作品，赶紧去发布吧。</p>
                    </div>
                );
                break;
            case 3:
                return (
                    <div className="no-result">
                        <img src={logo}/>
                        <p className="title">暂无内容</p>
                        <p className="detail">公共作品中展示公司常用的作品，例如产品介绍、客户案例等。全员可见，包括后入职员工。</p>
                    </div>
                );
                break;
            case 4:
                return (
                    <div className="no-result">
                        <img src={logo}/>
                        <p className="title">暂无内容</p>
                        <p className="detail">团队作品中展示您所管理的团队创建的所有作品</p>
                    </div>
                );
                break;
        }
    }



    render() {
        const {formList,page,router,isFetching,classData,role,...others} = this.props;


        //通过className来控制显示和隐藏
        let tab1Clz = classNames({
            hide:router==1,
            tab:true,
            tab1:true
        });

        let tab2Clz = classNames({
            hide:router==1||router==3,
            tab:true,
            tab2:true
        });

        let tab3Clz = classNames({
            hide:router==2||router==1||router==4,
            tab:true,
            tab3:true
        });

        let tab4Clz = classNames({
            hide:router==3,
            tab:true,
            tab4:true
        });

        let tab5Clz = classNames({
            tab:true,
            tab5:true
        });

        let cnameClz = classNames({
            hide:router !== 4,
            cname:true
        });

        let mnameClz = classNames({
            mname:true,
            hide:router == 1
        });


        return (

            <div className="form-list">
                <ul className="list-wrapper">
                        {
                            formList.length>0?(
                                formList.map((item,index)=>{
                                    return (
                                        <li className="form-item">
                                            <img className="share-pic" src={item.sharePic+'?x-oss-process=image/resize,m_fill,h_40,w_40'}/>
                                            <div className="form-info">
                                                {
                                                    this.renderTitle(item)
                                                }

                                                <div className="desc">
                                                    <div className={tab1Clz}>
                                                        <span>阅读：</span>
                                                        <a href={"//my.workec.com/form/graph?fid="+item.f_id+'&tabType=2'}>{item.f_viewed}</a>
                                                    </div>
                                                    <div className={tab2Clz}>
                                                        <span>填写：</span>
                                                        <a href={"//my.workec.com/form/graph?fid="+item.f_id}>{item.f_submitted}</a>
                                                        {
                                                            item.f_incr > 0 ? (<a href={"//my.workec.com/form/graph?fid="+item.f_id} className="num">{item.f_incr}</a>):null
                                                        }
                                                    </div>
                                                    <div className={tab3Clz}>
                                                        <span>{role.publicWrite?'填写：':'我带来的填写：'}</span>
                                                        <a  href={"//my.workec.com/form/graph?fid="+item.f_id}>{item.f_submitted}</a>
                                                        {
                                                            router!=3&&item.f_incr >0 ? (<a href={"//my.workec.com/form/graph?fid=" + item.f_id} className="num">{item.f_incr}</a>):null
                                                        }
                                                    </div>
                                                    <div className={tab4Clz}>
                                                        <span>创建：</span>
                                                        <span className="ctime">{moment(item.f_ctime).format('MM-DD HH:mm')}</span>
                                                        <span className={cnameClz} title={item.cname}>{item.cname} </span>
                                                    </div>
                                                    <div className={tab5Clz}>
                                                        <span>最近编辑：</span>
                                                        <span className="mtime">{moment(item.f_mtime).format('MM-DD HH:mm')}</span>
                                                        <span className={mnameClz} title={item.mname}>{item.mname}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                this.renderCtrlList(item,router,role)
                                            }
                                        </li>
                                    )
                                })
                            ):
                                isFetching?(
                                    <div className="loading-wrapper">
                                        <img src = {loadingImg} />
                                    </div>
                                ):(
                                    this.renderNoResult()
                                )
                        }
                </ul>
                <div className="footer">
                    {
                        formList.length>0?(
                            <Pagination className="pagination" showSizeChanger onChange={this.onPageIndexChange.bind(this)} pageSize={page.per} current={page.curr} onShowSizeChange={this.onPageSizeChange.bind(this)} total={page.totalcount} />
                        ):null
                    }
                </div>
                <Modal
                       visible={this.state.previewModalVisible}
                       footer={null}
                       onCancel={this.handlePreviewCancel.bind(this)}
                       width = "680px"
                       height = "560px"
                       style={{top:50}}
                       wrapClassName = "preview-modal"
                       key={this.state.currentFormItem.f_id+'_1'}

                >
                    <div className="left-side">
                        <iframe id="previewFrame" className="p-wrapper" src={this.state.currentFormItem.previewUrl}></iframe>
                    </div>
                    <div className="right-side">
                        <div className="info-wrapper">
                            <h1>微信扫描二维码</h1>
                            <h2>&nbsp;即&nbsp;&nbsp;&nbsp;可&nbsp;&nbsp;&nbsp;对&nbsp;&nbsp;&nbsp;外&nbsp;&nbsp;&nbsp;分&nbsp;&nbsp;&nbsp;享</h2>

                            <QRCode size="170" value={this.state.currentFormItem.shareUrl+'?uid='+this.state.currentFormItem.currentUid}/>
                            {
                                router==3?(<a className="more-link" href={"//my.workec.com/form/publish?id="+this.state.currentFormItem.f_id+'&state=3'}>点击获取更多分享方式</a>):(<a className="more-link" href={"//my.workec.com/form/publish?id="+this.state.currentFormItem.f_id}>点击获取更多分享方式</a>)
                            }
                            <a className="statistics" href={"//my.workec.com/form/graph?fid="+this.state.currentFormItem.f_id}>查看数据</a>
                            {

                                router==3&&!role.publicWrite?(<a className="copy-full" href={"//my.workec.com/form/index/design?formid="+this.state.currentFormItem.f_id+"&act=1"}>复制</a>)
                                    :(<div><a className="edit" href={"//my.workec.com/form/index/design?formid="+this.state.currentFormItem.f_id}>编辑</a><a className="copy" href={"//my.workec.com/form/index/design?formid="+this.state.currentFormItem.f_id+"&act=1"}>复制</a></div>)
                            }
                        </div>

                        {

                            this.state.currentFormItem.classInfo&&this.state.currentFormItem.classInfo.length>0?(
                                <div className="class-wrapper">
                                <div className="ctrl-area">
                                    <span className="title">类型</span>
                                </div>
                                <ul className="class-list">
                                    {
                                        this.state.currentFormItem.classInfo.map((item, index)=> {
                                            return (<li className="class">{item.className}</li>);
                                        })
                                    }

                                </ul>
                                </div>):null
                        }

                    </div>
                </Modal>

                <Modal title={classModalTitle}
                       visible={this.state.classModalVisible}
                       footer={null}
                       style={{top:45}}
                       onOk={this.handleClassOk.bind(this)}
                       onCancel={this.handleClassCancel.bind(this)}
                       width = "440px"
                       wrapClassName = "class-modal"
                       key={this.state.currentFormItem.f_id+'_2_'+Math.random()}
                >
                    <FilterPopover
                        data={classData}
                        selectedIds={this.state.currentFormItem.classIds?this.state.currentFormItem.classIds.split(',').map((item,index)=>parseInt(item)):[]}
                        onSubmit={this.handleClassOk.bind(this)}
                        onCancel={this.handleClassCancel.bind(this)}
                    />
                </Modal>
            </div>
        )

    }
}


const mapStateToProps = state => (
    state.indexReducer
);

const mapDispatchToProps = (dispatch) => {
    return {
        fetchFormList: (params) => {
            dispatch(fetchFormList(params))
        },
        pageChange: (payload) => {
            dispatch(pageChange(payload))
        },
        deleteForm: (formId) => {
            dispatch(deleteForm(formId))
        },
        fetchSetClass: (params) => {
            dispatch(fetchSetClass(params))
        },
        migrationToPublic: (formId) => {
            dispatch(migrationToPublic(formId))
        },
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(FormList)


