import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import './index.less';
import classNames from 'classnames';
import _ from 'lodash'
import { Picker, List } from 'antd-mobile';

function passThreeYear() {
    let cYear = (new Date()).getFullYear();
    return [cYear, cYear - 1, cYear - 2].map((item)=>{
        return {
            label:item.toString(),
            value:item.toString()
        }
    });
}

const seasons = [
  passThreeYear(),
  [
    {
      label: '1月',
      value: '1',
    },
    {
      label: '2月',
      value: '2',
    },
    {
      label: '3月',
      value: '3',
    },
    {
      label: '4月',
      value: '4',
    },
    {
      label: '5月',
      value: '5',
    },
    {
      label: '6月',
      value: '6',
    },
    {
      label: '7月',
      value: '7',
    },
    {
      label: '8月',
      value: '8',
    },
    {
      label: '9月',
      value: '9',
    },
    {
      label: '10月',
      value: '10',
    },
    {
      label: '11月',
      value: '11',
    },
    {
      label: '12月',
      value: '12',
    },
    {
      label: '第一季度',
      value: '111',
    },
    {
      label: '第二季度',
      value: '222',
    },
    {
      label: '第三季度',
      value: '333',
    },
    {
      label: '第四季度',
      value: '444',
    },
    {
      label: '全年',
      value: '000',
    }
  ],
];


const monthMap={
    1:'1月',
    2:'2月',
    3:'3月',
    4:'4月',
    5:'5月',
    6:'6月',
    7:'7月',
    8:'8月',
    9:'9月',
    10:'10月',
    11:'11月',
    12:'12月',
    111:'第一季度',
    222:'第二季度',
    333:'第三季度',
    444:'第四季度',
    '000':'全年',
}

class DepDateFilterPanel extends React.Component {
    constructor(props) {
        super(props);
    }
    static propTypes = {
        year:PropTypes.string,
        month:PropTypes.string,
        dept:PropTypes.object,
        onFilterChange:PropTypes.func.isRequired,
        defaultUser:PropTypes.string
    };

    static defaultProps = {
        year:((new Date()).getFullYear()).toString(),
        month:((new Date()).getMonth()+1).toString(),
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
                            dept:result.data,
                            year:year,
                            month:month
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
        let {onFilterChange,dept,year,month} = this.props;
        onFilterChange({
            dept:dept,
            year:value[0],
            month:value[1]
        });
    }

    render = () => {
        let {className,style,data,year,month,dept,defaultUser,...others} = this.props;
        let cls = classNames({
            'dep-date-filter-panel':true,
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
                    <div className="split-line"></div>
                    <div className="item date">
                        <div className="title">时间</div>
                            <Picker
                                data={seasons}
                                title="选择时间"
                                cascade={false}
                                value={[year,month]}
                                onChange={(value)=>this.onDateSelectChange(value)}
                                >
                                <div className="content">
                                    <span>{year}年{monthMap[month]}</span>
                                    <i className="iconfont">&#xe684;</i>
                                </div>
                            </Picker>
                    </div>
            </div>
        )
    }
}

export default DepDateFilterPanel;
