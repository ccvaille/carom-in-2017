import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import './index.less';
import classNames from 'classnames';
import _ from 'lodash'
import { Picker, List } from 'antd-mobile';

class DepFilterPanel extends React.Component {
    constructor(props) {
        super(props);
    }
    static propTypes = {
        dept:PropTypes.object,
        onFilterChange:PropTypes.func.isRequired,
        defaultUser:PropTypes.string
    };

    static defaultProps = {
        defaultUser:null,
        dept:{
            name:'全部'
        }
    };

    openSelectDepPanel=()=>{
        let {onFilterChange,dept,year,month,defaultUser} = this.props;
        if(!defaultUser){
            if (window.__ec_bridge__ && window.__ec_native__) {
                window.__ec_bridge__.openSingleSelectableDepartmentPanel({
                    parentId:0
                }, function(result, error){
                    if(result.code==0){
                        onFilterChange({
                            dept:result.data
                        });
                    }
                    else{
                        alert(result.msg);
                    }
                });
            }
        }
    }

    onDateSelectChange=(value)=>{
        let {onFilterChange,dept} = this.props;
        onFilterChange({
            dept:dept
        });
    }

    render = () => {
        let {className,style,data,dept,defaultUser,...others} = this.props;
        let cls = classNames({
            'dep-filter-panel':true,
            ...className
        });
        return (
            <div className={cls} style={style}>
                    <div className="item dep">
                        <div className="title">部门/员工</div>
                        <div className="content" onClick={()=>this.openSelectDepPanel()}>
                             <span>{defaultUser?defaultUser:(dept.name?(dept.name.length>5?dept.name.slice(0,5)+'...':dept.name):'全部')}</span>
                              {defaultUser?null:(<i className="iconfont">&#xe684;</i>)}
                        </div>
                    </div>
            </div>
        )
    }
}

export default DepFilterPanel;
