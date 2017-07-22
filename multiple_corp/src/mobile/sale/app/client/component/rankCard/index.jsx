import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import './index.less';
import classNames from 'classnames';
import ReactEcharts from 'echarts-for-react';
import {formatNumber} from '../../util/utils.js'
import noRankPng from '../../images/no-rank.png';
import noFunnelPng from '../../images/no-funnel.png';
import firstPng from '../../images/first.png'
import secondPng from '../../images/second.png'
import thirdPng from '../../images/third.png'


class RankCard extends React.Component {
    constructor(props) {
        super(props);
    
    }
    static propTypes = {
        data:PropTypes.array.isRequired,
    };

    static defaultProps = {
        data:[]
    };

    render = () => {
        let {className,style,data,...others} = this.props;
        let cls = classNames({
            'rank-card':true,
            ...className
        });

        return (
           
            <div className={cls} style={style}>
                <div className="header">
                    <span className="title">业绩贡献排行(本月)</span>
                    <i className="iconfont">&#xe67e;</i>
                </div>
                    {
                        data.length>0?(
                    <div className="content">
                        <table>
                            <thead>
                                <tr>
                                    <th>排名</th>
                                    <th>业绩</th>
                                    <th>单量</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.map((item,index)=>{
                                        return (
                                             <tr key = {index}>
                                                <td className="rank-cell"><img className="rank-img" src={{0:firstPng,1:secondPng,2:thirdPng}[index]}/><img className="avatar" src={item.face}/><span className="name">{item.name.length>6?item.name.slice(0,6)+'...':item.name}</span></td>
                                                <td className="performance">{item.money?formatNumber(item.money):'--'}</td>
                                                <td className="quantity">{item.total?item.total:'--'}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        
                    </div>
                    ):( 
                            <div className="no-data-content">
                                <img className="no-data-img" src={noRankPng} />
                                <p>还没有员工，榜单空空的</p>
                            </div>
                        )
                    }
            </div>
           
        )
    }
}

export default RankCard;
