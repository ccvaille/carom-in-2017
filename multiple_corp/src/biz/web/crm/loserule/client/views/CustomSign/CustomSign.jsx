import React from 'react';
import { Button, Icon } from 'antd';
import BackRuleSignModal from './components/BackRuleSignModal';
import './index.less';

//客户标签

class CustomSign extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSignModalShow: false, //是否显示标签弹窗
        };
    }
    //客户标签选择确认回掉
    onModalOk = (array) => {
        this.setState({
            isSignModalShow: false,
        });
        this.props.ruleAction.changeCheckedSigns(array);
    }
    //客户标签选择取消回调
    onModalCancle = () => {
        this.setState({
            isSignModalShow: false,
        });
    }
    //打开客户标签选择弹层
    onOpenModal = () => {
        if(this.props.allSignTabList.length<=0)
        this.props.ruleAction.loadSignTabs();
        this.setState({
            isSignModalShow: true,
        });
    }
    //删除客户标签
    onDeleteItem(id){
       return ()=>{
            let array=this.props.checkedSigns.filter(item=>(item.id!==id));
            this.props.ruleAction.changeCheckedSigns(array);
       }
    }
    //渲染
    render() {
        return (<div className="back-rule-sign">
            <p className="back-rule-addsign">
                <Button className="white-btn" onClick={this.onOpenModal}>添加标签</Button> 
                您已选择&nbsp;{this.props.checkedSigns.length}&nbsp;个标签
            </p>
            <ul className="back-rule-signpool">
                {
                    this.props.checkedSigns.map((item)=>{
                        return <li key={item.id} className={item.style}>{item.name}<Icon type="close" onClick={this.onDeleteItem(item.id)}/></li>;
                    })
                }
            </ul>
            <BackRuleSignModal 
                visible={this.state.isSignModalShow} //弹层是否显示
                onOk={this.onModalOk} //确定回调
                onCancle={this.onModalCancle} //取消回调
                tabData={this.props.allSignTabList}//标签数据
                checkedData={this.props.checkedSigns}//已选标签数据
                isLoading={this.props.signTabListLoading}//是否在加载中
            />
        </div >);
    }
}

export default CustomSign;
